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
 * Interface for service factories that can create service instances.
 *
 * @export
 */
export abstract class ServiceFactory<T = any> {
  /**
   * Create a service instance.
   *
   * @param {ServiceManager} serviceManager - The service manager.
   * @returns {[Class<T>, T]} A tuple of [ServiceClass, ServiceInstance].
   */
  abstract create(serviceManager: ServiceManager): [Class<T>, T];
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

  private readonly map: Map<string|ClassOrAbstractClass|ServiceFactory<any>, { boot: boolean, service?: any, target?: Class|ServiceFactory<any> }>  = new Map();
  private initialized: boolean = false;

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
      // Ensure service is instantiated before booting
      if (value.target && !value.service) {
        this.get(identifier as any);
      }
      await this.bootService(value);
    } else {
      const promises: Promise<void>[] = [];
      for (const [key, value] of this.map.entries()) {
        // Ensure service is instantiated before booting
        if (value.target && !value.service) {
          this.get(key as any);
        }
        promises.push(this.bootService(value));
      }
      await Promise.all(promises);
      this.initialized = true;
    }
  }

  /**
   * Register a service for lazy initialization.
   *
   * @param {string} identifier - The service ID.
   * @param {Class|ServiceFactory<any>} target - The service class or factory.
   * @param {{ boot?: boolean, init?: boolean }} [options] - Options for registration.
   * @returns {this} The service manager.
   * @memberof ServiceManager
   */
  register(identifier: string, target: Class|ServiceFactory<any>, options?: { boot?: boolean, init?: boolean }): this;
  /**
   * Register a service for lazy initialization.
   *
   * @template T
   * @param {ClassOrAbstractClass<T>} identifier - The service class.
   * @param {Class<T>|ServiceFactory<T>} target - The service class or factory.
   * @param {{ boot?: boolean, init?: boolean }} [options] - Options for registration.
   * @returns {this} The service manager.
   * @memberof ServiceManager
   */
  register<T>(identifier: ClassOrAbstractClass<T>, target: Class<T>|ServiceFactory<T>, options?: { boot?: boolean, init?: boolean }): this;
  /**
   * Register a service for lazy initialization.
   *
   * @param {ClassOrAbstractClass} identifierOrTarget - The service class (when used without a separate target).
   * @param {{ boot?: boolean, init?: boolean }} [options] - Options for registration.
   * @returns {this} The service manager.
   * @memberof ServiceManager
   */
  register(identifierOrTarget: ClassOrAbstractClass, options?: { boot?: boolean, init?: boolean }): this;
  register(
    identifierOrTarget: string|ClassOrAbstractClass,
    targetOrOptions?: Class|ServiceFactory<any>|{ boot?: boolean, init?: boolean },
    options?: { boot?: boolean, init?: boolean }
  ): this {
    let identifier: string|ClassOrAbstractClass;
    let target: Class|ServiceFactory<any>;
    let opts: { boot?: boolean, init?: boolean } = {};

    // Parse arguments based on their types and count
    if (arguments.length === 3 || (arguments.length === 2 && typeof targetOrOptions !== 'object')) {
      // Case: register(identifier, target, options)
      identifier = identifierOrTarget;
      target = targetOrOptions as Class|ServiceFactory<any>;
      opts = options || {};
    } else if (arguments.length === 2 && targetOrOptions instanceof ServiceFactory) {
      // Case: register(identifier, factory)
      identifier = identifierOrTarget;
      target = targetOrOptions;
      opts = {};
    } else if (arguments.length === 2 && typeof targetOrOptions === 'object' && !(targetOrOptions instanceof ServiceFactory)) {
      // Case: register(target, options)
      identifier = identifierOrTarget;
      target = identifierOrTarget as Class;
      opts = targetOrOptions as { boot?: boolean, init?: boolean };
    } else {
      // Case: register(target) with no options
      identifier = identifierOrTarget;
      target = identifierOrTarget as Class;
    }

    // Set defaults
    if (opts.boot === undefined) {
      opts.boot = true;
    }

    if (opts.init) {
      // Immediate initialization
      const service = this.get(target as any);
      this.map.set(identifier, {
        boot: false, // Already handled during get
        service
      });
    } else {
      // Lazy initialization
      this.map.set(identifier, {
        boot: opts.boot,
        target
      });
    }

    return this;
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
  get<T>(identifier: ClassOrAbstractClass<T> | ServiceFactory<T>): T;
  get(identifier: string): any;
  get(identifier: string|ClassOrAbstractClass|ServiceFactory<any>): any {
    // @ts-ignore : Type 'ServiceManager' is not assignable to type 'Service'.
    if (identifier === ServiceManager || identifier.isServiceManager === true) {
      // @ts-ignore : Type 'ServiceManager' is not assignable to type 'Service'.
      return this;
    }

    // Get the service if it exists.
    const value = this.map.get(identifier);
    if (value) {
      // Handle lazy initialization
      if (value.target && !value.service) {
        const [serviceClass, service] = this.instantiateService(value.target);
        value.service = service;
        this.injectDependencies(serviceClass, service);

        // Boot immediately if initialized and boot is true
        if (this.initialized && value.boot && service.boot) {
          const result = service.boot();
          if (result && typeof result.then === 'function') {
            throw new Error(
              `Lazy initialized services must not have async 'boot' hooks: ${
                (identifier as Class).name || identifier
              }`
            );
          }
          value.boot = false;
        }

        delete value.target;
      }
      return value.service;
    }

    // Throw an error if the identifier is a string and no service was found in the map.
    if (typeof identifier === 'string') {
      throw new Error(`No service was found with the identifier "${identifier}".`);
    }

    if (!(identifier instanceof ServiceFactory) && identifier.hasOwnProperty('concreteClassConfigPath')) {
      const concreteClass = this.getConcreteClassFromConfig(identifier);
      return this.get(concreteClass);
    }

    // If the service has not been instantiated yet then do it.
    const [serviceClass, service] = this.instantiateService(identifier as Class|ServiceFactory<any>);

    this.injectDependencies(serviceClass, service);

    // Save the service using the identifier (could be a factory or a class).
    this.map.set(identifier, {
      boot: true,
      service,
    });

    return service;
  }

  private instantiateService(target: Class|ServiceFactory<any>): [Class, any] {
    if (target instanceof ServiceFactory) {
      return target.create(this);
    } else {
      return [target, new target()];
    }
  }

  private injectDependencies(serviceClass: Class, service: any): void {
    const dependencies: IDependency[] = Reflect.getMetadata('dependencies', serviceClass.prototype) || [];

    for (const dependency of dependencies) {
      (service as any)[dependency.propertyKey] = this.get(dependency.serviceClassOrID as any);
    }
  }

  private async bootService(value: { boot: boolean, service?: any, target?: Class|ServiceFactory<any> }): Promise<void> {
    if (value.boot && value.service && value.service.boot) {
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
