import {
  Context,
  preHook,
  PreMiddleware
} from '@foal/core';

export function makeLogMiddleware(message: string): PreMiddleware {
  return function logMiddleware(ctx: Context): void {
    console.log(message);
  };
}

export function log(message: string) {
  return preHook(makeLogMiddleware(message));
}
