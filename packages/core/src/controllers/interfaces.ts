import { Injector } from '../di/injector';

export interface Context { [name: string]: any; }

export type ContextualMiddleware = (ctx: Context) => Promise<Context>;
export type NextFunction = (err?: Error) => void;
export type ExpressMiddleware = (req: any, res: any, next: NextFunction) => any;

export type ContextualHook = (injector: Injector) => ContextualMiddleware;
export interface ModuleHooks {
  contextual: ContextualHook[];
}

export type Decorator = (target: any, methodName?: string) => void;
