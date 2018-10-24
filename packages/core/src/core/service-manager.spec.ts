// std
import { deepStrictEqual, notStrictEqual, ok, strictEqual } from 'assert';

// FoalTS
import { createService, dependency, ServiceManager } from './service-manager';

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

  describe('when dependencies is a ServiceManager', () => {

    it('should create the service with all its dependencies from the ServiceManager.', () => {
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

      const services = new ServiceManager();
      services.set(MyService1, myService1);
      services.set(MyService2, myService2);

      const service = createService(MyService3, services);

      strictEqual(service.myService1, myService1);
      strictEqual(service.myService2, myService2);
    });

  });

  describe('when dependencies is a mere object', () => {

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

  });

  describe('when set is called', () => {

    it('should register the given service instance.', () => {
      const service = new Foobar();
      serviceManager.set(Foobar, service);
      strictEqual(serviceManager.get(Foobar), service);
    });

  });

});
