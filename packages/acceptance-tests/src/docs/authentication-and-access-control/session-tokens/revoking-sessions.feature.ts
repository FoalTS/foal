// std
import { notStrictEqual, strictEqual } from 'assert';

// 3p
import { DataSource } from 'typeorm';

// FoalTS
import { Config, createService, createSession, Store } from '@foal/core';
import { DatabaseSession } from '@foal/typeorm';
import { createAndInitializeDataSource, getTypeORMStorePath } from '../../../common';

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
      // await dataSource.initialize();

      const store = createService(Store);
      await store.boot();

      const session = await store.readSession(token);
      if (session) {
        await session.destroy();
      }
    }

    /* ======================= DOCUMENTATION END ========================= */

    const store = createService(Store);

    dataSource = await createAndInitializeDataSource([ DatabaseSession ]);

    const session = await createSession(store);
    await session.commit();

    notStrictEqual(await store.readSession(session.getToken()), null);

    await main({ token: session.getToken() });

    strictEqual(await store.readSession(session.getToken()), null);

  });

  it('Scenario: Revoking all sessions.', async () => {

    /* ======================= DOCUMENTATION BEGIN ======================= */

    async function main() {
      // await dataSource.initialize();

      const store = createService(Store);
      await store.boot();
      await store.clear();
    }

    /* ======================= DOCUMENTATION END ========================= */

    const store = createService(Store);

    dataSource = await createAndInitializeDataSource([ DatabaseSession ]);

    const session = await createSession(store);
    await session.commit();
    const session2 = await createSession(store);
    await session2.commit();

    notStrictEqual(await store.readSession(session.getToken()), null);
    notStrictEqual(await store.readSession(session2.getToken()), null);

    await main();

    strictEqual(await store.readSession(session.getToken()), null);
    strictEqual(await store.readSession(session2.getToken()), null);

  });

});
