import { postHook } from '@foal/core';

export function afterThatLog(message: string, logFn = console.log) {
  return postHook(ctx => logFn(message));
}
