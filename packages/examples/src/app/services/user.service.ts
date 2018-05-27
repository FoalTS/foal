import { ModelService, Service } from '@foal/core';

import { User } from '../models';

@Service()
export class UserService extends ModelService<User> {
  Entity = User;
}
