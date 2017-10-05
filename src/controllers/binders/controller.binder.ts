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
  NextFunction,
  PreHook
} from '../interfaces';
import { catchErrors } from '../utils';

export abstract class ControllerBinder<T> {

  constructor() {}

  public bindController(path: string, ControllerClass: Type<T>):
      (injector: Injector, modulePreHooks: PreHook[]) => { expressRouter: any } {
    return (injector: Injector, modulePreHooks: PreHook[]): { expressRouter: any } => {

      const controller = injector.get(ControllerClass);

      if (!controller) {
        throw new Error(`${ControllerClass.name} is not injected`);
      }

      function getPreHooks(methodName: string): PreHook[] {
        const classPreHooks: PreHook[] = Reflect.getMetadata(`preHooks`, ControllerClass) || [];
        const methoPredHooks: PreHook[] = Reflect.getMetadata(`preHooks`, ControllerClass.prototype,
          methodName) || [];
        return modulePreHooks.concat(classPreHooks).concat(methoPredHooks);
      }

      function getExpressContextMaker(methodName: string,
                                      defaultContextDef: ExpressContextDef = []): ExpressMiddleware {
        return catchErrors((req: any, res: any, next: NextFunction): void => {
          set(req, 'foal.context', {});
          for (const tuple of defaultContextDef) {
            set(req.foal.context, tuple.ctx, get(req, tuple.req));
          }
          next();
        });
      }

      function getExpressPreHooks(methodName: string): ExpressMiddleware {
        const preHooks = getPreHooks(methodName);
        return catchErrors(async (req: any, res: any, next: NextFunction) => {
          for (const preHook of preHooks) {
            req.foal.context = await preHook(req.foal.context, injector);
          }
          next();
        });
      }

      function getGeneratedExpressMiddlewares(methodName: string,
                                              defaultContextDef?: ExpressContextDef): ExpressMiddleware[] {
        return [
          getExpressContextMaker(methodName, defaultContextDef),
          getExpressPreHooks(methodName)
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
