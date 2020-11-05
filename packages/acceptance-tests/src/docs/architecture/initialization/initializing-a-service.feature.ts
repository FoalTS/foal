// std
import { strictEqual } from 'assert';

// FoalTS
import { createApp, dependency, ServiceManager } from '@foal/core';

describe('Feature: Initializing a service', () => {

  it('Example: A simple service.', async () => {
    let called = false;

    function doSomething() {
      called = true;
    }

    /* ======================= DOCUMENTATION BEGIN ======================= */

    class ServiceA {

      async boot() {
        await doSomething();
      }

    }

    /* ======================= DOCUMENTATION END ========================= */

    class AppController {
      @dependency
      serviceA: ServiceA;
    }

    strictEqual(called, false);
    await createApp(AppController);
    strictEqual(called, true);
  });

  it('Example: A service manually injected.', async () => {
    let called = false;

    class ServiceA {

      boot() {
        called = true;
      }

    }

    const myServiceInstance = new ServiceA();

    /* ======================= DOCUMENTATION BEGIN ======================= */

    const serviceManager = new ServiceManager();
    serviceManager.set(ServiceA, myServiceInstance, { boot: true });

    /* ======================= DOCUMENTATION END ========================= */

    class AppController {
      @dependency
      serviceA: ServiceA;
    }

    const serviceManager2 = new ServiceManager();
    // "boot" option not provided.
    serviceManager2.set(ServiceA, myServiceInstance);

    strictEqual(called, false);
    await createApp(AppController, { serviceManager: serviceManager2 });
    strictEqual(called, false);

    strictEqual(called, false);
    await createApp(AppController, { serviceManager });
    strictEqual(called, true);
  });

});
