import {
  Context,
  MethodNotAllowedError,
  preHook,
} from '@foal/core';

export async function methodNotAllowedMiddleware(ctx: Context): Promise<Context> {
  throw new MethodNotAllowedError();
}

export function methodNotAllowed() {
  return preHook(methodNotAllowedMiddleware);
}
