import { Decorator, PostMiddleware } from '../interfaces';
import { defineMetadata, getMetadata } from './helpers';

export function postHook(postMiddleware: PostMiddleware): Decorator {
  return function decorator(target: any, methodName?: string) {
    const postMiddlewares = getMetadata('post-middlewares', target, methodName) || [];
    postMiddlewares.unshift(postMiddleware);
    defineMetadata('post-middlewares', postMiddlewares, target, methodName);
  };
}
