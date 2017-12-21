import { Hook, PreMiddleware } from '../interfaces';
import { defineMetadata, getMetadata } from '../utils';

export function preHook(preMiddleware: PreMiddleware): Hook {
  return (target: any, methodName?: string) => {
    const preMiddlewares = getMetadata('pre-middlewares', target, methodName) || [];
    preMiddlewares.unshift(preMiddleware);
    defineMetadata('pre-middlewares', preMiddlewares, target, methodName);
  };
}
