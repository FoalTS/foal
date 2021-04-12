import { WebsocketHookFunction } from '../architecture';

export interface WebsocketRoute {
  eventName: string;
  hooks: WebsocketHookFunction[];
  controller: any;
  propertyKey: string;
}
