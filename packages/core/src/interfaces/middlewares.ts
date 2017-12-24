import { ServiceManager } from '../service-manager';
import { Context } from './contexts';

export type Middleware = (ctx: Context) => Promise<any>|any;
export type PreMiddleware = (ctx: Context, services: ServiceManager) => Promise<any>|any;
export type PostMiddleware = (ctx: Context, services: ServiceManager) => Promise<any>|any;
