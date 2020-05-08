// 3p
import { Class } from '@foal/core';
// tslint:disable-next-line:no-unused-variable
import { getMongoRepository, ObjectID } from 'typeorm';

/**
 * Create a function that finds the first MongoDB entity that matches some id.
 *
 * It returns undefined if no entity can be found.
 *
 * This function is usually used by:
 * - TokenRequired (@foal/core)
 * - TokenOptional (@foal/core)
 * - JWTRequired (@foal/jwt)
 * - JWTOptional (@foal/jwt)
 *
 * @export
 * @param {(Class<{ id: ObjectID }|{ _id: ObjectID }>)} userEntityClass - The entity class.
 * @returns {((id: number|string) => Promise<any>)} The returned function expecting an id.
 */
export function fetchMongoDBUser(
  userEntityClass: Class<{ id: ObjectID }|{ _id: ObjectID }>
): (id: number|string) => Promise<any> {
  return (id: number|string) => {
    if (typeof id === 'number') {
      throw new Error('Unexpected type for MongoDB user ID: number.');
    }
    return getMongoRepository(userEntityClass).findOne(id);
  };
}
