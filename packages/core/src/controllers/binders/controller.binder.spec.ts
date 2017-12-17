import { expect } from 'chai';

import { Service, ServiceManager } from '../../di/service-manager';
import { preHook } from '../factories';
import { Context, MethodPrimitiveBinding, PreMiddleware } from '../interfaces';
import { ControllerBinder } from './controller.binder';

describe('ControllerBinder<T>', () => {

  interface ServiceInterface { foobar: () => Promise<any>; }
  const classPreMiddleware: PreMiddleware = (ctx: Context, services: ServiceManager) => {
    ctx.state.class = { services };
  };
  const methodPreMiddleware: PreMiddleware = (ctx: Context, services: ServiceManager) => {
    ctx.state.method = { services };
  };

  @Service()
  @preHook(classPreMiddleware)
  class ServiceClass implements ServiceInterface {
    constructor() {}

    @preHook(methodPreMiddleware)
    public async foobar(): Promise<any> { return 'Hello world'; }
  }

  class ConcreteControllerBinder extends ControllerBinder<ServiceInterface> {
    protected bind(controller: ServiceInterface): MethodPrimitiveBinding[] {
      return [
        {
          controllerMethodBinder: async (context: Context) => controller.foobar(),
          controllerMethodName: 'foobar',
          httpMethod: 'GET',
          path: '/foobar',
          successStatus: 10000
        }
      ];
    }
  }
  let controllerBinder: ControllerBinder<ServiceInterface>;
  let services: ServiceManager;

  beforeEach(() => {
    services = new ServiceManager();
    controllerBinder = new ConcreteControllerBinder();
  });

  describe('when bindController(path: string, ControllerClass: Type<T>) is called', () => {

    describe('with a ControllerClass that has not been added to the service manager', () => {

      it('should raise an Error.', () => {
        const func = controllerBinder.bindController('/my_path', ServiceClass);

        expect(() => func(services)).to.throw();
      });

    });

    describe('with good parameters', () => {

      beforeEach(() => services.add(ServiceClass));

      it('should return a MethodBinding array from the MethodPrimitiveBinding array of the bind method.', async () => {
        const func = controllerBinder.bindController('/my_path', ServiceClass);
        const methodBindings = func(services);

        expect(methodBindings).to.be.an('array').and.to.have.lengthOf(1);

        const actual = methodBindings[0];

        expect(actual.httpMethod).to.equal('GET');
        expect(actual.paths).to.deep.equal(['/my_path', '/foobar']);
        expect(actual.successStatus).to.equal(10000);

        expect(actual.middlewares).to.be.an('array').and.to.have.lengthOf(3);
        const ctx = { state: {} } as Context;
        actual.middlewares[0](ctx);
        expect(ctx.state.class).to.deep.equal({ services });
        actual.middlewares[1](ctx);
        expect(ctx.state.method).to.deep.equal({ services });
        await actual.middlewares[2](ctx);
        expect(ctx.result).to.equal('Hello world');
      });

    });

  });

});
