// FoalTS
import { getRepository } from 'typeorm';
import { Class } from '../../core';

export function fetchUser(userEntityClass: Class<{ id: number|string }>): (id: number|string) => Promise<any> {
  return (id: number|string) => getRepository(userEntityClass).findOne({ id });
}
