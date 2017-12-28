import { preHook } from '@foal/core';

export function log(message: string, logFn = console.log) {
  return preHook(ctx => logFn(message));
}
