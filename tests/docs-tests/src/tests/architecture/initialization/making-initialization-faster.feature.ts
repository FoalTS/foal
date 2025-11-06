// std
import { strictEqual } from 'assert';

// FoalTS
import { createApp } from '@foal/core';

describe('Feature: Making initialization faster', () => {

  it('Example: A simple call to a service.', async () => {
    let createConnectionCalled = false;
    let createAnotherConnectionCalled = false;

    function createConnection() {
      createConnectionCalled = true;
    }

    function createAnotherConnection() {
      createAnotherConnectionCalled = true;
    }

    /* ======================= DOCUMENTATION BEGIN ======================= */

    class AppController {

      async init() {
        // Don't do
        await createConnection();
        await createAnotherConnection();

        // Do
        await Promise.all([
          createConnection(),
          createAnotherConnection()
        ]);
      }

    }

    /* ======================= DOCUMENTATION END ========================= */

    strictEqual(createConnectionCalled, false);
    strictEqual(createAnotherConnectionCalled, false);

    await createApp(AppController);

    strictEqual(createConnectionCalled, true);
    strictEqual(createAnotherConnectionCalled, true);
  });

});
