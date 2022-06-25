// std
import { notStrictEqual, strictEqual } from 'assert';

// FoalTS
import { Config, createService, createSession, readSession, Store } from '@foal/core';
import { DatabaseSession } from '@foal/typeorm';
import { createTestDataSource, getTypeORMStorePath } from '../../../common';
import { DataSource } from 'typeorm';

describe('Feature: Revoking sessions', () => {

  let dataSource: DataSource;

  beforeEach(() => {
    Config.set('settings.session.store', getTypeORMStorePath());
  });

  afterEach(async () => {
    Config.remove('settings.session.store');
    if (dataSource) {
      await dataSource.destroy();
    }
  });

  it('Scenario: Revoking one session.', async () => {

    /* ======================= DOCUMENTATION BEGIN ======================= */

    async function main({ token }: { token: string }) {
      // await createConnection();

      const store = createService(Store);
      await store.boot();

      const session = await readSession(store, token);
      if (session) {
        await session.destroy();
      }
    }

    /* ======================= DOCUMENTATION END ========================= */

    const store = createService(Store);

    dataSource = await createTestDataSource([ DatabaseSession ]);

    const session = await createSession(store);
    await session.commit();

    notStrictEqual(await readSession(store, session.getToken()), null);

    await main({ token: session.getToken() });

    strictEqual(await readSession(store, session.getToken()), null);

  });

  it('Scenario: Revoking all sessions.', async () => {

    /* ======================= DOCUMENTATION BEGIN ======================= */

    async function main() {
      // await createConnection();

      const store = createService(Store);
      await store.boot();
      await store.clear();
    }

    /* ======================= DOCUMENTATION END ========================= */

    const store = createService(Store);

    dataSource = await createTestDataSource([ DatabaseSession ]);

    const session = await createSession(store);
    await session.commit();
    const session2 = await createSession(store);
    await session2.commit();

    notStrictEqual(await readSession(store, session.getToken()), null);
    notStrictEqual(await readSession(store, session2.getToken()), null);

    await main();

    strictEqual(await readSession(store, session.getToken()), null);
    strictEqual(await readSession(store, session2.getToken()), null);

  });

});
