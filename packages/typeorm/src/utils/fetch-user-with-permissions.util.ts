// 3p
import { Class, FetchUser } from '@foal/core';
import { getRepository } from 'typeorm';

/**
 * Create a function that finds the first entity that matches some id. Groups and permissions
 * are also retreived so that `UserWithPermissions.hasPerm` and `PermissionRequired` can be used.
 *
 * It returns undefined if no entity can be found.
 *
 * This function is usually used by:
 * - UseSessions (@foal/core)
 * - JWTRequired (@foal/jwt)
 * - JWTOptional (@foal/jwt)
 *
 * @export
 * @param {(Class<{ id: number|string }>)} userEntityClass - The entity class which must extend UserWithPermissions.
 * @returns {FetchUser} The returned function expecting an id.
 */
export function fetchUserWithPermissions(userEntityClass: Class<{ id: number|string }>): FetchUser {
  return async (id: number|string) => await getRepository(userEntityClass).findOne(
    { id },
    { relations: [ 'userPermissions', 'groups', 'groups.permissions' ] }
  ) ?? null;
}
