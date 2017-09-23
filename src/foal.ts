import * as express from 'express';
import 'reflect-metadata';

import { ContextualHook, Decorator, ExpressContextDef, ExpressHook, ModuleContextDef,
  ModuleHooks } from './controllers/interfaces';
import { Injector } from './di/injector';
import { Type } from './interfaces';

export interface ModuleData {
  services: Type<any>[];
  controllerBindings?: ((injector: Injector, controllerHooks: ModuleHooks,
                         controllerContextDef: ModuleContextDef) => { expressRouter: any })[];
  sharedControllerDecorators?: Decorator[];
  imports?: { module: ModuleData, path?: string }[];
}

export class FoalModule {
  public readonly injector: Injector;
  private readonly router: any = express.Router();

  constructor(data: ModuleData, parentModule?: FoalModule) {
    data.controllerBindings = data.controllerBindings || [];
    data.imports = data.imports || [];
    data.sharedControllerDecorators = data.sharedControllerDecorators || [];

    if (parentModule) {
      this.injector = new Injector(parentModule.injector);
    } else {
      this.injector = new Injector();
    }

    data.services.forEach(service => this.injector.inject(service));

    class FakeModule {}
    // Reverse the array to apply decorators in the proper order.
    data.sharedControllerDecorators.reverse().forEach(decorator => decorator(FakeModule));
    const expressHooks: ExpressHook[] = Reflect.getMetadata('hooks:express', FakeModule) || [];
    const contextualHooks: ContextualHook[] = Reflect.getMetadata('hooks:contextual', FakeModule) || [];
    const expressContextDef: ExpressContextDef = Reflect.getMetadata('contextDef:express',
      FakeModule) || [];

    data.controllerBindings.forEach(getRouters => {
      const { expressRouter } = getRouters(
        this.injector,
        { express: expressHooks, contextual: contextualHooks },
        { express: expressContextDef }
      );
      this.router.use(expressRouter);
    });

    data.imports.forEach(imp => this.router.use(
      imp.path || '/',
      new FoalModule(imp.module, this).router
    ));
  }

  public expressRouter(): any {
    return this.router;
  }

}
