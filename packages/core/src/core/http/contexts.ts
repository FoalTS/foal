import { AbstractUser } from '../../auth';

export class Context<User extends AbstractUser = AbstractUser> {
  state: { [key: string]: any } = {};
  user: User|undefined = undefined;

  constructor(public request) {}
}
