import { EmailAuthenticator, Service } from '@foal/core';

import { User } from 'somewhere';

@Service()
export class /* upperFirstCamelName */ extends EmailAuthenticator<User> {
  entityClass = User;
}
