import * as get from 'lodash/get';
import * as set from 'lodash/set';
import 'reflect-metadata';

import { Injector } from '../../di/injector';
import { Type } from '../../interfaces';
import {
  ContextualHook,
  ContextualMiddleware,
  ExpressMiddleware,
  ModuleHooks,
  NextFunction
} from '../interfaces';
import { catchErrors } from '../utils';

export abstract class ControllerBinder<T> {

  constructor() {}

  public bindController(path: string, ControllerClass: Type<T>):
      (injector: Injector, moduleHooks: ModuleHooks) => { expressRouter: any } {
    return (injector: Injector, moduleHooks: ModuleHooks): { expressRouter: any } => {

      const controller = injector.get(ControllerClass);

      if (!controller) {
        throw new Error(`${ControllerClass.name} is not injected`);
      }

      function getContextualMiddlewares(methodName: string): ContextualMiddleware[] {
        const classHooks: ContextualHook[] = Reflect.getMetadata(`hooks:contextual`, ControllerClass) || [];
        const methodHooks: ContextualHook[] = Reflect.getMetadata(`hooks:contextual`, ControllerClass.prototype,
          methodName) || [];
        return moduleHooks.contextual.concat(classHooks).concat(methodHooks).map(hook => hook(injector));
      }

      function getExpressContextMaker(methodName: string): ExpressMiddleware {
        return catchErrors((req: any, res: any, next: NextFunction): void => {
          set(req, 'foal.context', {});
          const contextDef = [
            { req: 'body', ctx: 'data' },
            { req: 'params.id', ctx: 'id' },
            { req: 'query', ctx: 'params.query' }
          ];
          for (const tuple of contextDef) {
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

      function getGeneratedExpressMiddlewares(methodName: string): ExpressMiddleware[] {
        return [
          getExpressContextMaker(methodName),
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
    getExpressMiddlewares: (methodName: string) => ExpressMiddleware[]
  ): any;
}
