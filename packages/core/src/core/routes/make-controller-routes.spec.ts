// 3p
import { expect } from 'chai';

// FoalTS
import { Controller } from '../controllers';
import { Hook, HookFunction } from '../hooks';
import { Get, Post } from '../http';
import { Service, ServiceManager } from '../service-manager';
import { makeControllerRoutes } from './make-controller-routes';

describe('makeControllerRoutes', () => {

  const hook1: HookFunction = () => {};
  const hook2: HookFunction = () => {};
  const hook3: HookFunction = () => {};
  const hook4: HookFunction = () => {};
  const hook5: HookFunction = () => {};
  const hook6: HookFunction = () => {};

  it('should return the routes from a controller with no paths and hooks.', () => {
    @Controller()
    class FoobarController {
      @Get()
      bar() {}
    }

    const routes = makeControllerRoutes('', [], FoobarController, new ServiceManager());

    expect(routes).to.have.lengthOf(1);

    // bar() {}
    expect(routes[0].controller).to.be.an.instanceOf(FoobarController);
    expect(routes[0].hooks).to.deep.equal([]);
    expect(routes[0].httpMethod).to.equal('GET');
    expect(routes[0].path).to.equal('');
    expect(routes[0].propertyKey).to.equal('bar');
  });

  it('should return the routes from a controller with the parent, controller and method paths.', () => {
    @Controller('/foo/')
    class FoobarController {
      @Get('/bar')
      bar() {}
    }
    const routes = makeControllerRoutes('barfoo', [], FoobarController, new ServiceManager());

    expect(routes).to.have.lengthOf(1);

    // bar() {}
    expect(routes[0].path).to.equal('barfoo/foo/bar');
  });

  it('should return the routes from a controller with the parent, controller and method hooks.', () => {
    @Controller()
    @Hook(hook3)
    @Hook(hook4)
    class FoobarController {
      @Get()
      @Hook(hook5)
      @Hook(hook6)
      bar() {}
    }
    const routes = makeControllerRoutes('', [ hook1, hook2 ], FoobarController, new ServiceManager());

    expect(routes).to.have.lengthOf(1);

    // bar() {}
    expect(routes[0].hooks).to.deep.equal([ hook1, hook2, hook3, hook4, hook5, hook6 ]);
  });

  it('should return the routes from the controller methods that have a http-method decorator.', () => {

    @Controller()
    class FoobarController {
      @Get()
      bar() {}

      foo() {}

      @Post()
      barfoo() {}

    }

    const routes = makeControllerRoutes('', [], FoobarController, new ServiceManager());

    expect(routes).to.have.lengthOf(2);

    // bar() {}
    expect(routes[0].httpMethod).to.equal('GET');
    expect(routes[0].propertyKey).to.equal('bar');

    // barfoo() {}
    expect(routes[1].httpMethod).to.equal('POST');
    expect(routes[1].propertyKey).to.equal('barfoo');
  });

  it('should properly instantiate a controller that has dependencies.', () => {

    @Service()
    class Service1 {}

    @Service()
    class Service2 {}

    @Controller()
    class FoobarController {
      constructor(private service1: Service1, private service2: Service2) {}

      @Get()
      bar() {}
    }

    const services = new ServiceManager();
    const routes = makeControllerRoutes('', [], FoobarController, services);

    expect(routes).to.have.lengthOf(1);

    // bar
    expect(routes[0].controller).to.be.an.instanceOf(FoobarController);
    expect(routes[0].controller.service1).to.equal(services.get(Service1));
    expect(routes[0].controller.service2).to.equal(services.get(Service2));
  });

  it('should return all the routes of the prototype chain of an inherited controller.', () => {
    class FoobarController {

      @Get('/bar')
      @Hook(hook1)
      bar() {}

    }

    @Controller('/foo')
    @Hook(hook2)
    class FoobarController2 extends FoobarController {

      @Post('/barfoo')
      @Hook(hook3)
      barfoo() {}

    }

    const routes = makeControllerRoutes('', [], FoobarController2, new ServiceManager());

    console.log(routes);
    expect(routes).to.have.lengthOf(2);

    // barfoo
    expect(routes[0].controller).to.be.an.instanceOf(FoobarController2);
    expect(routes[0].hooks).to.deep.equal([ hook2, hook3 ]);
    expect(routes[0].httpMethod).to.equal('POST');
    expect(routes[0].path).to.equal('/foo/barfoo');
    expect(routes[0].propertyKey).to.equal('barfoo');

    // bar
    expect(routes[1].controller).to.be.an.instanceOf(FoobarController2);
    expect(routes[1].hooks).to.deep.equal([ hook2, hook1 ]);
    expect(routes[1].httpMethod).to.equal('GET');
    expect(routes[1].path).to.equal('/foo/bar');
    expect(routes[1].propertyKey).to.equal('bar');

  });

});
