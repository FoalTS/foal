import { HookFunction } from '../hooks';
import { HttpMethod } from '../http';

/**
 * Represent a Foal route with its controller handler and hooks.
 *
 * @export
 * @interface Route
 */
export interface Route {
  httpMethod: HttpMethod;
  path: string;
  hooks: HookFunction[];
  controller: any;
  propertyKey: string;
}
