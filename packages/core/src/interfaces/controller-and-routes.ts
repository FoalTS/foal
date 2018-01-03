import { ServiceManager } from '../service-manager';
import { ReducedMiddleware } from './middlewares';

export type HttpMethod = 'POST' | 'GET' | 'PUT' | 'PATCH' | 'DELETE';

export interface ReducedRoute {
  httpMethod: HttpMethod;
  paths: string[];
  middlewares: ReducedMiddleware[];
  successStatus: number;
}

export interface Route {
  middleware: ReducedMiddleware;
  serviceMethodName: string;
  httpMethod: HttpMethod;
  path: string;
  successStatus: number;
}

export type Controller = (services: ServiceManager) => ReducedRoute[];
