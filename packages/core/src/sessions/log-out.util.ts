import { Config, Context } from '../core';
import { SESSION_DEFAULT_COOKIE_NAME } from './constants';
import { Session } from './session';
import { SessionStore } from './session-store';

/**
 * Log a user out from the given session.
 *
 * @export
 * @param {Context} ctx - The request context.
 * @param {SessionStore} store - The store where the session can be found.
 * @param {{ cookie?: true }} [options={}] - Options
 * @param {boolean} [options.cookie] - True if the session token is located in a cookie.
 * False if it is in the `Authorization` header.
 * @returns {(Promise<void|false>)}
 */
export async function logOut(
  ctx: Context, store: SessionStore, options: { cookie?: true } = {}
): Promise<void|false> {
  const cookieName = Config.get<string>('settings.session.cookie.name', SESSION_DEFAULT_COOKIE_NAME);

  /* Validate the request */

  let token: string;
  if (options.cookie) {
    const content = ctx.request.cookies[cookieName] as string|undefined;
    if (!content) {
      return false;
    }
    token = content;
  } else {
    const authorizationHeader = ctx.request.get('Authorization') as string|undefined || '';
    if (!authorizationHeader) {
      return false;
    }

    const content = authorizationHeader.split('Bearer ')[1] as string|undefined;
    if (!content) {
      return false;
    }

    token = content;
  }

  /* Verify the token */

  const sessionID = Session.verifyTokenAndGetId(token);
  if (!sessionID) {
    return false;
  }

  /* Destroy the session */

  return store.destroy(sessionID);
}
