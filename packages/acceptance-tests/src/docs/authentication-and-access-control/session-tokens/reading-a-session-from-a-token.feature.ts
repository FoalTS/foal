// std
import { rejects, strictEqual } from 'assert';

// 3p
import { DataSource } from '@foal/typeorm/node_modules/typeorm';

// FoalTS
import {
  Config,
  createSession,
  readSession,
  ServiceManager,
} from '@foal/core';
import { DatabaseSession, TypeORMStore } from '@foal/typeorm';
import { createTestDataSource, getTypeORMStorePath } from '../../../common';

describe('Feature: Reading a session from a token', () => {

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

  it('Example: Simple example.', async () => {
    dataSource = await createTestDataSource([ DatabaseSession ]);
    await dataSource.initialize()

    const serviceManager = new ServiceManager();

    const store = serviceManager.get(TypeORMStore);
    store.setDataSource(dataSource);

    async function getFoo(token: string): Promise<any> {
      /* ======================= DOCUMENTATION BEGIN ======================= */

      const session = await readSession(store, token);
      if (!session) {
        throw new Error('Session does not exist or has expired.');
      }
      const foo = session.get('foo');

      /* ======================= DOCUMENTATION END ========================= */

      return foo;
    }

    const session = await createSession(store);
    session.set('foo', 'bar');
    await session.commit();

    rejects(() => getFoo('xxx'));

    strictEqual(await getFoo(session.getToken()), 'bar');
  });

});
