import { Router } from 'express';
import 'reflect-metadata';

import { ContextualHook, Decorator, ExpressContextDef, ExpressHook, ModuleContextDef,
  ModuleHooks } from './controllers/interfaces';
import { Injector } from './di/injector';
import { Type } from './interfaces';

export interface ModuleData {
  services: Type<any>[];
  controllerBindings: ((injector: Injector, controllerHooks: ModuleHooks,
                        controllerContextDef: ModuleContextDef) => { express: Router })[];
  controllerDecorators?: Decorator[];
  imports?: { module: ModuleData, path?: string }[];
}

export class FoalModule {
  public readonly injector: Injector;
  private readonly router: Router = Router();

  constructor(data: ModuleData, parentModule?: FoalModule) {
    data.controllerDecorators = data.controllerDecorators || [];
    data.imports = data.imports || [];

    if (parentModule) {
      this.injector = new Injector(parentModule.injector);
    } else {
      this.injector = new Injector();
    }

    data.services.forEach(service => this.injector.inject(service));

    class FakeModule {}
    // Reverse the array to apply decorators in the proper order.
    data.controllerDecorators.reverse().forEach(decorator => decorator(FakeModule));
    const expressHooks: ExpressHook[] = Reflect.getMetadata('hooks:express', FakeModule) || [];
    const contextualHooks: ContextualHook[] = Reflect.getMetadata('hooks:contextual', FakeModule) || [];
    const expressContextDef: ExpressContextDef = Reflect.getMetadata('contextDef:express',
      FakeModule) || [];

    data.controllerBindings.forEach(getRouters => {
      const { express } = getRouters(
        this.injector,
        { express: expressHooks, contextual: contextualHooks },
        { express: expressContextDef }
      );
      this.router.use(express);
    });

    data.imports.forEach(imp => this.router.use(
      imp.path || '/',
      new FoalModule(imp.module, this).router
    ));
  }

  public expressRouter(): Router {
    return this.router;
  }

}
