// std
import { deepStrictEqual, notStrictEqual, rejects, strictEqual } from 'assert';

// 3p
import { createConnection, getConnection, getRepository } from 'typeorm';

// FoalTS
import { createService, Session, SessionStore } from '@foal/core';
import { DatabaseSession, TypeORMStore } from './typeorm-store.service';

type DBType = 'mysql'|'mariadb'|'postgres'|'sqlite';

async function createTestConnection(type: DBType) {
  switch (type) {
    case 'mysql':
    case 'mariadb':
      await createConnection({
        database: 'test',
        dropSchema: true,
        entities: [ DatabaseSession ],
        password: 'test',
        port: type === 'mysql' ? 3308 : 3307,
        synchronize: true,
        type,
        username: 'test',
      });
      break;
    case 'postgres':
      await createConnection({
        database: 'test',
        dropSchema: true,
        entities: [ DatabaseSession ],
        password: 'test',
        synchronize: true,
        type,
        username: 'test',
      });
      break;
    case 'sqlite':
      await createConnection({
        database: 'test_db.sqlite',
        dropSchema: true,
        entities: [ DatabaseSession ],
        synchronize: true,
        type,
      });
      break;
    default:
      break;
  }
}

function entityTestSuite(type: DBType) {

  describe(`with ${type}`, () => {
    before(() => createTestConnection(type));

    beforeEach(async () => {
      await getRepository(DatabaseSession).clear();
    });

    after(() => getConnection().close());

    it('should has an id which is unique.', async () => {
      const session1 = getRepository(DatabaseSession).create({
        content: '',
        created_at: 0,
        id: 'a',
        updated_at: 0,
      });

      await getRepository(DatabaseSession).save(session1);

      await rejects(
        () => getRepository(DatabaseSession)
          .createQueryBuilder()
          .insert()
          .values({
            content: '',
            created_at: 0,
            id: 'a',
            updated_at: 0,
          })
          .execute()
      );
    });

    it('should has a "content" which supports long strings.', async () => {
      const session1 = getRepository(DatabaseSession).create({
        content: JSON.stringify({
          hello: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
            + 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
            + 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
            + 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
            + 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
        }),
        created_at: 0,
        id: 'a',
        updated_at: 0,
      });
      await getRepository(DatabaseSession).save(session1);
    });

  });
}

describe('DatabaseSession', () => {

  entityTestSuite('mysql');
  entityTestSuite('mariadb');
  entityTestSuite('sqlite');
  entityTestSuite('postgres');

});

