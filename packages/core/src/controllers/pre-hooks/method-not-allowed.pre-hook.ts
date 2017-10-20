import { MethodNotAllowedError } from '../errors';
import { preHook } from '../factories';
import { Context } from '../interfaces';

export async function methodNotAllowedMiddleware(ctx: Context): Promise<Context> {
  throw new MethodNotAllowedError();
}

export function methodNotAllowed() {
  return preHook(methodNotAllowedMiddleware);
}
