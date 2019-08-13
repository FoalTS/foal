// std
import { deepStrictEqual, notStrictEqual, strictEqual } from 'assert';

// 3p
import { createConnection, getConnection } from 'typeorm';

// FoalTS
import { createService, Session, SessionStore } from '@foal/core';
import { DatabaseSession, TypeORMStore } from './typeorm-store.service';

interface PlainSession {
  sessionID: string;
  sessionContent: object;
  createdAt: number;
  updatedAt: number;
}

async function insertSessionIntoDB(session: PlainSession): Promise<PlainSession> {
  await getConnection().query(`
    INSERT INTO foal_session (session_id, session_content, created_at, updated_at)
    VALUES ('${session.sessionID}', '${JSON.stringify(session.sessionContent)}',
            ${session.createdAt.toString()}, ${session.updatedAt.toString()})
  `);
  return session;
}

async function readSessionsFromDB(): Promise<PlainSession[]> {
  const sessions: DatabaseSession[] = await getConnection().query('SELECT * FROM foal_session');
  return sessions.map(session => ({
    createdAt: parseInt(session.created_at, 10),
    sessionContent: JSON.parse(session.session_content),
    sessionID: session.session_id,
    updatedAt: parseInt(session.updated_at, 10),
  }));
}

async function findByID(sessionID: string): Promise<PlainSession> {
  const sessions: DatabaseSession[] = await getConnection().query(
    `SELECT * FROM foal_session WHERE session_id='${sessionID}'`
  );
  strictEqual(sessions.length, 1);
  return {
    createdAt: parseInt(sessions[0].created_at, 10),
    sessionContent: JSON.parse(sessions[0].session_content),
    sessionID: sessions[0].session_id,
    updatedAt: parseInt(sessions[0].updated_at, 10),
  };
}

