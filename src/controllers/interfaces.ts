import { Request, RequestHandler } from 'express';

import { Injector } from '../di/injector';

export interface Context { [name: string]: any; }
export interface RequestWithContext extends Request {
  foal: {
    context: Context
  };
}

export interface ExtendedRequest extends Request {
  [propertyKey: string]: any;
}

export type ContextualMiddleware = (ctx: Context) => Promise<Context>;
export interface ExpressMiddleware extends RequestHandler {}

export type ContextualHook = (injector: Injector) => ContextualMiddleware;
export type ExpressHook = (injector: Injector) => ExpressMiddleware;
export interface ModuleHooks {
  express: ExpressHook[];
  contextual: ContextualHook[];
}

export type ExpressContextDef = { req: string; ctx: string; }[];
export interface ModuleContextDef {
  express: ExpressContextDef;
}

export type Decorator = (target: any, methodName?: string) => void;
export type Family = 'express'|'contextual';
