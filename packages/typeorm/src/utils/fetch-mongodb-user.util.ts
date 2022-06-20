// 3p
import { Class, FetchUser } from '@foal/core';
// tslint:disable-next-line:no-unused-variable
import { DataSource, ObjectID } from 'typeorm';
import { ObjectId } from 'mongodb';

// FoalTS
import { TYPEORM_DATA_SOURCE_KEY } from '../common';

/**
 * Create a function that finds the first MongoDB entity that matches some id.
 *
 * It returns undefined if no entity can be found.
 *
 * This function is usually used by:
 * - UseSessions (@foal/core)
 * - JWTRequired (@foal/jwt)
 * - JWTOptional (@foal/jwt)
 *
 * @export
 * @param {(Class<{ id: ObjectID }|{ _id: ObjectID }>)} userEntityClass - The entity class.
 * @returns {FetchUser} The returned function expecting an id.
 */
export function fetchMongoDBUser(userEntityClass: Class<{ id: ObjectID }|{ _id: ObjectID }>): FetchUser {
  return async (id: number|string, services) => {
    if (typeof id === 'number') {
      throw new Error('Unexpected type for MongoDB user ID: number.');
    }
    const dataSource = services.get(TYPEORM_DATA_SOURCE_KEY) as DataSource;
    return dataSource.getMongoRepository(userEntityClass).findOneBy({ _id: new ObjectId(id) });
  };
}
