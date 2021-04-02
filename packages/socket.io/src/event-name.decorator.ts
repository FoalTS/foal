export function EventName(eventName: string) {
  return (target: any, propertyKey: string) => {
    Reflect.defineMetadata('websocket-event-name', eventName, target, propertyKey);
  };
}
