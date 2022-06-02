// 3p
import { Class, FetchUser } from '@foal/core';
import { DataSource } from 'typeorm';
import { TYPEORM_DATA_SOURCE_KEY } from '../common';

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
 * @returns {FetchUser} The returned function expecting an id.
 */
export function fetchUser(userEntityClass: Class<{ id: number|string }>): FetchUser {
  return (id: number|string, services) => {
    const dataSource = services.get(TYPEORM_DATA_SOURCE_KEY) as DataSource;
    return dataSource.getRepository(userEntityClass).findOneBy({ id });
  }
}
