import { Hook, Middleware } from '../interfaces';
import { defineMetadata, getMetadata } from '../utils';

export function preHook(preMiddleware: Middleware): Hook {
  return (target: any, methodName?: string) => {
    const preMiddlewares = getMetadata('pre-middlewares', target, methodName) || [];
    preMiddlewares.unshift(preMiddleware);
    defineMetadata('pre-middlewares', preMiddlewares, target, methodName);
  };
}
