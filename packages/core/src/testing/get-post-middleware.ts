import 'reflect-metadata';

import { Hook, Middleware } from '../interfaces';

export function getPostMiddleware(postHook: Hook): Middleware {
  @postHook
  class Service {}

  const postMiddlewares = Reflect.getMetadata('post-middlewares', Service) as undefined|Middleware[];

  if (!postMiddlewares) {
    throw new Error('getPostMiddleware should receive a post-hook.');
  }

  return postMiddlewares[0];
}
