import { Controller } from '../controller';
import { HookFunction } from '../decorators';
import { Handler, PostHook, PreHook } from './hooks';

export type HttpMethod = 'POST' | 'GET' | 'PUT' | 'PATCH' | 'DELETE';

export interface Route {
  httpMethod: HttpMethod;
  path: string;
  preHooks: PreHook[];
  postHooks: PostHook[];
  handler: Handler;
}

export interface RouteData {
  httpMethod: HttpMethod;
  path: string;
  hooks: HookFunction[];
  controller: Controller<string>[];
  propertyKey: string;
  // Todo: add `parameters`
}