function storeTestSuite(type: DBType) {

  describe(`with ${type}`, () => {
    let store: TypeORMStore;

    before(() => createTestConnection(type));

    beforeEach(async () => {
      store = createService(TypeORMStore);
      await getRepository(DatabaseSession).clear();
    });

    after(() => getConnection().close());

    describe('has a "createAndSaveSession" method that', () => {

      it('should throw if the user ID is defined and is a number.', async () => {
        await rejects(
          () => store.createAndSaveSession({ foo: 'bar' }, { userId: 'e' }),
          {
            message: '[TypeORMStore] Impossible to save the session. The user ID must be a number.'
          }
        );
      });

      it('should generate an ID and create a new session in the database.', async () => {
        const dateBefore = Date.now();
        await store.createAndSaveSession({ foo: 'bar' }, { userId: 2 });
        const dateAfter = Date.now();

        const sessions = await getRepository(DatabaseSession).find();
        strictEqual(sessions.length, 1);
        const sessionA = sessions[0];

        notStrictEqual(sessionA.id, undefined);
        strictEqual(sessionA.user_id, 2);
        deepStrictEqual(sessionA.content, JSON.stringify({ foo: 'bar' }));

        const createdAt = parseInt(sessionA.created_at.toString(), 10);
        strictEqual(dateBefore <= createdAt, true);
        strictEqual(createdAt <= dateAfter, true);

        const updatedAt = parseInt(sessionA.created_at.toString(), 10);
        strictEqual(dateBefore <= updatedAt, true);
        strictEqual(updatedAt <= dateAfter, true);
      });

      it('should return a representation (Session object) of the created session.', async () => {
        const session = await store.createAndSaveSession({ foo: 'bar' }, { userId: 2 });

        const sessions = await getRepository(DatabaseSession).find();
        strictEqual(sessions.length, 1);
        const sessionA = sessions[0];

        strictEqual(session.store, store);
        strictEqual(session.userId, sessionA.user_id);
        strictEqual(session.sessionID, sessionA.id);
        deepStrictEqual(session.getContent(), { foo: 'bar' });
        strictEqual(session.createdAt, parseInt(sessionA.created_at.toString(), 10));
      });

      it('should support session options.', async () => {
        const session = await store.createAndSaveSession({ foo: 'bar' }, { csrfToken: true });
        strictEqual(typeof (session.getContent() as any).csrfToken, 'string');
      });

    });

    describe('has an "update" method that', () => {

      it('should update the content of the session if the session exists.', async () => {
        const session1 = getRepository(DatabaseSession).create({
          content: JSON.stringify({}),
          created_at: Date.now(),
          id: 'a',
          updated_at: Date.now(),
        });
        const session2 = getRepository(DatabaseSession).create({
          content: JSON.stringify({}),
          created_at: Date.now(),
          id: 'b',
          updated_at: Date.now(),
        });

        await getRepository(DatabaseSession).save([ session1, session2 ]);

        await store.update(new Session({
          content: { bar: 'foo' },
          createdAt: session1.created_at,
          id: session1.id,
          store: {} as any,
        }));

        const sessionA = await getRepository(DatabaseSession).findOneOrFail({ id: session1.id });
        deepStrictEqual(sessionA.content, JSON.stringify({ bar: 'foo' }));
        deepStrictEqual(parseInt(sessionA.created_at.toString(), 10), session1.created_at);

        const sessionB = await getRepository(DatabaseSession).findOneOrFail({ id: session2.id });
        deepStrictEqual(sessionB.content, JSON.stringify({}));
        deepStrictEqual(parseInt(sessionB.created_at.toString(), 10), session2.created_at);
      });

      it('should update the lifetime (inactiviy) if the session exists.', async () => {
        const session1 = getRepository(DatabaseSession).create({
          content: JSON.stringify({}),
          created_at: Date.now(),
          id: 'a',
          updated_at: Date.now(),
        });
        const session2 = getRepository(DatabaseSession).create({
          content: JSON.stringify({}),
          created_at: Date.now(),
          id: 'b',
          updated_at: Date.now(),
        });

        await getRepository(DatabaseSession).save([ session1, session2 ]);

        const dateBefore = Date.now();
        await store.update(new Session({
          content: session1.content,
          createdAt: session1.created_at,
          id: session1.id,
          store: {} as any,
        }));
        const dateAfter = Date.now();

        const sessionA = await getRepository(DatabaseSession).findOneOrFail({ id: session1.id });
        const updatedAtA = parseInt(sessionA.updated_at.toString(), 10);
        strictEqual(dateBefore <= updatedAtA, true);
        strictEqual(updatedAtA <= dateAfter, true);

        const sessionB = await getRepository(DatabaseSession).findOneOrFail({ id: session2.id });
        strictEqual(parseInt(sessionB.updated_at.toString(), 10), session2.updated_at);
      });

    });

    describe('has a "destroy" method that', () => {

      it('should delete the session from its ID.', async () => {
        const session1 = getRepository(DatabaseSession).create({
          content: JSON.stringify({}),
          created_at: Date.now(),
          id: 'a',
          updated_at: Date.now(),
        });
        const session2 = getRepository(DatabaseSession).create({
          content: JSON.stringify({}),
          created_at: Date.now(),
          id: 'b',
          updated_at: Date.now(),
        });

        await getRepository(DatabaseSession).save([ session1, session2 ]);

        strictEqual((await getRepository(DatabaseSession).find()).length, 2);

        await store.destroy(session1.id);

        const sessions = await getRepository(DatabaseSession).find();
        strictEqual(sessions.length, 1);
        strictEqual(sessions.find(session => session.id === session1.id), undefined);
        notStrictEqual(sessions.find(session => session.id === session2.id), undefined);
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
        const inactivity = SessionStore.getExpirationTimeouts().inactivity;

        const session1 = getRepository(DatabaseSession).create({
          content: JSON.stringify({}),
          created_at: Date.now(),
          id: 'a',
          updated_at: Date.now() - inactivity * 1000,
        });

        await getRepository(DatabaseSession).save(session1);

        const session = await store.read(session1.id);
        strictEqual(session, undefined);
      });

      it('should delete the session if it has expired (inactivity).', async () => {
        const inactivity = SessionStore.getExpirationTimeouts().inactivity;
        const session1 = getRepository(DatabaseSession).create({
          content: JSON.stringify({}),
          created_at: Date.now(),
          id: 'a',
          updated_at: Date.now(),
        });
        const session2 = getRepository(DatabaseSession).create({
          content: JSON.stringify({}),
          created_at: Date.now(),
          id: 'b',
          updated_at: Date.now() - inactivity * 1000,
        });

        await getRepository(DatabaseSession).save([ session1, session2 ]);

        let sessions = await getRepository(DatabaseSession).find();
        strictEqual(sessions.length, 2);
        notStrictEqual(sessions.find(session => session.id === session1.id), undefined);
        notStrictEqual(sessions.find(session => session.id === session2.id), undefined);

        await store.read(session2.id);

        sessions = await getRepository(DatabaseSession).find();
        strictEqual(sessions.length, 1);
        notStrictEqual(sessions.find(session => session.id === session1.id), undefined);
        strictEqual(sessions.find(session => session.id === session2.id), undefined);
      });

      it('should return undefined if the session has expired (absolute).', async () => {
        const absolute = SessionStore.getExpirationTimeouts().absolute;

        const session1 = getRepository(DatabaseSession).create({
          content: JSON.stringify({}),
          created_at: Date.now() - absolute * 1000,
          id: 'a',
          updated_at: Date.now(),
        });

        await getRepository(DatabaseSession).save(session1);

        const session = await store.read(session1.id);
        strictEqual(session, undefined);
      });

      it('should delete the session if it has expired (absolute).', async () => {
        const absolute = SessionStore.getExpirationTimeouts().absolute;

        const session1 = getRepository(DatabaseSession).create({
          content: JSON.stringify({}),
          created_at: Date.now(),
          id: 'a',
          updated_at: Date.now(),
        });
        const session2 = getRepository(DatabaseSession).create({
          content: JSON.stringify({}),
          created_at: Date.now() - absolute * 1000,
          id: 'b',
          updated_at: Date.now(),
        });

        await getRepository(DatabaseSession).save([ session1, session2 ]);

        let sessions = await getRepository(DatabaseSession).find();
        strictEqual(sessions.length, 2);
        notStrictEqual(sessions.find(session => session.id === session1.id), undefined);
        notStrictEqual(sessions.find(session => session.id === session2.id), undefined);

        await store.read(session2.id);

        sessions = await getRepository(DatabaseSession).find();
        strictEqual(sessions.length, 1);
        notStrictEqual(sessions.find(session => session.id === session1.id), undefined);
        strictEqual(sessions.find(session => session.id === session2.id), undefined);
      });

      it('should return the session.', async () => {
        const session1 = getRepository(DatabaseSession).create({
          content: JSON.stringify({}),
          created_at: Date.now(),
          id: 'a',
          updated_at: Date.now(),
        });
        const session2 = getRepository(DatabaseSession).create({
          content: JSON.stringify({ foo: 'bar' }),
          created_at: Date.now(),
          id: 'b',
          updated_at: Date.now(),
          user_id: 2,
        });

        await getRepository(DatabaseSession).save([ session1, session2 ]);

        const session = await store.read(session2.id);
        if (!session) {
          throw new Error('TypeORMStore.read should not return undefined.');
        }
        strictEqual(session.store, store);
        strictEqual(session.userId, 2);
        strictEqual(session.sessionID, session2.id);
        strictEqual(session.get('foo'), 'bar');
        strictEqual(session.createdAt, session2.created_at);
      });

    });

    describe('has a "extendLifeTime" method that', () => {

      it('should extend the lifetime of session (inactivity).', async () => {
        const inactivity = SessionStore.getExpirationTimeouts().inactivity;

        const session1 = getRepository(DatabaseSession).create({
          content: JSON.stringify({}),
          created_at: Date.now(),
          id: 'a',
          updated_at: Date.now() - Math.round(inactivity * 1000 / 2),
        });
        const session2 = getRepository(DatabaseSession).create({
          content: JSON.stringify({}),
          created_at: Date.now(),
          id: 'b',
          updated_at: Date.now() - Math.round(inactivity * 1000 / 2),
        });

        await getRepository(DatabaseSession).save([ session1, session2 ]);

        const dateBefore = Date.now();
        await store.extendLifeTime(session1.id);
        const dateAfter = Date.now();

        const session = await getRepository(DatabaseSession).findOneOrFail({ id: session1.id });
        notStrictEqual(session1.updated_at, session.updated_at);
        strictEqual(dateBefore <= session.updated_at, true);
        strictEqual(session.updated_at <= dateAfter, true);

        const sessionB = await getRepository(DatabaseSession).findOneOrFail({ id: session2.id });
        strictEqual(session2.updated_at.toString(), sessionB.updated_at.toString());
      });

      it('should not throw if no session matches the given session ID.', () => {
        return store.extendLifeTime('c');
      });

    });

    describe('has a "clear" method that', () => {

      it('should remove all sessions.', async () => {
        const session1 = getRepository(DatabaseSession).create({
          content: JSON.stringify({}),
          created_at: Date.now(),
          id: 'a',
          updated_at: Date.now(),
        });
        const session2 = getRepository(DatabaseSession).create({
          content: JSON.stringify({ foo: 'bar' }),
          created_at: Date.now(),
          id: 'b',
          updated_at: Date.now(),
        });

        await getRepository(DatabaseSession).save([ session1, session2 ]);

        strictEqual((await getRepository(DatabaseSession).find()).length, 2);

        await store.clear();

        strictEqual((await getRepository(DatabaseSession).find()).length, 0);
      });

    });

    describe('has a "cleanUpExpiredSessions" method that', () => {

      it('should remove expired sessions due to inactivity.', async () => {
        const inactivityTimeout = SessionStore.getExpirationTimeouts().inactivity;

        const currentSession = getRepository(DatabaseSession).create({
          content: JSON.stringify({}),
          created_at: Date.now(),
          id: 'a',
          updated_at: Date.now() - inactivityTimeout * 1000 + 5000,
        });
        const expiredSession = getRepository(DatabaseSession).create({
          content: JSON.stringify({}),
          created_at: Date.now(),
          id: 'b',
          updated_at: Date.now() - inactivityTimeout * 1000,
        });

        await getRepository(DatabaseSession).save([ currentSession, expiredSession ]);

        let sessions = await getRepository(DatabaseSession).find();
        strictEqual(sessions.length, 2);
        notStrictEqual(sessions.find(session => session.id === currentSession.id), undefined);
        notStrictEqual(sessions.find(session => session.id === expiredSession.id), undefined);

        await store.cleanUpExpiredSessions();

        sessions = await getRepository(DatabaseSession).find();
        strictEqual(sessions.length, 1);
        notStrictEqual(sessions.find(session => session.id === currentSession.id), undefined);
        strictEqual(sessions.find(session => session.id === expiredSession.id), undefined);
      });

      it('should remove expired sessions due to absolute timeout.', async () => {
        const absoluteTimeout = SessionStore.getExpirationTimeouts().absolute;

        const currentSession = getRepository(DatabaseSession).create({
          content: JSON.stringify({}),
          created_at: Date.now() - absoluteTimeout * 1000 + 5000,
          id: 'a',
          updated_at: Date.now(),
        });
        const expiredSession = getRepository(DatabaseSession).create({
          content: JSON.stringify({}),
          created_at: Date.now() - absoluteTimeout * 1000,
          id: 'b',
          updated_at: Date.now(),
        });

        await getRepository(DatabaseSession).save([ currentSession, expiredSession ]);

        let sessions = await getRepository(DatabaseSession).find();
        strictEqual(sessions.length, 2);
        notStrictEqual(sessions.find(session => session.id === currentSession.id), undefined);
        notStrictEqual(sessions.find(session => session.id === expiredSession.id), undefined);

        await store.cleanUpExpiredSessions();

        sessions = await getRepository(DatabaseSession).find();
        strictEqual(sessions.length, 1);
        notStrictEqual(sessions.find(session => session.id === currentSession.id), undefined);
        strictEqual(sessions.find(session => session.id === expiredSession.id), undefined);
      });

    });

    describe('has a "getAuthenticatedUsers" method that', () => {

      beforeEach(async () => {
        const sessions = getRepository(DatabaseSession).create([
          {
            content: '{}',
            created_at: 1,
            id: 'a',
            updated_at: 2,
          },
          {
            content: '{}',
            created_at: 3,
            id: 'b',
            updated_at: 4,
            user_id: 1,
          },
          {
            content: '{}',
            created_at: 5,
            id: 'c',
            updated_at: 6,
            user_id: 2,
          },
          {
            content: '{}',
            created_at: 7,
            id: 'd',
            updated_at: 8,
            user_id: 2
          }
        ]);

        await getRepository(DatabaseSession).save(sessions);
      });

      it('should return the IDs of the authenticated users (distinct).', async () => {
        const sessions = await store.getAuthenticatedUserIds();
        // No null or dupplicated values.
        deepStrictEqual(sessions, [ 1, 2 ]);
      });

    });

  });

}

describe('TypeORMStore', () => {

  storeTestSuite('mysql');
  storeTestSuite('mariadb');
  storeTestSuite('sqlite');
  storeTestSuite('postgres');

});
