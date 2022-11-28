// std
import { deepStrictEqual, doesNotReject, doesNotThrow, rejects, strictEqual } from 'assert';

// 3p
import {
  Config,
  ConfigNotFoundError,
  createService,
  createSession,
  SessionAlreadyExists,
  SessionState
} from '@foal/core';
import { MongoClient, MongoNotConnectedError } from 'mongodb';

// FoalTS
import { MongoDBStore } from './mongodb-store.service';

interface DatabaseSession {
  sessionID: string;
  state: SessionState;
}

describe('MongoDBStore', () => {

  const MONGODB_URI = 'mongodb://localhost:27017/db';
  const COLLECTION_NAME = 'sessions';

  let store: MongoDBStore;
  let mongoDBClient: MongoClient;

  before(() => Config.set('settings.mongodb.uri', MONGODB_URI));

  after(() => Config.remove('settings.mongodb.uri'));

  describe('has a "boot" method that', () => {

    beforeEach(() => store = createService(MongoDBStore));

    afterEach(async () => {
      await mongoDBClient.close();
      await store.close();
    });

    context('when setMongoDBClient has been previously called', () => {

      it('should NOT create a new MongoDB instance but use the one provided.', async () => {
        mongoDBClient = await MongoClient.connect(MONGODB_URI);
        try {
          await mongoDBClient.db().collection<DatabaseSession>(COLLECTION_NAME).dropIndexes();
        } catch (error: any) {
          if (!(error.message.includes('ns not found'))) {
            throw error;
          }
        }

        store.setMongoDBClient(mongoDBClient);

        doesNotThrow(
          () => mongoDBClient.db().collection(COLLECTION_NAME).findOne()
        );

        await store.boot();
        await store.close();

        await rejects(
          () => mongoDBClient.db().collection(COLLECTION_NAME).findOne(),
          new MongoNotConnectedError('Client must be connected before running operations'),
        );
      });

      it('should still create an index on the provided MongoDB instance.', async () => {
        mongoDBClient = await MongoClient.connect(MONGODB_URI);
        try {
          await mongoDBClient.db().collection<DatabaseSession>(COLLECTION_NAME).dropIndexes();
        } catch (error: any) {
          if (!(error.message.includes('ns not found'))) {
            throw error;
          }
        }

        store.setMongoDBClient(mongoDBClient);

        if ((await mongoDBClient.db().collections()).length === 0) {
          // This line is required in order to use the method "indexInformation()".
          await mongoDBClient.db().createCollection('sessions');
        }

        let indexInformation = await mongoDBClient.db().collection<DatabaseSession>(COLLECTION_NAME).indexInformation();
        strictEqual(Object.keys(indexInformation).some(key => indexInformation[key][0][0] === 'sessionID'), false);

        await store.boot();

        indexInformation = await mongoDBClient.db().collection<DatabaseSession>(COLLECTION_NAME).indexInformation();
        strictEqual(Object.keys(indexInformation).some(key => indexInformation[key][0][0] === 'sessionID'), true);
      })

    })

  });

  describe('when the service has been initialized', () => {

    let state: SessionState;
    let state2: SessionState;
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

    before(async () => {
      mongoDBClient = await MongoClient.connect(MONGODB_URI);
      try {
        await mongoDBClient.db().collection<DatabaseSession>(COLLECTION_NAME).dropIndexes();
      } catch (error: any) {
        if (!(error.message.includes('ns not found'))) {
          throw error;
        }
      }
      store = createService(MongoDBStore);
      await store.boot();
    });

    beforeEach(async () => {
      state = createState();
      state2 = {
        ...createState(),
        id: `${state.id}2`
      };
      maxInactivity = 1000;
      await mongoDBClient.db().collection<DatabaseSession>(COLLECTION_NAME).deleteMany({});
    });

    after(() => {
      return Promise.all([
        mongoDBClient.close(),
        store.close(),
      ]);
    });

    async function insertSessionIntoDB(session: DatabaseSession): Promise<DatabaseSession> {
      await mongoDBClient.db().collection<DatabaseSession>(COLLECTION_NAME).insertOne(session);
      return session;
    }

    async function readSessionsFromDB(): Promise<DatabaseSession[]> {
      return mongoDBClient.db().collection<DatabaseSession>(COLLECTION_NAME).find({}).toArray();
    }

    async function findByID(sessionID: string): Promise<DatabaseSession> {
      const session = await mongoDBClient.db().collection<DatabaseSession>(COLLECTION_NAME).findOne({ sessionID });
      if (!session) {
        throw new Error('Session not found');
      }
      return session;
    }

    it('should support sessions IDs of length 44.', async () => {
      const session = await createSession({} as any);
      const id = session.getToken();
      await insertSessionIntoDB({
        sessionID: id,
        state: {} as any,
      });
      return doesNotReject(() => findByID(id));
    });

    describe('has a "boot" method that', () => {

      it('should throw a ConfigNotFoundError if no MongoDB URI is provided.', () => {
        Config.remove('settings.mongodb.uri');

        return rejects(
          () => createService(MongoDBStore).boot(),
          new ConfigNotFoundError(
            'settings.mongodb.uri',
            'You must provide the URI of your database when using MongoDBStore.',
          )
        );
      });

    });

    describe('has a "save" method that', () => {

      context('given no session exists in the database with the given ID', () => {

        it('should save the session state in the database.', async () => {
          await store.save(state, maxInactivity);

          const actual = (await findByID(state.id)).state;
          deepStrictEqual(actual, state);
        });

      });

      context('given a session already exists in the database with the given ID', () => {

        beforeEach(async () => {
          await insertSessionIntoDB({
            sessionID: state.id,
            state,
          });
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
          await insertSessionIntoDB({
            sessionID: state.id,
            state,
          });
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

          const actual = (await findByID(state.id)).state;
          deepStrictEqual(actual, state);
        });

      });

      context('given a session already exists in the database with the given ID', () => {

        let updatedState: SessionState;

        beforeEach(async () => {
          // The state2 must be saved before the state.
          await insertSessionIntoDB({
            sessionID: state2.id,
            state: state2,
          });
          await insertSessionIntoDB({
            sessionID: state.id,
            state,
          });

          updatedState = {
            content: {
              ...state.content,
              foo2: 'bar2',
            },
            createdAt: state.createdAt + 1,
            flash: {
              ...state.flash,
              hello2: 'world2',
            },
            id: state.id,
            updatedAt: state.updatedAt + 2,
            userId: 3,
          };
        });

        it('should update the session state in the database.', async () => {
          await store.update(updatedState, maxInactivity);

          const actual = (await findByID(state.id)).state;
          deepStrictEqual(actual, updatedState);
        });

        it('should not update the other session states in the database.', async () => {
          await store.update(updatedState, maxInactivity);

          const actual = (await findByID(state2.id)).state;
          deepStrictEqual(actual, state2);
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
          // The state2 must be saved before the state.
          await insertSessionIntoDB({
            sessionID: state2.id,
            state: state2,
          });
          await insertSessionIntoDB({
            sessionID: state.id,
            state,
          });
        });

        it('should delete the session in the database.', async () => {
          await store.destroy(state.id);

          return rejects(() => findByID(state.id));
        });

        it('should delete the session in the database.', async () => {
          await store.destroy(state.id);

          return doesNotReject(() => findByID(state2.id));
        });

      });

    });

    describe('has a "clear" method that', () => {

      beforeEach(async () => {
        await insertSessionIntoDB({
          sessionID: state.id,
          state,
        });
      });

      it('should remove all sessions.', async () => {
        await store.clear();

        strictEqual((await readSessionsFromDB()).length, 0);
      });

    });

    describe('has a "cleanUpExpiredSessions" method that', () => {

      let maxLifeTime: number;

      beforeEach(async () => {
        maxInactivity = 10;
        maxLifeTime = 20;

        const now = Math.trunc(Date.now() / 1000);
        const states: SessionState[] = [
          {
            ...createState(),
            createdAt: now - 1,
            id: 'xxx',
            updatedAt: now - 1,
          },
          {
            ...createState(),
            createdAt: now,
            id: 'yyy',
            updatedAt: now - maxInactivity - 1,
          },
          {
            ...createState(),
            createdAt: now - maxLifeTime - 1,
            id: 'zzz',
            updatedAt: now,
          },
        ];

        for (const state of states) {
          await insertSessionIntoDB({
            sessionID: state.id,
            state,
          });
        }
      });

      it('should not remove unexpired sessions.', async () => {
        await store.cleanUpExpiredSessions(maxInactivity, maxLifeTime);

        return doesNotReject(() => findByID('xxx'));
      });

      it('should remove sessions expired due to inactivity.', async () => {
        await store.cleanUpExpiredSessions(maxInactivity, maxLifeTime);

        return rejects(() => findByID('yyy'));
      });

      it('should remove sessions expired due to absolute end of life.', async () => {
        await store.cleanUpExpiredSessions(maxInactivity, maxLifeTime);

        return rejects(() => findByID('zzz'));
      });

    });

  });

});
