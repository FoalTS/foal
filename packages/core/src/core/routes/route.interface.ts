import { Class } from '../class.interface';
import { Handler, HookFunction, PostHook, PreHook } from '../hooks';

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
  controller: any;
  propertyKey: string;
  // Todo: add `parameters`
}
