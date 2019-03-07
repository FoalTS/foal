import { HookDecorator } from '../core';
import { Login } from './login.hook';

/**
 * Hook factory to authenticate users using cookies and sessions.
 *
 * The hook returns a 401 error if no user could be authenticated.
 *
 * @export
 * @param {({ redirect?: string, user: (id: number|string) => Promise<any> })} options - Hook options.
 * @param {string|undefined} options.redirect - Optional URL path where unauthenticated users should be redirected.
 * @param {(id: number|string) => Promise<any>} options.user - Function that takes an id as parameter and returns
 * the corresponding user. If no user is found, the function must return undefined.
 * @returns {HookDecorator} The hook
 */
export function LoginRequired(
    options: { redirect?: string, user: (id: number|string) => Promise<any> }): HookDecorator {
  return Login(true, options);
}
