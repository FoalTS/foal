import { deepStrictEqual, strictEqual } from 'assert';
import { createService, Get, ServiceManager } from '../core';
import { ApiInfo, ApiRequestBody } from './decorators';
import { IApiRequestBody } from './interfaces';
import { OpenAPI } from './openapi.service';

describe('OpenAPI', () => {
  it('should create an OpenAPI document from the controller class using the ServiceManager', () => {
    @ApiInfo({
      title: 'foo',
      version: '0.0.0'
    })
    class Foobar {
      static count = 0;

      requestBody: IApiRequestBody = {
        content: {}
      };

      constructor() {
        Foobar.count++;
      }

      @Get()
      @ApiRequestBody((c: Foobar) => c.requestBody)
      index() {}
    }

    const serviceManager = new ServiceManager();
    serviceManager.get(Foobar);
    const openapi = createService(OpenAPI, serviceManager);

    deepStrictEqual(openapi.createDocument(Foobar), {
      info: {
        title: 'foo',
        version: '0.0.0'
      },
      openapi: '3.0.0',
      paths: {
        '/': {
          get: {
            requestBody: {
              content: {}
            },
            responses: {}
          }
        }
      }
    });
    strictEqual(Foobar.count, 1);
  });
});
