// 3p
import { Config, createService, createSession, SessionAlreadyExists, SessionState } from '@foal/core';
import { createClient } from 'redis';

// FoalTS
import { deepStrictEqual, doesNotReject, rejects, strictEqual } from 'assert';
import { RedisStore } from './redis-store.service';

describe('RedisStore', () => {

  const REDIS_URI = 'redis://localhost:6380';
  const COLLECTION_NAME =  'sessions';

  let store: RedisStore;
  let redisClient: any;

  before(() => Config.set('settings.redis.uri', REDIS_URI));

  after(() => Config.remove('settings.redis.uri'));

  describe('has a "boot" method that', () => {

    beforeEach(() => store = createService(RedisStore));

    afterEach(() => Promise.all([
      store.close(),
      redisClient.quit()
    ]))

    context('when setRedisClient has been previously called', () => {

      it('should NOT create a new redis instance but use the one provided.', () => {
        return new Promise<void>(async resolve => {
          redisClient = createClient(REDIS_URI)
          redisClient.on('end', resolve);

          store.setRedisClient(redisClient);

          await store.boot();
          await store.close();
        });
      })

    })

  });

  describe('when the service has been initialized', () => {

    let state: SessionState;
    let maxInactivity: number;

    function createState(): SessionState {
      return {
        content: {
          foo: 'bar'
        },
        createdAt: 0,
        flash: {
          hello: 'world'
        },
        id: 'xxx',
        updatedAt: 0,
        userId: null,
      };
    }

    function getKey(id: string): string {
      return `${COLLECTION_NAME}:${id}`;
    }

    before(async () => {
      redisClient = createClient(REDIS_URI);
      store = createService(RedisStore);
      await store.boot();
    });

    beforeEach(done => {
      state = createState();
      maxInactivity = 1000;
      redisClient.flushdb(done);
    });

    after(() => {
      return Promise.all([
        redisClient.quit(),
        store.close(),
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

    function asyncExists(key: string): Promise<number> {
      return new Promise<number>((resolve, reject) => {
        redisClient.exists(key, (err: any, val: number) => {
          if (err) {
            return reject(err);
          }
          resolve(val);
        });
      });
    }

    it('should support sessions IDs of length 44.', async () => {
      const session = await createSession({} as any);
      const key = getKey(session.getToken());
      await asyncSet(key, 'bar');
      strictEqual(await asyncExists(key), 1);
    });

    describe('has a "save" method that', () => {

      context('given no session exists in the database with the given ID', () => {

        it('should save the session state in the database.', async () => {
          await store.save(state, maxInactivity);

          const actual = JSON.parse(await asyncGet(getKey(state.id)));
          deepStrictEqual(actual, state);
        });

        it('should set the proper key lifetime in the database.', async () => {
          await store.save(state, maxInactivity);

          const actual = await asyncTTL(getKey(state.id));
          deepStrictEqual(actual, maxInactivity);
        });

      });

      context('given a session already exists in the database with the given ID', () => {

        beforeEach(async () => {
          await asyncSet(getKey(state.id), JSON.stringify(state));
        });

        it('should throw a SessionAlreadyExists error.', async () => {
          return rejects(
            () => store.save(state, maxInactivity),
            new SessionAlreadyExists()
          );
        });

      });

    });

    describe('has a "read" method that', () => {

      context('given no session exists in the database with the given ID', () => {

        it('should return null.', async () => {
          strictEqual(await store.read('c'), null);
        });

      });

      context('given a session exists in the database with the given ID', () => {

        beforeEach(async () => {
          await asyncSet(getKey(state.id), JSON.stringify(state));
        });

        it('should return the session state.', async () => {
          const expected = createState();
          const actual = await store.read(state.id);

          deepStrictEqual(actual, expected);
        });

      });

    });

    describe('has a "update" method that', () => {

      context('given no session exists in the database with the given ID', () => {

        it('should save the session state in the database.', async () => {
          await store.update(state, maxInactivity);

          const actual = JSON.parse(await asyncGet(getKey(state.id)));
          deepStrictEqual(actual, state);
        });

        it('should set the proper key lifetime in the database.', async () => {
          await store.update(state, maxInactivity);

          const actual = await asyncTTL(getKey(state.id));
          deepStrictEqual(actual, maxInactivity);
        });

      });

      context('given a session already exists in the database with the given ID', () => {

        beforeEach(async () => {
          await asyncSet(getKey(state.id), JSON.stringify(state));
        });

        it('should update the session state in the database.', async () => {
          const updatedState = {
            ...state,
            updatedAt: state.updatedAt + 1,
          };
          await store.update(updatedState, maxInactivity);

          const actual = JSON.parse(await asyncGet(getKey(state.id)));
          deepStrictEqual(actual, updatedState);
        });

        it('should set the proper key lifetime in the database.', async () => {
          strictEqual(await asyncTTL(getKey(state.id)), -1);

          await store.update(state, maxInactivity);

          const actual = await asyncTTL(getKey(state.id));
          deepStrictEqual(actual, maxInactivity);
        });

      });

    });

    describe('has a "destroy" method that', () => {

      context('given no session exists in the database with the given ID', () => {

        it('should not throw an error.', () => {
          return doesNotReject(() => store.destroy('c'));
        });

      });

      context('given a session already exists in the database with the given ID', () => {

        beforeEach(async () => {
          await asyncSet(getKey(state.id), JSON.stringify(state));
        });

        it('should delete the session in the database.', async () => {
          await store.destroy(state.id);

          strictEqual(await asyncGet(getKey(state.id)), null);
        });

      });

    });

    describe('has a "clear" method that', () => {

      beforeEach(async () => {
        await asyncSet(getKey(state.id), JSON.stringify(state));
      });

      it('should remove all sessions.', async () => {
        await store.clear();

        strictEqual(await asyncGet(getKey(state.id)), null);
      });

    });

    describe('has a "cleanUpExpiredSessions" method that', () => {

      it('should not throw.', () => {
        return doesNotReject(() => store.cleanUpExpiredSessions());
      });

    });

  });

});
