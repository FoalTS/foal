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

  it('should return the paths and operations of the sub controllers methods.', () => {
    const operation1: IApiOperation = {
      responses: {},
      summary: 'Operation 1',
    };
    const operation2: IApiOperation = {
      responses: {},
      summary: 'Operation 2',
    };
    const operation3: IApiOperation = {
      responses: {},
      summary: 'Operation 3',
    };

    @ApiInfo(infoMetadata)
    class Controller {
      subControllers = [
        controller('/api', ApiController),
      ];

      @Post('/bar')
      @ApiOperation(operation1)
      bar() {}
    }

    class ApiController {
      subControllers = [
        controller('/products', ProductController),
      ];

      @Post('/foo')
      @ApiOperation(operation2)
      foo() {}
    }

    class ProductController {
      @Get()
      @ApiOperation(operation3)
      index() {}
    }

    const document = createOpenApiDocument(Controller);
    deepStrictEqual(document.paths, {
      '/api/foo': {
        post: operation2
      },
      '/api/products': {
        get: operation3
      },
      '/bar': {
        post: operation1
      },
    });
  });

  it('should return the paths with the proper OpenAPI path templating.', () => {
    const operation1: IApiOperation = {
      responses: {},
      summary: 'Operation 1',
    };
    const operation2: IApiOperation = {
      responses: {},
      summary: 'Operation 2',
    };
    const operation3: IApiOperation = {
      responses: {},
      summary: 'Operation 3',
    };

    @ApiInfo(infoMetadata)
    class Controller {
      @Get()
      @ApiOperation(operation1)
      index() {}

      @Get('foo')
      @ApiOperation(operation2)
      foo() {}

      @Get('/users/:userId/products/:productId')
      @ApiOperation(operation3)
      bar() {}
    }

    const document = createOpenApiDocument(Controller);
    deepStrictEqual(document.paths, {
      '/': {
        get: operation1
      },
      '/foo': {
        get: operation2
      },
      '/users/{userId}/products/{productId}': {
        get: operation3
      },
    });
  });

  it('should gather several operations (POST, GET, etc) under the same path.', () => {
    const operation1: IApiOperation = {
      responses: {},
      summary: 'Operation 1',
    };
    const operation2: IApiOperation = {
      responses: {},
      summary: 'Operation 2',
    };
    const operation3: IApiOperation = {
      responses: {},
      summary: 'Operation 3',
    };
    const operation4: IApiOperation = {
      responses: {},
      summary: 'Operation 4',
    };

    @ApiInfo(infoMetadata)
    class Controller {
      subControllers = [
        SubController1, SubController2
      ];

      @Get('/foo')
      @ApiOperation(operation1)
      foo() {}

      @Post('/foo')
      @ApiOperation(operation2)
      foo2() {}
    }

    class SubController1 {
      @Get('/bar')
      @ApiOperation(operation3)
      foobar() {}
    }

    class SubController2 {
      @Post('/bar')
      @ApiOperation(operation4)
      foobar() {}
    }

    const document = createOpenApiDocument(Controller);
    deepStrictEqual(document.paths, {
      '/bar': {
        get: operation3,
        post: operation4,
      },
      '/foo': {
        get: operation1,
        post: operation2
      },
    });
  });

  it('should throw an Error is some paths are duplicated.', done => {
    @ApiInfo(infoMetadata)
    class Controller {
      @Get('/api/users/:userId/products/:productId')
      something() {}

      // Note that there is no beginning slash for the test.
      @Get('api/users/:userId2/products/:productId2')
      something2() {}
    }

    try {
      createOpenApiDocument(Controller);
      done(new Error('The function should have thrown an Error.'));
    } catch (error) {
      strictEqual(
        error.message,
        'Templated paths with the same hierarchy but different templated names MUST NOT exist as they are identical.'
        + '\n  Path 1: /api/users/{userId}/products/{productId}'
        + '\n  Path 2: /api/users/{userId2}/products/{productId2}'
      );
      done();
    }
  });

  it('should return the components of the sub-controllers and sub-controllers methods if they exist.', () => {
    const callback1: IApiCallback = { a: { $ref: '1' } };
    const callback2: IApiCallback = { a: { $ref: '2' } };
    const callback3: IApiCallback = { a: { $ref: '3' } };
    const callback4: IApiCallback = { a: { $ref: '4' } };

    @ApiInfo(infoMetadata)
    @ApiDefineCallback('callback1', callback1)
    class Controller {
      subControllers = [
        SubController
      ];
    }

    @ApiDefineCallback('callback2', callback2)
    @ApiDefineCallback('callback3', callback3)
    class SubController {
      subControllers = [
        SubSubController
      ];
    }

    class SubSubController {
      @Get('/foo')
      @ApiDefineCallback('callback1', callback4)
      @ApiDefineCallback('callback2', callback4)
      foo() {}
    }

    const document = createOpenApiDocument(Controller);
    deepStrictEqual(document.components, {
      callbacks: {
        callback1: callback4,
        callback2: callback4,
        callback3
      }
    });
  });

  it('should return the tags of the sub-controllers and sub-controllers methods if they exist.', () => {
    const tag1: IApiTag = { name: '1' };
    const tag2: IApiTag = { name: '2' };
    const tag3: IApiTag = { name: '3' };
    const tag4: IApiTag = { name: '4' };

    @ApiInfo(infoMetadata)
    @ApiDefineTag(tag1)
    class Controller {
      subControllers = [
        SubController
      ];
    }

    @ApiDefineTag(tag2)
    @ApiDefineTag(tag3)
    class SubController {
      subControllers = [
        SubSubController
      ];
    }

    class SubSubController {
      @Get('/foo')
      @ApiDefineTag(tag4)
      foo() {}
    }

    const document = createOpenApiDocument(Controller);
    deepStrictEqual(document.tags, [ tag1, tag2, tag3, tag4 ]);
  });

  it('should return the operations completed with the operation pieces defined in the sub-controllers.', () => {
    const response: IApiResponse = { description: 'Unauthorized' };
    const parameter: IApiParameter = { in: 'cookie', name: 'foo' };

    @ApiInfo(infoMetadata)
    @ApiResponse(401, response)
    class Controller {
      subControllers = [
        SubController
      ];
    }

    @ApiParameter(parameter)
    @ApiDeprecated()
    @ApiUseTag('tag1')
    class SubController {
      subControllers = [
        SubSubController
      ];
    }

    class SubSubController {
      @Get('/foo')
      @ApiUseTag('tag2')
      foo() {}

      @Post('/bar')
      @ApiDeprecated(false)
      bar() {}
    }

    const document = createOpenApiDocument(Controller);
    deepStrictEqual(document.paths, {
      '/bar': {
        post: {
          deprecated: false,
          parameters: [
            parameter
          ],
          responses: {
            401: response
          },
          tags: [ 'tag1' ]
        }
      },
      '/foo': {
        get: {
          deprecated: true,
          parameters: [
            parameter
          ],
          responses: {
            401: response
          },
          tags: [ 'tag1', 'tag2' ]
        },
      }
    } as IApiPaths);
  });

  it('should not include the root servers, security requirements and externalDocs in the paths.', () => {
    const server: IApiServer = { url: 'http://example.com' };
    const externalDocs: IApiExternalDocumentation = { url: 'http://example.com/docs' };
    const securityRequirement: IApiSecurityRequirement = { a: [ 'b' ] };

    @ApiInfo(infoMetadata)
    @ApiServer(server)
    @ApiExternalDoc(externalDocs)
    @ApiSecurityRequirement(securityRequirement)
    class Controller {
      @Get('/foo')
      foo() {}
    }

    const document = createOpenApiDocument(Controller);
    deepStrictEqual(document.servers, [ server ]);
    deepStrictEqual(document.externalDocs, externalDocs);
    deepStrictEqual(document.security, [ securityRequirement ]);
    deepStrictEqual(document.paths, {
      '/foo': {
        get: {
          responses: {}
        }
      }
    });
  });

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
