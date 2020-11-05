// 3p
import { Class } from '@foal/core';
import { getRepository } from 'typeorm';

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
 * @param {(Class<{ id: number|string }>)} userEntityClass - The entity class.
 * @returns {((id: number|string) => Promise<any>)} The returned function expecting an id.
 */
export function fetchUser(userEntityClass: Class<{ id: number|string }>): (id: number|string) => Promise<any> {
  return (id: number|string) => getRepository(userEntityClass).findOne({ id });
}
