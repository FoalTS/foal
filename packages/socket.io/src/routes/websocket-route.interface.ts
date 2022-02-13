import { WebsocketHookFunction } from '../architecture';

/**
 * Represents a websocket route with its controller handler and hooks.
 *
 * @export
 * @interface Route
 */
export interface WebsocketRoute {
  eventName: string;
  hooks: WebsocketHookFunction[];
  controller: any;
  propertyKey: string;
}
