// std
import { deepStrictEqual, doesNotThrow, notDeepStrictEqual, notStrictEqual, ok, strictEqual, throws } from 'assert';

// FoalTS
import { controller } from '../../common/utils/controller.util';
import { Config } from '../config';
import { Hook, HookFunction } from '../hooks';
import { Context, Get, HttpResponseOK, Post } from '../http';
import {
  ApiDefineCallback,
  ApiDefineTag,
  ApiDeprecated,
  ApiExternalDoc,
  ApiInfo,
  ApiOperation,
  ApiOperationDescription,
  ApiParameter,
  ApiRequestBody,
  ApiResponse,
  ApiSecurityRequirement,
  ApiServer,
  ApiUseTag,
  IApiCallback,
  IApiComponents,
  IApiExternalDocumentation,
  IApiOperation,
  IApiParameter,
  IApiPaths,
  IApiRequestBody,
  IApiResponse,
  IApiSecurityRequirement,
  IApiServer,
  IApiTag,
  OpenApi
} from '../openapi';
import { dependency, ServiceManager } from '../service-manager';
import { makeControllerRoutes } from './make-controller-routes';

describe('makeControllerRoutes', () => {

  const hook1: HookFunction = () => new HttpResponseOK('hook1');
  const hook2: HookFunction = () => new HttpResponseOK('hook2');
  const hook3: HookFunction = () => new HttpResponseOK('hook3');
  const hook4: HookFunction = () => new HttpResponseOK('hook4');
  const hook5: HookFunction = () => new HttpResponseOK('hook5');
  const hook6: HookFunction = () => new HttpResponseOK('hook6');

  const ctx = new Context({});
  const services = new ServiceManager();

  it('should return the routes from a controller with a method.', () => {
    class FoobarController {
      @Get()
      bar() {}
    }

    const routes = Array.from(makeControllerRoutes(FoobarController, new ServiceManager()))
      .map(({ route }) => route);

    strictEqual(routes.length, 1);

    // bar() {}
    ok(routes[0].controller instanceof FoobarController);
    deepStrictEqual(routes[0].hooks, []);
    strictEqual(routes[0].httpMethod, 'GET');
    strictEqual(routes[0].path, '');
    strictEqual(routes[0].propertyKey, 'bar');
  });

  it('should return the routes from a controller with a method and a path.', () => {
    @Reflect.metadata('path', '/foo/')
    class FoobarController {
      @Get('/bar')
      bar() {}
    }

    const routes = Array.from(makeControllerRoutes(FoobarController, new ServiceManager()))
      .map(({ route }) => route);

    strictEqual(routes.length, 1);

    // bar() {}
    strictEqual(routes[0].path, '/foo/bar');
  });

  it('should return the routes from a controller with a method and controller and method hooks.', () => {
    @Hook(hook3)
    @Hook(hook4)
    class FoobarController {
      @Get()
      @Hook(hook5)
      @Hook(hook6)
      bar() {}
    }

    const routes = Array.from(makeControllerRoutes(FoobarController, new ServiceManager()))
      .map(({ route }) => route);

    strictEqual(routes.length, 1);

    // bar() {}
    deepStrictEqual(
      routes[0].hooks.map(hook => (hook(ctx, services) as HttpResponseOK).body),
      [ 'hook3', 'hook4', 'hook5', 'hook6' ]
    );
  });

  it('should return the routes from the controller methods that have a http-method decorator.', () => {
    class FoobarController {
      @Get()
      bar() {}

      foo() {}

      @Post()
      barfoo() {}
    }

    const routes = Array.from(makeControllerRoutes(FoobarController, new ServiceManager()))
      .map(({ route }) => route);

    strictEqual(routes.length, 2);

    // bar() {}
    strictEqual(routes[0].httpMethod, 'GET');
    strictEqual(routes[0].propertyKey, 'bar');

    // barfoo() {}
    strictEqual(routes[1].httpMethod, 'POST');
    strictEqual(routes[1].propertyKey, 'barfoo');
  });

  it('should properly instantiate a controller that has dependencies.', () => {
    class Service1 {}

    class Service2 {}

    class FoobarController {
      @dependency
      service1: Service1;

      @dependency
      service2: Service2;

      @Get()
      bar() {}
    }

    const services = new ServiceManager();
    const routes = Array.from(makeControllerRoutes(FoobarController, services))
      .map(({ route }) => route);

    strictEqual(routes.length, 1);

    // bar
    ok(routes[0].controller instanceof FoobarController);
    strictEqual(routes[0].controller.service1, services.get(Service1));
    strictEqual(routes[0].controller.service2, services.get(Service2));
  });

  it('should register the controller instance in the ServiceManager.', () => {
    class FoobarController {
      @Get()
      bar() {}
    }

    const services = new ServiceManager();
    const routes = Array.from(makeControllerRoutes(FoobarController, services))
      .map(({ route }) => route);

    strictEqual(routes.length, 1);

    // bar
    strictEqual(routes[0].controller, services.get(FoobarController));
  });

  it('should return all the routes of the prototype chain of an inherited controller.', () => {
    class FoobarController {

      @Get('/bar')
      @Hook(hook1)
      bar() {}

    }

    @Reflect.metadata('path', '/foo')
    @Hook(hook2)
    class FoobarController2 extends FoobarController {

      @Post('/barfoo')
      @Hook(hook3)
      barfoo() {}

    }

    const routes = Array.from(makeControllerRoutes(FoobarController2, new ServiceManager()))
      .map(({ route }) => route);

    strictEqual(routes.length, 2);

    // barfoo
    ok(routes[0].controller instanceof FoobarController2);
    deepStrictEqual(
      routes[0].hooks.map(hook => (hook(ctx, services) as HttpResponseOK).body),
      [ 'hook2', 'hook3' ]
    );
    strictEqual(routes[0].httpMethod, 'POST');
    strictEqual(routes[0].path, '/foo/barfoo');
    strictEqual(routes[0].propertyKey, 'barfoo');

    // bar
    ok(routes[1].controller instanceof FoobarController2);
    deepStrictEqual(
      routes[1].hooks.map(hook => (hook(ctx, services) as HttpResponseOK).body),
      [ 'hook2', 'hook1' ]
    );
    strictEqual(routes[1].httpMethod, 'GET');
    strictEqual(routes[1].path, '/foo/bar');
    strictEqual(routes[1].propertyKey, 'bar');

  });

  it('should recursively return the routes of the subControllers if they exist.', () => {
    @Reflect.metadata('path', '/api')
    @Hook(hook2)
    class ApiController {
      @Get('/flights')
      @Hook(hook3)
      flights() {}
    }

    @Reflect.metadata('path', '/auth')
    @Hook(hook4)
    class AuthController {
      @Get('/')
      @Hook(hook5)
      index() {}
    }

    @Reflect.metadata('path', '/foo')
    @Hook(hook1)
    class AppController {
      subControllers = [
        ApiController,
        AuthController,
      ];
    }

    const routes = Array.from(makeControllerRoutes(AppController, new ServiceManager()))
      .map(({ route }) => route);

    strictEqual(routes.length, 2);

    // bar
    ok(routes[0].controller instanceof ApiController);
    deepStrictEqual(
      routes[0].hooks.map(hook => (hook(ctx, services) as HttpResponseOK).body),
      [ 'hook1', 'hook2', 'hook3' ]
    );
    strictEqual(routes[0].httpMethod, 'GET');
    strictEqual(routes[0].path, '/foo/api/flights');
    strictEqual(routes[0].propertyKey, 'flights');

    // foobar
    ok(routes[1].controller instanceof AuthController);
    deepStrictEqual(
      routes[1].hooks.map(hook => (hook(ctx, services) as HttpResponseOK).body),
      [ 'hook1', 'hook4', 'hook5' ]
    );
    strictEqual(routes[1].httpMethod, 'GET');
    strictEqual(routes[1].path, '/foo/auth/');
    strictEqual(routes[1].propertyKey, 'index');
  });

  it('should return the sub-controllers and controller routes in the right order.', () => {
    class SubController {
      @Get('/bar')
      bar() {}
    }

    class AppController {
      subControllers = [ SubController ];

      @Get('/foo')
      foo() {}
    }

    const routes = Array.from(makeControllerRoutes(AppController, new ServiceManager()))
      .map(({ route }) => route);

    strictEqual(routes.length, 2);

    // bar
    ok(routes[0].controller instanceof SubController);

    // foo
    ok(routes[1].controller instanceof AppController);
  });

  it('should bind the controller instance to the controller and method hooks.', () => {
    let firstThis: FoobarController|undefined;
    // tslint:disable-next-line:prefer-const
    let secondThis: FoobarController|undefined;

    @Hook(function(this: FoobarController) {
      firstThis = this;
    })
    class FoobarController {
      @Get()
      @Hook(function(this: FoobarController) {
        secondThis = this;
      })
      bar() {}
    }

    const routes = Array.from(makeControllerRoutes(FoobarController, new ServiceManager()))
      .map(({ route }) => route);

    strictEqual(routes.length, 1);

    // bar() {}
    strictEqual(firstThis, undefined);
    routes[0].hooks[0](ctx, services);
    strictEqual(firstThis as any instanceof FoobarController, true);

    strictEqual(secondThis, undefined);
    routes[0].hooks[1](ctx, services);
    strictEqual(secondThis as any instanceof FoobarController, true);

    strictEqual(firstThis, secondThis);
  });

  describe('should register the OpenAPI documents of the @ApiInfo controllers', () => {

    const infoMetadata = {
      title: 'foo',
      version: '0.0.0'
    };
    let openApi: OpenApi;

    before(() => openApi = services.get(OpenApi))

    beforeEach(() => Config.set('settings.openapi.enabled', true));

    afterEach(() => Config.remove('settings.openapi.enabled'));

    it('but not the other controllers.', () => {
      @ApiInfo(infoMetadata)
      class ApiController {}

      class AppController {
        subControllers = [
          controller('/api', ApiController)
        ];
      }

      Array.from(makeControllerRoutes(AppController, services));

      throws(
        () => openApi.getDocument(AppController),
        {
          message: 'No OpenAPI document found associated with the controller AppController. '
          + 'Are you sure you added the @ApiInfo decorator on the controller?'
        }
      );
    });

    it('with the proper OpenAPI version.', () => {
      @ApiInfo(infoMetadata)
      class ApiController {}

      class AppController {
        subControllers = [
          controller('/api', ApiController)
        ];
      }

      Array.from(makeControllerRoutes(AppController, services));

      strictEqual(openApi.getDocument(ApiController).openapi, '3.0.0');
    });

    it('with the API information.', () => {
      const metadata = {
        title: 'foo',
        version: '0.0.0'
      };
      @ApiInfo(metadata)
      class ApiController {}

      class AppController {
        subControllers = [
          controller('/api', ApiController)
        ];
      }

      Array.from(makeControllerRoutes(AppController, services));

      strictEqual(openApi.getDocument(ApiController).info, metadata);
    });

    it('with the API information (dynamic API information).', () => {
      const metadata = {
        title: 'foo',
        version: '0.0.0'
      };
      @ApiInfo((controller: ApiController) => controller.metadata)
      class ApiController {
        metadata = metadata;
      }

      class AppController {
        subControllers = [
          controller('/api', ApiController)
        ];
      }

      Array.from(makeControllerRoutes(AppController, services));

      strictEqual(openApi.getDocument(ApiController).info, metadata);
    });

    it('with the servers if they exist.', () => {
      @ApiInfo(infoMetadata)
      class ApiController {}

      class AppController {
        subControllers = [
          controller('/api', ApiController)
        ];
      }

      Array.from(makeControllerRoutes(AppController, services));
      strictEqual(openApi.getDocument(ApiController).hasOwnProperty('servers'), false);

      const server: IApiServer = {
        url: 'http://example.com'
      };

      @ApiInfo(infoMetadata)
      @ApiServer(server)
      class ApiController2 {}

      class AppController2 {
        subControllers = [
          controller('/api', ApiController2)
        ];
      }

      Array.from(makeControllerRoutes(AppController2, services));
      deepStrictEqual(openApi.getDocument(ApiController2).servers, [ server ]);
    });

    it('with the components if they exist.', () => {
      @ApiInfo(infoMetadata)
      class ApiController {
        @Get('/foo')
        foo() {}
      }

      class AppController {
        subControllers = [
          controller('/api', ApiController)
        ];
      }

      Array.from(makeControllerRoutes(AppController, services));
      strictEqual(openApi.getDocument(ApiController).hasOwnProperty('components'), false);

      const callback: IApiCallback = {};

      @ApiInfo(infoMetadata)
      @ApiDefineCallback('callback', callback)
      class ApiController2 {}

      class AppController2 {
        subControllers = [
          controller('/api', ApiController2)
        ];
      }

      Array.from(makeControllerRoutes(AppController2, services));
      deepStrictEqual(openApi.getDocument(ApiController2).components, {
        callbacks: { callback }
      });
    });

    it('with the security requirements if they exist.', () => {
      @ApiInfo(infoMetadata)
      class ApiController {}

      class AppController {
        subControllers = [
          controller('/api', ApiController)
        ];
      }

      Array.from(makeControllerRoutes(AppController, services));
      strictEqual(openApi.getDocument(ApiController).hasOwnProperty('security'), false);

      const securityRequirement: IApiSecurityRequirement = {};

      @ApiInfo(infoMetadata)
      @ApiSecurityRequirement(securityRequirement)
      class ApiController2 {}

      class AppController2 {
        subControllers = [
          controller('/api', ApiController2)
        ];
      }

      Array.from(makeControllerRoutes(AppController2, services));
      deepStrictEqual(openApi.getDocument(ApiController2).security, [ securityRequirement ]);
    });

    it('with the tags if they exist.', () => {
      @ApiInfo(infoMetadata)
      class ApiController {
        @Get('/foo')
        foo() {}
      }

      class AppController {
        subControllers = [
          controller('/api', ApiController)
        ];
      }

      Array.from(makeControllerRoutes(AppController, services));
      strictEqual(openApi.getDocument(ApiController).hasOwnProperty('tags'), false);

      const tag: IApiTag = {
        name: 'tag1'
      };

      @ApiInfo(infoMetadata)
      @ApiDefineTag(tag)
      class ApiController2 {}

      class AppController2 {
        subControllers = [
          controller('/api', ApiController2)
        ];
      }

      Array.from(makeControllerRoutes(AppController2, services));
      deepStrictEqual(openApi.getDocument(ApiController2).tags, [ tag ]);
    });

    it('with the external documentation if it exists.', () => {
      @ApiInfo(infoMetadata)
      class ApiController {}

      class AppController {
        subControllers = [
          controller('/api', ApiController)
        ];
      }

      Array.from(makeControllerRoutes(AppController, services));
      strictEqual(openApi.getDocument(ApiController).hasOwnProperty('externalDocs'), false);

      const externalDocs: IApiExternalDocumentation = {
        url: 'http://example.com/docs'
      };

      @ApiInfo(infoMetadata)
      @ApiExternalDoc(externalDocs)
      class ApiController2 {}

      class AppController2 {
        subControllers = [
          controller('/api', ApiController2)
        ];
      }

      Array.from(makeControllerRoutes(AppController2, services));
      strictEqual(openApi.getDocument(ApiController2).externalDocs, externalDocs);
    });

    it('with the paths and operations of the root controller methods.', () => {
      const operation1: IApiOperation = {
        responses: {},
        summary: 'Operation 1',
      };
      const operation2: IApiOperation = {
        responses: {},
        summary: 'Operation 2',
      };

      @ApiInfo(infoMetadata)
      class ApiController {
        @Post('/bar')
        @ApiOperation(operation1)
        bar() {}

        @Get('/foo')
        @ApiOperation(operation2)
        foo() {}

        barfoo() {}
      }

      class AppController {
        subControllers = [
          controller('/api', ApiController)
        ];
      }

      Array.from(makeControllerRoutes(AppController, services));
      deepStrictEqual(openApi.getDocument(ApiController).paths, {
        '/bar': {
          post: operation1
        },
        '/foo': {
          get: operation2
        },
      });
    });

    it('with the paths and operations of the sub controllers methods.', () => {
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

      class ProductController {
        @Get()
        @ApiOperation(operation3)
        index() {}
      }

      class UserController {
        subControllers = [
          controller('/products', ProductController),
        ];

        @Post('/foo')
        @ApiOperation(operation2)
        foo() {}
      }

      @ApiInfo(infoMetadata)
      class ApiController {
        subControllers = [
          controller('/users', UserController),
        ];

        @Post('/bar')
        @ApiOperation(operation1)
        bar() {}
      }

      class AppController {
        subControllers = [
          controller('/api', ApiController)
        ];
      }

      Array.from(makeControllerRoutes(AppController, services));
      deepStrictEqual(openApi.getDocument(ApiController).paths, {
        '/bar': {
          post: operation1
        },
        '/users/foo': {
          post: operation2
        },
        '/users/products': {
          get: operation3
        },
      });
    });

    it('with the paths with the proper OpenAPI path templating.', () => {
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

      class BoxController {
        @Get('/:boxId')
        @ApiOperation(operation4)
        readBox() {}
      }

      @ApiInfo(infoMetadata)
      class ApiController {
        subControllers = [
          controller('/boxes', BoxController)
        ];

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

      class AppController {
        subControllers = [
          controller('/api', ApiController)
        ];
      }

      Array.from(makeControllerRoutes(AppController, services));
      deepStrictEqual(openApi.getDocument(ApiController).paths, {
        '/': {
          get: operation1
        },
        '/boxes/{boxId}': {
          get: operation4
        },
        '/foo': {
          get: operation2
        },
        '/users/{userId}/products/{productId}': {
          get: operation3
        },
      });
    });

    it('while gathering several operations (POST, GET, etc) under the same path.', () => {
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
      class ApiController {
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

      class AppController {
        subControllers = [
          controller('/api', ApiController)
        ];
      }

      Array.from(makeControllerRoutes(AppController, services));
      deepStrictEqual(openApi.getDocument(ApiController).paths, {
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

    it('with the operations completed with the operation pieces defined in the sub-controllers.', () => {
      const response: IApiResponse = { description: 'Unauthorized' };
      const parameter: IApiParameter = { in: 'cookie', name: 'foo' };

      @ApiInfo(infoMetadata)
      @ApiResponse(401, response)
      class ApiController {
        subControllers = [
          SubController
        ];

        @Post('/barfoo')
        @ApiUseTag('tag3')
        barfoo() {}
      }

      @ApiParameter(parameter)
      @ApiDeprecated()
      @ApiUseTag('tag1')
      class SubController {
        subControllers = [
          SubSubController
        ];
      }

      @ApiUseTag('tag3')
      class SubSubController {
        @Get('/foo')
        @ApiUseTag('tag2')
        foo() {}

        @Post('/bar')
        @ApiDeprecated(false)
        bar() {}
      }

      class AppController {
        subControllers = [
          controller('/api', ApiController)
        ];
      }

      Array.from(makeControllerRoutes(AppController, services));
      deepStrictEqual(openApi.getDocument(ApiController).paths, {
        '/bar': {
          post: {
            deprecated: false,
            parameters: [
              parameter
            ],
            responses: {
              401: response
            },
            tags: [ 'tag1', 'tag3' ]
          }
        },
        '/barfoo': {
          post: {
            responses: {
              401: response
            },
            tags: [ 'tag3' ]
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
            tags: [ 'tag1', 'tag3', 'tag2' ]
          },
        }
      } as IApiPaths);
    });

    it('with the sub-controllers\' servers, security requirements and externalDocs in the paths.', () => {
      const server: IApiServer = { url: 'http://example.com' };
      const externalDocs: IApiExternalDocumentation = { url: 'http://example.com/docs' };
      const securityRequirement: IApiSecurityRequirement = { a: [ 'b' ] };

      @ApiServer(server)
      @ApiExternalDoc(externalDocs)
      @ApiSecurityRequirement(securityRequirement)
      class UserController {
        @Get('/foo')
        foo(){}
      }

      @ApiInfo(infoMetadata)
      class ApiController {
        subControllers = [
          controller('/users', UserController),
        ]
      }

      class AppController {
        subControllers = [
          controller('/api', ApiController)
        ];
      }

      Array.from(makeControllerRoutes(AppController, services));
      const document = openApi.getDocument(ApiController);
      strictEqual(document.servers, undefined);
      strictEqual(document.externalDocs, undefined);
      strictEqual(document.security, undefined);

      deepStrictEqual(document.paths, {
        '/users/foo': {
          get: {
            externalDocs,
            responses: {},
            security: [ securityRequirement ],
            servers: [ server ],
          }
        }
      });
    });

    it('but without the root servers, security requirements and externalDocs in the paths.', () => {
      const server: IApiServer = { url: 'http://example.com' };
      const externalDocs: IApiExternalDocumentation = { url: 'http://example.com/docs' };
      const securityRequirement: IApiSecurityRequirement = { a: [ 'b' ] };

      @ApiInfo(infoMetadata)
      @ApiServer(server)
      @ApiExternalDoc(externalDocs)
      @ApiSecurityRequirement(securityRequirement)
      class ApiController {
        @Get('/foo')
        foo() {}
      }

      class AppController {
        subControllers = [
          controller('/api', ApiController)
        ];
      }

      Array.from(makeControllerRoutes(AppController, services));
      const document = openApi.getDocument(ApiController);
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

    it('with the components of the sub-controllers and sub-controllers methods if they exist.', () => {
      const callback1: IApiCallback = { a: { $ref: '1' } };
      const callback2: IApiCallback = { a: { $ref: '2' } };
      const callback2bis: IApiCallback = { a: { $ref: '2bis' } };
      const callback3: IApiCallback = { a: { $ref: '3' } };
      const callback4: IApiCallback = { a: { $ref: '4' } };
      const callback5: IApiCallback = { a: { $ref: '5' } };
      const callback6: IApiCallback = { a: { $ref: '6' } };
      const callback7: IApiCallback = { a: { $ref: '7' } };

      @ApiInfo(infoMetadata)
      @ApiDefineCallback('callback1', callback1)
      class ApiController {
        subControllers = [
          SubController
        ];

        @Get('/bar')
        @ApiDefineCallback('callback2', callback2)
        bar() {}

        @Get('/bar2')
        @ApiDefineCallback('callback2bis', callback2bis)
        bar2() {}
      }

      @ApiDefineCallback('callback3', callback3)
      @ApiDefineCallback('callback4', callback4)
      class SubController {
        subControllers = [
          SubSubController
        ];
      }

      @ApiDefineCallback('callback5', callback5)
      class SubSubController {
        @Get('/foo')
        @ApiDefineCallback('callback6', callback6)
        foo() {}

        @Get('/foo2')
        @ApiDefineCallback('callback7', callback7)
        foo2() {}
      }

      class AppController {
        subControllers = [
          controller('/api', ApiController)
        ];
      }

      Array.from(makeControllerRoutes(AppController, services));
      deepStrictEqual(openApi.getDocument(ApiController).components, {
        callbacks: {
          callback1,
          callback2,
          callback2bis,
          callback3,
          callback4,
          callback5,
          callback6,
          callback7,
        }
      });
    });

    it('with the tags of the sub-controllers and sub-controllers methods if they exist.', () => {
      const tag1: IApiTag = { name: '1' };
      const tag2bis: IApiTag = { name: '2bis' };
      const tag2: IApiTag = { name: '2' };
      const tag3: IApiTag = { name: '3' };
      const tag4: IApiTag = { name: '4' };
      const tag5: IApiTag = { name: '5' };
      const tag6: IApiTag = { name: '6' };
      const tag7: IApiTag = { name: '7' };

      @ApiInfo(infoMetadata)
      @ApiDefineTag(tag1)
      class ApiController {
        subControllers = [
          SubController
        ];

        @Get('/bar')
        @ApiDefineTag(tag2)
        bar() {}

        @Get('/bar2')
        @ApiDefineTag(tag2bis)
        bar2() {}
      }

      @ApiDefineTag(tag3)
      @ApiDefineTag(tag4)
      class SubController {
        subControllers = [
          SubSubController
        ];
      }

      @ApiDefineTag(tag5)
      class SubSubController {
        @Get('/foo')
        @ApiDefineTag(tag6)
        foo() {}

        @Get('/foo2')
        @ApiDefineTag(tag7)
        foo2() {}
      }

      class AppController {
        subControllers = [
          controller('/api', ApiController)
        ];
      }

      Array.from(makeControllerRoutes(AppController, services));
      deepStrictEqual(openApi.getDocument(ApiController).tags, [
        tag1, tag3, tag4, tag5, tag6, tag7, tag2, tag2bis
      ]);
    });

    it('and should throw an Error is some paths are duplicated.', done => {
      @ApiInfo(infoMetadata)
      class ApiController {
        @Get('/api/users/:userId/products/:productId')
        something() {}

        // Note that there is no beginning slash for the test.
        @Get('api/users/:userId2/products/:productId2')
        something2() {}
      }

      class AppController {
        subControllers = [
          controller('/api', ApiController)
        ];
      }

      try {
        Array.from(makeControllerRoutes(AppController, services));
        done(new Error('The function should have thrown an Error.'));
      } catch (error: any) {
        strictEqual(
          error.message,
          '[OpenAPI] Templated paths with the same hierarchy but different '
          + 'templated names MUST NOT exist as they are identical.'
          + '\n  Path 1: /api/users/{userId}/products/{productId}'
          + '\n  Path 2: /api/users/{userId2}/products/{productId2}'
        );
        done();
      }
    });

    it('and should not throw a "duplicate path" error on similar but different paths.', () => {
      @ApiInfo(infoMetadata)
      class ApiController {
        @Get('/api/users/:userId')
        something() {}

        @Get('/api/users/:userId/products/:productId2')
        something2() {}
      }

      class AppController {
        subControllers = [
          controller('/api', ApiController)
        ];
      }

      doesNotThrow(() => Array.from(makeControllerRoutes(AppController, services)));
    });

    it('and should use the controller instances to retreive the dynamic metadata.', () => {
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
      class ApiController {
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

      class AppController {
        subControllers = [
          controller('/api', ApiController)
        ];
      }

      Array.from(makeControllerRoutes(AppController, services));
      const document = openApi.getDocument(ApiController);
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

    it('with the controller instances.', () => {
      @ApiDefineCallback('callback2', { $ref: '$ref2' })
      class UserController {
        @Get('/foobar')
        foobar() {}
      }

      // This controller does not have its own routes but
      // it may have a controller hook that uses the OpenAPI component.
      @ApiInfo(infoMetadata)
      @ApiDefineCallback('callback1', { $ref: '$ref1' })
      class ApiController {
        subControllers = [
          controller('/users', UserController)
        ];
      }

      class AppController {
        subControllers = [
          controller('/api', ApiController)
        ];
      }

      const array = Array.from(makeControllerRoutes(AppController, services));
      strictEqual(array.length, 1);

      const components: IApiComponents = {
        callbacks: {
          callback1: { $ref: '$ref1' },
          callback2: { $ref: '$ref2' },
        }
      };
      const openApi = services.get(OpenApi);

      const appController = services.get(AppController);
      const apiController = services.get(ApiController);
      const userController = services.get(UserController);

      deepStrictEqual(openApi.getComponents(apiController), components);
      deepStrictEqual(openApi.getComponents(userController), components);
      deepStrictEqual(openApi.getComponents(appController), {});
    });

  });

  it('should not yield the controller tags, components or operation if it is not part of an OpenAPI API.', () => {
    @ApiDefineTag({ name: 'tag1' })
    @ApiDefineCallback('callback1', { $ref: 'ref1' })
    @ApiOperationDescription('description1')
    class UserController {
      @Get('/something')
      something() {}
    }

    @ApiInfo({
      title: 'foo',
      version: '0.0.0'
    })
    class ApiController {
      subControllers = [
        controller('/users', UserController)
      ];

      @Get('/bar')
      @ApiDefineTag({ name: 'bartag' })
      @ApiDefineCallback('barcallback', { $ref: 'barref' })
      @ApiOperationDescription('bardescription')
      bar() {}
    }

    class AppController {
      subControllers = [
        controller('/api', ApiController)
      ];

      @Get('/foo')
      @ApiDefineTag({ name: 'footag' })
      @ApiDefineCallback('foocallback', { $ref: 'fooref' })
      @ApiOperationDescription('foodescription')
      foo() {}
    }

    for (const { tags, components, operation } of makeControllerRoutes(AppController, new ServiceManager())) {
      strictEqual(tags, undefined);
      deepStrictEqual(components, {});
      deepStrictEqual(operation, { responses: {} });
    }

    for (const { tags, components, operation } of makeControllerRoutes(ApiController, new ServiceManager())) {
      notStrictEqual(tags, undefined);
      notDeepStrictEqual(components, {});
      notDeepStrictEqual(operation, { responses: {} });
    }
  });

});
