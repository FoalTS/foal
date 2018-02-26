import { HttpResponse } from '../classes';
import { ObjectType } from './utils';

export interface Context<User = any> {
  session: any;
  params: ObjectType;
  body: any;
  query: ObjectType;
  state: ObjectType;
  user: User | null;
  getHeader(field: string): string;
}

export interface PostContext extends Context {
  result: HttpResponse | undefined;
}
