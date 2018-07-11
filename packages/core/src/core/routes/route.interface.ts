import { HookFunction, PostHook, PreHook } from '../hooks';
import { HttpMethod } from '../http';

export interface Route {
  httpMethod: HttpMethod;
  path: string;
  hooks: HookFunction[];
  controller: any;
  propertyKey: string;
  // Todo: add `parameters`
}
