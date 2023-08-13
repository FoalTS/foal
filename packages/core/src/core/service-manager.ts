// std
import { join } from 'path';

// 3p
import 'reflect-metadata';

// FoalTS
import { Class, ClassOrAbstractClass } from './class.interface';
import { Config } from './config';

export interface IDependency {
  propertyKey: string;
  serviceClassOrID: string|Class;
}

/**
 * Decorator injecting a service inside a controller or another service.
 *
 * @param id {string} - The service ID.
 */
export function Dependency(id: string) {
  return (target: any, propertyKey: string) => {
    const dependencies: IDependency[] = [ ...(Reflect.getMetadata('dependencies', target) || []) ];
    dependencies.push({ propertyKey, serviceClassOrID: id });
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
  const dependencies: IDependency[] = [ ...(Reflect.getMetadata('dependencies', target) || []) ];
  dependencies.push({ propertyKey, serviceClassOrID: serviceClass });
  Reflect.defineMetadata('dependencies', dependencies, target);
}

/**
 * Create a new service with its dependencies.
 *
 * @export
 * @template Service
 * @param {ClassOrAbstractClass<Service>} serviceClass - The service class.
 * @param {object} [dependencies] - An object which key/values are the service properties/instances.
 * @returns {Service} - The created service.
 */
export function createService<Service extends object>(
  serviceClass: ClassOrAbstractClass<Service>, dependencies?: object
): Service {
  return createControllerOrService(serviceClass, dependencies);
}

export function createControllerOrService<T extends object>(
  serviceClass: ClassOrAbstractClass<T>, dependencies?: object
): T {
  const metadata: IDependency[] = Reflect.getMetadata('dependencies', serviceClass.prototype) || [];

  const serviceManager = new ServiceManager();

  if (dependencies) {
    metadata.forEach(dep => {
      const serviceMock = (dependencies as any)[dep.propertyKey];
      if (serviceMock) {
        serviceManager.set(dep.serviceClassOrID, serviceMock);
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

  private readonly map: Map<string|ClassOrAbstractClass, { boot: boolean, service: any }>  = new Map();

  /**
   * Boot all services : call the method "boot" of each service if it exists.
   *
   * If a service identifier is provided, only this service will be booted.
   *
   * Services are only booted once.
   *
   * @param {(string|ClassOrAbstractClass)} [identifier] - The service ID or the service class.
   * @returns {Promise<void>}
   * @memberof ServiceManager
   */
  async boot(identifier?: string|ClassOrAbstractClass): Promise<void> {
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
   * @param {string|ClassOrAbstractClass} identifier - The service ID or the service class.
   * @param {*} service - The service object (or mock).
   * @param {{ boot: boolean }} [options={ boot: false }] If `boot` is true, the service method "boot"
   * will be executed when calling `ServiceManager.boot` is called.
   * @returns {this} The service manager.
   * @memberof ServiceManager
   */
  set(identifier: string|ClassOrAbstractClass, service: any, options: { boot: boolean } = { boot: false }): this {
    this.map.set(identifier, {
      boot: options.boot,
      service,
    });
    return this;
  }

  /**
   * Get (and create if necessary) the service singleton.
   *
   * @param {string|ClassOrAbstractClass} identifier - The service ID or the service class.
   * @returns {*} - The service instance.
   * @memberof ServiceManager
   */
  get<T>(identifier: ClassOrAbstractClass<T>): T;
  get(identifier: string): any;
  get(identifier: string|ClassOrAbstractClass): any {
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

    if (identifier.hasOwnProperty('concreteClassConfigPath')) {
      const concreteClass = this.getConcreteClassFromConfig(identifier);
      return this.get(concreteClass);
    }

    // If the service has not been instantiated yet then do it.
    const dependencies: IDependency[] = Reflect.getMetadata('dependencies', identifier.prototype) || [];

    // identifier is a class here.
    const service = new (identifier as Class)();

    for (const dependency of dependencies) {
      (service as any)[dependency.propertyKey] = this.get(dependency.serviceClassOrID as any);
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

  private getConcreteClassFromConfig(cls: ClassOrAbstractClass<any>): any {
    const concreteClassConfigPath: string = this.getProperty(
      cls,
      'concreteClassConfigPath',
      'string',
    );

    const concreteClassName: string = this.getProperty(
      cls,
      'concreteClassName',
      'string',
    );

    let concreteClassPath: string;
    if (cls.hasOwnProperty('defaultConcreteClassPath')) {
      concreteClassPath = Config.get(concreteClassConfigPath, 'string', 'local');
    } else {
      concreteClassPath = Config.getOrThrow(concreteClassConfigPath, 'string');
    }

    let prettyConcreteClassPath: string | undefined;

    if (concreteClassPath === 'local') {
      concreteClassPath = this.getProperty(
        cls,
        'defaultConcreteClassPath',
        'string',
        `[CONFIG] ${cls.name} does not support the "local" option in ${concreteClassConfigPath}.`
      );
    } else if (concreteClassPath.startsWith('./')) {
      prettyConcreteClassPath = concreteClassPath;
      concreteClassPath = join(process.cwd(), 'build', concreteClassPath);
    }

    prettyConcreteClassPath = prettyConcreteClassPath || concreteClassPath;

    let pkg: any;
    try {
      pkg = require(concreteClassPath);
    } catch (err: any) {
      // TODO: test this line.
      if (err.code !== 'MODULE_NOT_FOUND') {
        throw err;
      }
      throw new Error(`[CONFIG] The package or file ${prettyConcreteClassPath} was not found.`);
    }

    const concreteClass = this.getProperty(
      pkg,
      concreteClassName,
      'function',
      `[CONFIG] ${prettyConcreteClassPath} is not a valid package or file for ${cls.name}:`
        + ` class ${concreteClassName} not found.`,
      `[CONFIG] ${prettyConcreteClassPath} is not a valid package or file for ${cls.name}:`
        + ` ${concreteClassName} is not a class.`
    );

    return concreteClass;
  }

  private getProperty(obj: any, propertyKey: string, type: string, notFoundMsg?: string, typeMsg?: string): any {
    if (!obj.hasOwnProperty(propertyKey)) {
      throw new Error(notFoundMsg || `[CONFIG] ${obj.name}.${propertyKey} is missing.`);
    }

    const property = (obj as any)[propertyKey];
    if (typeof property !== type) {
      throw new Error(typeMsg || `[CONFIG] ${obj.name}.${propertyKey} should be a ${type}.`);
    }

    return property;
  }

}
