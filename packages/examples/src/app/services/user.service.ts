import { EntitySerializer, Service } from '@foal/core';

import { User } from '../entities';

@Service()
export class UserService extends EntitySerializer<User> {
  Model = User;
}
