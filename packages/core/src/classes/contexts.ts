import { HttpResponse } from '../classes';

export class Context {
  session: any = undefined;
  params: { [key: string]: any } = {};
  body: any = undefined;
  query: { [key: string]: any } = {};
  state: { [key: string]: any } = {};
  user: any = null;
  getHeader(field: string): string {
    return field;
  }
}

export class PostContext extends Context {
  response: HttpResponse | undefined = undefined;
}
