import 'reflect-metadata';

import { Decorator, MethodBinding, PostMiddleware, PreMiddleware } from './controllers/interfaces';
import { ServiceManager } from './di/service-manager';
import { Type } from './interfaces';

export interface FoalModule {
  services: Type<any>[];
  controllerBindings?: ((services: ServiceManager) => MethodBinding[])[];
  hooks?: Decorator[];
  imports?: { module: FoalModule, path?: string }[];
}

export class Foal {
  public readonly services: ServiceManager;
  public readonly methodsBindings: MethodBinding[] = [];

  constructor(foalModule: FoalModule, parentModule?: Foal) {
    const controllerBindings = foalModule.controllerBindings || [];
    const imports = foalModule.imports || [];
    const moduleHooks = foalModule.hooks || [];

    if (parentModule) {
      this.services = new ServiceManager(parentModule.services);
    } else {
      this.services = new ServiceManager();
    }

    foalModule.services.forEach(service => this.services.add(service));

    const { modulePreMiddlewares, modulePostMiddlewares } = this.getMiddlewares(moduleHooks);

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

  private getMiddlewares(hooks: Decorator[]): { modulePreMiddlewares: PreMiddleware[],
      modulePostMiddlewares: PostMiddleware[] } {
    class FakeModule {}
    // Reverse the array to apply decorators in the proper order.
    hooks.reverse().forEach(decorator => decorator(FakeModule));
    return {
      modulePostMiddlewares: Reflect.getMetadata('post-middlewares', FakeModule) || [],
      modulePreMiddlewares: Reflect.getMetadata('pre-middlewares', FakeModule) || [],
    };
  }

}
