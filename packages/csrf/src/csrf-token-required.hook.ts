import { Hook, HookDecorator } from '@foal/core';

export function CsrfTokenRequired(): HookDecorator {
  return Hook(() => {});
}
