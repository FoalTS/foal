// std
import { deepStrictEqual, ok, strictEqual } from 'assert';

// 3p
import 'reflect-metadata';
import { dependency, ServiceManager } from '@foal/core';

// FoalTS
import { WebsocketHook, WebsocketHookFunction, WebsocketContext, EventName } from '../architecture';
import { makeWebsocketControllerRoutes } from './make-websocket-controller-routes';
import { WebsocketResponse } from '../architecture/websocket-responses';

describe('makeWebsocketControllerRoutes', () => {

  const hook1: WebsocketHookFunction = () => new WebsocketResponse('hook1');
  const hook2: WebsocketHookFunction = () => new WebsocketResponse('hook2');
  const hook3: WebsocketHookFunction = () => new WebsocketResponse('hook3');
  const hook4: WebsocketHookFunction = () => new WebsocketResponse('hook4');
  const hook5: WebsocketHookFunction = () => new WebsocketResponse('hook5');
  const hook6: WebsocketHookFunction = () => new WebsocketResponse('hook6');

  const ctx = new WebsocketContext('foo', {});
  const services = new ServiceManager();

  it('should return the routes from a controller with a method.', () => {
    class FoobarController {
      @EventName('barfoo')
      bar() {}
    }

    const routes = Array.from(makeWebsocketControllerRoutes(FoobarController, new ServiceManager()));

    strictEqual(routes.length, 1);

    // bar() {}
    ok(routes[0].controller instanceof FoobarController);
    deepStrictEqual(routes[0].hooks, []);
    strictEqual(routes[0].eventName, 'barfoo');
    strictEqual(routes[0].propertyKey, 'bar');
  });

  it('should return the routes from a controller with a method and a concated event name.', () => {
    @Reflect.metadata('websocket-event-name', 'foo')
    class FoobarController {
      @EventName('bar')
      bar() {}
    }

    const routes = Array.from(makeWebsocketControllerRoutes(FoobarController, new ServiceManager()))

    strictEqual(routes.length, 1);

    // bar() {}
    strictEqual(routes[0].eventName, 'foobar');
  });

  it('should return the routes from a controller with a method and controller and method hooks.', () => {
    @WebsocketHook(hook3)
    @WebsocketHook(hook4)
    class FoobarController {
      @EventName('barfoo')
      @WebsocketHook(hook5)
      @WebsocketHook(hook6)
      bar() {}
    }

    const routes = Array.from(makeWebsocketControllerRoutes(FoobarController, new ServiceManager()))

    strictEqual(routes.length, 1);

    // bar() {}
    deepStrictEqual(
      routes[0].hooks.map(hook => (hook(ctx, services) as WebsocketResponse).payload),
      [ 'hook3', 'hook4', 'hook5', 'hook6' ]
    );
  });

  it('should return the routes from the controller methods that have a event-name decorator.', () => {
    class FoobarController {
      @EventName('bar event')
      bar() {}

      foo() {}

      @EventName('barfoo event')
      barfoo() {}
    }

    const routes = Array.from(makeWebsocketControllerRoutes(FoobarController, new ServiceManager()));

    strictEqual(routes.length, 2);

    // bar() {}
    strictEqual(routes[0].eventName, 'bar event');
    strictEqual(routes[0].propertyKey, 'bar');

    // barfoo() {}
    strictEqual(routes[1].eventName, 'barfoo event');
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

      @EventName('bar event')
      bar() {}
    }

    const services = new ServiceManager();
    const routes = Array.from(makeWebsocketControllerRoutes(FoobarController, services))

    strictEqual(routes.length, 1);

    // bar
    ok(routes[0].controller instanceof FoobarController);
    strictEqual(routes[0].controller.service1, services.get(Service1));
    strictEqual(routes[0].controller.service2, services.get(Service2));
  });

  it('should register the controller instance in the ServiceManager.', () => {
    class FoobarController {
      @EventName('bar event')
      bar() {}
    }

    const services = new ServiceManager();
    const routes = Array.from(makeWebsocketControllerRoutes(FoobarController, services))

    strictEqual(routes.length, 1);

    // bar
    strictEqual(routes[0].controller, services.get(FoobarController));
  });


  it('should return all the routes of the prototype chain of an inherited controller.', () => {
    class FoobarController {

      @EventName('bar event')
      @WebsocketHook(hook1)
      bar() {}

    }

    @Reflect.metadata('websocket-event-name', 'foo ')
    @WebsocketHook(hook2)
    class FoobarController2 extends FoobarController {

      @EventName('barfoo event')
      @WebsocketHook(hook3)
      barfoo() {}

    }

    const routes = Array.from(makeWebsocketControllerRoutes(FoobarController2, new ServiceManager()))

    strictEqual(routes.length, 2);

    // barfoo
    ok(routes[0].controller instanceof FoobarController2);
    deepStrictEqual(
      routes[0].hooks.map(hook => (hook(ctx, services) as WebsocketResponse).payload),
      [ 'hook2', 'hook3' ]
    );
    strictEqual(routes[0].eventName, 'foo barfoo event');
    strictEqual(routes[0].propertyKey, 'barfoo');

    // bar
    ok(routes[1].controller instanceof FoobarController2);
    deepStrictEqual(
      routes[1].hooks.map(hook => (hook(ctx, services) as WebsocketResponse).payload),
      [ 'hook2', 'hook1' ]
    );
    strictEqual(routes[1].eventName, 'foo bar event');
    strictEqual(routes[1].propertyKey, 'bar');

  });

  it('should recursively return the routes of the subControllers if they exist.', () => {
    @Reflect.metadata('websocket-event-name', 'api ')
    @WebsocketHook(hook2)
    class ApiController {
      @EventName('flights event')
      @WebsocketHook(hook3)
      flights() {}
    }

    @Reflect.metadata('websocket-event-name', 'auth ')
    @WebsocketHook(hook4)
    class AuthController {
      @EventName('index event')
      @WebsocketHook(hook5)
      index() {}
    }

    @Reflect.metadata('websocket-event-name', 'foo ')
    @WebsocketHook(hook1)
    class AppController {
      subControllers = [
        ApiController,
        AuthController,
      ];
    }

    const routes = Array.from(makeWebsocketControllerRoutes(AppController, new ServiceManager()))

    strictEqual(routes.length, 2);

    // bar
    ok(routes[0].controller instanceof ApiController);
    deepStrictEqual(
      routes[0].hooks.map(hook => (hook(ctx, services) as WebsocketResponse).payload),
      [ 'hook1', 'hook2', 'hook3' ]
    );
    strictEqual(routes[0].eventName, 'foo api flights event');
    strictEqual(routes[0].propertyKey, 'flights');

    // foobar
    ok(routes[1].controller instanceof AuthController);
    deepStrictEqual(
      routes[1].hooks.map(hook => (hook(ctx, services) as WebsocketResponse).payload),
      [ 'hook1', 'hook4', 'hook5' ]
    );
    strictEqual(routes[1].eventName, 'foo auth index event');
    strictEqual(routes[1].propertyKey, 'index');
  });

  it('should return the sub-controllers and controller routes in the right order.', () => {
    class SubController {
      @EventName('bar event')
      bar() {}
    }

    class AppController {
      subControllers = [ SubController ];

      @EventName('foo event')
      foo() {}
    }

    const routes = Array.from(makeWebsocketControllerRoutes(AppController, new ServiceManager()))

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

    @WebsocketHook(function(this: FoobarController) {
      firstThis = this;
    })
    class FoobarController {
      @EventName('bar event')
      @WebsocketHook(function(this: FoobarController) {
        secondThis = this;
      })
      bar() {}
    }

    const routes = Array.from(makeWebsocketControllerRoutes(FoobarController, new ServiceManager()));

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