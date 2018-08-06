import { Hook, HookDecorator } from '@foal/core';

export function TestFooBar(): HookDecorator {
  return Hook(async (ctx, services) => {

  });
}
