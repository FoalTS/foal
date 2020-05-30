// std
import { deepStrictEqual, strictEqual } from 'assert';

// FoalTS
import { controller } from '../common';
import { Get, Post, ServiceManager } from '../core';
import { createOpenApiDocument } from './create-open-api-document';
import {
  ApiDefineCallback, ApiDefineTag, ApiDeprecated, ApiExternalDoc, ApiInfo,
  ApiOperation, ApiParameter, ApiRequestBody, ApiResponse, ApiSecurityRequirement, ApiServer, ApiUseTag
} from './decorators';
import {
  IApiCallback, IApiExternalDocumentation, IApiOperation, IApiParameter, IApiPaths,
  IApiRequestBody, IApiResponse, IApiSecurityRequirement, IApiServer, IApiTag
} from './interfaces';

describe('createOpenApiDocument', () => {

  const infoMetadata = {
    title: 'foo',
    version: '0.0.0'
  };

  it('should use the controller instances to retreive the dynamic metadata.', () => {
    @ApiRequestBody(controller => controller.requestBody)
    @ApiDefineCallback('callback1', controller => controller.callback)
    class SubController {
      requestBody: IApiRequestBody = {
        content: {
          'application/xml': {}
        }
      };
      callback: IApiCallback = {
        a: { $ref: 'foobar' }
      };

      @Post('/bar')
      bar() {}
    }

    @ApiInfo(infoMetadata)
    @ApiRequestBody(controller => controller.requestBody2)
    @ApiDefineCallback('callback2', controller => controller.callback2)
    class Controller {
      subControllers = [ SubController ];

      requestBody: IApiRequestBody = {
        content: {
          'application/json': {}
        }
      };
      requestBody2: IApiRequestBody = {
        content: {
          'application/json': {
            schema: {}
          }
        }
      };

      callback2: IApiCallback = {
        b: { $ref: 'foobar' }
      };
      callback3: IApiCallback = {
        c: { $ref: 'foobar' }
      };

      @Get('/foo')
      @ApiRequestBody(controller => controller.requestBody)
      @ApiDefineCallback('callback3', controller => controller.callback3)
      foo() {}

      @Get('/barfoo')
      barfoo() {}
    }

    const controllers = new ServiceManager();

    const document = createOpenApiDocument(Controller, controllers);
    deepStrictEqual(document.paths, {
      '/bar': {
        post: {
          requestBody: {
            content: {
              'application/xml': {}
            }
          },
          responses: {}
        }
      },
      '/barfoo': {
        get: {
          requestBody: {
            content: {
              'application/json': { schema: {} }
            }
          },
          responses: {}
        }
      },
      '/foo': {
        get: {
          requestBody: {
            content: {
              'application/json': {}
            }
          },
          responses: {}
        }
      }
    });
    deepStrictEqual(document.components, {
      callbacks: {
        callback1: {
          a: { $ref: 'foobar' }
        },
        callback2: {
          b: { $ref: 'foobar' }
        },
        callback3: {
          c: { $ref: 'foobar' }
        }
      }
    });
  });

});
