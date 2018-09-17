// std
import { deepStrictEqual, notStrictEqual, ok, strictEqual } from 'assert';

// FoalTS
import { service, ServiceManager } from './service-manager';

describe('service', () => {

  it('should add the property key and the service class to the class metaproperty "dependencies".', () => {
    class MyService1 {}
    class MyService2 {}
    class MyService3 {}

    class MyParentServiceOrController {
      @service
      myService1: MyService1;
    }

    // The service decorator should support inheritance and "multiple" inherited classes
    class MyChildServiceOrControllerA extends MyParentServiceOrController {
      @service
      myService2: MyService2;
    }
    class MyChildServiceOrControllerB extends MyParentServiceOrController {
      @service
      myService3: MyService3;
    }

    const expectedDependenciesA = [
      { propertyKey: 'myService1', serviceClass: MyService1 },
      { propertyKey: 'myService2', serviceClass: MyService2 },
    ];
    const actualDependenciesA = Reflect.getMetadata('dependencies', MyChildServiceOrControllerA.prototype);

    deepStrictEqual(actualDependenciesA, expectedDependenciesA);

    const expectedDependenciesB = [
      { propertyKey: 'myService1', serviceClass: MyService1 },
      { propertyKey: 'myService3', serviceClass: MyService3 },
    ];
    const actualDependenciesB = Reflect.getMetadata('dependencies', MyChildServiceOrControllerB.prototype);

    deepStrictEqual(actualDependenciesB, expectedDependenciesB);
  });

});

describe('ServiceManager', () => {

  let serviceManager: ServiceManager;

  class Foobar {}

  beforeEach(() => serviceManager = new ServiceManager());

  describe('when get is called', () => {

    it('should return itself if the given serviceClass is ServiceManager.', () => {
      strictEqual(serviceManager.get(ServiceManager), serviceManager);
    });

    it('should return an instance of the given Service.', () => {
      ok(serviceManager.get(Foobar) instanceof Foobar);
    });

    it('should always return the same value for the same given Service.', () => {
      strictEqual(serviceManager.get(Foobar), serviceManager.get(Foobar));
    });

    it('should return an instance of the given Service which dependencies are instances that can be retreived'
        + ' by the same method.', () => {
      class Foobar2 {}

      class Foobar3 {
        @service
        foobar: Foobar;

        @service
        foobar2: Foobar2;
      }

      // foobar3 is "gotten" in the middle on purpose.
      const foobar = serviceManager.get(Foobar);
      const foobar3 = serviceManager.get(Foobar3);
      const foobar2 = serviceManager.get(Foobar2);

      strictEqual(foobar3.foobar, foobar);
      strictEqual(foobar3.foobar2, foobar2);
    });

    it('should support inheritance', () => {
      class Foobar2 {}

      class ParentService {
        @service
        foobar: Foobar;
      }
      class ChildService extends ParentService {}
      class ChildService2 extends ParentService {
        @service
        foobar2: Foobar2;
      }

      notStrictEqual(serviceManager.get(ChildService).foobar, undefined);
      strictEqual((serviceManager.get(ChildService) as any).foobar2, undefined);
      notStrictEqual(serviceManager.get(ChildService2).foobar, undefined);
      notStrictEqual(serviceManager.get(ChildService2).foobar2, undefined);
    });

  });

  describe('when set is called', () => {

    it('should register the given service instance.', () => {
      const service = new Foobar();
      serviceManager.set(Foobar, service);
      strictEqual(serviceManager.get(Foobar), service);
    });

  });

});
