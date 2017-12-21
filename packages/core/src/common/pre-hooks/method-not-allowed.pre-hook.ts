import {
  Context,
  MethodNotAllowedError,
  preHook,
} from '../../index';

export async function methodNotAllowedMiddleware(ctx: Context): Promise<Context> {
  throw new MethodNotAllowedError();
}

export function methodNotAllowed() {
  return preHook(methodNotAllowedMiddleware);
}
