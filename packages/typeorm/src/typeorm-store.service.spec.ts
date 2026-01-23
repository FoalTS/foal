// std
import { deepStrictEqual, doesNotReject, rejects, strictEqual } from 'assert';

// 3p
import { DataSource } from 'typeorm';

// FoalTS
import { createService, createSession, SessionAlreadyExists, SessionState } from '@foal/core';
import { DatabaseSession, TypeORMStore } from './typeorm-store.service';

type DBType = 'mysql'|'postgres'|'sqlite';

function createTestDataSource(type: DBType, name?: string): DataSource {
  switch (type) {
    case 'mysql':
      return new DataSource({
        database: 'test',
        dropSchema: true,
        entities: [ DatabaseSession ],
        password: 'test',
        port: type === 'mysql' ? 3308 : 3307,
        synchronize: true,
        type,
        username: 'test',
        name,
      });
    case 'postgres':
      return new DataSource({
        database: 'test',
        dropSchema: true,
        entities: [ DatabaseSession ],
        password: 'test',
        synchronize: true,
        type,
        username: 'test',
        name,
      });
    case 'sqlite':
      return new DataSource({
        database: 'test_db.sqlite',
        dropSchema: true,
        entities: [ DatabaseSession ],
        synchronize: true,
        type,
        name,
      });
    default:
      throw new Error('Invalid database type.');
  }
}

function entityTestSuite(type: DBType) {

  describe(`with ${type}`, () => {
    const longNumber = 2147483647;

    let dataSource: DataSource;

    before(async () => {
      dataSource = createTestDataSource(type);
      await dataSource.initialize();
    });

    beforeEach(async () => {
      await dataSource.getRepository(DatabaseSession).clear();
    });

    after(async () => {
      if (dataSource) {
        await dataSource.destroy();
      }
    });

    it('should be associated to table named "sessions".', () => {
      strictEqual(dataSource.getRepository(DatabaseSession).metadata.tableName, 'sessions');
    });

    it('should have an id which is unique.', async () => {
      const session1 = dataSource.getRepository(DatabaseSession).create({
        content: '',
        created_at: 0,
        flash: '',
        id: 'a',
        updated_at: 0,
        user_id: undefined,
        user_id_str: undefined,
      });
      await dataSource.getRepository(DatabaseSession).save(session1);

      await rejects(
        () => dataSource.getRepository(DatabaseSession)
          .createQueryBuilder()
          .insert()
          .values({
            content: '',
            created_at: 0,
            flash: '',
            id: 'a',
            updated_at: 0,
          })
          .execute()
      );
    });

    it('should support sessions IDs of length 44.', async () => {
      const session = await createSession({} as any);
      const id = session.getToken();

      const dbSession = dataSource.getRepository(DatabaseSession).create({
        content: '',
        created_at: 0,
        flash: '',
        id,
        updated_at: 0,
        user_id: undefined,
        user_id_str: undefined,
      });
      await dataSource.getRepository(DatabaseSession).save(dbSession);

      return doesNotReject(() => dataSource.getRepository(DatabaseSession).findOneByOrFail({ id }));
    });

    it('should have a "user_id_str" column which supports strings of length 64.', async () => {
      const userIdStr = 'a'.repeat(64);
      const session1 = dataSource.getRepository(DatabaseSession).create({
        content: '',
        created_at: 0,
        flash: '',
        id: 'a',
        updated_at: 0,
        user_id_str: userIdStr,
      });

      await dataSource.getRepository(DatabaseSession).save(session1);

      const savedSession = await dataSource.getRepository(DatabaseSession).findOneByOrFail({ id: 'a' });
      strictEqual(savedSession.user_id_str, userIdStr);
    });

    it('should have a "content" column which supports long strings.', async () => {
      const session1 = dataSource.getRepository(DatabaseSession).create({
        content: JSON.stringify({
          hello: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
            + 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
            + 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
            + 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
            + 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
        }),
        created_at: 0,
        flash: '',
        id: 'a',
        updated_at: 0,
      });
      await dataSource.getRepository(DatabaseSession).save(session1);
    });

    it('should have a "flash" column which supports long strings.', async () => {
      const session1 = dataSource.getRepository(DatabaseSession).create({
        content: '',
        created_at: 0,
        flash:  JSON.stringify({
          hello: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
            + 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
            + 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
            + 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
            + 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
        }),
        id: 'a',
        updated_at: 0,
      });
      await dataSource.getRepository(DatabaseSession).save(session1);
    });

    it('should have an "updated_at" column which supports numbers of 4-bytes', async () => {
      const session1 = dataSource.getRepository(DatabaseSession).create({
        content: '',
        created_at: 0,
        flash: '',
        id: 'a',
        updated_at: longNumber,
      });

      await dataSource.getRepository(DatabaseSession).save(session1);
    });

    it('should have an "created_at" column which supports numbers of 4-bytes', async () => {
      const session1 = dataSource.getRepository(DatabaseSession).create({
        content: '',
        created_at: longNumber,
        flash: '',
        id: 'a',
        updated_at: 0,
      });

      await dataSource.getRepository(DatabaseSession).save(session1);
    });

  });
}

