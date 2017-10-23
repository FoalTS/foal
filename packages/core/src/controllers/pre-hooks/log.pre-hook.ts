import { preHook } from '../factories';
import { Context, PreMiddleware } from '../interfaces';

export function makeLogMiddleware(message: string): PreMiddleware {
  return function logMiddleware(ctx: Context): void {
    console.log(message);
  };
}

export function log(message: string) {
  return preHook(makeLogMiddleware(message));
}
