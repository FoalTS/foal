import { PostHook } from '../../core';

export function afterThatLog(message: string, logFn = console.log): PostHook {
  return ctx => logFn(message);
}
