import { EmailAuthenticator } from '@foal/typeorm';

import { User } from '../entities';

export class TestFooBar extends EmailAuthenticator<User> {
  entityClass = User;
}
