import 'reflect-metadata';

import { Decorator, MethodBinding, PreMiddleware } from './controllers/interfaces';
import { Injector } from './di/injector';
import { Type } from './interfaces';

export interface FoalModule {
  services: Type<any>[];
  controllerBindings?: ((injector: Injector) => MethodBinding[])[];
  preHooks?: Decorator[];
  imports?: { module: FoalModule, path?: string }[];
}

export class Foal {
  public readonly injector: Injector;
  public readonly methodsBindings: MethodBinding[] = [];

  constructor(foalModule: FoalModule, parentModule?: Foal) {
    const controllerBindings = foalModule.controllerBindings || [];
    const imports = foalModule.imports || [];
    const modulePreHooks = foalModule.preHooks || [];

    if (parentModule) {
      this.injector = new Injector(parentModule.injector);
    } else {
      this.injector = new Injector();
    }

    foalModule.services.forEach(service => this.injector.inject(service));

    const modulePreMiddlewares = this.getPreMiddlewares(modulePreHooks);

    for (const controllerBinding of controllerBindings) {
      for (const methodBinding of controllerBinding(this.injector)) {
        this.methodsBindings.push({
          ...methodBinding,
          middlewares: [
            ...modulePreMiddlewares.map(e => (ctx => e(ctx, this.injector))),
            ...methodBinding.middlewares
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
            ...modulePreMiddlewares.map(e => (ctx => e(ctx, this.injector))),
            ...methodBinding.middlewares
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

}
