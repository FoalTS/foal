// std
import { notStrictEqual, strictEqual } from 'assert';

// 3p
import { DataSource } from 'typeorm';

// FoalTS
import { Config, createSession, readSession, ServiceManager, Store } from '@foal/core';
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

    async function main({ token }: { token: string }, services: ServiceManager) {
      // await dataSource.initialize();

      const store = services.get(Store);
      await store.boot();

      const session = await readSession(store, token);
      if (session) {
        await session.destroy();
      }
    }

    /* ======================= DOCUMENTATION END ========================= */

    const services = new ServiceManager();
    const store = services.get(Store);

    dataSource = await createAndInitializeDataSource([ DatabaseSession ]);

    const session = await createSession(store);
    await session.commit();

    notStrictEqual(await readSession(store, session.getToken()), null);

    await main({ token: session.getToken() }, services);

    strictEqual(await readSession(store, session.getToken()), null);

  });

  it('Scenario: Revoking all sessions.', async () => {

    /* ======================= DOCUMENTATION BEGIN ======================= */

    async function main(args: any, services: ServiceManager) {
      // await dataSource.initialize();

      const store = services.get(Store);
      await store.boot();
      await store.clear();
    }

    /* ======================= DOCUMENTATION END ========================= */

    const services = new ServiceManager();
    const store = services.get(Store);

    dataSource = await createAndInitializeDataSource([ DatabaseSession ]);

    const session = await createSession(store);
    await session.commit();
    const session2 = await createSession(store);
    await session2.commit();

    notStrictEqual(await readSession(store, session.getToken()), null);
    notStrictEqual(await readSession(store, session2.getToken()), null);

    await main(undefined, services);

    strictEqual(await readSession(store, session.getToken()), null);
    strictEqual(await readSession(store, session2.getToken()), null);

  });

});
