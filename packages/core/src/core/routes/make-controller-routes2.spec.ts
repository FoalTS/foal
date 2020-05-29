// std
import { deepStrictEqual, ok, strictEqual } from 'assert';

// FoalTS
import { Hook, HookFunction } from '../hooks';
import { Context, Get, HttpResponseOK, Post } from '../http';
import { dependency, ServiceManager } from '../service-manager';
import { makeControllerRoutes2 } from './make-controller-routes2';

describe('makeControllerRoutes2', () => {

  const hook0: HookFunction = () => new HttpResponseOK('hook0');
  const hook1: HookFunction = () => new HttpResponseOK('hook1');
  const hook2: HookFunction = () => new HttpResponseOK('hook2');
  const hook3: HookFunction = () => new HttpResponseOK('hook3');
  const hook4: HookFunction = () => new HttpResponseOK('hook4');
  const hook5: HookFunction = () => new HttpResponseOK('hook5');
  const hook6: HookFunction = () => new HttpResponseOK('hook6');

  const ctx = new Context({});
  const services = new ServiceManager();

  it('should return the routes from a controller with no paths and hooks.', () => {
    class FoobarController {
      @Get()
      bar() {}
    }

    const routes = Array.from(makeControllerRoutes2('', [], FoobarController, new ServiceManager()));

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
    const routes = Array.from(makeControllerRoutes2('barfoo', [], FoobarController, new ServiceManager()));

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
    const routes = Array.from(makeControllerRoutes2('', [ hook1, hook2 ], FoobarController, new ServiceManager()));

    strictEqual(routes.length, 1);

    // bar() {}
    deepStrictEqual(
      routes[0].hooks.map(hook => (hook(ctx, services) as HttpResponseOK).body),
      [ 'hook1', 'hook2', 'hook3', 'hook4', 'hook5', 'hook6' ]
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

    const routes = Array.from(makeControllerRoutes2('', [], FoobarController, new ServiceManager()));

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
    const routes = Array.from(makeControllerRoutes2('', [], FoobarController, services));

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
    const routes = Array.from(makeControllerRoutes2('', [], FoobarController, services));

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

    const routes = Array.from(makeControllerRoutes2('', [], FoobarController2, new ServiceManager()));

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

    const routes = Array.from(makeControllerRoutes2('bar//', [ hook0 ] , AppController, new ServiceManager()));

    strictEqual(routes.length, 2);

    // bar
    ok(routes[0].controller instanceof ApiController);
    deepStrictEqual(
      routes[0].hooks.map(hook => (hook(ctx, services) as HttpResponseOK).body),
      [ 'hook0', 'hook1', 'hook2', 'hook3' ]
    );
    strictEqual(routes[0].httpMethod, 'GET');
    strictEqual(routes[0].path, 'bar/foo/api/flights');
    strictEqual(routes[0].propertyKey, 'flights');

    // foobar
    ok(routes[1].controller instanceof AuthController);
    deepStrictEqual(
      routes[1].hooks.map(hook => (hook(ctx, services) as HttpResponseOK).body),
      [ 'hook0', 'hook1', 'hook4', 'hook5' ]
    );
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

    const routes = Array.from(makeControllerRoutes2('', [] , AppController, new ServiceManager()));

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

    const routes = Array.from(makeControllerRoutes2('', [], FoobarController, new ServiceManager()));

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

});
