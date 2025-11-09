// std
import { deepStrictEqual, notStrictEqual, ok, strictEqual, throws } from 'assert';

// 3p
import { ConcreteSessionStore } from 'mock-module';

// FoalTS
import { existsSync, mkdirSync, rmdirSync, unlinkSync, writeFileSync } from 'fs';
import { join } from 'path';
import { Config, ConfigNotFoundError } from './config';
import { createService, dependency, Dependency, IDependency, ServiceManager } from './service-manager';

describe('dependency', () => {

  it('should add the property key and the service class to the class metaproperty "dependencies".', () => {
    class MyService1 {}
    class MyService2 {}
    class MyService3 {}

    class MyParentServiceOrController {
      @dependency
      myService1: MyService1;
    }

    // The dependency decorator should support inheritance and "multiple" inherited classes
    class MyChildServiceOrControllerA extends MyParentServiceOrController {
      @dependency
      myService2: MyService2;
    }
    class MyChildServiceOrControllerB extends MyParentServiceOrController {
      @dependency
      myService3: MyService3;
    }

    const expectedDependenciesA: IDependency[] = [
      { propertyKey: 'myService1', serviceClassOrID: MyService1 },
      { propertyKey: 'myService2', serviceClassOrID: MyService2 },
    ];
    const actualDependenciesA = Reflect.getMetadata('dependencies', MyChildServiceOrControllerA.prototype);

    deepStrictEqual(actualDependenciesA, expectedDependenciesA);

    const expectedDependenciesB: IDependency[] = [
      { propertyKey: 'myService1', serviceClassOrID: MyService1 },
      { propertyKey: 'myService3', serviceClassOrID: MyService3 },
    ];
    const actualDependenciesB = Reflect.getMetadata('dependencies', MyChildServiceOrControllerB.prototype);

    deepStrictEqual(actualDependenciesB, expectedDependenciesB);
  });

});

describe('Dependency', () => {

  it('should add the property key and the service ID to the class metaproperty "dependencies".', () => {
    class MyService1 {}
    class MyService2 {}
    class MyService3 {}

    class MyParentServiceOrController {
      @Dependency('service 1')
      myService1: MyService1;
    }

    // The dependency decorator should support inheritance and "multiple" inherited classes
    class MyChildServiceOrControllerA extends MyParentServiceOrController {
      @Dependency('service 2')
      myService2: MyService2;
    }
    class MyChildServiceOrControllerB extends MyParentServiceOrController {
      @Dependency('service 3')
      myService3: MyService3;
    }

    const expectedDependenciesA: IDependency[] = [
      { propertyKey: 'myService1', serviceClassOrID: 'service 1' },
      { propertyKey: 'myService2', serviceClassOrID: 'service 2' },
    ];
    const actualDependenciesA = Reflect.getMetadata('dependencies', MyChildServiceOrControllerA.prototype);

    deepStrictEqual(actualDependenciesA, expectedDependenciesA);

    const expectedDependenciesB: IDependency[] = [
      { propertyKey: 'myService1', serviceClassOrID: 'service 1' },
      { propertyKey: 'myService3', serviceClassOrID: 'service 3' },
    ];
    const actualDependenciesB = Reflect.getMetadata('dependencies', MyChildServiceOrControllerB.prototype);

    deepStrictEqual(actualDependenciesB, expectedDependenciesB);
  });

});

