import { expect } from 'chai';

import { Service, ServiceManager } from '../../di/service-manager';
import { postHook, preHook } from '../factories';
import { Context, MethodPrimitiveBinding, PostMiddleware, PreMiddleware } from '../interfaces';
import { ControllerBinder } from './controller.binder';

describe('ControllerBinder<T>', () => {

  interface ServiceInterface { foobar: () => Promise<any>; }
  const classPreMiddleware1: PreMiddleware = (ctx: Context, services: ServiceManager) => {
    ctx.state.preClass1 = { services };
  };
  const classPreMiddleware2: PreMiddleware = (ctx: Context, services: ServiceManager) => {
    ctx.state.preClass2 = { services };
  };
  const methodPreMiddleware1: PreMiddleware = (ctx: Context, services: ServiceManager) => {
    ctx.state.preMethod1 = { services };
  };
  const methodPreMiddleware2: PreMiddleware = (ctx: Context, services: ServiceManager) => {
    ctx.state.preMethod2 = { services };
  };
  const classPostMiddleware1: PostMiddleware = (ctx: Context, services: ServiceManager) => {
    ctx.state.postClass1 = { services };
  };
  const classPostMiddleware2: PostMiddleware = (ctx: Context, services: ServiceManager) => {
    ctx.state.postClass2 = { services };
  };
  const methodPostMiddleware1: PostMiddleware = (ctx: Context, services: ServiceManager) => {
    ctx.state.postMethod1 = { services };
  };
  const methodPostMiddleware2: PostMiddleware = (ctx: Context, services: ServiceManager) => {
    ctx.state.postMethod2 = { services };
  };

  @Service()
  @preHook(classPreMiddleware1)
  @preHook(classPreMiddleware2)
  @postHook(classPostMiddleware1)
  @postHook(classPostMiddleware2)
  class ServiceClass implements ServiceInterface {
    constructor() {}

    @preHook(methodPreMiddleware1)
    @preHook(methodPreMiddleware2)
    @postHook(methodPostMiddleware1)
    @postHook(methodPostMiddleware2)
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

        expect(actual.middlewares).to.be.an('array').and.to.have.lengthOf(4 + 1 + 4);
        const ctx = { state: {} } as Context;

        // Pre-hooks
        actual.middlewares[0](ctx);
        expect(ctx.state.preClass1).to.deep.equal({ services });
        actual.middlewares[1](ctx);
        expect(ctx.state.preClass2).to.deep.equal({ services });
        actual.middlewares[2](ctx);
        expect(ctx.state.preMethod1).to.deep.equal({ services });
        actual.middlewares[3](ctx);
        expect(ctx.state.preMethod2).to.deep.equal({ services });

        // Service method
        await actual.middlewares[4](ctx);
        expect(ctx.result).to.equal('Hello world');

        // Post-hooks
        // Method post-hooks should be executed before class post-hooks.
        actual.middlewares[5](ctx);
        expect(ctx.state.postMethod1).to.deep.equal({ services });
        actual.middlewares[6](ctx);
        expect(ctx.state.postMethod2).to.deep.equal({ services });
        actual.middlewares[7](ctx);
        expect(ctx.state.postClass1).to.deep.equal({ services });
        actual.middlewares[8](ctx);
        expect(ctx.state.postClass2).to.deep.equal({ services });
      });

    });

  });

});
