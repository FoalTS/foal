import { Controller } from '../controller';
import { HookFunction } from '../hooks';
import { Class } from './class';
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
  controller: Class;
  propertyKey: string;
  // Todo: add `parameters`
}
