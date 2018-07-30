// FoalTS
import { Class } from '../class.interface';
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

  const controllerDependencies = getMetadata('design:paramtypes', controllerClass) as Class[] || [];
  const controller = new controllerClass(
    ...controllerDependencies.map(serviceClass => services.get(serviceClass))
  );

  getMethods(controllerClass.prototype).forEach(propertyKey => {
    if (propertyKey === 'constructor') { return; }
    const httpMethod = getMetadata('httpMethod', controllerClass, propertyKey);
    if (httpMethod) {
      const methodPath = getMetadata('path', controllerClass, propertyKey) as string|undefined;
      const methodHooks = getMetadata('hooks', controllerClass, propertyKey) as HookFunction[] || [];
      const path = join(parentPath, controllerPath, methodPath);
      const hooks = parentHooks.concat(controllerHooks).concat(methodHooks);
      routes.push({ controller, hooks, httpMethod, path, propertyKey });
    }
  });

  return routes;
}
