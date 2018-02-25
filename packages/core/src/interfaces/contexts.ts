import { ObjectType } from './utils';
import { HttpResponse } from '../classes';

export interface SUContext<Session, User> {
  session: Session;
  params: ObjectType;
  body: any;
  query: ObjectType;
  result: HttpResponse|undefined;
  state: ObjectType;
  user: User|undefined;
  getHeader(field: string): string;
}
export type UContext<User> = SUContext<any, User>;
export type SContext<Session> = SUContext<Session, any>;
export type Context = SUContext<any, any>;
