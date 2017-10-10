import { Context, preHook } from '@foal/core';

export function logger(text?: string) {
  return preHook((ctx: Context) => {
    console.log(`Log: ${text}`);
    return ctx;
  });
}
