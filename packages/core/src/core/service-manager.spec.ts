// std
import { doesNotThrow, ok, strictEqual } from 'assert';

// FoalTS
import { Service, ServiceManager } from './service-manager';

describe('ServiceManager', () => {

  let serviceManager: ServiceManager;

  @Service()
  class Foobar {}

  beforeEach(() => serviceManager = new ServiceManager());

  describe('when get is called', () => {

    it('should return itself if the given serviceClass is ServiceManager.', () => {
      strictEqual(serviceManager.get(ServiceManager), serviceManager);
    });

    it('should not throw an exception if the given class does not have the Service decorator '
        + 'and/or has no constructor.', () => {
      class Foo {}

      @Service()
      class Bar {}

      class Barfoo {
        constructor() {}
      }

      doesNotThrow(() => serviceManager.get(Foo));
      doesNotThrow(() => serviceManager.get(Bar));
      doesNotThrow(() => serviceManager.get(Barfoo));
    });

    it('should return an instance of the given Service.', () => {
      ok(serviceManager.get(Foobar) instanceof Foobar);
    });

    it('should always return the same value for the same given Service.', () => {
      strictEqual(serviceManager.get(Foobar), serviceManager.get(Foobar));
    });

    it('should return an instance of the given Service which dependencies are instances that can be retreived'
        + ' by the same method.', () => {
      @Service()
      class Foobar2 {
        constructor() {}
      }

      @Service()
      class Foobar3 {
        constructor(public foobar: Foobar, public foobar2: Foobar2) {}
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
