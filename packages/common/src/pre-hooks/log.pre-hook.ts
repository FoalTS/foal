import { PreHook } from '@foal/core';

export function log(message: string, logFn = console.log): PreHook {
  return ctx => logFn(message);
}
