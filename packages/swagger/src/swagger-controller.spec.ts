// std
import { deepStrictEqual, ok, strictEqual } from 'assert';
import { readFileSync } from 'fs';
import { join } from 'path';
import { Readable } from 'stream';

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
  ServiceManager
} from '@foal/core';

// FoalTS
import { SwaggerController } from './swagger-controller';

function streamToBuffer(stream: Readable): Promise<Buffer> {
  const chunks: Buffer[] = [];
  return new Promise<Buffer>((resolve, reject) => {
    stream.on('data', chunk => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks)));
  });
}

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

  describe('has a "index" method that', () => {

    const ctx = new Context({ path: 'swagger/' });

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

    it('should properly render the template given options are { url: "xxx" }.', async () => {
      class ConcreteClass extends SwaggerController {
        options = { url: 'xxx' };
      }
      const controller = new ConcreteClass();
      const response = await controller.index(ctx);

      if (!isHttpResponseOK(response)) {
        throw new Error('SwaggerController.index should return an HttpResponseOK instance.');
      }

      strictEqual(response.getHeader('Content-Type'), 'text/html; charset=utf-8');

      const expected = readFileSync(join(__dirname, 'index.url.spec.html'), 'utf8');
      strictEqual(response.body, expected);
    });

    it('should properly render the template given options are AppController.', async () => {
      class ConcreteClass extends SwaggerController {
        options = { controllerClass: class {} };
      }
      const controller = new ConcreteClass();
      const response = await controller.index(ctx);

      if (!isHttpResponseOK(response)) {
        throw new Error('SwaggerController.index should return an HttpResponseOK instance.');
      }

      strictEqual(response.getHeader('Content-Type'), 'text/html; charset=utf-8');

      const expected = readFileSync(join(__dirname, 'index.controller.spec.html'), 'utf8');
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
        const response = await controller.index(ctx);

        if (!isHttpResponseOK(response)) {
          throw new Error('SwaggerController.index should return an HttpResponseOK instance.');
        }

        strictEqual(response.getHeader('Content-Type'), 'text/html; charset=utf-8');

        const expected = readFileSync(join(__dirname, 'index.no-primary.spec.html'), 'utf8');
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
        const response = await controller.index(ctx);

        if (!isHttpResponseOK(response)) {
          throw new Error('SwaggerController.index should return an HttpResponseOK instance.');
        }

        strictEqual(response.getHeader('Content-Type'), 'text/html; charset=utf-8');

        const expected = readFileSync(join(__dirname, 'index.primary.spec.html'), 'utf8');
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
        const response = await controller.index(ctx);

        if (!isHttpResponseOK(response)) {
          throw new Error('SwaggerController.index should return an HttpResponseOK instance.');
        }

        strictEqual(response.getHeader('Content-Type'), 'text/html; charset=utf-8');

        const expected = readFileSync(join(__dirname, 'index.url.ui-options.spec.html'), 'utf8');
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
        const response = await controller.index(ctx);

        if (!isHttpResponseOK(response)) {
          throw new Error('SwaggerController.index should return an HttpResponseOK instance.');
        }

        strictEqual(response.getHeader('Content-Type'), 'text/html; charset=utf-8');

        const expected = readFileSync(join(__dirname, 'index.no-primary.ui-options.spec.html'), 'utf8');
        strictEqual(response.body, expected);
    });

  });

  describe('has a "swaggerUi" method that', () => {

    it('should handle requests at GET /.', () => {
      strictEqual(getHttpMethod(ConcreteClass, 'swaggerUi'), 'GET');
      strictEqual(getPath(ConcreteClass, 'swaggerUi'), '/swagger-ui.css');
    });

    it('should return an HttpResponseOK whose content is the swagger-ui.css asset.', async () => {
      const controller = new ConcreteClass();
      const response = await controller.swaggerUi();

      if (!isHttpResponseOK(response)) {
        throw new Error('SwaggerController.swaggerUi should return an HttpResponseOK instance.');
      }

      strictEqual(response.getHeader('Content-Type'), 'text/css');
      strictEqual(response.stream, true);

      const content = await streamToBuffer(response.body);
      const expected = readFileSync('./node_modules/swagger-ui-dist/swagger-ui.css');
      ok(expected.equals(content));
    });

  });

  describe('has a "swaggerUiBundle" method that', () => {

    it('should handle requests at GET /.', () => {
      strictEqual(getHttpMethod(ConcreteClass, 'swaggerUiBundle'), 'GET');
      strictEqual(getPath(ConcreteClass, 'swaggerUiBundle'), '/swagger-ui-bundle.js');
    });

    it('should return an HttpResponseOK whose content is the swagger-ui-bundle.js asset.', async () => {
      const controller = new ConcreteClass();
      const response = await controller.swaggerUiBundle();

      if (!isHttpResponseOK(response)) {
        throw new Error('SwaggerController.swaggerUiBundle should return an HttpResponseOK instance.');
      }

      strictEqual(response.getHeader('Content-Type'), 'application/javascript');
      strictEqual(response.stream, true);

      const content = await streamToBuffer(response.body);
      const expected = readFileSync('./node_modules/swagger-ui-dist/swagger-ui-bundle.js');
      ok(expected.equals(content));
    });

  });

  describe('has a "swaggerUiStandalonePreset" method that', () => {

    it('should handle requests at GET /.', () => {
      strictEqual(getHttpMethod(ConcreteClass, 'swaggerUiStandalonePreset'), 'GET');
      strictEqual(getPath(ConcreteClass, 'swaggerUiStandalonePreset'), '/swagger-ui-standalone-preset.js');
    });

    it('should return an HttpResponseOK whose content is the swagger-ui-standalone-preset.js asset.', async () => {
      const controller = new ConcreteClass();
      const response = await controller.swaggerUiStandalonePreset();

      if (!isHttpResponseOK(response)) {
        throw new Error('SwaggerController.swaggerUiStandalonePreset should return an HttpResponseOK instance.');
      }

      strictEqual(response.getHeader('Content-Type'), 'application/javascript');
      strictEqual(response.stream, true);

      const content = await streamToBuffer(response.body);
      const expected = readFileSync('./node_modules/swagger-ui-dist/swagger-ui-standalone-preset.js');
      ok(expected.equals(content));
    });

  });

});
