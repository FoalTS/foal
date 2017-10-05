import { Injector } from '../di/injector';

export interface Context { [name: string]: any; }

export type ContextualMiddleware = (ctx: Context) => Promise<Context>;
export type NextFunction = (err?: Error) => void;
export type ExpressMiddleware = (req: any, res: any, next: NextFunction) => any;

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

export type PreHook = (ctx: Context, injector: Injector) => Context|Promise<Context>;
