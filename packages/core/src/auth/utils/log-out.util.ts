import { Context } from '../../core';

/**
 * Remove the user id from the current session.
 *
 * @export
 * @param {Context} ctx - The request context.
 */
export function logOut(ctx: Context) {
  delete ctx.request.session.authentication;
}
