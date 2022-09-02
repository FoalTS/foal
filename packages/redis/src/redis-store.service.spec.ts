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
  let redisClient: ReturnType<typeof createClient>;

  before(() => Config.set('settings.redis.uri', REDIS_URI));

  after(() => Config.remove('settings.redis.uri'));

  describe('has a "boot" method that', () => {

    beforeEach(() => store = createService(RedisStore));

    afterEach(() => Promise.all([
      store.close(),
      redisClient.quit()
    ]).catch((err: any) => strictEqual(err.message, 'The client is closed')))

    context('when setRedisClient has been previously called', () => {

      it('should NOT create a new redis instance but use the one provided.', () => {
        return new Promise<void>(async resolve => {
          redisClient = createClient({ url: REDIS_URI });
          await redisClient.connect();

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
      redisClient = createClient({ url: REDIS_URI });
      await redisClient.connect();

      store = createService(RedisStore);
      await store.boot();
    });

    beforeEach(async () => {
      state = createState();
      maxInactivity = 1000;
      await redisClient.flushDb();
    });

    after(() => {
      return Promise.all([
        redisClient.quit(),
        store.close(),
      ]);
    });

    it('should support sessions IDs of length 44.', async () => {
      const session = await createSession({} as any);
      const key = getKey(session.getToken());
      await redisClient.set(key, 'bar');
      strictEqual(await redisClient.exists(key), 1);
    });

    describe('has a "save" method that', () => {

      context('given no session exists in the database with the given ID', () => {

        it('should save the session state in the database.', async () => {
          await store.save(state, maxInactivity);

          const actual = JSON.parse(await redisClient.get(getKey(state.id)) as string);
          deepStrictEqual(actual, state);
        });

        it('should set the proper key lifetime in the database.', async () => {
          await store.save(state, maxInactivity);

          const actual = await redisClient.ttl(getKey(state.id));
          deepStrictEqual(actual, maxInactivity);
        });

      });

      context('given a session already exists in the database with the given ID', () => {

        beforeEach(async () => {
          await redisClient.set(getKey(state.id), JSON.stringify(state));
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
          await redisClient.set(getKey(state.id), JSON.stringify(state));
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

          const actual = JSON.parse(await redisClient.get(getKey(state.id)) as string);
          deepStrictEqual(actual, state);
        });

        it('should set the proper key lifetime in the database.', async () => {
          await store.update(state, maxInactivity);

          const actual = await redisClient.ttl(getKey(state.id));
          deepStrictEqual(actual, maxInactivity);
        });

      });

      context('given a session already exists in the database with the given ID', () => {

        beforeEach(async () => {
          await redisClient.set(getKey(state.id), JSON.stringify(state));
        });

        it('should update the session state in the database.', async () => {
          const updatedState = {
            ...state,
            updatedAt: state.updatedAt + 1,
          };
          await store.update(updatedState, maxInactivity);

          const actual = JSON.parse(await redisClient.get(getKey(state.id)) as string);
          deepStrictEqual(actual, updatedState);
        });

        it('should set the proper key lifetime in the database.', async () => {
          strictEqual(await redisClient.ttl(getKey(state.id)), -1);

          await store.update(state, maxInactivity);

          const actual = await redisClient.ttl(getKey(state.id));
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
          await redisClient.set(getKey(state.id), JSON.stringify(state));
        });

        it('should delete the session in the database.', async () => {
          await store.destroy(state.id);

          strictEqual(await redisClient.get(getKey(state.id)), null);
        });

      });

    });

    describe('has a "clear" method that', () => {

      beforeEach(async () => {
        await redisClient.set(getKey(state.id), JSON.stringify(state));
      });

      it('should remove all sessions.', async () => {
        await store.clear();

        strictEqual(await redisClient.get(getKey(state.id)), null);
      });

    });

    describe('has a "cleanUpExpiredSessions" method that', () => {

      it('should not throw.', () => {
        return doesNotReject(() => store.cleanUpExpiredSessions());
      });

    });

  });

});
