import { Injector } from '../../di/injector';
import { Decorator } from '../interfaces';
import { defineMetadata, getMetadata } from './helpers';

export function newControllerDecoratorWithInjector(hook: (injector: Injector) => any): Decorator {
  return function decorator(target: any, methodName?: string) {
    const hooks = getMetadata('hooks:contextual', target, methodName) || [];
    hooks.unshift(hook);
    defineMetadata('hooks:contextual', hooks, target, methodName);
  };
}
