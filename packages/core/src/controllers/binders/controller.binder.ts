import * as get from 'lodash/get';
import * as set from 'lodash/set';
import 'reflect-metadata';

import { Injector } from '../../di/injector';
import { Type } from '../../interfaces';
import {
  ContextualHook,
  ContextualMiddleware,
  ExpressContextDef,
  ExpressHook,
  ExpressMiddleware,
  ModuleContextDef,
  ModuleHooks,
  NextFunction
} from '../interfaces';
import { catchErrors } from '../utils';

export abstract class ControllerBinder<T> {

  constructor() {}

  public bindController(path: string, ControllerClass: Type<T>):
      (injector: Injector, moduleHooks: ModuleHooks, moduleContextDef: ModuleContextDef) => { expressRouter: any } {
    return (injector: Injector, moduleHooks: ModuleHooks,
            moduleContextDef: ModuleContextDef): { expressRouter: any } => {

      const controller = injector.get(ControllerClass);

      if (!controller) {
        throw new Error(`${ControllerClass.name} is not injected`);
      }

      function getExpressMiddlewares(methodName: string): ExpressMiddleware[] {
        const classHooks: ExpressHook[] = Reflect.getMetadata(`hooks:express`, ControllerClass) || [];
        const methodHooks: ExpressHook[] = Reflect.getMetadata(`hooks:express`, ControllerClass.prototype,
          methodName) || [];
        return moduleHooks.express.concat(classHooks).concat(methodHooks).map(hook => hook(injector));
      }

      function getContextualMiddlewares(methodName: string): ContextualMiddleware[] {
        const classHooks: ContextualHook[] = Reflect.getMetadata(`hooks:contextual`, ControllerClass) || [];
        const methodHooks: ContextualHook[] = Reflect.getMetadata(`hooks:contextual`, ControllerClass.prototype,
          methodName) || [];
        return moduleHooks.contextual.concat(classHooks).concat(methodHooks).map(hook => hook(injector));
      }

      function getExpressContextDef(methodName: string): ExpressContextDef {
        const classContextDef: ExpressContextDef = Reflect.getMetadata(`contextDef:express`, ControllerClass) || [];
        const methodContextDef: ExpressContextDef = Reflect.getMetadata(`contextDef:express`, ControllerClass.prototype,
          methodName) || [];
        return moduleContextDef.express.concat(classContextDef).concat(methodContextDef);
      }

      function getExpressContextMaker(methodName: string,
                                      defaultContextDef: ExpressContextDef = []): ExpressMiddleware {
        const contextDef = getExpressContextDef(methodName);
        return catchErrors((req: any, res: any, next: NextFunction): void => {
          set(req, 'foal.context', {});
          for (const tuple of defaultContextDef.concat(contextDef)) {
            set(req.foal.context, tuple.ctx, get(req, tuple.req));
          }
          next();
        });
      }

      function getExpressContextualMiddleware(methodName: string): ExpressMiddleware {
        const contextualMiddlewares = getContextualMiddlewares(methodName);
        return catchErrors(async (req: any, res: any, next: NextFunction) => {
          for (const middleware of contextualMiddlewares) {
            req.foal.context = await middleware(req.foal.context);
          }
          next();
        });
      }

      function getGeneratedExpressMiddlewares(methodName: string,
                                              defaultContextDef?: ExpressContextDef): ExpressMiddleware[] {
        return [
          ...getExpressMiddlewares(methodName),
          getExpressContextMaker(methodName, defaultContextDef),
          getExpressContextualMiddleware(methodName)
        ];
      }

      return {
        expressRouter: this.expressRouter(path, controller, getGeneratedExpressMiddlewares)
      };
    };
  }

  protected abstract expressRouter(
    path: string, controller: T,
    getExpressMiddlewares: (methodName: string, defaultContextDef?: ExpressContextDef) => ExpressMiddleware[]
  ): any;
}