describe('createService', () => {

  it('should return an instance of the service (no dependencies).', () => {
    class MyService {}
    ok(createService(MyService) instanceof MyService, 'The returned value is not an instance of MyService.');
  });

  describe('when dependencies is undefined', () => {

    it('should create the service with all its dependencies.', () => {
      class MyService1 {}
      class MyService2 {}
      class MyService3 {
        @dependency
        myService1: MyService1;

        @dependency
        myService2: MyService2;
      }

      const service = createService(MyService3);
      ok(service.myService1 instanceof MyService1, `${service.myService1} should be an instance of MyService1.`);
      ok(service.myService2 instanceof MyService2, `${service.myService2} should be an instance of MyService2.`);
    });

  });

  describe('when dependencies is a defined', () => {

    it('should create the service with ALL its dependencies from the object.', () => {
      class MyService1 {}
      class MyService2 {}
      class MyService3 {
        @dependency
        myService1: MyService1;

        @dependency
        myService2: MyService2;
      }

      const myService1 = new MyService1();
      const myService2 = new MyService2();

      const service = createService(MyService3, {
        myService1, myService2
      });

      strictEqual(service.myService1, myService1);
      strictEqual(service.myService2, myService2);
    });

    it('should create the service with SOME OF its dependencies from the object.', () => {
      class MyService1 {}
      class MyService2 {
        @dependency
        myService1: MyService1;
      }
      class MyService3 {
        @dependency
        myService1: MyService1;

        @dependency
        myService2: MyService2;
      }

      const myService1 = new MyService1();

      const service = createService(MyService3, { myService1 });

      strictEqual(service.myService1, myService1);
      ok(service.myService2 instanceof MyService2, `${service.myService2} should be an instance of MyService2.`);
      strictEqual(service.myService2.myService1, myService1);
    });

  });

  it('should support inheritance.', () => {
    class Foobar {}
    class Foobar2 {}

    class ParentService {
      @dependency
      foobar: Foobar;
    }
    class ChildService extends ParentService {}
    class ChildService2 extends ParentService {
      @dependency
      foobar2: Foobar2;
    }

    const childService = createService(ChildService);
    const childService2 = createService(ChildService2);

    notStrictEqual(childService.foobar, undefined);
    strictEqual((childService as any).foobar2, undefined);
    notStrictEqual(childService2.foobar, undefined);
    notStrictEqual(childService2.foobar2, undefined);
  });

});

