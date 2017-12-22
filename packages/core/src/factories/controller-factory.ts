import 'reflect-metadata';

import {
  Context,
  LowLevelRoute,
  PostMiddleware,
  PreMiddleware,
  Route,
  Type
} from '../interfaces';
import { ServiceManager } from '../service-manager';

export abstract class ControllerFactory<T> {

  constructor() {}

  public attachService(path: string, ServiceClass: Type<T>): (services: ServiceManager) => LowLevelRoute[] {
    return (services: ServiceManager): LowLevelRoute[] => {
      const service = services.get(ServiceClass);

      if (!service) {
        throw new Error(`${ServiceClass.name} should be declared in a module.`);
      }

      return this.getRoutes(service).map(route => {
        const preMiddlewares = this.getPreMiddlewares(ServiceClass, route.serviceMethodName)
          .map(pM => ((ctx: Context) => pM(ctx, services)));
        const methodMiddleware = async (ctx: Context) => {
          ctx.result = await route.serviceMethodBinder(ctx);
        };
        const postMiddlewares = this.getPostMiddlewares(ServiceClass, route.serviceMethodName)
          .map(pM => ((ctx: Context) => pM(ctx, services)));
        const middlewares = [ ...preMiddlewares, methodMiddleware, ...postMiddlewares ];
        return {
          httpMethod: route.httpMethod,
          middlewares,
          paths: [path, route.path],
          successStatus: route.successStatus
        };
      });
    };
  }

  protected abstract getRoutes(service: T): Route[];

  private getPreMiddlewares(ServiceClass: Type<T>, methodName: string): PreMiddleware[] {
    const classPreMiddlewares: PreMiddleware[] = Reflect.getMetadata('pre-middlewares', ServiceClass) || [];
    const methodPreMiddlewares: PreMiddleware[] = Reflect.getMetadata('pre-middlewares', ServiceClass.prototype,
      methodName) || [];
    return classPreMiddlewares.concat(methodPreMiddlewares);
  }

  private getPostMiddlewares(ServiceClass: Type<T>, methodName: string): PostMiddleware[] {
    const classPostMiddlewares: PostMiddleware[] = Reflect.getMetadata('post-middlewares', ServiceClass) || [];
    const methodPostMiddlewares: PostMiddleware[] = Reflect.getMetadata('post-middlewares', ServiceClass.prototype,
      methodName) || [];
    return methodPostMiddlewares.concat(classPostMiddlewares);
  }
}