function testSuite(type: 'mysql'|'mariadb'|'postgres'|'sqlite') {

  describe(`with ${type}`, () => {
    let store: TypeORMStore;

    before(async () => {
      switch (type) {
        case 'mysql':
        case 'mariadb':
          await createConnection({
            database: 'test',
            dropSchema: true,
            password: 'test',
            type,
            username: 'test',
          });
          break;
        case 'postgres':
          await createConnection({
            database: 'test',
            dropSchema: true,
            password: 'test',
            type,
            username: 'test',
          });
          break;
        case 'sqlite':
          await createConnection({
            database: 'test_db.sqlite',
            dropSchema: true,
            type,
          });
          break;
        default:
          break;
      }
    });

    beforeEach(async () => {
      store = createService(TypeORMStore);
      const queryRunner = getConnection().createQueryRunner();
      if (await queryRunner.hasTable('foal_session')) {
        await queryRunner.clearTable('foal_session');
      }
      await queryRunner.release();
    });

    after(() => getConnection().close());

    describe('has a "createAndSaveSession" method that', () => {

      it('should generate an ID and create a new session in the database.', async () => {
        const dateBefore = Date.now();
        await store.createAndSaveSession({ foo: 'bar' });
        const dateAfter = Date.now();

        const sessions = await readSessionsFromDB();
        strictEqual(sessions.length, 1);
        const sessionA = sessions[0];

        notStrictEqual(sessionA.sessionID, undefined);
        deepStrictEqual(sessionA.sessionContent, { foo: 'bar' });

        const createdAt = parseInt(sessionA.createdAt.toString(), 10);
        strictEqual(dateBefore <= createdAt, true);
        strictEqual(createdAt <= dateAfter, true);

        const updatedAt = parseInt(sessionA.updatedAt.toString(), 10);
        strictEqual(dateBefore <= updatedAt, true);
        strictEqual(updatedAt <= dateAfter, true);
      });

      it('should return a representation (Session object) of the created session.', async () => {
        const session = await store.createAndSaveSession({ foo: 'bar' });

        const sessions = await readSessionsFromDB();
        strictEqual(sessions.length, 1);
        const sessionA = sessions[0];

        strictEqual(session.sessionID, sessionA.sessionID);
        deepStrictEqual(session.getContent(), { foo: 'bar' });
        strictEqual(session.createdAt, parseInt(sessionA.createdAt.toString(), 10));
      });

      it('should support session options.', async () => {
        const session = await store.createAndSaveSession({ foo: 'bar' }, { csrfToken: true });
        strictEqual(typeof (session.getContent() as any).csrfToken, 'string');
      });

    });

    describe('has a "update" method that', () => {

      it('should update the content of the session if the session exists.', async () => {
        const session1 = await insertSessionIntoDB({
          createdAt: Date.now(),
          sessionContent: {},
          sessionID: 'a',
          updatedAt: Date.now(),
        });
        const session2 = await insertSessionIntoDB({
          createdAt: Date.now(),
          sessionContent: {},
          sessionID: 'b',
          updatedAt: Date.now(),
        });

        await store.update(new Session(session1.sessionID, { bar: 'foo' }, session1.createdAt));

        const sessionA = await findByID(session1.sessionID);
        deepStrictEqual(sessionA.sessionContent, { bar: 'foo' });
        deepStrictEqual(parseInt(sessionA.createdAt.toString(), 10), session1.createdAt);

        const sessionB = await findByID(session2.sessionID);
        deepStrictEqual(sessionB.sessionContent, {});
        deepStrictEqual(parseInt(sessionB.createdAt.toString(), 10), session2.createdAt);
      });

      it('should update the lifetime (inactiviy) if the session exists.', async () => {
        const session1 = await insertSessionIntoDB({
          createdAt: Date.now(),
          sessionContent: {},
          sessionID: 'a',
          updatedAt: Date.now(),
        });
        const session2 = await insertSessionIntoDB({
          createdAt: Date.now(),
          sessionContent: {},
          sessionID: 'b',
          updatedAt: Date.now(),
        });

        const dateBefore = Date.now();
        await store.update(new Session(session1.sessionID, session1.sessionContent, session1.createdAt));
        const dateAfter = Date.now();

        const sessionA = await findByID(session1.sessionID);
        const updatedAtA = parseInt(sessionA.updatedAt.toString(), 10);
        strictEqual(dateBefore <= updatedAtA, true);
        strictEqual(updatedAtA <= dateAfter, true);

        const sessionB = await findByID(session2.sessionID);
        strictEqual(parseInt(sessionB.updatedAt.toString(), 10), session2.updatedAt);
      });

    });

    describe('has a "destroy" method that', () => {

      it('should delete the session from its ID.', async () => {
        const session1 = await insertSessionIntoDB({
          createdAt: Date.now(),
          sessionContent: {},
          sessionID: 'a',
          updatedAt: Date.now(),
        });
        const session2 = await insertSessionIntoDB({
          createdAt: Date.now(),
          sessionContent: {},
          sessionID: 'b',
          updatedAt: Date.now(),
        });

        strictEqual((await readSessionsFromDB()).length, 2);

        await store.destroy(session1.sessionID);

        const sessions = await readSessionsFromDB();
        strictEqual(sessions.length, 1);
        strictEqual(sessions.find(session => session.sessionID === session1.sessionID), undefined);
        notStrictEqual(sessions.find(session => session.sessionID === session2.sessionID), undefined);
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

        const session1 = await insertSessionIntoDB({
          createdAt: Date.now(),
          sessionContent: {},
          sessionID: 'a',
          updatedAt: Date.now() - inactivity * 1000,
        });

        const session = await store.read(session1.sessionID);
        strictEqual(session, undefined);
      });

      it('should delete the session if it has expired (inactivity).', async () => {
        const inactivity = SessionStore.getExpirationTimeouts().inactivity;
        const session1 = await insertSessionIntoDB({
          createdAt: Date.now(),
          sessionContent: {},
          sessionID: 'a',
          updatedAt: Date.now(),
        });
        const session2 = await insertSessionIntoDB({
          createdAt: Date.now(),
          sessionContent: {},
          sessionID: 'b',
          updatedAt: Date.now() - inactivity * 1000,
        });

        let sessions = await readSessionsFromDB();
        strictEqual(sessions.length, 2);
        notStrictEqual(sessions.find(session => session.sessionID === session1.sessionID), undefined);
        notStrictEqual(sessions.find(session => session.sessionID === session2.sessionID), undefined);

        await store.read(session2.sessionID);

        sessions = await readSessionsFromDB();
        strictEqual(sessions.length, 1);
        notStrictEqual(sessions.find(session => session.sessionID === session1.sessionID), undefined);
        strictEqual(sessions.find(session => session.sessionID === session2.sessionID), undefined);
      });

      it('should return undefined if the session has expired (absolute).', async () => {
        const absolute = SessionStore.getExpirationTimeouts().absolute;

        const session1 = await insertSessionIntoDB({
          createdAt: Date.now() - absolute * 1000,
          sessionContent: {},
          sessionID: 'a',
          updatedAt: Date.now(),
        });

        const session = await store.read(session1.sessionID);
        strictEqual(session, undefined);
      });

      it('should delete the session if it has expired (absolute).', async () => {
        const absolute = SessionStore.getExpirationTimeouts().absolute;

        const session1 = await insertSessionIntoDB({
          createdAt: Date.now(),
          sessionContent: {},
          sessionID: 'a',
          updatedAt: Date.now(),
        });
        const session2 = await insertSessionIntoDB({
          createdAt: Date.now() - absolute * 1000,
          sessionContent: {},
          sessionID: 'b',
          updatedAt: Date.now(),
        });

        let sessions = await readSessionsFromDB();
        strictEqual(sessions.length, 2);
        notStrictEqual(sessions.find(session => session.sessionID === session1.sessionID), undefined);
        notStrictEqual(sessions.find(session => session.sessionID === session2.sessionID), undefined);

        await store.read(session2.sessionID);

        sessions = await readSessionsFromDB();
        strictEqual(sessions.length, 1);
        notStrictEqual(sessions.find(session => session.sessionID === session1.sessionID), undefined);
        strictEqual(sessions.find(session => session.sessionID === session2.sessionID), undefined);
      });

      it('should return the session.', async () => {
        await insertSessionIntoDB({
          createdAt: Date.now(),
          sessionContent: {},
          sessionID: 'a',
          updatedAt: Date.now(),
        });
        const session2 = await insertSessionIntoDB({
          createdAt: Date.now(),
          sessionContent: { foo: 'bar' },
          sessionID: 'b',
          updatedAt: Date.now(),
        });

        const session = await store.read(session2.sessionID);
        if (!session) {
          throw new Error('TypeORMStore.read should not return undefined.');
        }
        strictEqual(session.sessionID, session2.sessionID);
        strictEqual(session.get('foo'), 'bar');
        strictEqual(session.createdAt, session2.createdAt);
      });

    });

    describe('has a "extendLifeTime" method that', () => {

      it('should extend the lifetime of session (inactivity).', async () => {
        const inactivity = SessionStore.getExpirationTimeouts().inactivity;

        const session1 = await insertSessionIntoDB({
          createdAt: Date.now(),
          sessionContent: {},
          sessionID: 'a',
          updatedAt: Date.now() - Math.round(inactivity * 1000 / 2),
        });
        const session2 = await insertSessionIntoDB({
          createdAt: Date.now(),
          sessionContent: {},
          sessionID: 'b',
          updatedAt: Date.now() - Math.round(inactivity * 1000 / 2),
        });

        const dateBefore = Date.now();
        await store.extendLifeTime(session1.sessionID);
        const dateAfter = Date.now();

        const session = await findByID(session1.sessionID);
        notStrictEqual(session1.updatedAt, session.updatedAt);
        strictEqual(dateBefore <= session.updatedAt, true);
        strictEqual(session.updatedAt <= dateAfter, true);

        const sessionB = await findByID(session2.sessionID);
        strictEqual(session2.updatedAt.toString(), sessionB.updatedAt.toString());
      });

      it('should not throw if no session matches the given session ID.', () => {
        return store.extendLifeTime('c');
      });

    });

    describe('has a "clear" method that', () => {

      it('should remove all sessions.', async () => {
        await insertSessionIntoDB({
          createdAt: Date.now(),
          sessionContent: {},
          sessionID: 'a',
          updatedAt: Date.now(),
        });
        await insertSessionIntoDB({
          createdAt: Date.now(),
          sessionContent: { foo: 'bar' },
          sessionID: 'b',
          updatedAt: Date.now(),
        });

        strictEqual((await readSessionsFromDB()).length, 2);

        await store.clear();

        strictEqual((await readSessionsFromDB()).length, 0);
      });

    });

    describe('has a "cleanUpExpiredSessions" method that', () => {

      it('should remove expired sessions due to inactivity.', async () => {
        const inactivityTimeout = SessionStore.getExpirationTimeouts().inactivity;

        const currentSession = await insertSessionIntoDB({
          createdAt: Date.now(),
          sessionContent: {},
          sessionID: 'a',
          updatedAt: Date.now() - inactivityTimeout * 1000 + 5000,
        });
        const expiredSession = await insertSessionIntoDB({
          createdAt: Date.now(),
          sessionContent: {},
          sessionID: 'b',
          updatedAt: Date.now() - inactivityTimeout * 1000,
        });

        let sessions = await readSessionsFromDB();
        strictEqual(sessions.length, 2);
        notStrictEqual(sessions.find(session => session.sessionID === currentSession.sessionID), undefined);
        notStrictEqual(sessions.find(session => session.sessionID === expiredSession.sessionID), undefined);

        await store.cleanUpExpiredSessions();

        sessions = await readSessionsFromDB();
        strictEqual(sessions.length, 1);
        notStrictEqual(sessions.find(session => session.sessionID === currentSession.sessionID), undefined);
        strictEqual(sessions.find(session => session.sessionID === expiredSession.sessionID), undefined);
      });

      it('should remove expired sessions due to absolute timeout.', async () => {
        const absoluteTimeout = SessionStore.getExpirationTimeouts().absolute;

        const currentSession = await insertSessionIntoDB({
          createdAt: Date.now() - absoluteTimeout * 1000 + 5000,
          sessionContent: {},
          sessionID: 'a',
          updatedAt: Date.now(),
        });
        const expiredSession = await insertSessionIntoDB({
          createdAt: Date.now() - absoluteTimeout * 1000,
          sessionContent: {},
          sessionID: 'b',
          updatedAt: Date.now(),
        });

        let sessions = await readSessionsFromDB();
        strictEqual(sessions.length, 2);
        notStrictEqual(sessions.find(session => session.sessionID === currentSession.sessionID), undefined);
        notStrictEqual(sessions.find(session => session.sessionID === expiredSession.sessionID), undefined);

        await store.cleanUpExpiredSessions();

        sessions = await readSessionsFromDB();
        strictEqual(sessions.length, 1);
        notStrictEqual(sessions.find(session => session.sessionID === currentSession.sessionID), undefined);
        strictEqual(sessions.find(session => session.sessionID === expiredSession.sessionID), undefined);
      });

    });

  });

}

describe('TypeORMStore', () => {

  testSuite('mysql');
  testSuite('mariadb');
  testSuite('sqlite');
  testSuite('postgres');

});