describe('ServiceManager', () => {

  let serviceManager: ServiceManager;

  class Foobar {}

  beforeEach(() => serviceManager = new ServiceManager());

  describe('when "boot" is called', () => {

    describe('when no identifier is given', () => {

      it('should call all the "boot" methods of the registered services if they exist.', async () => {
        let called = false;

        class Foobar2 {
          boot() {
            called = true;
          }
        }

        const serviceManager = new ServiceManager();
        // Foobar does not have a "boot" method.
        serviceManager.get(Foobar);
        // Foobar2 does have a "boot" method.
        serviceManager.get(Foobar2);

        await serviceManager.boot();

        strictEqual(called, true);
      });

      it('should reject an error if at least one call has rejected one.', async () => {
        class Foobar {
          async boot() {
            throw new Error('rejected');
          }
        }

        const serviceManager = new ServiceManager();
        serviceManager.get(Foobar);

        try {
          await serviceManager.boot();
          throw new Error('An error should have been thrown');
        } catch (error: any) {
          strictEqual(error.message, 'rejected');
        }
      });

      it('should not call by default the "boot" method of services injected manually.', async () => {
        let called = false;
        class Service {
          boot() {
            called = true;
          }
        }
        class Connection {
          boot() {
            throw new Error('This method should not have been called.');
          }
        }

        const serviceManager = new ServiceManager();
        serviceManager.set(Connection, new Connection());
        // This line tests the options in the "set" method.
        serviceManager.set(Service, new Service(), { boot: true });

        await serviceManager.boot();
        strictEqual(called, true);
      });

      it('should boot the services only once.', async () => {
        let i = 0;

        class Foobar2 {
          boot() {
            i++;
          }
        }

        const serviceManager = new ServiceManager();
        serviceManager.get(Foobar2);

        await serviceManager.boot();
        await serviceManager.boot();

        strictEqual(i, 1);
      });

    });

    describe('when an identifier is given', () => {

      it('should throw an error if no registered service is found for the given identifier.', async () => {
        const serviceManager = new ServiceManager();

        try {
          await serviceManager.boot('foobar');
          throw new Error('An error should have been thrown');
        } catch (error: any) {
          strictEqual(error.message, 'No service was found with the identifier "foobar".');
        }
      });

      it('should call all the "boot" method of the given service if it exist.', async () => {
        let called = false;

        class Foobar2 {
          boot() {
            called = true;
          }
        }

        const serviceManager = new ServiceManager();
        // Foobar does not have a "boot" method.
        serviceManager.get(Foobar);
        // Foobar2 does have a "boot" method.
        serviceManager.get(Foobar2);

        await serviceManager.boot(Foobar);
        strictEqual(called, false);
        await serviceManager.boot(Foobar2);

        strictEqual(called, true);
      });

      it('should reject an error if the service has rejected one.', async () => {
        class Foobar {
          async boot() {
            throw new Error('rejected');
          }
        }

        const serviceManager = new ServiceManager();
        serviceManager.get(Foobar);

        try {
          await serviceManager.boot(Foobar);
          throw new Error('An error should have been thrown');
        } catch (error: any) {
          strictEqual(error.message, 'rejected');
        }
      });

      it('should not call by default the "boot" method of the service if is has been injected manually.', async () => {
        let called = false;
        class Service {
          boot() {
            called = true;
          }
        }
        class Connection {
          boot() {
            throw new Error('This method should not have been called.');
          }
        }

        const serviceManager = new ServiceManager();
        serviceManager.set(Connection, new Connection());
        // This line tests the options in the "set" method.
        serviceManager.set(Service, new Service(), { boot: true });

        await serviceManager.boot(Connection);
        strictEqual(called, false);
        await serviceManager.boot(Service);
        strictEqual(called, true);
      });

      it('should boot the service only once.', async () => {
        let i = 0;

        class Foobar2 {
          boot() {
            i++;
          }
        }

        const serviceManager = new ServiceManager();
        serviceManager.get(Foobar2);

        await serviceManager.boot(Foobar2);
        await serviceManager.boot(Foobar2);

        strictEqual(i, 1);
      });

    });

  });

  describe('when "set" is called', () => {

    it('should return itself.', () => {
      const serviceManager = new ServiceManager();
      strictEqual(serviceManager.set(Foobar, {}), serviceManager);
    });

  });

  describe('when "get" is called', () => {

    it('should return itself if the given serviceClass is ServiceManager.', () => {
      strictEqual(serviceManager.get(ServiceManager), serviceManager);
    });

    it('should return itself if the given serviceClass has a isServiceManager static property.', () => {
      class ServiceManager {
        static isServiceManager = true;
      }
      strictEqual(serviceManager.get(ServiceManager), serviceManager);
    });

    it('should return the service registered with the "set" method.', () => {
      const service = new Foobar();
      serviceManager.set(Foobar, service);
      strictEqual(serviceManager.get(Foobar), service);

      const service2 = new Foobar();
      serviceManager.set('foobar', service2);
      strictEqual(serviceManager.get('foobar'), service2);
    });

    describe('if the service has not been registered with the "set" method', () => {

      it('should throw an error if the service is actually an id.', () => {
        try {
          serviceManager.get('foobar');
          throw new Error('An error should have been thrown.');
        } catch (error: any) {
          strictEqual(error.message, 'No service was found with the identifier "foobar".');
        }
      });

      it('should instantiate and return the service.', () => {
        ok(serviceManager.get(Foobar) instanceof Foobar);
      });

      it('should instantiate the service only once.', () => {
        strictEqual(serviceManager.get(Foobar), serviceManager.get(Foobar));
      });

      it('should instantiate the service with all its dependencies.', () => {
        class Foobar2 {}

        class Foobar3 {
          @dependency
          foobar: Foobar;

          @dependency
          foobar2: Foobar2;
        }

        // foobar3 is "gotten" in the middle on purpose.
        const foobar = serviceManager.get(Foobar);
        const foobar3 = serviceManager.get(Foobar3);
        const foobar2 = serviceManager.get(Foobar2);

        strictEqual(foobar3.foobar, foobar);
        strictEqual(foobar3.foobar2, foobar2);
      });

      it('should instantiate the service with all inherited dependencies.', () => {
        class Foobar {}
        class Foobar2 {}

        class ParentService {
          @dependency
          foobar: Foobar;
        }
        class ChildService extends ParentService {}
        class ChildService2 extends ParentService {
          @dependency
          foobar2: Foobar2;
        }

        const childService = serviceManager.get(ChildService);
        const childService2 = serviceManager.get(ChildService2);

        notStrictEqual(childService.foobar, undefined);
        strictEqual((childService as any).foobar2, undefined);
        notStrictEqual(childService2.foobar, undefined);
        notStrictEqual(childService2.foobar2, undefined);
      });

      describe('and if it has a static property "concreteClassConfigPath"', () => {

        beforeEach(() => Config.remove('settings.toto'));

        it('should throw an Error if Service.concreteClassConfigPath is not a string.', () => {
          abstract class Foobar {
            static concreteClassConfigPath = 3;
            static concreteClassName = 'Foobar2';
          }

          throws(
            () => serviceManager.get(Foobar),
            {
              message: '[CONFIG] Foobar.concreteClassConfigPath should be a string.'
            } as any
          );
        });

        it('should throw an Error if Service.concreteClassName is not defined.', () => {
          Config.set('settings.toto', 'mock-module');

          abstract class Foobar {
            static concreteClassConfigPath = 'settings.toto';
          }

          throws(
            () => serviceManager.get(Foobar),
            {
              message: '[CONFIG] Foobar.concreteClassName is missing.'
            } as any
          );
        });

        it('should throw an Error if Service.concreteClassName is not a string.', () => {
          Config.set('settings.toto', 'mock-module');

          abstract class Foobar {
            static concreteClassConfigPath = 'settings.toto';
            static concreteClassName = 3; // or undefined
          }

          throws(
            () => serviceManager.get(Foobar),
            {
              message: '[CONFIG] Foobar.concreteClassName should be a string.'
            } as any
          );
        });

        describe('when the concrete class path is a package name (does not start by "./")', () => {

          it('should throw an Error if the package is not installed.', () => {
            Config.set('settings.toto', 'uninstalledPackage');

            abstract class Foobar {
              static concreteClassConfigPath = 'settings.toto';
              static concreteClassName = 'Foobar2';
            }

            throws(
              () => serviceManager.get(Foobar),
              {
                message: '[CONFIG] The package or file uninstalledPackage was not found.'
              } as any
            );
          });

          it('should throw an Error if the specified concrete class is not found in the package.', () => {
            Config.set('settings.toto', 'mock-module');

            abstract class Foobar {
              static concreteClassConfigPath = 'settings.toto';
              static concreteClassName = 'Foobar2';
            }

            throws(
              () => serviceManager.get(Foobar),
              {
                message: '[CONFIG] mock-module is not a valid package or file for Foobar:'
                  + ' class Foobar2 not found.'
              } as any
            );
          });

          it('should throw an Error if the specified concrete class is actually not a class.', () => {
            Config.set('settings.toto', 'mock-module');

            abstract class Foobar {
              static concreteClassConfigPath = 'settings.toto';
              static concreteClassName = 'aNum';
            }

            throws(
              () => serviceManager.get(Foobar),
              {
                message: '[CONFIG] mock-module is not a valid package or file for Foobar: aNum is not a class.'
              } as any
            );
          });

          it('should return the concrete class instance.', () => {
            Config.set('settings.toto', 'mock-module');

            abstract class Foobar {
              static concreteClassConfigPath = 'settings.toto';
              static concreteClassName = 'ConcreteSessionStore';
            }

            const service = serviceManager.get(Foobar);
            strictEqual(service instanceof ConcreteSessionStore, true);
          });

        });

        function testLocal() {

          const filePath = join(__dirname, './service-manager.test.js');

          beforeEach(() => {
            writeFileSync(
              filePath,
              'exports.ConcreteSessionStore2 = class ConcreteSessionStore2 {}; exports.aNum = 1;',
              'utf8'
            );
          });

          afterEach(() => {
            if (existsSync(filePath)) {
              unlinkSync(filePath);
            }
          });

          it('should throw an error if Service.defaultConcreteClassPath is not a string.', () => {
            abstract class Foobar {
              static concreteClassConfigPath = 'settings.toto';
              static concreteClassName = 'Foobar2';
              static defaultConcreteClassPath = 3;
            }

            throws(
              () => serviceManager.get(Foobar),
              {
                message: '[CONFIG] Foobar.defaultConcreteClassPath should be a string.'
              } as any
            );
          });

          it('should throw an Error if the file does not exist.', () => {
            abstract class Foobar {
              static concreteClassConfigPath = 'settings.toto';
              static concreteClassName = 'Foobar2';
              static defaultConcreteClassPath = './foo';
            }

            throws(
              () => serviceManager.get(Foobar),
              {
                message: '[CONFIG] The package or file ./foo was not found.'
              } as any
            );
          });

          it('should throw an Error if the specified concrete class is not found in the file.', () => {
            abstract class Foobar {
              static concreteClassConfigPath = 'settings.toto';
              static concreteClassName = 'Foobar2';
              static defaultConcreteClassPath = './service-manager.test';
            }

            throws(
              () => serviceManager.get(Foobar),
              {
                message: '[CONFIG] ./service-manager.test is not a valid package or file for Foobar:'
                  + ' class Foobar2 not found.'
              } as any
            );
          });

          it('should throw an Error if the specified concrete class is actually not a class.', () => {
            abstract class Foobar {
              static concreteClassConfigPath = 'settings.toto';
              static concreteClassName = 'aNum';
              static defaultConcreteClassPath = './service-manager.test';
            }

            throws(
              () => serviceManager.get(Foobar),
              {
                message: '[CONFIG] ./service-manager.test is not a valid package or file for Foobar:'
                  + ' aNum is not a class.'
              } as any
            );
          });

          it('should return the concrete class instance.', () => {
            abstract class Foobar {
              static concreteClassConfigPath = 'settings.toto';
              static concreteClassName = 'ConcreteSessionStore2';
              static defaultConcreteClassPath = './service-manager.test';
            }

            const service: any = serviceManager.get(Foobar);
            strictEqual(typeof service === 'object', true);
            strictEqual(service.constructor.name, 'ConcreteSessionStore2');
          });

        }

        describe('when the concrete class path is not defined', () => {

          describe('if Service.defaultConcreteClassPath is not defined', () => {

            it('should throw a ConfigNotFoundError.', () => {
              abstract class Foobar {
                static concreteClassConfigPath = 'settings.toto';
                static concreteClassName = 'Foobar2';
              }

              try {
                serviceManager.get(Foobar);
                throw new Error('An error should have been thrown');
              } catch (error: any) {
                if (!(error instanceof ConfigNotFoundError)) {
                  throw new Error('A ConfigNotFoundError should have been thrown.');
                }
                strictEqual(error.key, 'settings.toto');
              }
            });

          });

          describe('if Service.defaultConcreteClassPath is defined', () => {
            testLocal();
          });

        });

        describe('when the concrete class path is "local"', () => {

          beforeEach(() => Config.set('settings.toto', 'local'));

          it('should throw an error if Service.defaultConcreteClassPath is not defined.', () => {
            abstract class Foobar {
              static concreteClassConfigPath = 'settings.toto';
              static concreteClassName = 'Foobar2';
            }

            throws(
              () => serviceManager.get(Foobar),
              {
                message: '[CONFIG] Foobar does not support the "local" option in settings.toto.'
              } as any
            );
          });

          testLocal();

        });

        describe('when the concrete class path is a relative path (starts with "./")', () => {

          const buildDirPath = join(process.cwd(), 'build');
          const concreteFilePath = join(process.cwd(), 'build/service-manager.test2.js');

          beforeEach(() => {
            mkdirSync(buildDirPath);
            writeFileSync(
              concreteFilePath,
              'exports.ConcreteSessionStore3 = class ConcreteSessionStore3 {}; exports.aNum = 1;',
              'utf8'
            );
          });

          afterEach(() => {
            if (existsSync(concreteFilePath)) {
              unlinkSync(concreteFilePath);
            }
            if (existsSync(buildDirPath)) {
              rmdirSync(buildDirPath);
            }
          });

          it('should throw an Error if the file does not exist.', () => {
            Config.set('settings.toto', './foo');

            abstract class Foobar {
              static concreteClassConfigPath = 'settings.toto';
              static concreteClassName = 'Foobar2';
            }

            throws(
              () => serviceManager.get(Foobar),
              {
                message: '[CONFIG] The package or file ./foo was not found.'
              } as any
            );
          });

          it('should throw an Error if the specified concrete class is not found in the package.', () => {
            Config.set('settings.toto', './service-manager.test2');

            abstract class Foobar {
              static concreteClassConfigPath = 'settings.toto';
              static concreteClassName = 'Foobar2';
            }

            throws(
              () => serviceManager.get(Foobar),
              {
                message: '[CONFIG] ./service-manager.test2 is not a valid package or file for Foobar:'
                  + ' class Foobar2 not found.'
              } as any
            );
          });

          it('should throw an Error if the specified concrete class is actually not a class.', () => {
            Config.set('settings.toto', './service-manager.test2');

            abstract class Foobar {
              static concreteClassConfigPath = 'settings.toto';
              static concreteClassName = 'aNum';
            }

            throws(
              () => serviceManager.get(Foobar),
              {
                message: '[CONFIG] ./service-manager.test2 is not a valid package or file for Foobar:'
                  + ' aNum is not a class.'
              } as any
            );
          });

          it('should return the concrete class instance.', () => {
            Config.set('settings.toto', './service-manager.test2');

            abstract class Foobar {
              static concreteClassConfigPath = 'settings.toto';
              static concreteClassName = 'ConcreteSessionStore3';
            }

            const service = serviceManager.get(Foobar);
            strictEqual(typeof service === 'object', true);
            strictEqual(service.constructor.name, 'ConcreteSessionStore3');
          });

        });

      });

    });

  });

});
