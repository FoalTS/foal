import { EmailAuthenticator } from '@foal/core';

import { User } from '../entities';

export class Authenticator extends EmailAuthenticator<User> {
  entityClass = User;
}
