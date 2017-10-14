import { Injector } from '../../di/injector';
import { Context, Decorator } from '../interfaces';
import { newControllerDecoratorWithInjector } from './new-controller-decorator-with-injector';

export function newContextualDecoratorWithInjector(hook: (injector: Injector)
                                                   => ((ctx: Context) => Promise<Context>)): Decorator {
  return newControllerDecoratorWithInjector(hook);
}

export function newContextualDecorator(middleware: (ctx: Context) => Promise<Context>): Decorator {
  return newControllerDecoratorWithInjector((injector: Injector) => middleware);
}
