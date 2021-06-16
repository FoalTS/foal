import { deepStrictEqual } from 'assert';
import { Get } from '../http';
import { Dependency, ServiceManager } from '../service-manager';
import { createOpenApiDocument } from './create-open-api-document';
import { ApiInfo, ApiUseTag } from './decorators';
import { IOpenAPI } from './interfaces';

describe('createOpenApiDocument', () => {

  it('should create and return the OpenAPI document of the given controller class.', () => {
    @ApiInfo({
      title: 'API example',
      version: '0.1.0',
    })
    @ApiUseTag('tag1')
    class ApiController {
      @Get('/foo')
      foo() {}
    }

    const document = createOpenApiDocument(ApiController);
    const actual: IOpenAPI = {
      info: {
        title: 'API example',
        version: '0.1.0',
      },
      openapi: '3.0.0',
      paths: {
        '/foo': {
          get: {
            responses: {},
            tags: ['tag1'],
          }
        }
      }
    };
    deepStrictEqual(document, actual);
  });

  it('should accept an optional serviceManager.', () => {
    @ApiInfo({
      title: 'API example',
      version: '0.1.0',
    })
    class ApiController {
      @Dependency('tag')
      tag: string;

      @Get('/bar')
      @ApiUseTag((ctrl: ApiController) => ctrl.tag)
      bar() {}
    }

    const services = new ServiceManager();
    services.set('tag', 'tag1');

    const document = createOpenApiDocument(ApiController, services);
    const actual: IOpenAPI = {
      info: {
        title: 'API example',
        version: '0.1.0',
      },
      openapi: '3.0.0',
      paths: {
        '/bar': {
          get: {
            responses: {},
            tags: ['tag1'],
          }
        }
      }
    };
    deepStrictEqual(document, actual);
  });

});
