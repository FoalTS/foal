// std
import { deepStrictEqual, ok, strictEqual } from 'assert';

// FoalTS
import { Controller } from '../controllers';
import { Hook } from '../hooks';
import { Get, Post } from '../http';
import { IModule, Module } from '../modules';
import { ServiceManager } from '../service-manager';
import { makeModuleRoutes } from './make-module-routes';

describe('makeModuleRoutes', () => {

  it('should return the routes of each controller.', () => {
    class MyController {
      @Get()
      bar() {}
    }

    class MyController2 {
      @Post()
      foobar() {}
    }

    @Module()
    class MyModule implements IModule {
      controllers = [
        MyController,
        MyController2
      ];
    }

    const routes = makeModuleRoutes('', [], MyModule, new ServiceManager());

    strictEqual(routes.length, 2);

    // bar
    ok(routes[0].controller instanceof MyController);
    strictEqual(routes[0].httpMethod, 'GET');
    strictEqual(routes[0].propertyKey, 'bar');

    // foobar
    ok(routes[1].controller instanceof MyController2);
    strictEqual(routes[1].httpMethod, 'POST');
    strictEqual(routes[1].propertyKey, 'foobar');
  });

  it('should return the routes of each submodule.', () => {
    class MyController {
      @Get()
      bar() {}
    }

    class MyController2 {
      @Post()
      foobar() {}
    }

    @Module()
    class Module1 {
      controllers = [ MyController ];
    }

    @Module()
    class Module2 {
      controllers = [ MyController2 ];
    }

    @Module()
    class MyModule implements IModule {
      subModules = [
        Module1,
        Module2
      ];
    }

    const routes = makeModuleRoutes('', [], MyModule, new ServiceManager());

    strictEqual(routes.length, 2);

    // bar
    ok(routes[0].controller instanceof MyController);
    strictEqual(routes[0].httpMethod, 'GET');
    strictEqual(routes[0].propertyKey, 'bar');

    // foobar
    ok(routes[1].controller instanceof MyController2);
    strictEqual(routes[1].httpMethod, 'POST');
    strictEqual(routes[1].propertyKey, 'foobar');
  });

  it('should include in the returned routes the parent and module path and/or hooks.', () => {
    const hook0 = () => {};
    const hook1 = () => {};
    const hook2 = () => {};
    const hook3 = () => {};
    const hook4 = () => {};

    @Controller('/barfoo')
    @Hook(hook3)
    class MyController {
      @Get()
      bar() {}
    }

    @Controller('/foobar')
    @Hook(hook4)
    class MyController2 {
      @Post()
      foobar() {}
    }

    @Module()
    class Module1 {
      controllers = [ MyController ];
    }

    @Module('/foo//')
    @Hook(hook1)
    @Hook(hook2)
    class MyModule implements IModule {
      controllers = [
        MyController2,
      ];
      subModules = [
        Module1,
      ];
    }

    const routes = makeModuleRoutes('bar//', [ hook0 ] , MyModule, new ServiceManager());

    strictEqual(routes.length, 2);

    // bar
    ok(routes[0].controller instanceof MyController2);
    deepStrictEqual(routes[0].hooks, [ hook0, hook1, hook2, hook4 ]);
    strictEqual(routes[0].httpMethod, 'POST');
    strictEqual(routes[0].path, 'bar/foo/foobar');
    strictEqual(routes[0].propertyKey, 'foobar');

    // foobar
    ok(routes[1].controller instanceof MyController);
    deepStrictEqual(routes[1].hooks, [ hook0, hook1, hook2, hook3 ]);
    strictEqual(routes[1].httpMethod, 'GET');
    strictEqual(routes[1].path, 'bar/foo/barfoo');
    strictEqual(routes[1].propertyKey, 'bar');
  });

});
