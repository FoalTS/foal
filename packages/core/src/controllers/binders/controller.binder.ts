import 'reflect-metadata';

import { Injector } from '../../di/injector';
import { Type } from '../../interfaces';
import { Context, MethodBinding, MethodPrimitiveBinding, PreMiddleware } from '../interfaces';

export abstract class ControllerBinder<T> {

  constructor() {}

  public bindController(path: string, ControllerClass: Type<T>): (injector: Injector) => MethodBinding[] {
    return (injector: Injector): MethodBinding[] => {
      const controller = injector.get(ControllerClass);

      if (!controller) {
        throw new Error(`${ControllerClass.name} should be declared in a module.`);
      }

      return this.bind(controller).map(binding => {
        const preMiddlewares = this.getPreMiddlewares(ControllerClass, binding.controllerMethodName)
          .map(pM => ((ctx: Context) => pM(ctx, injector)));
        const methodMiddleware = async (ctx: Context) => ctx.result = await binding.controllerMethodBinder(ctx);
        const middlewares = [...preMiddlewares, methodMiddleware];
        return {
          httpMethod: binding.httpMethod,
          middlewares,
          paths: [path, binding.path],
          successStatus: binding.successStatus
        };
      });
    };
  }

  protected abstract bind(controller: T): MethodPrimitiveBinding[];

  private getPreMiddlewares(ControllerClass: Type<T>, methodName: string): PreMiddleware[] {
    const classPreMiddlewares: PreMiddleware[] = Reflect.getMetadata('pre-middlewares', ControllerClass) || [];
    const methodPreMiddlewares: PreMiddleware[] = Reflect.getMetadata('pre-middlewares', ControllerClass.prototype,
      methodName) || [];
    return classPreMiddlewares.concat(methodPreMiddlewares);
  }
}
