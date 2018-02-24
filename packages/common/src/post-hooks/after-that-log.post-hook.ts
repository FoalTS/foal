import { Hook } from '@foal/core';

export function afterThatLog(message: string, logFn = console.log): Hook {
  return ctx => logFn(message);
}
