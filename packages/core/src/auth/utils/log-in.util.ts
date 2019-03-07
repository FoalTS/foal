import { Context } from '../../core';

/**
 * Save the user id in the current session.
 *
 * @export
 * @param {Context} ctx - The request context.
 * @param {object} user - The user object.
 * @param {string} [idKey='id'] - The name of the user's id property.
 */
export function logIn(ctx: Context, user: object, idKey = 'id') {
  ctx.request.session.authentication = {
    ...ctx.request.session.authentication,
    userId: user[idKey]
  };
}
