// 3p
import { Class, FetchUser } from '@foal/core';
import { getRepository } from 'typeorm';
import { UserWithPermissions } from '../entities';

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
 * @param {Class<UserWithPermissions>} userEntityClass - The entity class which must extend UserWithPermissions.
 * @returns {FetchUser} The returned function expecting an id.
 */
export function fetchUserWithPermissions(userEntityClass: Class<UserWithPermissions>): FetchUser {
  return async (id: number|string) => {
    if (typeof id === 'string') {
      id = parseInt(id, 10);
      if (isNaN(id)) {
        throw new Error('Suspicious operation: the provided ID cannot be parsed to a number.');
      }
    }
    return getRepository(userEntityClass).findOne({
      where: { id },
      relations: {
        userPermissions: true,
        groups: {
          permissions: true,
        }
      }
    });
  }
}
