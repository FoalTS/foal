// std
import { deepStrictEqual, ok, strictEqual } from 'assert';

// FoalTS
import { Hook, HookFunction } from '../hooks';
import { Get, Post } from '../http';
import { dependency, ServiceManager } from '../service-manager';
import { makeControllerRoutes } from './make-controller-routes';

describe('makeControllerRoutes', () => {

  const hook0: HookFunction = () => {};
  const hook1: HookFunction = () => {};
  const hook2: HookFunction = () => {};
  const hook3: HookFunction = () => {};
  const hook4: HookFunction = () => {};
  const hook5: HookFunction = () => {};
  const hook6: HookFunction = () => {};

  it('should return the routes from a controller with no paths and hooks.', () => {
    class FoobarController {
      @Get()
      bar() {}
    }

    const routes = makeControllerRoutes('', [], FoobarController, new ServiceManager());

    strictEqual(routes.length, 1);

    // bar() {}
    ok(routes[0].controller instanceof FoobarController);
    deepStrictEqual(routes[0].hooks, []);
    strictEqual(routes[0].httpMethod, 'GET');
    strictEqual(routes[0].path, '');
    strictEqual(routes[0].propertyKey, 'bar');
  });

  it('should return the routes from a controller with the parent, controller and method paths.', () => {
    @Reflect.metadata('path', '/foo/')
    class FoobarController {
      @Get('/bar')
      bar() {}
    }
    const routes = makeControllerRoutes('barfoo', [], FoobarController, new ServiceManager());

    strictEqual(routes.length, 1);

    // bar() {}
    strictEqual(routes[0].path, 'barfoo/foo/bar');
  });

  it('should return the routes from a controller with the parent, controller and method hooks.', () => {
    @Hook(hook3)
    @Hook(hook4)
    class FoobarController {
      @Get()
      @Hook(hook5)
      @Hook(hook6)
      bar() {}
    }
    const routes = makeControllerRoutes('', [ hook1, hook2 ], FoobarController, new ServiceManager());

    strictEqual(routes.length, 1);

    // bar() {}
    deepStrictEqual(routes[0].hooks, [ hook1, hook2, hook3, hook4, hook5, hook6 ]);
  });

  it('should return the routes from the controller methods that have a http-method decorator.', () => {
    class FoobarController {
      @Get()
      bar() {}

      foo() {}

      @Post()
      barfoo() {}
    }

    const routes = makeControllerRoutes('', [], FoobarController, new ServiceManager());

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
    const routes = makeControllerRoutes('', [], FoobarController, services);

    strictEqual(routes.length, 1);

    // bar
    ok(routes[0].controller instanceof FoobarController);
    strictEqual(routes[0].controller.service1, services.get(Service1));
    strictEqual(routes[0].controller.service2, services.get(Service2));
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

    const routes = makeControllerRoutes('', [], FoobarController2, new ServiceManager());

    strictEqual(routes.length, 2);

    // barfoo
    ok(routes[0].controller instanceof FoobarController2);
    deepStrictEqual(routes[0].hooks, [ hook2, hook3 ]);
    strictEqual(routes[0].httpMethod, 'POST');
    strictEqual(routes[0].path, '/foo/barfoo');
    strictEqual(routes[0].propertyKey, 'barfoo');

    // bar
    ok(routes[1].controller instanceof FoobarController2);
    deepStrictEqual(routes[1].hooks, [ hook2, hook1 ]);
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

    const routes = makeControllerRoutes('bar//', [ hook0 ] , AppController, new ServiceManager());

    strictEqual(routes.length, 2);

    // bar
    ok(routes[0].controller instanceof ApiController);
    deepStrictEqual(routes[0].hooks, [ hook0, hook1, hook2, hook3 ]);
    strictEqual(routes[0].httpMethod, 'GET');
    strictEqual(routes[0].path, 'bar/foo/api/flights');
    strictEqual(routes[0].propertyKey, 'flights');

    // foobar
    ok(routes[1].controller instanceof AuthController);
    deepStrictEqual(routes[1].hooks, [ hook0, hook1, hook4, hook5 ]);
    strictEqual(routes[1].httpMethod, 'GET');
    strictEqual(routes[1].path, 'bar/foo/auth/');
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

    const routes = makeControllerRoutes('', [] , AppController, new ServiceManager());

    strictEqual(routes.length, 2);

    // bar
    ok(routes[0].controller instanceof SubController);

    // foo
    ok(routes[1].controller instanceof AppController);
  });

});
