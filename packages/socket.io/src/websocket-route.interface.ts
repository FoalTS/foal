import { WebsocketHookFunction } from './websocket-hooks';

export interface WebsocketRoute {
  eventName: string;
  hooks: WebsocketHookFunction[];
  controller: any;
  propertyKey: string;
}
