import { HookDecorator } from '../core';
import { Login } from './login.hook';

/**
 * Hook factory to authenticate users using cookies and sessions.
 *
 * The hook does not return any error when no user could be authenticated.
 *
 * @export
 * @param {({ user: (id: number|string) => Promise<any> })} options - Hook options.
 * @param {(id: number|string) => Promise<any>} options.user - Function that takes an id as parameter and returns
 * the corresponding user. If no user is found, the function must return undefined.
 * @returns {HookDecorator}
 */
export function LoginOptional(options: { user: (id: number|string) => Promise<any> }): HookDecorator {
  return Login(false, options);
}
