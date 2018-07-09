// FoalTS
import { Class } from '../class.interface';
import { IModule } from '../modules';
import { ServiceManager } from '../service-manager';
import { makeModuleRoutes } from './make-module-routes';
import { RouteData } from './route.interface';

export function makeRoutes(moduleClass: Class<IModule>, services: ServiceManager): RouteData[] {
  return makeModuleRoutes('', [], moduleClass, services);
}
