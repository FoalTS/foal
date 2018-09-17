// 3p
import 'reflect-metadata';

// FoalTS
import { Class } from './class.interface';
import { Dependency, ServiceManager } from './service-manager';

export function createController<T>(controllerClass: Class<T>, dependencies?: object|ServiceManager): T {
  const controllerDependencies: Dependency[] = Reflect.getMetadata('dependencies', controllerClass.prototype) || [];

  let serviceManager = new ServiceManager();

  const service = new controllerClass();

  if (dependencies instanceof ServiceManager) {
    serviceManager = dependencies;
  } else if (typeof dependencies === 'object') {
    controllerDependencies.forEach(dep => {
      const serviceMock = dependencies[dep.propertyKey];
      if (serviceMock) {
        serviceManager.set(dep.serviceClass, serviceMock);
      }
    });
  }
  controllerDependencies.forEach(dep => service[dep.propertyKey] = serviceManager.get(dep.serviceClass));

  return service;
}
