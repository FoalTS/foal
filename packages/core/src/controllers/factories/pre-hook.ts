import { Decorator, PreMiddleware } from '../interfaces';
import { defineMetadata, getMetadata } from './helpers';

export function preHook(preMiddleware: PreMiddleware): Decorator {
  return function decorator(target: any, methodName?: string) {
    const preMiddlewares = getMetadata('pre-middlewares', target, methodName) || [];
    preMiddlewares.unshift(preMiddleware);
    defineMetadata('pre-middlewares', preMiddlewares, target, methodName);
  };
}
