import * as chai from 'chai';
import * as spies from 'chai-spies';

import { Class } from '../interfaces';
import { Controller } from './controller';
import { HttpResponseOK } from './http-responses';
import { ServiceControllerFactory } from './service-controller-factory';

chai.use(spies);
const expect = chai.expect;

describe('ControllerFactory', () => {

  interface ServiceInterface {
    getFoo(): string;
  }

  interface Options {
    option: string;
  }

  class ConcreteServiceControllerFactory extends ServiceControllerFactory<
      ServiceInterface, 'main', Options> {

    public defineController(controller: Controller<'main'>,
                            ServiceClass: Class<ServiceInterface>,
                            options?: Options) {
      controller.addRoute('main', 'POST', '/foo', (ctx, services) => {
        return new HttpResponseOK(services.get(ServiceClass).getFoo());
      });
    }

  }

  class ConcreteService implements ServiceInterface {
    public getFoo(): string {
      return 'bar';
    }
  }

  let factory: ConcreteServiceControllerFactory;

  before(() => factory = new ConcreteServiceControllerFactory());

  describe('when attachService is called', () => {

    it('should call defineController with the ServiceClass, the returned controller and the optional options.', () => {
      chai.spy.on(factory, 'defineController');

      let controller = factory.attachService('/', ConcreteService);
      expect(factory.defineController).to.have.been.called.with.exactly(controller, ConcreteService, undefined);

      const options: Options = {
        option: 'option 1'
      };
      controller = factory.attachService('/', ConcreteService, options);
      expect(factory.defineController).to.have.been.called.with.exactly(controller, ConcreteService, options);
    });

    it('should add the given path to each route of the returned controller.', () => {
      const controller = factory.attachService('/bar', ConcreteService);
      expect(controller.getRoute('main').path).to.equal('/bar/foo');
    });

  });

});
