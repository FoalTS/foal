// std
import { deepStrictEqual, strictEqual } from 'assert';

// FoalTS
import { controller } from '../common';
import { Get, Post } from '../core';
import { createOpenApiDocument } from './create-open-api-document';
import {
  ApiDefineCallback, ApiDefineExample, ApiDefineHeader, ApiDefineLink,
  ApiDefineParameter, ApiDefineRequestBody, ApiDefineResponse, ApiDefineSchema,
  ApiDefineSecurityScheme, ApiDefineTag, ApiExternalDoc, ApiInfo, ApiOperation, ApiSecurityRequirement, ApiServer
} from './decorators';
import {
  IApiCallback, IApiExample, IApiExternalDocumentation, IApiHeader, IApiLink,
  IApiOperation, IApiParameter, IApiRequestBody, IApiResponse, IApiSchema,
  IApiSecurityRequirement, IApiSecurityScheme, IApiServer, IApiTag
} from './interfaces';

describe('createOpenApiDocument', () => {

  const infoMetadata = {
    title: 'foo',
    version: '0.0.0'
  };

  it('should return the proper OpenAPI version.', () => {
    @ApiInfo(infoMetadata)
    class Controller {}

    const document = createOpenApiDocument(Controller);
    strictEqual(document.openapi, '3.0.0');
  });

  describe('should return from the root controller', () => {

    it('the API information.', () => {
      const metadata = {
        title: 'foo',
        version: '0.0.0'
      };
      @ApiInfo(metadata)
      class Controller {}

      const document = createOpenApiDocument(Controller);
      strictEqual(document.info, metadata);
    });

    it('or throw an Error if no API information is found.', done => {
      class Controller {}

      try {
        createOpenApiDocument(Controller);
        done(new Error('The function should have thrown an Error.'));
      } catch (error) {
        strictEqual(error.message, 'The API root controller should be decorated with @ApiInfo.');
        done();
      }
    });

    it('the servers if they exist.', () => {
      @ApiInfo(infoMetadata)
      class Controller {}

      const document = createOpenApiDocument(Controller);
      strictEqual(document.hasOwnProperty('servers'), false);

      const server: IApiServer = {
        url: 'http://example.com'
      };

      @ApiInfo(infoMetadata)
      @ApiServer(server)
      class Controller2 {}

      const document2 = createOpenApiDocument(Controller2);
      deepStrictEqual(document2.servers, [ server ]);
    });

    it('the components if they exist.', () => {
      @ApiInfo(infoMetadata)
      class Controller {}

      const document = createOpenApiDocument(Controller);
      strictEqual(document.hasOwnProperty('components'), false);

      const callback: IApiCallback = {};

      @ApiInfo(infoMetadata)
      @ApiDefineCallback('callback', callback)
      class Controller2 {}

      const document2 = createOpenApiDocument(Controller2);
      deepStrictEqual(document2.components, {
        callbacks: { callback }
      });
    });

    it('the security requirements if they exist.', () => {
      @ApiInfo(infoMetadata)
      class Controller {}

      const document = createOpenApiDocument(Controller);
      strictEqual(document.hasOwnProperty('security'), false);

      const securityRequirement: IApiSecurityRequirement = {};

      @ApiInfo(infoMetadata)
      @ApiSecurityRequirement(securityRequirement)
      class Controller2 {}

      const document2 = createOpenApiDocument(Controller2);
      deepStrictEqual(document2.security, [ securityRequirement ]);
    });

    it('the tags if they exist.', () => {
      @ApiInfo(infoMetadata)
      class Controller {}

      const document = createOpenApiDocument(Controller);
      strictEqual(document.hasOwnProperty('tags'), false);

      const tag: IApiTag = {
        name: 'tag1'
      };

      @ApiInfo(infoMetadata)
      @ApiDefineTag(tag)
      class Controller2 {}

      const document2 = createOpenApiDocument(Controller2);
      deepStrictEqual(document2.tags, [ tag ]);
    });

    it('the external documentation if it exists.', () => {
      @ApiInfo(infoMetadata)
      class Controller {}

      const document = createOpenApiDocument(Controller);
      strictEqual(document.hasOwnProperty('externalDocs'), false);

      const externalDocs: IApiExternalDocumentation = {
        url: 'http://example.com/docs'
      };

      @ApiInfo(infoMetadata)
      @ApiExternalDoc(externalDocs)
      class Controller2 {}

      const document2 = createOpenApiDocument(Controller2);
      deepStrictEqual(document2.externalDocs, externalDocs);
    });

  });

  it('should return the paths and operations of the root controller methods.', () => {
    const operation1: IApiOperation = {
      responses: {},
      summary: 'Operation 1',
    };
    const operation2: IApiOperation = {
      responses: {},
      summary: 'Operation 2',
    };

    @ApiInfo(infoMetadata)
    class Controller {
      @Post('/bar')
      @ApiOperation(operation1)
      bar() {}

      @Get('/foo')
      @ApiOperation(operation2)
      foo() {}

      barfoo() {}
    }

    const document = createOpenApiDocument(Controller);
    deepStrictEqual(document.paths, {
      '/bar': {
        post: operation1
      },
      '/foo': {
        get: operation2
      },
    });
  });

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

  // should return the components defined in sub-controllers (and sub-methods?)
  // '-> Test one component type is sufficient because of the unit tests on "extendComponents"
  // -> use three levels of sub-controllers with components overring and others with no conflicts
  // should return the tags defined in sub-controllers and sub-methods
  // should complete the operations with the operation pieces defined in sub controllers
  // -> same notes as for the components
  // -> Think about the specificity of the root controller

});
