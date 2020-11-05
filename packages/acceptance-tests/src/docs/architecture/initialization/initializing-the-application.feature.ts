// std
import { strictEqual } from 'assert';

// FoalTS
import { createApp, dependency } from '@foal/core';

describe('Feature: Initializing the application', () => {

  it('Example: A simple call to a service.', async () => {
    let called = false;

    class ServiceA {
      doSomething() {
        called = true;
      }
    }

    /* ======================= DOCUMENTATION BEGIN ======================= */

    class AppController {

      @dependency
      serviceA: ServiceA;

      async init() {
        await this.serviceA.doSomething();
      }

    }

    /* ======================= DOCUMENTATION END ========================= */

    strictEqual(called, false);
    await createApp(AppController);
    strictEqual(called, true);
  });

});