describe('DatabaseSession', () => {

  entityTestSuite('mysql');
  entityTestSuite('sqlite');
  entityTestSuite('postgres');

});

function storeTestSuite(type: DBType) {

  describe(`with ${type}`, () => {

    let dataSource: DataSource;
    let store: TypeORMStore;
    let state: SessionState;
    let state2: SessionState;
    let maxInactivity: number;

    function createStateWithNoUserId(): SessionState {
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
        // The null value is important in this test suite.
        userId: null,
      };
    }

    beforeEach(async () => {
      store = createService(TypeORMStore);

      dataSource = createTestDataSource(type);
      await dataSource.initialize();
    });

    beforeEach(async () => {
      state = createStateWithNoUserId();
      state2 = {
        ...createStateWithNoUserId(),
        id: `${state.id}2`
      };
      maxInactivity = 1000;
      await dataSource.getRepository(DatabaseSession).clear();
    });

    afterEach(async () => {
      if (dataSource) {
        await dataSource.destroy();
      }
    });

    function convertDbSessionToState(dbSession: DatabaseSession, userIdType: 'number' | 'string' = 'number'): SessionState {
      return {
        content: JSON.parse(dbSession.content),
        createdAt: dbSession.created_at,
        flash: JSON.parse(dbSession.flash),
        id: dbSession.id,
        updatedAt: dbSession.updated_at,
        userId: (userIdType === 'number' ? dbSession.user_id : dbSession.user_id_str) ?? null,
      };
    }

    function convertStateToDbSession(state: SessionState): DatabaseSession {
      const userIdNumber = typeof state.userId === 'number' ? state.userId : null;
      const userIdStr = typeof state.userId === 'string' ? state.userId : null;

      return dataSource.getRepository(DatabaseSession).create({
        content: JSON.stringify(state.content),
        created_at: state.createdAt,
        flash: JSON.stringify(state.flash),
        id: state.id,
        updated_at: state.updatedAt,
        // tslint:disable-next-line
        user_id: userIdNumber ?? undefined,
        // tslint:disable-next-line
        user_id_str: userIdStr ?? undefined,
      });
    }

    describe('has a "save" method that', () => {

      it('should throw an error if the user ID is a string longer than 64 characters.', async () => {
        const longUserId = 'a'.repeat(65);
        await rejects(
          () => store.save(
            {
              ...createStateWithNoUserId(),
              userId: longUserId,
            },
            maxInactivity
          ),
          {
            message: '[TypeORMStore] Impossible to save the session. The user ID is too long (max 64 characters).'
          }
        );
      });

      context('given no session exists in the database with the given ID', () => {

        it('should save the session state in the database.', async () => {
          await store.save(state, maxInactivity);

          const dbSession = await dataSource.getRepository(DatabaseSession).findOneByOrFail({ id: state.id });
          deepStrictEqual(convertDbSessionToState(dbSession), state);
        });

        it('should save the session state in the database with a number user ID.', async () => {
          const stateWithNumberUserId = {
            ...createStateWithNoUserId(),
            userId: 1234,
          };

          await store.save(stateWithNumberUserId, maxInactivity);

          const dbSession = await dataSource.getRepository(DatabaseSession).findOneByOrFail({ id: stateWithNumberUserId.id });
          deepStrictEqual(convertDbSessionToState(dbSession, 'number'), stateWithNumberUserId);
          strictEqual(dbSession.user_id, 1234);
          strictEqual(dbSession.user_id_str, null);
        });

        it('should save the session state in the database with a string user ID.', async () => {
          const stateWithStringUserId = {
            ...createStateWithNoUserId(),
            userId: 'user-uuid-1234',
          };

          await store.save(stateWithStringUserId, maxInactivity);

          const dbSession = await dataSource.getRepository(DatabaseSession).findOneByOrFail({ id: stateWithStringUserId.id });
          deepStrictEqual(convertDbSessionToState(dbSession, 'string'), stateWithStringUserId);
          strictEqual(dbSession.user_id, null);
          strictEqual(dbSession.user_id_str, 'user-uuid-1234');
        });

      });

      context('given a session already exists in the database with the given ID', () => {

        beforeEach(async () => {
          const session = convertStateToDbSession(state);
          await dataSource.getRepository(DatabaseSession).save(session);
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
          const session = convertStateToDbSession(state);
          await dataSource.getRepository(DatabaseSession).save(session);
        });

        it('should return the session state.', async () => {
          const expected = createStateWithNoUserId();
          const actual = await store.read(state.id);

          deepStrictEqual(actual, expected);
        });

      });

      context('given a session exists in the database with a number user ID', () => {
        const stateWithNumberUserId: SessionState = {
          ...createStateWithNoUserId(),
          userId: 1234,
        };

        beforeEach(async () => {
          const session = convertStateToDbSession(stateWithNumberUserId);
          await dataSource.getRepository(DatabaseSession).save(session);
        });

        it('should return the session state with the number user ID.', async () => {
          const actual = await store.read(stateWithNumberUserId.id);

          deepStrictEqual(actual, stateWithNumberUserId);
        });
      });

      context('given a session exists in the database with a string user ID', () => {

        const stateWithStringUserId: SessionState = {
          ...createStateWithNoUserId(),
          userId: 'user-uuid-5678',
        };

        beforeEach(async () => {
          const session = convertStateToDbSession(stateWithStringUserId);
          await dataSource.getRepository(DatabaseSession).save(session);
        });

        it('should return the session state with the string user ID.', async () => {
          const actual = await store.read(stateWithStringUserId.id);

          deepStrictEqual(actual, stateWithStringUserId);
        });

      });

    });

    describe('has a "update" method that', () => {

      it('should throw an error if the user ID is a string longer than 64 characters.', async () => {
        const longUserId = 'a'.repeat(65);
        await rejects(
          () => store.update(
            {
              ...createStateWithNoUserId(),
              userId: longUserId,
            },
            maxInactivity
          ),
          {
            message: '[TypeORMStore] Impossible to save the session. The user ID is too long (max 64 characters).'
          }
        );
      });

      context('given no session exists in the database with the given ID', () => {

        it('should save the session state in the database.', async () => {
          await store.update(state, maxInactivity);

          const dbSession = await dataSource.getRepository(DatabaseSession).findOneByOrFail({ id: state.id });
          deepStrictEqual(convertDbSessionToState(dbSession), state);
        });

      });

      context('given a session already exists in the database with the given ID', () => {

        let updatedState: SessionState;

        beforeEach(async () => {
          const session = convertStateToDbSession(state);
          const session2 = convertStateToDbSession(state2);
          // The state2 must be saved before the state.
          await dataSource.getRepository(DatabaseSession).save([ session2, session ]);

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
            userId: null,
          };
        });

        it('should update the session state in the database (no user ID).', async () => {
          await store.update(updatedState, maxInactivity);

          const dbSession = await dataSource.getRepository(DatabaseSession).findOneByOrFail({ id: state.id });
          deepStrictEqual(convertDbSessionToState(dbSession), updatedState);
        });

        it('should update the session state in the database (number user ID).', async () => {
          const updatedStateWithNumberUserId = {
            ...updatedState,
            userId: 3,
          };
          await store.update(updatedStateWithNumberUserId, maxInactivity);

          const dbSession = await dataSource.getRepository(DatabaseSession).findOneByOrFail({ id: state.id });
          deepStrictEqual(convertDbSessionToState(dbSession, 'number'), updatedStateWithNumberUserId);
        });

        it('should update the session state in the database (string user ID).', async () => {
          const updatedStateWithStringUserId = {
            ...updatedState,
            userId: 'user-uuid-3',
          };
          await store.update(updatedStateWithStringUserId, maxInactivity);

          const dbSession = await dataSource.getRepository(DatabaseSession).findOneByOrFail({ id: state.id });
          deepStrictEqual(convertDbSessionToState(dbSession, 'string'), updatedStateWithStringUserId);
        });

        it('should not update the other session states in the database.', async () => {
          await store.update(updatedState, maxInactivity);

          const dbSession = await dataSource.getRepository(DatabaseSession).findOneByOrFail({ id: state2.id });
          deepStrictEqual(convertDbSessionToState(dbSession), state2);
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
          const session = convertStateToDbSession(state);
          const session2 = convertStateToDbSession(state2);
          // The state2 must be saved before the state.
          await dataSource.getRepository(DatabaseSession).save([ session2, session ]);
        });

        it('should delete the session in the database.', async () => {
          await store.destroy(state.id);

          strictEqual((await dataSource.getRepository(DatabaseSession).findOneBy({ id: state.id })), null);
        });

        it('should not delete the other sessions in the database.', async () => {
          await store.destroy(state.id);

          return doesNotReject(() => dataSource.getRepository(DatabaseSession).findOneByOrFail({ id: state2.id }));
        });

      });

    });

    describe('has a "clear" method that', () => {

      beforeEach(async () => {
        const session = convertStateToDbSession(state);
        await dataSource.getRepository(DatabaseSession).save(session);
      });

      it('should remove all sessions.', async () => {
        await store.clear();

        strictEqual((await dataSource.getRepository(DatabaseSession).find()).length, 0);
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
            ...createStateWithNoUserId(),
            createdAt: now - 1,
            id: 'xxx',
            updatedAt: now - 1,
          },
          {
            ...createStateWithNoUserId(),
            createdAt: now,
            id: 'yyy',
            updatedAt: now - maxInactivity - 1,
          },
          {
            ...createStateWithNoUserId(),
            createdAt: now - maxLifeTime - 1,
            id: 'zzz',
            updatedAt: now,
          },
        ];

        for (const state of states) {
          const session = convertStateToDbSession(state);
          await dataSource.getRepository(DatabaseSession).save(session);
        }
      });

      it('should not remove unexpired sessions.', async () => {
        await store.cleanUpExpiredSessions(maxInactivity, maxLifeTime);

        return doesNotReject(() => dataSource.getRepository(DatabaseSession).findOneByOrFail({ id: 'xxx' }));
      });

      it('should remove sessions expired due to inactivity.', async () => {
        await store.cleanUpExpiredSessions(maxInactivity, maxLifeTime);

        return rejects(() => dataSource.getRepository(DatabaseSession).findOneByOrFail({ id: 'yyy' }));
      });

      it('should remove sessions expired due to absolute end of life.', async () => {
        await store.cleanUpExpiredSessions(maxInactivity, maxLifeTime);

        return rejects(() => dataSource.getRepository(DatabaseSession).findOneByOrFail({ id: 'zzz' }));
      });

    });

    describe('has a "getAuthenticatedUsers" method that', () => {

      beforeEach(async () => {
        const sessions = dataSource.getRepository(DatabaseSession).create([
          {
            content: '{}',
            created_at: 1,
            flash: JSON.stringify({}),
            id: 'a',
            updated_at: 2,
          },
          {
            content: '{}',
            created_at: 3,
            flash: JSON.stringify({}),
            id: 'b',
            updated_at: 4,
            user_id: 1,
          },
          {
            content: '{}',
            created_at: 5,
            flash: JSON.stringify({}),
            id: 'c',
            updated_at: 6,
            user_id: 2,
          },
          {
            content: '{}',
            created_at: 7,
            flash: JSON.stringify({}),
            id: 'd',
            updated_at: 8,
            user_id: 2
          },
          {
            content: '{}',
            created_at: 9,
            flash: JSON.stringify({}),
            id: 'e',
            updated_at: 10,
            user_id_str: 'uuid-1'
          },
          {
            content: '{}',
            created_at: 11,
            flash: JSON.stringify({}),
            id: 'f',
            updated_at: 12,
            user_id_str: 'uuid-2'
          },
          {
            content: '{}',
            created_at: 13,
            flash: JSON.stringify({}),
            id: 'g',
            updated_at: 14,
            user_id_str: 'uuid-2'
          }
        ]);

        await dataSource.getRepository(DatabaseSession).save(sessions);
      });

      it('should return the IDs of the authenticated users (distinct, both number and string).', async () => {
        const sessions = await store.getAuthenticatedUserIds();
        // No null or dupplicated values.
        deepStrictEqual(sessions, [ 1, 2, 'uuid-1', 'uuid-2' ]);
      });

    });

    describe('has a "destroyAllSessionsOf" method that', () => {

      beforeEach(async () => {
        const sessions = dataSource.getRepository(DatabaseSession).create([
          {
            content: '{}',
            created_at: 1,
            flash: JSON.stringify({}),
            id: 'a',
            updated_at: 2,
          },
          {
            content: '{}',
            created_at: 3,
            flash: JSON.stringify({}),
            id: 'b',
            updated_at: 4,
            user_id: 1,
          },
          {
            content: '{}',
            created_at: 5,
            flash: JSON.stringify({}),
            id: 'c',
            updated_at: 6,
            user_id: 2,
          },
          {
            content: '{}',
            created_at: 7,
            flash: JSON.stringify({}),
            id: 'd',
            updated_at: 8,
            user_id: 2
          },
          {
            content: '{}',
            created_at: 9,
            flash: JSON.stringify({}),
            id: 'e',
            updated_at: 10,
            user_id_str: 'uuid-1'
          },
          {
            content: '{}',
            created_at: 11,
            flash: JSON.stringify({}),
            id: 'f',
            updated_at: 12,
            user_id_str: 'uuid-2'
          }
        ]);

        await dataSource.getRepository(DatabaseSession).save(sessions);
      });

      it('should destroy all the sessions of the given user (number ID).', async () => {
        const user = { id: 2 };
        await store.destroyAllSessionsOf(user.id);

        const sessions = await dataSource.getRepository(DatabaseSession).find();
        strictEqual(sessions.length, 4);
        strictEqual(sessions[0].id, 'a');
        strictEqual(sessions[1].id, 'b');
        strictEqual(sessions[2].id, 'e');
        strictEqual(sessions[3].id, 'f');
      });

      it('should destroy all the sessions of the given user (string ID).', async () => {
        const user = { id: 'uuid-2' };
        await store.destroyAllSessionsOf(user.id);

        const sessions = await dataSource.getRepository(DatabaseSession).find();
        strictEqual(sessions.length, 5);
        strictEqual(sessions[0].id, 'a');
        strictEqual(sessions[1].id, 'b');
        strictEqual(sessions[2].id, 'c');
        strictEqual(sessions[3].id, 'd');
        strictEqual(sessions[4].id, 'e');
      });

    });

    describe('has a "getSessionIDsOf" method that', () => {

      beforeEach(async () => {
        const sessions = dataSource.getRepository(DatabaseSession).create([
          {
            content: '{}',
            created_at: 1,
            flash: JSON.stringify({}),
            id: 'a',
            updated_at: 2,
          },
          {
            content: '{}',
            created_at: 3,
            flash: JSON.stringify({}),
            id: 'b',
            updated_at: 4,
            user_id: 1,
          },
          {
            content: '{ "foo": "bar" }',
            created_at: 5,
            flash: JSON.stringify({ hello: 'world' }),
            id: 'c',
            updated_at: 6,
            user_id: 2,
          },
          {
            content: '{ "bar": "foo" }',
            created_at: 7,
            flash: JSON.stringify({}),
            id: 'd',
            updated_at: 8,
            user_id: 2
          },
          {
            content: '{}',
            created_at: 9,
            flash: JSON.stringify({}),
            id: 'e',
            updated_at: 10,
            user_id_str: 'uuid-1'
          },
          {
            content: '{ "str": "data" }',
            created_at: 11,
            flash: JSON.stringify({ str: 'flash' }),
            id: 'f',
            updated_at: 12,
            user_id_str: 'uuid-2'
          },
          {
            content: '{ "str2": "data2" }',
            created_at: 13,
            flash: JSON.stringify({}),
            id: 'g',
            updated_at: 14,
            user_id_str: 'uuid-2'
          }
        ]);

        await dataSource.getRepository(DatabaseSession).save(sessions);
      });

      it('should return an empty array if the number user ID does not match any users.', async () => {
        const user = { id: 0 };
        const sessions = await store.getSessionIDsOf(user.id);
        strictEqual(sessions.length, 0);
      });

      it('should return an empty array if the string user ID does not match any users.', async () => {
        const user = { id: 'unknown-uuid' };
        const sessions = await store.getSessionIDsOf(user.id);
        strictEqual(sessions.length, 0);
      });

      it('should return the IDs of the sessions associated with the given user (number ID).', async () => {
        const user = { id: 2 };
        const sessions = await store.getSessionIDsOf(user.id);
        strictEqual(sessions.length, 2);

        strictEqual(sessions[0], 'c');
        strictEqual(sessions[1], 'd');
      });

      it('should return the IDs of the sessions associated with the given user (string ID).', async () => {
        const user = { id: 'uuid-2' };
        const sessions = await store.getSessionIDsOf(user.id);
        strictEqual(sessions.length, 2);

        strictEqual(sessions[0], 'f');
        strictEqual(sessions[1], 'g');
      });

    });

  });

}

describe('TypeORMStore', () => {

  storeTestSuite('mysql');
  storeTestSuite('sqlite');
  storeTestSuite('postgres');

});