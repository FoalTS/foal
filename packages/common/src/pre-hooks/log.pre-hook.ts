import { Hook } from '@foal/core';

export function log(message: string, logFn = console.log): Hook {
  return ctx => logFn(message);
}
