// 3p
import 'reflect-metadata';

// FoalTS
import { Class } from './class.interface';
import { getMetadata } from './routes/utils';
import { Dependency, ServiceManager } from './service-manager';

export function createController<T>(controllerClass: Class<T>, services?: ServiceManager): T {
  const dependencies: Dependency[] = getMetadata('dependencies', controllerClass.prototype) || [];
  if (!services) {
    services = new ServiceManager();
  }
  const controller = new controllerClass();
  dependencies.forEach(dep => {
    controller[dep.propertyKey] = (services as ServiceManager).get(dep.serviceClass);
  });
  return controller;
}
