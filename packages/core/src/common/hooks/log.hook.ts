import { Hook, HookDecorator } from '../../core';

export function Log(message: string, logFn = console.log): HookDecorator {
  return Hook(() => logFn(message));
}
