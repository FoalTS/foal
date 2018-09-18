// FoalTS
import { Class } from '../class.interface';
import { createController } from '../controllers';
import { HookFunction } from '../hooks';
import { ServiceManager } from '../service-manager';
import { Route } from './route.interface';
import { getMetadata, join } from './utils';

function getMethods(obj: object|null): string[] {
  if (obj === Object.prototype) { return []; }
  return Object.getOwnPropertyNames(obj).concat(getMethods(Object.getPrototypeOf(obj)));
}

export function makeControllerRoutes(parentPath: string, parentHooks: HookFunction[],
                                     controllerClass: Class, services: ServiceManager): Route[] {
  const routes: Route[] = [];

  const controllerHooks = getMetadata('hooks', controllerClass) as HookFunction[] || [];
  const controllerPath = getMetadata('path', controllerClass) as string|undefined;

  const leftPath = join(parentPath, controllerPath);
  const leftHooks = parentHooks.concat(controllerHooks);

  const controller = createController(controllerClass, services);

  getMethods(controllerClass.prototype).forEach(propertyKey => {
    if (propertyKey === 'constructor') { return; }
    const httpMethod = getMetadata('httpMethod', controllerClass, propertyKey);
    if (httpMethod) {
      const methodPath = getMetadata('path', controllerClass, propertyKey) as string|undefined;
      const methodHooks = getMetadata('hooks', controllerClass, propertyKey) as HookFunction[] || [];
      const path = join(leftPath, methodPath);
      const hooks = [ ...leftHooks, ...methodHooks ];
      routes.push({ controller, hooks, httpMethod, path, propertyKey });
    }
  });

  for (const controllerClass of controller.subControllers || []) {
    routes.push(
      ...makeControllerRoutes(leftPath, leftHooks, controllerClass, services)
    );
  }

  return routes;
}
