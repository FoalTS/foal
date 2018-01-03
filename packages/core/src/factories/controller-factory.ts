import 'reflect-metadata';

import {
  Context,
  LowLevelRoute,
  Middleware,
  Route,
  Type
} from '../interfaces';
import { ServiceManager } from '../service-manager';

export abstract class ControllerFactory<T> {

  constructor() {}

  public attachService(path: string, ServiceClass: Type<T>): (services: ServiceManager) => LowLevelRoute[] {
    return (services: ServiceManager): LowLevelRoute[] => {
      const service = services.get(ServiceClass);

      return this.getRoutes(service).map(route => {
        const middlewares = [
          ...this.getPreMiddlewares(ServiceClass, route.serviceMethodName),
          async (ctx: Context) => ctx.result = await route.serviceMethodBinder(ctx),
          ...this.getPostMiddlewares(ServiceClass, route.serviceMethodName)
        ].map(middleware => ((ctx: Context) => middleware(ctx, services)));
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

  private getPreMiddlewares(ServiceClass: Type<T>, methodName: string): Middleware[] {
    const classPreMiddlewares: Middleware[] = Reflect.getMetadata('pre-middlewares', ServiceClass) || [];
    const methodPreMiddlewares: Middleware[] = Reflect.getMetadata('pre-middlewares', ServiceClass.prototype,
      methodName) || [];
    return classPreMiddlewares.concat(methodPreMiddlewares);
  }

  private getPostMiddlewares(ServiceClass: Type<T>, methodName: string): Middleware[] {
    const classPostMiddlewares: Middleware[] = Reflect.getMetadata('post-middlewares', ServiceClass) || [];
    const methodPostMiddlewares: Middleware[] = Reflect.getMetadata('post-middlewares', ServiceClass.prototype,
      methodName) || [];
    return methodPostMiddlewares.concat(classPostMiddlewares);
  }
}
