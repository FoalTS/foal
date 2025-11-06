import { hashPassword } from '@foal/core';
import { User } from './user.entity';

export async function createFixtureUser(n: number): Promise<User> {
  const user = new User();
  user.email = `user${n}@foalts.org`;
  user.password = await hashPassword(`password${n}`);
  return user;
}
