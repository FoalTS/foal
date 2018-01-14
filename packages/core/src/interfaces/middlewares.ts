import { ServiceManager } from '../service-manager';
import { Context } from './contexts';

export type ReducedMiddleware = (ctx: Context) => Promise<any>|any;
export type Middleware = (ctx: Context, services: ServiceManager) => Promise<any>|any;
