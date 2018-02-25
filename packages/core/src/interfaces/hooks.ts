import { HttpResponse, ServiceManager } from '../classes';
import { Context, PostContext } from './contexts';

export type PreHook = (ctx: Context, services: ServiceManager) => void | HttpResponse | Promise<void | HttpResponse>;
export type Handler = (ctx: Context, services: ServiceManager) => void | HttpResponse | Promise<void | HttpResponse>;
export type PostHook = (ctx: PostContext, services: ServiceManager) => void | Promise<void>;
