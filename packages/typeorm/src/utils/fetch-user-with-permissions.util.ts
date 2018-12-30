// 3p
import { Class } from '@foal/core';
import { getRepository } from 'typeorm';

export function fetchUserWithPermissions(
      userEntityClass: Class<{ id: number|string }>
    ): (id: number|string) => Promise<any> {
  return (id: number|string) => getRepository(userEntityClass).findOne(
    { id },
    { relations: [ 'userPermissions', 'groups', 'groups.permissions' ] }
  );
}
