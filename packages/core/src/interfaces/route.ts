import { Hook } from './hook';

export type HttpMethod = 'POST' | 'GET' | 'PUT' | 'PATCH' | 'DELETE';

export interface Route {
  httpMethod: HttpMethod;
  path: string;
  preHooks: Hook[];
  postHooks: Hook[];
  middleHook: Hook;
}
