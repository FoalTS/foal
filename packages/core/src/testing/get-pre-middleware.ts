import 'reflect-metadata';

import { Hook, Middleware } from '../interfaces';

export function getPreMiddleware(preHook: Hook): Middleware {
  @preHook
  class Service {}

  const preMiddlewares = Reflect.getMetadata('pre-middlewares', Service) as undefined|Middleware[];

  if (!preMiddlewares) {
    throw new Error('getPreMiddleware should receive a pre-hook.');
  }

  return preMiddlewares[0];
}
