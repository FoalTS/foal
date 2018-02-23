import { ServiceManager } from '../classes';
import { Context } from './contexts';
import { HttpResponse } from '../classes';

export type Hook = (ctx: Context, services: ServiceManager) => void | HttpResponse | Promise<void|HttpResponse>;
