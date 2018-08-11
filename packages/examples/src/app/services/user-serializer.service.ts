import { EntitySerializer, Service } from '@foal/core';

import { User } from '../entities';

@Service()
export class UserSerializer extends EntitySerializer {
  entityClass = User;
}
