import { ModelService, Service } from '@foal/core';

import { User } from '../entities';

@Service()
export class UserService extends ModelService<User> {
  Model = User;
}
