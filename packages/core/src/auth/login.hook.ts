// FoalTS
import {
  Hook,
  HookDecorator,
  HttpResponseRedirect,
  HttpResponseUnauthorized,
} from '../core';

/**
 * Sub-function used by LoginRequired and LoginOptional to avoid code duplication.
 *
 * @export
 * @param {boolean} required
 * @param {({ redirect?: string, user: (id: number|string) => Promise<any> })} options
 * @returns {HookDecorator}
 */
export function Login(required: boolean,
                      options: { redirect?: string, user: (id: number|string) => Promise<any> }): HookDecorator {
  return Hook(async ctx => {
    if (!ctx.request.session) {
      throw new Error('LoginRequired and LoginOptional hooks require session management.');
    }
    if (!ctx.request.session.authentication || !ctx.request.session.authentication.hasOwnProperty('userId')) {
      if (!required) {
        return;
      }
      return options.redirect ? new HttpResponseRedirect(options.redirect) : new HttpResponseUnauthorized();
    }
    const user = await options.user(ctx.request.session.authentication.userId);
    if (!user) {
      if (!required) {
        return;
      }
      return options.redirect ? new HttpResponseRedirect(options.redirect) : new HttpResponseUnauthorized();
    }
    ctx.user = user;
  });
}
