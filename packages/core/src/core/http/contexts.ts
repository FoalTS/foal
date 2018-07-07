import { AbstractUser } from '../../auth';
import { HttpRequest } from './http-request';
import { HttpResponse } from './http-responses';

export class Context<User extends AbstractUser = AbstractUser> {
  request: HttpRequest;
  session: any = undefined;
  state: { [key: string]: any } = {};
  user: User|undefined = undefined;

  constructor(expressRequest?, stateDef?: { req: string, state: string }[]) {
    this.request = new HttpRequest(expressRequest);

    if (expressRequest) {
      this.session = expressRequest.session;
      if (stateDef) {
        stateDef.forEach(e => this.state[e.state] = expressRequest[e.req]);
      }
    }
  }
}

export class PostContext extends Context {
  response: HttpResponse | undefined = undefined;
}
