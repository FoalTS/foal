import * as express from 'express';
import 'reflect-metadata';

import { ContextualHook, Decorator, ExpressContextDef, ExpressHook, ModuleContextDef,
  PreHook } from './controllers/interfaces';
import { Injector } from './di/injector';
import { Type } from './interfaces';

export interface FoalModule {
  services: Type<any>[];
  controllerBindings?: ((injector: Injector, preHooks: PreHook[]) => { expressRouter: any })[];
  sharedControllerDecorators?: Decorator[];
  imports?: { module: FoalModule, path?: string }[];
}

export class Foal {
  public readonly injector: Injector;
  private readonly router: any = express.Router();

  constructor(foalModule: FoalModule, parentModule?: Foal) {
    foalModule.controllerBindings = foalModule.controllerBindings || [];
    foalModule.imports = foalModule.imports || [];
    foalModule.sharedControllerDecorators = foalModule.sharedControllerDecorators || [];

    if (parentModule) {
      this.injector = new Injector(parentModule.injector);
    } else {
      this.injector = new Injector();
    }

    foalModule.services.forEach(service => this.injector.inject(service));

    class FakeModule {}
    // Reverse the array to apply decorators in the proper order.
    foalModule.sharedControllerDecorators.reverse().forEach(decorator => decorator(FakeModule));
    const preHooks: PreHook[] = Reflect.getMetadata('preHooks', FakeModule) || [];

    foalModule.controllerBindings.forEach(getRouters => {
      const { expressRouter } = getRouters(this.injector, preHooks);
      this.router.use(expressRouter);
    });

    foalModule.imports.forEach(imp => this.router.use(
      imp.path || '/',
      new Foal(imp.module, this).router
    ));
  }

  public expressRouter(): any {
    return this.router;
  }

}
