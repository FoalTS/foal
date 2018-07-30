import { EmailAuthenticator, Service } from '@foal/core';

import { User } from '../../../entities';

@Service()
export class Authenticator extends EmailAuthenticator<User> {
  entityClass = User;
}
