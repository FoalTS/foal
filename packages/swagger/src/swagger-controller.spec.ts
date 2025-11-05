// std
import { deepStrictEqual, ok, strictEqual } from 'assert';
import { readFileSync } from 'fs';
import { stat }from 'node:fs/promises';
import { join } from 'path';

// 3p
import {
  ApiInfo,
  Context,
  getHttpMethod,
  getPath,
  isHttpResponseBadRequest,
  isHttpResponseMovedPermanently,
  isHttpResponseNotFound,
  isHttpResponseOK,
  OpenApi,
  OPENAPI_SERVICE_ID,
  ServiceManager,
  streamToBuffer
} from '@foal/core';

// FoalTS
import { SwaggerController } from './swagger-controller';

describe('SwaggerController', () => {

  class ConcreteClass extends SwaggerController {
    options = { url: 'foobar' };
  }

  /* Spec file(s) */

  describe('has a "getOpenApiDefinition" method that', () => {

    it('should handle requests at GET /.', () => {
      strictEqual(getHttpMethod(ConcreteClass, 'getOpenApiDefinition'), 'GET');
      strictEqual(getPath(ConcreteClass, 'getOpenApiDefinition'), '/openapi.json');
    });

    describe('given options is an object', () => {

      const ctx = new Context({});

      it('should return an HttpResponseNotFound if the object interface is { url: string }', () => {
        class ConcreteClass extends SwaggerController {
          options = { url: 'foobar' };
        }
        const controller = new ConcreteClass();
        const response = controller.getOpenApiDefinition(ctx);

        if (!isHttpResponseNotFound(response)) {
          throw new Error('The response should be an instance of HttpResponseNotFound.');
        }
      });

      it('should return an HttpResponseOK with the controller document.', () => {
        const info = {
          title: 'Api',
          version: '1.0.0',
        };

        @ApiInfo(info)
        class ApiController {}

        class ConcreteClass extends SwaggerController {
          options = { controllerClass: ApiController };
        }

        const services = new ServiceManager();
        const openApi = services.get(OpenApi);
        openApi.addDocument(ApiController, {
          info,
          openapi: '3.0.0',
          paths: {}
        });
        services.set(OPENAPI_SERVICE_ID, openApi);

        const controller = services.get(ConcreteClass);
        const response = controller.getOpenApiDefinition(ctx);

        if (!isHttpResponseOK(response)) {
          throw new Error('The response should be an instance of HttpResponseOK.');
        }

        deepStrictEqual(response.body, {
          info,
          openapi: '3.0.0',
          paths: {}
        });
      });
    });

    describe('given options is an array', () => {

      it('should return an HttpResponseBadRequest if no param "name" is provided.', () => {
        class ConcreteClass extends SwaggerController {
          options = [];
        }
        const controller = new ConcreteClass();

        const ctx = new Context({ query: {} });
        const response = controller.getOpenApiDefinition(ctx);

        if (!isHttpResponseBadRequest(response)) {
          throw new Error('The response should be an instance of HttpResponseBadRequest.');
        }

        strictEqual(response.body, 'Missing URL parameter "name".');
      });

      it('should return an HttpResponseNotFound if no controller is found with that name.', () => {
        class ConcreteClass extends SwaggerController {
          options = [
            { name: 'v1', url: 'http://example.com' },
          ];
        }
        const controller = new ConcreteClass();

        let ctx = new Context({ query: { name: 'v2' } });
        let response = controller.getOpenApiDefinition(ctx);
        if (!isHttpResponseNotFound(response)) {
          throw new Error('The response should be an instance of HttpResponseNotFound.');
        }

        ctx = new Context({ query: { name: 'v1' } });
        response = controller.getOpenApiDefinition(ctx);
        if (!isHttpResponseNotFound(response)) {
          throw new Error('The response should be an instance of HttpResponseNotFound.');
        }
      });

      it('should return an HttpResponseOK with the controller document.', () => {
        const info = {
          title: 'Api',
          version: '1.0.0',
        };

        @ApiInfo(info)
        class ApiController {}

        class ConcreteClass extends SwaggerController {
          options = [
            { name: 'v1', url: 'http://example.com' },
            { name: 'v2', controllerClass: ApiController },
          ];
        }

        const services = new ServiceManager();
        const openApi = services.get(OpenApi);
        openApi.addDocument(ApiController, {
          info,
          openapi: '3.0.0',
          paths: {}
        });
        services.set(OPENAPI_SERVICE_ID, openApi);

        const controller = services.get(ConcreteClass);
        const ctx = new Context({ query: { name: 'v2' } });
        const response = controller.getOpenApiDefinition(ctx);
        if (!isHttpResponseOK(response)) {
          throw new Error('The response should be an instance of HttpResponseOK.');
        }

        deepStrictEqual(response.body, {
          info,
          openapi: '3.0.0',
          paths: {}
        });
      });

    });

  });

  /* UI */

  describe('has an "index" method that', () => {

    it('should handle requests at GET /.', () => {
      strictEqual(getHttpMethod(ConcreteClass, 'index'), 'GET');
      strictEqual(getPath(ConcreteClass, 'index'), '/');
    });

    it('should redirect the user to xxx/ if there is no trailing slash in the URL.', async () => {
      // This way, the browser requests the assets at the correct path (the relative path).
      const controller = new ConcreteClass();

      const ctx = new Context({ path: 'xxx' });
      const response = await controller.index(ctx);

      if (!isHttpResponseMovedPermanently(response)) {
        throw new Error('SwaggerController.index should return an HttpResponseMovedPermanently instance.');
      }

      strictEqual(response.path, ctx.request.path + '/');
    });

    it('should return the swagger HTML page.', async () => {
      const controller = new ConcreteClass();

      const ctx = new Context({ path: 'swagger/' });
      const response = await controller.index(ctx);

      if (!isHttpResponseOK(response)) {
        throw new Error('SwaggerController.index should return an HttpResponseOK instance.');
      }

      strictEqual(response.getHeader('Content-Type'), 'text/html; charset=utf-8');

      const expected = readFileSync(join(__dirname, 'index.html'), 'utf8');
      strictEqual(response.body, expected);
    })

  });

  describe('has a "main" method that', () => {

    const ctx = new Context({ path: 'swagger/' });

    it('should handle requests at GET /main.js.', () => {
      strictEqual(getHttpMethod(ConcreteClass, 'main'), 'GET');
      strictEqual(getPath(ConcreteClass, 'main'), '/main.js');
    });


    it('should properly render the template given options are { url: "xxx" }.', async () => {
      class ConcreteClass extends SwaggerController {
        options = { url: 'xxx' };
      }
      const controller = new ConcreteClass();
      const response = await controller.main(ctx);

      if (!isHttpResponseOK(response)) {
        throw new Error('SwaggerController.main should return an HttpResponseOK instance.');
      }

      strictEqual(response.getHeader('Content-Type'), 'application/javascript');

      const expected = readFileSync(join(process.cwd(), 'specs/main.url.spec.js'), 'utf8');
      strictEqual(response.body, expected);
    });

    it('should properly render the template given options are AppController.', async () => {
      class ConcreteClass extends SwaggerController {
        options = { controllerClass: class {} };
      }
      const controller = new ConcreteClass();
      const response = await controller.main(ctx);

      if (!isHttpResponseOK(response)) {
        throw new Error('SwaggerController.main should return an HttpResponseOK instance.');
      }

      strictEqual(response.getHeader('Content-Type'), 'application/javascript');

      const expected = readFileSync(join(process.cwd(), 'specs/main.controller.spec.js'), 'utf8');
      strictEqual(response.body, expected);
    });

    it('should properly render the template given options are [{ url: "v1.json", name: "v1" }, '
      + '{ controllerClass: AppController, name: "v2" }].', async () => {
        class ConcreteClass extends SwaggerController {
          options = [
            { name: 'v1', url: 'v1.json' },
            { name: 'v2', controllerClass: class {} },
          ];
        }
        const controller = new ConcreteClass();
        const response = await controller.main(ctx);

        if (!isHttpResponseOK(response)) {
          throw new Error('SwaggerController.main should return an HttpResponseOK instance.');
        }

        strictEqual(response.getHeader('Content-Type'), 'application/javascript');

        const expected = readFileSync(join(process.cwd(), 'specs/main.no-primary.spec.js'), 'utf8');
        strictEqual(response.body, expected);
    });

    it('should properly render the template given options are [{ url: "xxx", name: "spec1" }, '
      + '{ url: "yyy", name: "spec2", primary: true }].', async () => {
        class ConcreteClass extends SwaggerController {
          options = [
            { name: 'spec1', url: 'xxx' },
            { name: 'spec2', url: 'yyy', primary: true },
          ];
        }
        const controller = new ConcreteClass();
        const response = await controller.main(ctx);

        if (!isHttpResponseOK(response)) {
          throw new Error('SwaggerController.main should return an HttpResponseOK instance.');
        }

        strictEqual(response.getHeader('Content-Type'), 'application/javascript');

        const expected = readFileSync(join(process.cwd(), 'specs/main.primary.spec.js'), 'utf8');
        strictEqual(response.body, expected);

    });

    it('should properly render the template given options are { url: "xxx" } and uiOptions are { docExpansion:"none" }'
      , async () => {
        class ConcreteClass extends SwaggerController {
          options = {
            url: 'xxx'
          };
          uiOptions = { docExpansion: 'none' };
        }
        const controller = new ConcreteClass();
        const response = await controller.main(ctx);

        if (!isHttpResponseOK(response)) {
          throw new Error('SwaggerController.main should return an HttpResponseOK instance.');
        }

        strictEqual(response.getHeader('Content-Type'), 'application/javascript');

        const expected = readFileSync(join(process.cwd(), 'specs/main.url.ui-options.spec.js'), 'utf8');
        strictEqual(response.body, expected);
    });

    it('should properly render the template given options are [{ url: "v1.json", name: "v1" }] and uiOptions are' +
      '{ docExpansion:"none" }', async () => {
        class ConcreteClass extends SwaggerController {
          options = [
            { name: 'v1', url: 'v1.json' },
          ];
          uiOptions = { docExpansion: 'none' };
        }
        const controller = new ConcreteClass();
        const response = await controller.main(ctx);

        if (!isHttpResponseOK(response)) {
          throw new Error('SwaggerController.main should return an HttpResponseOK instance.');
        }

        strictEqual(response.getHeader('Content-Type'), 'application/javascript');

        const expected = readFileSync(join(process.cwd(), 'specs/main.no-primary.ui-options.spec.js'), 'utf8');
        strictEqual(response.body, expected);
    });

  });

  function testAsset(
    methodName: 'swaggerUi'|'swaggerUiBundle'|'swaggerUiStandalonePreset',
    filename: string,
    contentType: string
  ): void {
    describe(`has a "${methodName}" method that`, () => {

      it(`should handle requests at GET /${filename}.`, () => {
        strictEqual(getHttpMethod(ConcreteClass, methodName), 'GET');
        strictEqual(getPath(ConcreteClass, methodName), `/${filename}`);
      });

      it(`should return an HttpResponseOK whose content is the ${filename} asset.`, async () => {
        const controller = new ConcreteClass();
        const response = await controller[methodName]();

        if (!isHttpResponseOK(response)) {
          throw new Error(`SwaggerController.${methodName} should return an HttpResponseOK instance.`);
        }

        strictEqual(response.getHeader('Content-Type'), contentType);
        strictEqual(response.stream, true);

        const filePath = `../../node_modules/swagger-ui-dist/${filename}`;
        const stats = await stat(filePath);
        strictEqual(response.getHeader('Content-Length'), stats.size.toString());

        const content = await streamToBuffer(response.body);
        const expected = readFileSync(filePath);
        ok(expected.equals(content));
      });

    });
  }

  testAsset('swaggerUi', 'swagger-ui.css', 'text/css');
  testAsset('swaggerUiBundle', 'swagger-ui-bundle.js', 'application/javascript');
  testAsset('swaggerUiStandalonePreset', 'swagger-ui-standalone-preset.js', 'application/javascript');

});
