import { Hook, HookDecorator } from '../../core';

export function log(message: string, logFn = console.log): HookDecorator {
  return Hook(() => logFn(message));
}
