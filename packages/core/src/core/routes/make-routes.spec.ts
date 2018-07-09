// 3p
import { expect } from 'chai';

// FoalTS
import { Controller } from '../controllers';
import { Get } from '../http';
import { IModule, Module } from '../modules';
import { ServiceManager } from '../service-manager';
import { makeRoutes } from './make-routes';

describe('makeRoutes', () => {

  it('should call makeModuleRoutes with no parent path and no parent hooks.', () => {
    @Controller()
    class MyController {
      @Get('/foo')
      bar() {}
    }

    @Module()
    class MyModule implements IModule {
      controllers = [ MyController ];
    }

    const routes = makeRoutes(MyModule, new ServiceManager());

    expect(routes).to.have.lengthOf(1);

    // bar
    expect(routes[0].controller).to.be.an.instanceOf(MyController);
    expect(routes[0].hooks).to.deep.equal([]);
    expect(routes[0].httpMethod).to.equal('GET');
    expect(routes[0].path).to.equal('/foo');
    expect(routes[0].propertyKey).to.equal('bar');

  });

});
