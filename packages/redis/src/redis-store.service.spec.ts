// 3p
import { ConfigMock, createService, Session, SessionStore } from '@foal/core';
import { createClient } from 'redis';

// FoalTS
import { deepStrictEqual, notStrictEqual, strictEqual } from 'assert';
import { RedisStore } from './redis-store.service';

describe('RedisStore', () => {

  let store: RedisStore;
  const REDIS_URL = 'redis://localhost:6379';
  const config = new ConfigMock();
  let redisClient;

  before(() => {
    redisClient = createClient(REDIS_URL);
    store = createService(RedisStore);
  });

  beforeEach(async () => {
    config.reset();
    config.set('redis.url', REDIS_URL);
    await new Promise((resolve, reject) => {
      redisClient.flushdb((err, success) => {
        if (err) {
          return reject(err);
        }
        resolve(success);
      });
    });
  });

  after(() => Promise.all([
    redisClient.end(true),
    store.getRedisInstance().end(true)
  ]));

  function asyncSet(key: string, value: string) {
    return new Promise((resolve, reject) => {
      redisClient.set(key, value, (err, success) => {
        if (err) {
          return reject(err);
        }
        resolve(success);
      });
    });
  }

  function asyncExpire(key: string, value: number) {
    return new Promise((resolve, reject) => {
      redisClient.expire(key, value, (err, success) => {
        if (err) {
          return reject(err);
        }
        resolve(success);
      });
    });
  }

  function asyncGet(key: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      redisClient.get(key, (err, val) => {
        if (err) {
          return reject(err);
        }
        resolve(val);
      });
    });
  }

  function asyncTTL(key: string): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      redisClient.ttl(key, (err, val) => {
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

      notStrictEqual(session.sessionID, undefined);
      deepStrictEqual(session.getContent(), { foo: 'bar' });

      strictEqual(dateBefore <= session.createdAt, true);
      strictEqual(session.createdAt <= dateAfter, true);
    });

    it('should generate an ID and create a new session in the database.', async () => {
      const inactivity = SessionStore.getExpirationTimeouts().inactivity;

      const session = await store.createAndSaveSession({ foo: 'bar' });

      notStrictEqual(session.sessionID, undefined);
      strictEqual(await asyncTTL(`session:${session.sessionID}`), inactivity);
      const data = JSON.parse(await asyncGet(`session:${session.sessionID}`));
      deepStrictEqual(data, {
        content: { foo: 'bar' },
        createdAt: session.createdAt
      });
    });

  });

  describe('has a "update" method that', () => {

    it('should update the content of the session if the session exists.', async () => {
      const createdAt = Date.now();
      const data = { content: { foo: 'bar' }, createdAt };
      await asyncSet('session:a', JSON.stringify(data));
      strictEqual(await asyncGet('session:a'), JSON.stringify(data));

      const session = new Session('a', data.content, data.createdAt);
      session.set('foo', 'foobar');

      await store.update(session);

      const data2 = JSON.parse(await asyncGet('session:a'));
      deepStrictEqual(data2, {
        content: { foo: 'foobar' },
        createdAt
      });
    });

    it('should update the lifetime (inactiviy) if the session exists.', async () => {
      const inactivity = SessionStore.getExpirationTimeouts().inactivity;

      const createdAt = Date.now();
      const data = { content: { foo: 'bar' }, createdAt };
      await asyncSet('session:a', JSON.stringify(data));
      strictEqual(await asyncGet('session:a'), JSON.stringify(data));

      const session = new Session('a', data.content, data.createdAt);
      session.set('foo', 'foobar');

      await store.update(session);

      strictEqual(await asyncTTL('session:a'), inactivity);
    });

    it('should create the session if it does not exist (with the proper lifetime).', async () => {
      strictEqual(await asyncGet('session:a'), null);

      const session = new Session('a', { foo: 'bar' }, Date.now());

      await store.update(session);

      const sessionA = await asyncGet('session:a');
      notStrictEqual(sessionA, null);

      deepStrictEqual(JSON.parse(sessionA), {
        content: session.getContent(),
        createdAt: session.createdAt
      });
    });

  });

  describe('has a "destroy" method that', () => {

    it('should delete the session from its ID.', async () => {
      await asyncSet('session:a', '{}');
      strictEqual(await asyncGet('session:a'), '{}');

      await store.destroy('a');

      strictEqual(await asyncGet('session:a'), null);
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
      await asyncSet('session:aaa', '{}');
      await asyncExpire('session:aaa', 0);
      strictEqual(await store.read('aaa'), undefined);
    });

    it('should return undefined if the session has expired (absolute).', async () => {
      const absolute = SessionStore.getExpirationTimeouts().absolute;

      const sessionA = { content: {}, createdAt: Date.now() - absolute * 1000 };
      await asyncSet('session:a', JSON.stringify(sessionA));

      const session = await store.read('a');
      strictEqual(session, undefined);
    });

    it('should delete the session if it has expired (absolute).', async () => {
      const absolute = SessionStore.getExpirationTimeouts().absolute;

      const sessionA = { content: {}, createdAt: Date.now() - absolute * 1000 };
      await asyncSet('session:a', JSON.stringify(sessionA));

      await store.read('a');

      strictEqual(await asyncGet('session:a'), null);
    });

    it('should return the session.', async () => {
      const createdAt = Date.now();
      const sessionA = { content: {}, createdAt };
      await asyncSet('session:a', JSON.stringify(sessionA));
      const sessionB = { content: { foo: 'bar' }, createdAt };
      await asyncSet('session:b', JSON.stringify(sessionB));

      const session = await store.read('b');
      if (!session) {
        throw new Error('RedisStore.read should not return undefined.');
      }
      strictEqual(session.sessionID, 'b');
      strictEqual(session.get('foo'), 'bar');
      strictEqual(session.createdAt, createdAt);
    });

  });

  describe('has a "extendLifeTime" method that', () => {

    it('should extend the lifetime of session (inactivity).', async () => {
      const inactivity = SessionStore.getExpirationTimeouts().inactivity;

      await asyncSet('session:aaa', '{}');
      await asyncExpire('session:aaa', 5);
      strictEqual(await asyncTTL('session:aaa'), 5);

      await store.extendLifeTime('aaa');

      strictEqual(await asyncTTL('session:aaa'), inactivity);
    });

    it('should not throw if no session matches the given session ID.', async () => {
      await store.extendLifeTime('c');

      strictEqual(await asyncTTL('session:c'), -2);
    });

  });

  describe('has a "clear" method that', () => {

    it('should remove all sessions.', async () => {
      await asyncSet('session:aaa', '{}');
      const sessionA = await asyncGet('session:aaa');
      strictEqual(sessionA, '{}');

      await store.clear();

      strictEqual(await asyncGet('session:aaa'), null);
    });

  });

  describe('has a "cleanUpExpiredSessions" method that', () => {

    it('should do nothing.', async () => {
      await store.cleanUpExpiredSessions();
    });

  });

});
