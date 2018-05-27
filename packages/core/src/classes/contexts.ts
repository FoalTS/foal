import { AbstractUser } from '../auth';
import { HttpRequest, HttpResponse } from '../http';

export class Context<User extends AbstractUser = AbstractUser> {
  readonly request: HttpRequest;
  readonly session: any = undefined;
  readonly state: { [key: string]: any } = {};
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
