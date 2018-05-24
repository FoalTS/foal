import { HttpResponse } from '../classes';

export interface Context<User = any, State = { [key: string]: any }> {
  session: any;
  params: { [key: string]: any };
  body: any;
  query: { [key: string]: any };
  state: State;
  user: User;
  getHeader(field: string): string;
}

export interface PostContext extends Context {
  response: HttpResponse | undefined;
}
