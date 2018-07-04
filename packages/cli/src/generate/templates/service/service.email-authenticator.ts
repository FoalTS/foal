import { AbstractEmailAuthenticator, Service } from '@foal/core';

import { User } from 'somewhere';

@Service()
export class /* upperFirstCamelName */ extends AbstractEmailAuthenticator<User> {
  UserModel = User;
}
