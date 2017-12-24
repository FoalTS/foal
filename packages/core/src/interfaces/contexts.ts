import { ObjectType } from './utils';

export interface RSUContext<Result, Session, User> {
  session: Session;
  params: ObjectType;
  body: any;
  query: ObjectType;
  result: Result;
  state: ObjectType;
  user: User|undefined;
  getHeader(field: string): string;
}
export type RSContext<Result, Session> = RSUContext<Result, Session, any>;
export type RUContext<Result, User> = RSUContext<Result, any, User>;
export type SUContext<Session, User> = RSUContext<any, Session, User>;
export type RContext<Result> = RSUContext<Result, any, any>;
export type SContext<Session> = RSUContext<any, Session, any>;
export type UContext<User> = RSUContext<any, any, User>;
export type Context = RSUContext<any, any, any>;
