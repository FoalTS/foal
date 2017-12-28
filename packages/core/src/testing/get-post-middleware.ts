import 'reflect-metadata';

import { Hook, PostMiddleware } from '../interfaces';

export function getPostMiddleware(postHook: Hook): PostMiddleware {
  @postHook
  class Service {}

  const postMiddlewares = Reflect.getMetadata('post-middlewares', Service) as undefined|PostMiddleware[];

  if (!postMiddlewares) {
    throw new Error('getPostMiddleware should receive a post-hook.');
  }

  return postMiddlewares[0];
}
