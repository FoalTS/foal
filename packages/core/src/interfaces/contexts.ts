import { ObjectType } from './utils';
import { HttpResponse } from '../classes';

export interface Context {
  session: any;
  params: ObjectType;
  body: any;
  query: ObjectType;
  state: ObjectType;
  user: any | undefined;
  getHeader(field: string): string;
}

export interface PostContext extends Context {
  result: HttpResponse | undefined;
}