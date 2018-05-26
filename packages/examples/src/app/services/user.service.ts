import { Service } from '@foal/core';
import { ModelService } from '@foal/typeorm';

import { User } from '../models';

@Service()
export class UserService extends ModelService<User> {
  Entity = User;
}
