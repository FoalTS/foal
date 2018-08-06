import { EmailAuthenticator, Service } from '@foal/core';

import { User } from '../entities';

@Service()
export class /* upperFirstCamelName */ extends EmailAuthenticator<User> {
  entityClass = User;
}
