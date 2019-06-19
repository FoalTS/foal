import { Config, Context } from '../core';
import { SESSION_DEFAULT_COOKIE_NAME } from './constants';
import { Session } from './session';
import { SessionStore } from './session-store';

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
