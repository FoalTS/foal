import { MethodNotAllowedError } from '../errors';
import { preHook } from '../factories';
import { Context } from '../interfaces';

export async function methodNotAllowedHook(ctx: Context): Promise<Context> {
  throw new MethodNotAllowedError();
}

export function methodNotAllowed() {
  return preHook(methodNotAllowedHook);
}
