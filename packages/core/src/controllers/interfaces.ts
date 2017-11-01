import { Injector } from '../di/injector';

export interface Context { [name: string]: any; }

export type Middleware = (ctx: Context) => Promise<any>|any;
export type PreMiddleware = (ctx: Context, injector: Injector) => Promise<any>|any;

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
