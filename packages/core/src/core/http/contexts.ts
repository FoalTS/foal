import { AbstractUser } from '../../auth';
import { HttpResponse } from './http-responses';

export class Context<User extends AbstractUser = AbstractUser> {
  state: { [key: string]: any } = {};
  user: User|undefined = undefined;

  constructor(public request) {}
}

export class PostContext extends Context {
  response: HttpResponse | undefined = undefined;
}
