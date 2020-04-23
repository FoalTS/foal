import 'reflect-metadata';

import { Class } from './class.interface';

export interface Dependency {
  propertyKey: string;
  // Service class or service ID.
  serviceClass: string|Class;
}

/**
 * Decorator injecting a service inside a controller or another service.
 *
 * @param id {string} - The service ID.
 */
export function Dependency(id: string) {
  return (target: any, propertyKey: string) => {
    const dependencies: Dependency[] = [ ...(Reflect.getMetadata('dependencies', target) || []) ];
    dependencies.push({ propertyKey, serviceClass: id });
    Reflect.defineMetadata('dependencies', dependencies, target);
  };
}

/**
 * Decorator injecting a service inside a controller or another service.
 *
 * @export
 */
export function dependency(target: any, propertyKey: string) {
  const serviceClass = Reflect.getMetadata('design:type', target, propertyKey);
  const dependencies: Dependency[] = [ ...(Reflect.getMetadata('dependencies', target) || []) ];
  dependencies.push({ propertyKey, serviceClass });
  Reflect.defineMetadata('dependencies', dependencies, target);
}

/**
 * Create a new service with its dependencies.
 *
 * @export
 * @template Service
 * @param {Class<Service>} serviceClass - The service class.
 * @param {(object|ServiceManager)} [dependencies] - Either a ServiceManager or an
 * object which key/values are the service properties/instances.
 * @returns {Service} - The created service.
 */
export function createService<Service>(serviceClass: Class<Service>, dependencies?: object|ServiceManager): Service {
  return createControllerOrService(serviceClass, dependencies);
}

export function createControllerOrService<T>(serviceClass: Class<T>, dependencies?: object|ServiceManager): T {
  const metadata: Dependency[] = Reflect.getMetadata('dependencies', serviceClass.prototype) || [];

  let serviceManager = new ServiceManager();

  if (dependencies instanceof ServiceManager) {
    serviceManager = dependencies;
  } else if (typeof dependencies === 'object') {
    metadata.forEach(dep => {
      const serviceMock = (dependencies as any)[dep.propertyKey];
      if (serviceMock) {
        serviceManager.set(dep.serviceClass, serviceMock);
      }
    });
  }

  return serviceManager.get(serviceClass);
}

/**
 * Identity Mapper that instantiates and returns service singletons.
 *
 * @export
 * @class ServiceManager
 */
export class ServiceManager {

  private readonly map: Map<string|Class, { boot: boolean, service: any }>  = new Map();

  /**
   * Boot all services : call the method "boot" of each service if it exists.
   *
   * If a service identifier is provided, only this service will be booted.
   *
   * Services are only booted once.
   *
   * @param {(string|Class)} [identifier] - The service ID or the service class.
   * @returns {Promise<void>}
   * @memberof ServiceManager
   */
  async boot(identifier?: string|Class): Promise<void> {
    if (typeof identifier !== 'undefined') {
      const value = this.map.get(identifier);
      if (!value) {
        throw new Error(`No service was found with the identifier "${identifier}".`);
      }
      return this.bootService(value);
    }

    const promises: Promise<void>[] = [];
    for (const value of this.map.values()) {
      promises.push(this.bootService(value));
    }
    await Promise.all(promises);
  }

  /**
   * Add manually a service to the identity mapper.
   *
   * @param {string|Class} identifier - The service ID or the service class.
   * @param {*} service - The service object (or mock).
   * @returns {this} The service manager.
   * @memberof ServiceManager
   */
  set(identifier: string|Class, service: any, options: { boot: boolean } = { boot: false }): this {
    this.map.set(identifier, {
      boot: options.boot,
      service,
    });
    return this;
  }

  /**
   * Get (and create if necessary) the service singleton.
   *
   * @param {string|Class} identifier - The service ID or the service class.
   * @returns {*} - The service instance.
   * @memberof ServiceManager
   */
  get<T>(identifier: Class<T>): T;
  get(identifier: string): any;
  get(identifier: string|Class): any {
    // @ts-ignore : Type 'ServiceManager' is not assignable to type 'Service'.
    if (identifier === ServiceManager || identifier.isServiceManager === true) {
      // @ts-ignore : Type 'ServiceManager' is not assignable to type 'Service'.
      return this;
    }

    // Get the service if it exists.
    const value = this.map.get(identifier);
    if (value) {
      return value.service;
    }

    // Throw an error if the identifier is a string and no service was found in the map.
    if (typeof identifier === 'string') {
      throw new Error(`No service was found with the identifier "${identifier}".`);
    }

    // If the service has not been instantiated yet then do it.
    const dependencies: Dependency[] = Reflect.getMetadata('dependencies', identifier.prototype) || [];

    // identifier is a class here.
    const service = new identifier();

    for (const dependency of dependencies) {
      (service as any)[dependency.propertyKey] = this.get(dependency.serviceClass as any);
    }

    // Save the service.
    this.map.set(identifier, {
      boot: true,
      service,
    });

    return service;
  }

  private async bootService(value: { boot: boolean, service: any }): Promise<void> {
    if (value.boot && value.service.boot) {
      value.boot = false;
      await value.service.boot();
    }
  }

}
