import { Request } from 'express';

interface HTTPRequest extends Request {
  session: any;
  csrfToken: () => string;
}

export class Context<User = any> {
  state: { [key: string]: any } = {};
  user: User;
  request: HTTPRequest;

  constructor(request) {
    this.request = request;
  }
}
