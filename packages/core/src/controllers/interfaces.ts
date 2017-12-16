import { ServiceManager } from '../di/service-manager';

export interface ObjectType {
  [name: string]: any;
}

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

export type Middleware = (ctx: Context) => Promise<any>|any;
export type PreMiddleware = (ctx: Context, services: ServiceManager) => Promise<any>|any;

export type Decorator = (target: any, methodName?: string) => void;

export type HttpMethod = 'POST' | 'GET' | 'PUT' | 'PATCH' | 'DELETE';

export interface MethodBinding {
  httpMethod: HttpMethod;
  paths: string[];
  middlewares: Middleware[];
  successStatus: number;
}

export interface MethodPrimitiveBinding {
  controllerMethodBinder: (context: Context) => Promise<any>;
  controllerMethodName: string;
  httpMethod: HttpMethod;
  path: string;
  successStatus: number;
}
