// 3p
import { expect } from 'chai';

// FoalTS
import { Controller } from '../controllers';
import { Hook } from '../hooks';
import { Get, Post } from '../http';
import { IModule, Module } from '../modules';
import { ServiceManager } from '../service-manager';
import { makeModuleRoutes } from './make-module-routes';

describe('makeModuleRoutes', () => {

  it('should return the routes of each controller.', () => {
    @Controller()
    class MyController {
      @Get()
      bar() {}
    }

    @Controller()
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

    expect(routes).to.have.lengthOf(2);

    // bar
    expect(routes[0].controller).to.be.an.instanceOf(MyController);
    expect(routes[0].httpMethod).to.equal('GET');
    expect(routes[0].propertyKey).to.equal('bar');

    // foobar
    expect(routes[1].controller).to.be.an.instanceOf(MyController2);
    expect(routes[1].httpMethod).to.equal('POST');
    expect(routes[1].propertyKey).to.equal('foobar');
  });

  it('should return the routes of each submodule.', () => {
    @Controller()
    class MyController {
      @Get()
      bar() {}
    }

    @Controller()
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

    expect(routes).to.have.lengthOf(2);

    // bar
    expect(routes[0].controller).to.be.an.instanceOf(MyController);
    expect(routes[0].httpMethod).to.equal('GET');
    expect(routes[0].propertyKey).to.equal('bar');

    // foobar
    expect(routes[1].controller).to.be.an.instanceOf(MyController2);
    expect(routes[1].httpMethod).to.equal('POST');
    expect(routes[1].propertyKey).to.equal('foobar');
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

    expect(routes).to.have.lengthOf(2);

    // bar
    expect(routes[0].controller).to.be.an.instanceOf(MyController2);
    expect(routes[0].hooks).to.deep.equal([ hook0, hook1, hook2, hook4 ]);
    expect(routes[0].httpMethod).to.equal('POST');
    expect(routes[0].path).to.equal('bar/foo/foobar');
    expect(routes[0].propertyKey).to.equal('foobar');

    // foobar
    expect(routes[1].controller).to.be.an.instanceOf(MyController);
    expect(routes[1].hooks).to.deep.equal([ hook0, hook1, hook2, hook3 ]);
    expect(routes[1].httpMethod).to.equal('GET');
    expect(routes[1].path).to.equal('bar/foo/barfoo');
    expect(routes[1].propertyKey).to.equal('bar');
  });

});
