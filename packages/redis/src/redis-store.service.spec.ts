// 3p
import { createService, Session, SessionState, SessionStore } from '@foal/core';
import { createClient } from 'redis';

// FoalTS
import { deepStrictEqual, notStrictEqual, strictEqual } from 'assert';
import { RedisStore } from './redis-store.service';

describe('RedisStore', () => {

  let store: RedisStore;
  const REDIS_URI = 'redis://localhost:6379';
  const COLLECTION_NAME =  'sessions';
  let redisClient: any;

  before(async () => {
    process.env.REDIS_URI = REDIS_URI;

    redisClient = createClient(REDIS_URI);
    store = createService(RedisStore);
    await store.boot();
  });

  beforeEach(async () => {
    await new Promise((resolve, reject) => {
      redisClient.flushdb((err: any, success: any) => {
        if (err) {
          return reject(err);
        }
        resolve(success);
      });
    });
  });

  after(() => {
    delete process.env.REDIS_URI;

    return Promise.all([
      redisClient.end(true),
      store.getRedisInstance().end(true)
    ]);
  });

  function asyncSet(key: string, value: string) {
    return new Promise((resolve, reject) => {
      redisClient.set(key, value, (err: any, success: any) => {
        if (err) {
          return reject(err);
        }
        resolve(success);
      });
    });
  }

  function asyncExpire(key: string, value: number) {
    return new Promise((resolve, reject) => {
      redisClient.expire(key, value, (err: any, success: any) => {
        if (err) {
          return reject(err);
        }
        resolve(success);
      });
    });
  }

  function asyncGet(key: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      redisClient.get(key, (err: any, val: string) => {
        if (err) {
          return reject(err);
        }
        resolve(val);
      });
    });
  }

  function asyncTTL(key: string): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      redisClient.ttl(key, (err: any, val: number) => {
        if (err) {
          return reject(err);
        }
        resolve(val);
      });
    });
  }

  describe('has a "createAndSaveSession" method that', () => {

    it('should return a representation (Session object) of the created session.', async () => {
      const dateBefore = Date.now();
      const session = await store.createAndSaveSession({ foo: 'bar' });
      const dateAfter = Date.now();

      strictEqual(session.store, store);
      notStrictEqual(session.getState().id, undefined);
      deepStrictEqual(session.getState().content, { foo: 'bar' });

      strictEqual(dateBefore <= session.getState().createdAt, true);
      strictEqual(session.getState().createdAt <= dateAfter, true);

      strictEqual(session.getState().updatedAt, session.getState().createdAt);
    });

    it('should support session options.', async () => {
      const session = await store.createAndSaveSession({ foo: 'bar' }, { csrfToken: true, userId: 2 });
      strictEqual(typeof (session.getState().content as any).csrfToken, 'string');
      strictEqual(session.getState().userId, 2);
    });

    it('should generate an ID and create a new session in the database.', async () => {
      const inactivity = SessionStore.getExpirationTimeouts().inactivity;

      const session = await store.createAndSaveSession({ foo: 'bar' }, { userId: 3 });

      notStrictEqual(session.getState().id, undefined);
      strictEqual(await asyncTTL(`${COLLECTION_NAME}:${session.getState().id}`), inactivity);
      const data = JSON.parse(await asyncGet(`${COLLECTION_NAME}:${session.getState().id}`));
      deepStrictEqual(data, {
        content: { foo: 'bar' },
        createdAt: session.getState().createdAt,
        flash: {},
        updatedAt: session.getState().updatedAt,
        userId: 3,
      });
    });

  });

  describe('has a "update" method that', () => {

    it('should update the content of the session if the session exists.', async () => {
      const createdAt = Date.now();
      const updatedAt = Date.now() + 1;
      const data: SessionState = {
        content: { foo: 'bar' },
        createdAt,
        flash: { bar: 'foo' },
        id: 'a',
        updatedAt,
      };
      await asyncSet(`${COLLECTION_NAME}:a`, JSON.stringify(data));
      strictEqual(await asyncGet(`${COLLECTION_NAME}:a`), JSON.stringify(data));

      const session = new Session({} as any, {
        content: data.content,
        createdAt: data.createdAt,
        flash: data.flash,
        id: 'a',
        updatedAt: data.updatedAt,
        userId: 2
      });
      session.set('foo', 'foobar');
      session.set('bar', 'foo2', { flash: true });

      await store.update(session.getState());

      const data2 = JSON.parse(await asyncGet(`${COLLECTION_NAME}:a`));
      deepStrictEqual(data2, {
        content: { foo: 'foobar' },
        createdAt,
        flash: { bar: 'foo2' },
        updatedAt: data.updatedAt,
        userId: 2,
      });
    });

    it('should update the lifetime (inactiviy) if the session exists.', async () => {
      const inactivity = SessionStore.getExpirationTimeouts().inactivity;

      const createdAt = Date.now();
      const updatedAt = Date.now() + 1;
      const data: SessionState = {
        content: { foo: 'bar' },
        createdAt,
        flash: { bar: 'foo' },
        id: 'a',
        updatedAt,
      };
      await asyncSet(`${COLLECTION_NAME}:a`, JSON.stringify(data));
      strictEqual(await asyncGet(`${COLLECTION_NAME}:a`), JSON.stringify(data));

      const session = new Session({} as any, {
        content: data.content,
        createdAt: data.createdAt,
        flash: data.flash,
        id: 'a',
        updatedAt: data.updatedAt,
        userId: 2
      });
      session.set('foo', 'foobar');

      await store.update(session.getState());

      strictEqual(await asyncTTL(`${COLLECTION_NAME}:a`), inactivity);
    });

  });

  describe('has a "destroy" method that', () => {

    it('should delete the session from its ID.', async () => {
      await asyncSet(`${COLLECTION_NAME}:a`, '{}');
      strictEqual(await asyncGet(`${COLLECTION_NAME}:a`), '{}');

      await store.destroy('a');

      strictEqual(await asyncGet(`${COLLECTION_NAME}:a`), null);
    });

    it('should not throw if no session matches the given session ID.', async () => {
      await store.destroy('c');
    });

  });

  describe('has a "read" method that', () => {

    it('should return undefined if no session matches the ID.', async () => {
      strictEqual(await store.read('c'), undefined);
    });

    it('should return undefined if the session has expired (inactivity).', async () => {
      await asyncSet(`${COLLECTION_NAME}:aaa`, '{}');
      await asyncExpire(`${COLLECTION_NAME}:aaa`, 0);
      strictEqual(await store.read('aaa'), undefined);
    });

    it('should return undefined if the session has expired (absolute).', async () => {
      const absolute = SessionStore.getExpirationTimeouts().absolute;

      const sessionA = { content: {}, createdAt: Date.now() - absolute * 1000, flash: {} };
      await asyncSet(`${COLLECTION_NAME}:a`, JSON.stringify(sessionA));
      // The line below fixes Travis test failures.
      await new Promise(resolve => setTimeout(resolve, 200));

      const session = await store.read('a');
      strictEqual(session, undefined);
    });

    it('should delete the session if it has expired (absolute).', async () => {
      const absolute = SessionStore.getExpirationTimeouts().absolute;

      const sessionA = { content: {}, createdAt: Date.now() - absolute * 1000, flash: {} };
      await asyncSet(`${COLLECTION_NAME}:a`, JSON.stringify(sessionA));
      // The line below fixes Travis test failures.
      await new Promise(resolve => setTimeout(resolve, 200));

      await store.read('a');

      strictEqual(await asyncGet(`${COLLECTION_NAME}:a`), null);
    });

    it('should return the session.', async () => {
      const createdAt = Date.now();
      const updatedAt = Date.now() + 1;
      const sessionA: SessionState = {
        content: {},
        createdAt,
        flash: {},
        id: 'a',
        updatedAt
      };
      await asyncSet(`${COLLECTION_NAME}:a`, JSON.stringify(sessionA));
      const sessionB: SessionState = {
        content: { foo: 'bar' },
        createdAt,
        id: 'b',
        flash: { hello: 'world' },
        updatedAt,
        userId: 3,
      };
      await asyncSet(`${COLLECTION_NAME}:b`, JSON.stringify(sessionB));

      const state = await store.read('b');
      if (!state) {
        throw new Error('RedisStore.read should not return undefined.');
      }

      strictEqual(state.id, 'b');
      deepStrictEqual(state.flash.hello, 'world');
      strictEqual(state.content.foo, 'bar');
      strictEqual(state.createdAt, createdAt);
      strictEqual(state.updatedAt, updatedAt);
      strictEqual(state.userId, 3);
    });

  });

  describe('has a "clear" method that', () => {

    it('should remove all sessions.', async () => {
      await asyncSet(`${COLLECTION_NAME}:aaa`, '{}');
      const sessionA = await asyncGet(`${COLLECTION_NAME}:aaa`);
      strictEqual(sessionA, '{}');

      await store.clear();

      strictEqual(await asyncGet(`${COLLECTION_NAME}:aaa`), null);
    });

  });

  describe('has a "cleanUpExpiredSessions" method that', () => {

    it('should do nothing.', async () => {
      await store.cleanUpExpiredSessions();
    });

  });

});
