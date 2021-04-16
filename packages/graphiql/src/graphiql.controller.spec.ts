// std
import { ok, strictEqual } from 'assert';
import { stat, readFileSync } from 'fs';
import { promisify } from 'util';
import { Readable } from 'stream';
import { join } from 'path';

// 3p
import { getHttpMethod, getPath, isHttpResponseOK } from '@foal/core';
import { GraphiQLController } from './graphiql.controller';

function streamToBuffer(stream: Readable): Promise<Buffer> {
  const chunks: Buffer[] = [];
  return new Promise<Buffer>((resolve, reject) => {
    stream.on('data', chunk => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks)));
  });
}

describe('GraphiQLController', () => {

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
        const stats = await promisify(stat)(filePath);
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