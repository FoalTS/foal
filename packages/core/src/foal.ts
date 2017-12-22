import 'reflect-metadata';

import {
  Controller,
  FoalModule,
  Hook,
  LowLevelRoute,
  PostMiddleware,
  PreMiddleware,
  Type
} from './interfaces';
import { ServiceManager } from './service-manager';

export class Foal {
  public readonly services: ServiceManager;
  public readonly lowLevelRoutes: LowLevelRoute[] = [];

  constructor(foalModule: FoalModule, parentModule?: Foal) {
    const controllers = foalModule.controllers || [];
    const modules = foalModule.modules || [];
    const moduleHooks = foalModule.hooks || [];

    if (parentModule) {
      this.services = new ServiceManager(parentModule.services);
    } else {
      this.services = new ServiceManager();
    }

    foalModule.services.forEach(service => this.services.add(service));

    const { modulePreMiddlewares, modulePostMiddlewares } = this.getMiddlewares(moduleHooks);

    for (const controller of controllers) {
      for (const lowLevelRoute of controller(this.services)) {
        this.lowLevelRoutes.push({
          ...lowLevelRoute,
          middlewares: [
            ...modulePreMiddlewares.map(e => (ctx => e(ctx, this.services))),
            ...lowLevelRoute.middlewares,
            ...modulePostMiddlewares.map(e => (ctx => e(ctx, this.services))),
          ],
        });
      }
    }

    for (const mod of modules) {
      const importedModule = new Foal(mod.module, this);
      const path = mod.path || '';
      for (const lowLevelRoute of importedModule.lowLevelRoutes) {
        this.lowLevelRoutes.push({
          ...lowLevelRoute,
          middlewares: [
            ...modulePreMiddlewares.map(e => (ctx => e(ctx, this.services))),
            ...lowLevelRoute.middlewares,
            ...modulePostMiddlewares.map(e => (ctx => e(ctx, this.services))),
          ],
          paths: [path, ...lowLevelRoute.paths],
        });
      }
    }
  }

  private getMiddlewares(hooks: Hook[]): { modulePreMiddlewares: PreMiddleware[],
      modulePostMiddlewares: PostMiddleware[] } {
    class FakeModule {}
    // Reverse the array to apply decorators in the proper order.
    hooks.reverse().forEach(hook => hook(FakeModule));
    return {
      modulePostMiddlewares: Reflect.getMetadata('post-middlewares', FakeModule) || [],
      modulePreMiddlewares: Reflect.getMetadata('pre-middlewares', FakeModule) || [],
    };
  }

}
