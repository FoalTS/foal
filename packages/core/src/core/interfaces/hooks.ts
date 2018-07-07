import { Context, HttpResponse , PostContext } from '../http';
import { ServiceManager } from '../service-manager';

export type PreHook = (ctx: Context, services: ServiceManager) => void | HttpResponse | Promise<void | HttpResponse>;
export type PostHook = (ctx: PostContext, services: ServiceManager) => void | Promise<void>;
