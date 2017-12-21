import { ServiceManager } from '../service-manager';
import { Context } from './contexts';
import { Middleware } from './middlewares';
import { ObjectType } from './utils';

export type HttpMethod = 'POST' | 'GET' | 'PUT' | 'PATCH' | 'DELETE';

export interface LowLevelRoute {
  httpMethod: HttpMethod;
  paths: string[];
  middlewares: Middleware[];
  successStatus: number;
}

export interface Route {
  serviceMethodBinder: (context: Context) => Promise<any>|any;
  serviceMethodName: string;
  httpMethod: HttpMethod;
  path: string;
  successStatus: number;
}

export type Controller = (services: ServiceManager) => LowLevelRoute[];
