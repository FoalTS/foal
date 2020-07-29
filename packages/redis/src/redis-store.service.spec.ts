// 3p
import { createService, Session, SessionStore } from '@foal/core';
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
      notStrictEqual(session.sessionID, undefined);
      deepStrictEqual(session.getContent(), { foo: 'bar' });

      strictEqual(dateBefore <= session.createdAt, true);
      strictEqual(session.createdAt <= dateAfter, true);
    });

    it('should support session options.', async () => {
      const session = await store.createAndSaveSession({ foo: 'bar' }, { csrfToken: true, userId: 2 });
      strictEqual(typeof (session.getContent() as any).csrfToken, 'string');
      strictEqual(session.userId, 2);
    });

    it('should generate an ID and create a new session in the database.', async () => {
      const inactivity = SessionStore.getExpirationTimeouts().inactivity;

      const session = await store.createAndSaveSession({ foo: 'bar' }, { userId: 3 });

      notStrictEqual(session.sessionID, undefined);
      strictEqual(await asyncTTL(`${COLLECTION_NAME}:${session.sessionID}`), inactivity);
      const data = JSON.parse(await asyncGet(`${COLLECTION_NAME}:${session.sessionID}`));
      deepStrictEqual(data, {
        content: { foo: 'bar' },
        createdAt: session.createdAt,
        userId: 3,
      });
    });

  });

  describe('has a "update" method that', () => {

    it('should update the content of the session if the session exists.', async () => {
      const createdAt = Date.now();
      const data = { content: { foo: 'bar' }, createdAt };
      await asyncSet(`${COLLECTION_NAME}:a`, JSON.stringify(data));
      strictEqual(await asyncGet(`${COLLECTION_NAME}:a`), JSON.stringify(data));

      const session = new Session({
        content: data.content,
        createdAt: data.createdAt,
        id: 'a',
        store: {} as any,
        userId: 2
      });
      session.set('foo', 'foobar');

      await store.update(session);

      const data2 = JSON.parse(await asyncGet(`${COLLECTION_NAME}:a`));
      deepStrictEqual(data2, {
        content: { foo: 'foobar' },
        createdAt,
        userId: 2,
      });
    });

    it('should update the lifetime (inactiviy) if the session exists.', async () => {
      const inactivity = SessionStore.getExpirationTimeouts().inactivity;

      const createdAt = Date.now();
      const data = { content: { foo: 'bar' }, createdAt };
      await asyncSet(`${COLLECTION_NAME}:a`, JSON.stringify(data));
      strictEqual(await asyncGet(`${COLLECTION_NAME}:a`), JSON.stringify(data));

      const session = new Session({ store: {} as any, id: 'a', content: data.content, createdAt: data.createdAt });
      session.set('foo', 'foobar');

      await store.update(session);

      strictEqual(await asyncTTL(`${COLLECTION_NAME}:a`), inactivity);
    });

    it('should create the session if it does not exist (with the proper lifetime).', async () => {
      strictEqual(await asyncGet(`${COLLECTION_NAME}:a`), null);

      const session = new Session({
        content: { foo: 'bar' },
        createdAt: Date.now(),
        id: 'a',
        store: {} as any,
        userId: 2
      });

      await store.update(session);

      const sessionA = await asyncGet(`${COLLECTION_NAME}:a`);
      notStrictEqual(sessionA, null);

      deepStrictEqual(JSON.parse(sessionA), {
        content: session.getContent(),
        createdAt: session.createdAt,
        userId: 2,
      });
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

      const sessionA = { content: {}, createdAt: Date.now() - absolute * 1000 };
      await asyncSet(`${COLLECTION_NAME}:a`, JSON.stringify(sessionA));
      // The line below fixes Travis test failures.
      await new Promise(resolve => setTimeout(resolve, 200));

      const session = await store.read('a');
      strictEqual(session, undefined);
    });

    it('should delete the session if it has expired (absolute).', async () => {
      const absolute = SessionStore.getExpirationTimeouts().absolute;

      const sessionA = { content: {}, createdAt: Date.now() - absolute * 1000 };
      await asyncSet(`${COLLECTION_NAME}:a`, JSON.stringify(sessionA));
      // The line below fixes Travis test failures.
      await new Promise(resolve => setTimeout(resolve, 200));

      await store.read('a');

      strictEqual(await asyncGet(`${COLLECTION_NAME}:a`), null);
    });

    it('should return the session.', async () => {
      const createdAt = Date.now();
      const sessionA = { content: {}, createdAt };
      await asyncSet(`${COLLECTION_NAME}:a`, JSON.stringify(sessionA));
      const sessionB = { content: { foo: 'bar' }, createdAt, userId: 3 };
      await asyncSet(`${COLLECTION_NAME}:b`, JSON.stringify(sessionB));

      const session = await store.read('b');
      if (!session) {
        throw new Error('RedisStore.read should not return undefined.');
      }
      strictEqual(session.store, store);
      strictEqual(session.sessionID, 'b');
      strictEqual(session.get('foo'), 'bar');
      strictEqual(session.createdAt, createdAt);
      strictEqual(session.userId, 3);
    });

  });

  describe('has a "extendLifeTime" method that', () => {

    it('should extend the lifetime of session (inactivity).', async () => {
      const inactivity = SessionStore.getExpirationTimeouts().inactivity;

      await asyncSet(`${COLLECTION_NAME}:aaa`, '{}');
      await asyncExpire(`${COLLECTION_NAME}:aaa`, 5);
      strictEqual(await asyncTTL(`${COLLECTION_NAME}:aaa`), 5);

      await store.extendLifeTime('aaa');

      strictEqual(await asyncTTL(`${COLLECTION_NAME}:aaa`), inactivity);
    });

    it('should not throw if no session matches the given session ID.', async () => {
      await store.extendLifeTime('c');

      strictEqual(await asyncTTL(`${COLLECTION_NAME}:c`), -2);
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
