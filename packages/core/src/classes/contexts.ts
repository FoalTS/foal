import { HttpRequest } from './http-request';
import { HttpResponse } from './http-responses';

export class Context {
  request: HttpRequest;
  session: any = undefined;
  state: { [key: string]: any } = {};
  user: any = null;

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
