// 3p
import 'reflect-metadata';

/**
 * Makes the controller method a WebSocket handler for the given event.
 *
 * @export
 * @param {string} eventName The name or partial name of the event.
 * @returns
 */
export function EventName(eventName: string) {
  return (target: any, propertyKey: string) => {
    Reflect.defineMetadata('websocket-event-name', eventName, target, propertyKey);
  };
}
