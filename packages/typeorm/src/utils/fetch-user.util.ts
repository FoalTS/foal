// 3p
import { Class, FetchUser } from '@foal/core';
import { BaseEntity } from 'typeorm';

/**
 * Create a function that finds the first entity that matches some id.
 *
 * It returns undefined if no entity can be found.
 *
 * This function is usually used by:
 * - UseSessions (@foal/core)
 * - JWTRequired (@foal/jwt)
 * - JWTOptional (@foal/jwt)
 *
 * @export
 * @param {(Class<{ id: number|string }> & typeof BaseEntity)} userEntityClass - The entity class.
 * @returns {FetchUser} The returned function expecting an id.
 */
export function fetchUser(userEntityClass: Class<{ id: number|string }> & typeof BaseEntity): FetchUser {
  return (id: number|string) => userEntityClass.findOneBy({ id });
}
