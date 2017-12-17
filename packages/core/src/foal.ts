import 'reflect-metadata';

import { Decorator, MethodBinding, PostMiddleware, PreMiddleware } from './controllers/interfaces';
import { ServiceManager } from './di/service-manager';
import { Type } from './interfaces';

export interface FoalModule {
  services: Type<any>[];
  controllerBindings?: ((services: ServiceManager) => MethodBinding[])[];
  preHooks?: Decorator[];
  postHooks?: Decorator[];
  imports?: { module: FoalModule, path?: string }[];
}

export class Foal {
  public readonly services: ServiceManager;
  public readonly methodsBindings: MethodBinding[] = [];

  constructor(foalModule: FoalModule, parentModule?: Foal) {
    const controllerBindings = foalModule.controllerBindings || [];
    const imports = foalModule.imports || [];
    const modulePreHooks = foalModule.preHooks || [];
    const modulePostHooks = foalModule.postHooks || [];

    if (parentModule) {
      this.services = new ServiceManager(parentModule.services);
    } else {
      this.services = new ServiceManager();
    }

    foalModule.services.forEach(service => this.services.add(service));

    const modulePreMiddlewares = this.getPreMiddlewares(modulePreHooks);
    const modulePostMiddlewares = this.getPostMiddlewares(modulePostHooks);

    for (const controllerBinding of controllerBindings) {
      for (const methodBinding of controllerBinding(this.services)) {
        this.methodsBindings.push({
          ...methodBinding,
          middlewares: [
            ...modulePreMiddlewares.map(e => (ctx => e(ctx, this.services))),
            ...methodBinding.middlewares,
            ...modulePostMiddlewares.map(e => (ctx => e(ctx, this.services))),
          ],
        });
      }
    }

    for (const imp of imports) {
      const importedModule = new Foal(imp.module, this);
      const path = imp.path || '';
      for (const methodBinding of importedModule.methodsBindings) {
        this.methodsBindings.push({
          ...methodBinding,
          middlewares: [
            ...modulePreMiddlewares.map(e => (ctx => e(ctx, this.services))),
            ...methodBinding.middlewares,
            ...modulePostMiddlewares.map(e => (ctx => e(ctx, this.services))),
          ],
          paths: [path, ...methodBinding.paths],
        });
      }
    }
  }

  private getPreMiddlewares(preHooks: Decorator[]): PreMiddleware[] {
    class FakeModule {}
    // Reverse the array to apply decorators in the proper order.
    preHooks.reverse().forEach(decorator => decorator(FakeModule));
    return Reflect.getMetadata('pre-middlewares', FakeModule) || [];
  }

  private getPostMiddlewares(postHooks: Decorator[]): PostMiddleware[] {
    class FakeModule {}
    // Reverse the array to apply decorators in the proper order.
    postHooks.reverse().forEach(decorator => decorator(FakeModule));
    return Reflect.getMetadata('post-middlewares', FakeModule) || [];
  }

}
