import { EmailAuthenticator } from '@foal/typeorm';

import { User } from '../entities';

export class Authenticator extends EmailAuthenticator<User> {
  entityClass = User;
}
