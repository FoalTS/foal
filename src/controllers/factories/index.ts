import { Injector } from '../../di/injector';
import { Context, Decorator, ExpressContextDef, ExpressMiddleware } from '../interfaces';
import { newControllerDecoratorWithInjector } from './new-controller-decorator-with-injector';

export function newExpressDecoratorWithInjector(hook: (injector: Injector) => ExpressMiddleware,
                                                contextDef?: ExpressContextDef): Decorator {
  return newControllerDecoratorWithInjector('express', hook, contextDef);
}

export function newExpressDecorator(middleware: ExpressMiddleware, contextDef?: ExpressContextDef): Decorator {
  return newExpressDecoratorWithInjector((injector: Injector) => middleware, contextDef);
}

export function newContextualDecoratorWithInjector(hook: (injector: Injector)
                                                   => ((ctx: Context) => Promise<Context>)): Decorator {
  return newControllerDecoratorWithInjector('contextual', hook);
}

export function newContextualDecorator(middleware: (ctx: Context) => Promise<Context>): Decorator {
  return newControllerDecoratorWithInjector('contextual', (injector: Injector) => middleware);
}
