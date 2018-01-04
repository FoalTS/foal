import 'reflect-metadata';

import {
  FoalModule,
  Hook,
  Middleware,
  ReducedRoute,
} from './interfaces';
import { ServiceManager } from './service-manager';

export class Foal {
  public readonly services: ServiceManager;
  public readonly routes: ReducedRoute[] = [];

  constructor(foalModule: FoalModule, parentModule?: Foal) {
    const controllers = foalModule.controllers || [];
    const modules = foalModule.modules || [];
    const moduleHooks = foalModule.hooks || [];
    const services = foalModule.services || [];

    if (parentModule) {
      this.services = new ServiceManager(parentModule.services);
    } else {
      this.services = new ServiceManager();
    }

    // Instantiate the services.
    services.forEach(service => this.services.get(service));

    const { modulePreMiddlewares, modulePostMiddlewares } = this.getMiddlewares(moduleHooks);

    for (const controller of controllers) {
      for (const route of controller(this.services)) {
        this.routes.push({
          ...route,
          middlewares: [
            ...modulePreMiddlewares.map(e => (ctx => e(ctx, this.services))),
            ...route.middlewares,
            ...modulePostMiddlewares.map(e => (ctx => e(ctx, this.services))),
          ],
        });
      }
    }

    for (const mod of modules) {
      const importedModule = new Foal(mod.module, this);
      const path = mod.path || '';
      for (const route of importedModule.routes) {
        this.routes.push({
          ...route,
          middlewares: [
            ...modulePreMiddlewares.map(e => (ctx => e(ctx, this.services))),
            ...route.middlewares,
            ...modulePostMiddlewares.map(e => (ctx => e(ctx, this.services))),
          ],
          paths: [path, ...route.paths],
        });
      }
    }
  }

  private getMiddlewares(hooks: Hook[]): { modulePreMiddlewares: Middleware[],
      modulePostMiddlewares: Middleware[] } {
    class FakeModule {}
    // Reverse the array to apply decorators in the proper order.
    hooks.reverse().forEach(hook => hook(FakeModule));
    return {
      modulePostMiddlewares: Reflect.getMetadata('post-middlewares', FakeModule) || [],
      modulePreMiddlewares: Reflect.getMetadata('pre-middlewares', FakeModule) || [],
    };
  }

}
