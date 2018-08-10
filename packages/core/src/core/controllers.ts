// 3p
import 'reflect-metadata';

// FoalTS
import { Class } from './class.interface';
import { getMetadata } from './routes/utils';
import { ServiceManager } from './service-manager';

export function Controller(path?: string) {
  return Reflect.metadata('path', path);
}

export function createController<T>(controllerClass: Class<T>): T {
  const controllerDependencies = getMetadata('design:paramtypes', controllerClass) as Class[] || [];
  const services = new ServiceManager();
  return new controllerClass(
    ...controllerDependencies.map(serviceClass => services.get(serviceClass))
  );
}
