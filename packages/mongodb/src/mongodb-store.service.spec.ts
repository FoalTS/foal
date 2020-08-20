// std
import { deepStrictEqual, doesNotReject, rejects, strictEqual } from 'assert';

// 3p
import { ConfigNotFoundError, createService, createSession, SessionAlreadyExists, SessionState } from '@foal/core';
import { MongoClient } from 'mongodb';

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
  let mongoDBClient: any;
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
      process.env.MONGODB_URI = MONGODB_URI;

      mongoDBClient = await MongoClient.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
      try {
        await mongoDBClient.db().collection(COLLECTION_NAME).dropIndexes();
      } catch (error) {
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
    await mongoDBClient.db().collection(COLLECTION_NAME).deleteMany({});
  });

  after(() => {
    delete process.env.MONGODB_URI;

    return Promise.all([
      mongoDBClient.close(),
      store.close(),
    ]);
  });

  async function insertSessionIntoDB(session: DatabaseSession): Promise<DatabaseSession> {
    await mongoDBClient.db().collection(COLLECTION_NAME).insertOne(session);
    return session;
  }

  async function readSessionsFromDB(): Promise<DatabaseSession[]> {
    return mongoDBClient.db().collection(COLLECTION_NAME).find({}).toArray();
  }

  async function findByID(sessionID: string): Promise<DatabaseSession> {
    const session = await mongoDBClient.db().collection(COLLECTION_NAME).findOne({ sessionID });
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
      delete process.env.MONGODB_URI;
      return rejects(
        () => createService(MongoDBStore).boot(),
        new ConfigNotFoundError(
          'mongodb.uri',
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
