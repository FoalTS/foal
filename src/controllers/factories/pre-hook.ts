import { Injector } from '../../di/injector';
import { Decorator, PreHook } from '../interfaces';
import { defineMetadata, getMetadata } from './helpers';

export function preHook(hook: PreHook): Decorator {
  return function decorator(target: any, methodName?: string) {
    const preHooks = getMetadata('preHooks', target, methodName) || [];
    preHooks.unshift(hook);
    defineMetadata('preHooks', preHooks, target, methodName);
  };
}
