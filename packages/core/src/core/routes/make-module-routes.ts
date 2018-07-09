// 3p
import 'reflect-metadata';

// FoalTS
import { Class } from '../class.interface';
import { HookFunction } from '../hooks';
import { IModule } from '../modules';
import { ServiceManager } from '../service-manager';
import { makeControllerRoutes } from './make-controller-routes';
import { RouteData } from './route.interface';
import { getMetadata, join } from './utils';

export function makeModuleRoutes(parentPath: string, parentHooks: HookFunction[],
                                 moduleClass: Class<IModule>, services: ServiceManager): RouteData[] {
  const routes: RouteData[] = [];

  const moduleHooks = getMetadata('hooks', moduleClass) || [];
  const modulePath = getMetadata('path', moduleClass);

  const hooks = parentHooks.concat(moduleHooks);
  const path = join(parentPath, modulePath);

  const module = new moduleClass();

  for (const controllerClass of module.controllers || []) {
    routes.push(
      ...makeControllerRoutes(path, hooks, controllerClass, services)
    );
  }

  for (const subModuleClass of module.subModules || []) {
    routes.push(
      ...makeModuleRoutes(path, hooks, subModuleClass, services)
    );
  }

  return routes;
}
