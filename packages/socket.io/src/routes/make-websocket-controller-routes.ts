// 3p
import { Class, ServiceManager, getMetadata } from '@foal/core';

// FoalTS
import { WebsocketHookFunction } from '../architecture';
import { WebsocketRoute } from './websocket-route.interface';

/**
 * Recursively get the property names of an object and its prototypes.
 *
 * @param {(object|null)} obj - The object.
 * @returns {string[]} The property names.
 */
 export function getMethods(obj: object|null): string[] {
  if (obj === Object.prototype) { return []; }
  return Object.getOwnPropertyNames(obj).concat(getMethods(Object.getPrototypeOf(obj)));
}

function getEventName(controllerClass: Class, propertyKey?: string): string {
  return getMetadata('websocket-event-name', controllerClass, propertyKey) as string|undefined || '';
}

function getHooks(controllerClass: Class, controller: object, propertyKey?: string): WebsocketHookFunction[] {
  return (getMetadata('websocket-hooks', controllerClass, propertyKey) as WebsocketHookFunction[] || [])
    .map(hook => hook.bind(controller));
}

/**
 * Recursively create the routes of a Websocket controller and its subcontrollers from the
 * controller class definition.
 *
 * @export
 * @param {Class} controllerClass - The controller class.
 * @param {ServiceManager} services - The application services.
 * @returns {Generator<WebsocketRoute>} The created routes.
 */
export function* makeWebsocketControllerRoutes(controllerClass: Class, services: ServiceManager): Generator<WebsocketRoute> {
  // FoalTS stores as well the controllers in the service manager.
  const controller = services.get(controllerClass);

  const controllerEventName = getEventName(controllerClass);
  const controllerHooks = getHooks(controllerClass, controller);

  function processRoute(route: WebsocketRoute): WebsocketRoute {
    return {
      controller: route.controller,
      hooks: controllerHooks.concat(route.hooks),
      eventName: `${controllerEventName}${route.eventName}`,
      propertyKey: route.propertyKey,
    };
  }

  for (const controllerClass of controller.subControllers || []) {
    for (
      const route of makeWebsocketControllerRoutes(controllerClass, services)
    ) {
      yield processRoute(route);
    }
  }

  for (const propertyKey of getMethods(controllerClass.prototype)) {
    const eventName = getMetadata('websocket-event-name', controllerClass, propertyKey);

    if (!eventName) {
      continue;
    }

    const hooks = getHooks(controllerClass, controller, propertyKey);
    const route = { controller, hooks, eventName, propertyKey };

    yield processRoute(route);
  }
}
