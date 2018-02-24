import { HttpResponse, ServiceManager } from '../classes';
import { Context } from './contexts';

export type Hook = (ctx: Context, services: ServiceManager) => void | HttpResponse | Promise<void|HttpResponse>;
