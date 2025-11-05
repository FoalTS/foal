// std
import { ok, strictEqual } from 'assert';
import { readFileSync } from 'fs';
import { stat } from 'node:fs/promises';
import { join } from 'path';

// 3p
import { Context, getHttpMethod, getPath, isHttpResponseMovedPermanently, isHttpResponseOK, streamToBuffer } from '@foal/core';

// FoalTS
import { GraphiQLController } from './graphiql.controller';

describe('GraphiQLController', () => {

  describe('has an "index" method that', () => {

    it('should handle requests at GET /.', () => {
      strictEqual(getHttpMethod(GraphiQLController, 'index'), 'GET');
      strictEqual(getPath(GraphiQLController, 'index'), '/');
    });

    it('should redirect the user to xxx/ if there is no trailing slash in the URL.', async () => {
      // This way, the browser requests the assets at the correct path (the relative path).
      const controller = new GraphiQLController();

      const ctx = new Context({ path: 'xxx' });
      const response = await controller.index(ctx);

      if (!isHttpResponseMovedPermanently(response)) {
        throw new Error('GraphiQLController.index should return an HttpResponseMovedPermanently instance.');
      }

      strictEqual(response.path, ctx.request.path + '/');
    });

    async function compareSpecAndTemplate(controller: GraphiQLController, specFileName: string) {
      const expected = readFileSync(join(process.cwd(), 'specs', specFileName), 'utf8');

      const ctx = new Context({ path: 'graphql/' });
      const response = await controller.index(ctx);
      if (!isHttpResponseOK(response)) {
        throw new Error('GraphiQLController.index should have returned a HttpResponseOK instance.');
      }
      const actual = response.body;

      strictEqual(actual, expected);
    }

    it('should render the HTML template.', async () => {
      const controller = new GraphiQLController();
      await compareSpecAndTemplate(controller, 'index.default.html');
    });

    it('should render the HTML template (custom endpoint).', async () => {
      class GraphiQLController2 extends GraphiQLController {
        apiEndpoint = '/another-endpoint';
      }
      const controller = new GraphiQLController2();
      await compareSpecAndTemplate(controller, 'index.endpoint.html');
    });

    it('should render the HTML template (custom API endpoint).', async () => {
      class GraphiQLController2 extends GraphiQLController {
        options = {
          defaultSecondaryEditorOpen: true
        }
      }
      const controller = new GraphiQLController2();
      await compareSpecAndTemplate(controller, 'index.options.html');
    });

    it('should render the HTML template (custom css theme).', async () => {
      class GraphiQLController2 extends GraphiQLController {
        cssThemeURL = 'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.23.0/theme/solarized.css'
      }
      const controller = new GraphiQLController2();
      await compareSpecAndTemplate(controller, 'index.css-theme.html');
    });

  });

  function testAsset(
    methodName: 'getReactProduction'|'getReactDomProduction'|'getGraphiqlCss'|'getGraphiqlJs',
    filename: string,
    contentType: string
  ): void {
    describe(`has a "${methodName}" method that`, () => {

      it('should handle requests at GET /.', () => {
        strictEqual(getHttpMethod(GraphiQLController, methodName), 'GET');
        strictEqual(getPath(GraphiQLController, methodName), `/${filename}`);
      });

      it(`should return an HttpResponseOK whose content is the ${filename} asset.`, async () => {
        const controller = new GraphiQLController();
        const response = await controller[methodName]();

        if (!isHttpResponseOK(response)) {
          throw new Error(`GraphiQLController.${methodName} should return an HttpResponseOK instance.`);
        }

        strictEqual(response.getHeader('Content-Type'), contentType);
        strictEqual(response.stream, true);

        const filePath = join(__dirname, 'static', filename);
        const stats = await stat(filePath);
        strictEqual(response.getHeader('Content-Length'), stats.size.toString());

        const content = await streamToBuffer(response.body);
        const expected = readFileSync(filePath);
        ok(expected.equals(content));
      });

    });
  }

  testAsset('getReactProduction', 'react.production.min.js', 'application/javascript');
  testAsset('getReactDomProduction', 'react-dom.production.min.js', 'application/javascript');
  testAsset('getGraphiqlCss', 'graphiql.min.css', 'text/css');
  testAsset('getGraphiqlJs', 'graphiql.min.js', 'application/javascript');

});