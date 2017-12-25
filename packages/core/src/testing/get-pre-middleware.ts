import 'reflect-metadata';

import { Hook, PreMiddleware } from '../interfaces';

export function getPreMiddleware(preHook: Hook): PreMiddleware {
  @preHook
  class Service {}

  const preMiddlewares = Reflect.getMetadata('pre-middlewares', Service) as undefined|PreMiddleware[];

  if (!preMiddlewares) {
    throw new Error('getPreMiddleware should receive a pre-hook.');
  }

  return preMiddlewares[0];
}
