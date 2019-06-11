// 3p
import { createConnection, getConnection, getRepository } from 'typeorm';

// FoalTS
import { createService, Session, SessionStore } from '@foal/core';
import { deepStrictEqual, notStrictEqual, strictEqual } from 'assert';
import { FoalSession, TypeORMStore } from './typeorm-store';

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
            entities: [ FoalSession ],
            password: 'test',
            synchronize: true,
            type,
            username: 'test',
          });
          break;
        case 'postgres':
          await createConnection({
            database: 'test',
            dropSchema: true,
            entities: [ FoalSession ],
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
            entities: [ FoalSession ],
            synchronize: true,
            type,
          });
          break;
        default:
          break;
      }
      store = createService(TypeORMStore);
    });

    beforeEach(() => getRepository(FoalSession).clear());

    after(() => getConnection().close());

    describe('has a "createAndSaveSession" method that', () => {

      it('should generate an ID and create a new session in the database.', async () => {
        const dateBefore = Date.now();
        await store.createAndSaveSession({ foo: 'bar' });
        const dateAfter = Date.now();

        const sessionA = await getRepository(FoalSession).findOne();
        if (!sessionA) {
          throw new Error('sessionA should be defined.');
        }
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

        const sessionA = await getRepository(FoalSession).findOne();
        if (!sessionA) {
          throw new Error('sessionA should be defined.');
        }
        strictEqual(session.sessionID, sessionA.sessionID);
        deepStrictEqual(session.getContent(), { foo: 'bar' });
        strictEqual(session.createdAt, parseInt(sessionA.createdAt.toString(), 10));
      });

    });

    describe('has a "update" method that', () => {

      it('should update the content of the session if the session exists.', async () => {
        const session1 = new FoalSession();
        session1.sessionID = 'a';
        session1.sessionContent = {};
        session1.createdAt = Date.now();
        session1.updatedAt = Date.now();

        const session2 = new FoalSession();
        session2.sessionID = 'b';
        session2.sessionContent = {};
        session2.createdAt = Date.now();
        session2.updatedAt = Date.now();

        await getRepository(FoalSession).save([ session1, session2 ]);

        await store.update(new Session(session1.sessionID, { bar: 'foo' }, session1.createdAt));

        const sessionA = await getRepository(FoalSession).findOne({ sessionID: session1.sessionID });
        if (!sessionA) {
          throw new Error('sessionA should be defined');
        }
        deepStrictEqual(sessionA.sessionContent, { bar: 'foo' });
        deepStrictEqual(parseInt(sessionA.createdAt.toString(), 10), session1.createdAt);

        const sessionB = await getRepository(FoalSession).findOne({ sessionID: session2.sessionID });
        if (!sessionB) {
          throw new Error('sessionB should be defined');
        }
        deepStrictEqual(sessionB.sessionContent, {});
        deepStrictEqual(parseInt(sessionB.createdAt.toString(), 10), session2.createdAt);
      });

      it('should update the lifetime (inactiviy) if the session exists.', async () => {
        const session1 = new FoalSession();
        session1.sessionID = 'a';
        session1.sessionContent = {};
        session1.createdAt = Date.now();
        session1.updatedAt = Date.now();

        const session2 = new FoalSession();
        session2.sessionID = 'b';
        session2.sessionContent = {};
        session2.createdAt = Date.now();
        session2.updatedAt = Date.now();

        await getRepository(FoalSession).save([ session1, session2 ]);

        const dateBefore = Date.now();
        await store.update(new Session(session1.sessionID, session1.sessionContent, session1.createdAt));
        const dateAfter = Date.now();

        const sessionA = await getRepository(FoalSession).findOne({ sessionID: session1.sessionID });
        if (!sessionA) {
          throw new Error('sessionA should be defined');
        }
        const updatedAtA = parseInt(sessionA.updatedAt.toString(), 10);
        strictEqual(dateBefore <= updatedAtA, true);
        strictEqual(updatedAtA <= dateAfter, true);

        const sessionB = await getRepository(FoalSession).findOne({ sessionID: session2.sessionID });
        if (!sessionB) {
          throw new Error('sessionB should be defined');
        }
        strictEqual(parseInt(sessionB.updatedAt.toString(), 10), session2.updatedAt);
      });

      it('should create the session if it does not exist (with the proper lifetime).', async () => {
        const session = new Session('aaa', { bar: 'foo' }, 36);

        const dateBefore = Date.now();
        await store.update(session);
        const dateAfter = Date.now();

        const sessionA = await getRepository(FoalSession).findOne({ sessionID: session.sessionID });
        if (!sessionA) {
          throw new Error('sessionA should be defined.');
        }
        strictEqual(sessionA.sessionID, session.sessionID);
        deepStrictEqual(sessionA.sessionContent, session.getContent());
        strictEqual(parseInt(sessionA.createdAt.toString(), 10), session.createdAt);

        const updatedAtA = parseInt(sessionA.updatedAt.toString(), 10);
        strictEqual(dateBefore <= updatedAtA, true);
        strictEqual(updatedAtA <= dateAfter, true);
      });

    });

    describe('has a "destroy" method that', () => {

      it('should delete the session from its ID.', async () => {
        const session1 = new FoalSession();
        session1.sessionID = 'a';
        session1.sessionContent = {};
        session1.createdAt = Date.now();
        session1.updatedAt = Date.now();

        const session2 = new FoalSession();
        session2.sessionID = 'b';
        session2.sessionContent = {};
        session2.createdAt = Date.now();
        session2.updatedAt = Date.now();

        await getRepository(FoalSession).save([ session1, session2 ]);

        strictEqual(await getRepository(FoalSession).count(), 2);

        await store.destroy(session1.sessionID);

        const sessions = await getRepository(FoalSession).find();
        strictEqual(sessions.length, 1);
        strictEqual(sessions.find(session => session.sessionID === session1.sessionID), undefined);
        notStrictEqual(sessions.find(session => session.sessionID === session2.sessionID), undefined);
      });

    });

    describe('has a "read" method that', () => {

      it('should return undefined if no session matches the ID.', async () => {
        strictEqual(await store.read('c'), undefined);
      });

      it('should return undefined if the session has expired (inactivity).', async () => {
        const inactivity = SessionStore.getExpirationTimeouts().inactivity;

        const session1 = new FoalSession();
        session1.sessionID = 'a';
        session1.sessionContent = {};
        session1.createdAt = Date.now();
        session1.updatedAt = Date.now() - inactivity * 1000;

        await getRepository(FoalSession).save(session1);

        const session = await store.read(session1.sessionID);
        strictEqual(session, undefined);
      });

      it('should delete the session if it has expired (inactivity).', async () => {
        const inactivity = SessionStore.getExpirationTimeouts().inactivity;

        const session1 = new FoalSession();
        session1.sessionID = 'a';
        session1.sessionContent = {};
        session1.createdAt = Date.now();
        session1.updatedAt = Date.now();

        const session2 = new FoalSession();
        session2.sessionID = 'b';
        session2.sessionContent = {};
        session2.createdAt = Date.now();
        session2.updatedAt = Date.now() - inactivity * 1000;

        await getRepository(FoalSession).save([ session1, session2 ]);

        let sessions = await getRepository(FoalSession).find();
        strictEqual(sessions.length, 2);
        notStrictEqual(sessions.find(session => session.sessionID === session1.sessionID), undefined);
        notStrictEqual(sessions.find(session => session.sessionID === session2.sessionID), undefined);

        await store.read(session2.sessionID);

        sessions = await getRepository(FoalSession).find();
        strictEqual(sessions.length, 1);
        notStrictEqual(sessions.find(session => session.sessionID === session1.sessionID), undefined);
        strictEqual(sessions.find(session => session.sessionID === session2.sessionID), undefined);
      });

      it('should return undefined if the session has expired (absolute).', async () => {
        const absolute = SessionStore.getExpirationTimeouts().absolute;

        const session1 = new FoalSession();
        session1.sessionID = 'a';
        session1.sessionContent = {};
        session1.createdAt = Date.now() - absolute * 1000;
        session1.updatedAt = Date.now();

        await getRepository(FoalSession).save(session1);

        const session = await store.read(session1.sessionID);
        strictEqual(session, undefined);
      });

      it('should delete the session if it has expired (absolute).', async () => {
        const absolute = SessionStore.getExpirationTimeouts().absolute;

        const session1 = new FoalSession();
        session1.sessionID = 'a';
        session1.sessionContent = {};
        session1.createdAt = Date.now();
        session1.updatedAt = Date.now();

        const session2 = new FoalSession();
        session2.sessionID = 'b';
        session2.sessionContent = {};
        session2.createdAt = Date.now() - absolute * 1000;
        session2.updatedAt = Date.now();

        await getRepository(FoalSession).save([ session1, session2 ]);

        let sessions = await getRepository(FoalSession).find();
        strictEqual(sessions.length, 2);
        notStrictEqual(sessions.find(session => session.sessionID === session1.sessionID), undefined);
        notStrictEqual(sessions.find(session => session.sessionID === session2.sessionID), undefined);

        await store.read(session2.sessionID);

        sessions = await getRepository(FoalSession).find();
        strictEqual(sessions.length, 1);
        notStrictEqual(sessions.find(session => session.sessionID === session1.sessionID), undefined);
        strictEqual(sessions.find(session => session.sessionID === session2.sessionID), undefined);
      });

      it('should return the session.', async () => {
        const session1 = new FoalSession();
        session1.sessionID = 'a';
        session1.sessionContent = {};
        session1.createdAt = Date.now();
        session1.updatedAt = Date.now();

        const session2 = new FoalSession();
        session2.sessionID = 'b';
        session2.sessionContent = { foo: 'bar' };
        session2.createdAt = Date.now();
        session2.updatedAt = Date.now();

        await getRepository(FoalSession).save([ session1, session2 ]);

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

        const session1 = new FoalSession();
        session1.sessionID = 'a';
        session1.sessionContent = {};
        session1.createdAt = Date.now();
        session1.updatedAt = Date.now() - Math.round(inactivity * 1000 / 2);

        const session2 = new FoalSession();
        session2.sessionID = 'b';
        session2.sessionContent = {};
        session2.createdAt = Date.now();
        session2.updatedAt = Date.now() - Math.round(inactivity * 1000 / 2);

        await getRepository(FoalSession).save([ session1, session2 ]);

        const dateBefore = Date.now();
        await store.extendLifeTime(session1.sessionID);
        const dateAfter = Date.now();

        const session = await getRepository(FoalSession).findOne({ sessionID: session1.sessionID });
        if (!session) {
          throw new Error('The session should exist.');
        }
        notStrictEqual(session1.updatedAt, session.updatedAt);
        strictEqual(dateBefore <= session.updatedAt, true);
        strictEqual(session.updatedAt <= dateAfter, true);

        const sessionB = await getRepository(FoalSession).findOne({ sessionID: session2.sessionID });
        if (!sessionB) {
          throw new Error('The session should exist.');
        }
        strictEqual(session2.updatedAt.toString(), sessionB.updatedAt.toString());
      });

      it('should not throw if no session matches the given session ID.', () => {
        return store.extendLifeTime('c');
      });

    });

    describe('has a "clear" method that', () => {

      it('should remove all sessions.', async () => {
        const session1 = new FoalSession();
        session1.sessionID = 'a';
        session1.sessionContent = {};
        session1.createdAt = Date.now();
        session1.updatedAt = Date.now();

        const session2 = new FoalSession();
        session2.sessionID = 'b';
        session2.sessionContent = {};
        session2.createdAt = Date.now();
        session2.updatedAt = Date.now();

        await getRepository(FoalSession).save([ session1, session2 ]);

        strictEqual(await getRepository(FoalSession).count(), 2);

        await store.clear();

        strictEqual(await getRepository(FoalSession).count(), 0);
      });

    });

    describe('has a "cleanUpExpiredSessions" method that', () => {

      it('should remove expired sessions due to inactivity.', async () => {
        const inactivityTimeout = SessionStore.getExpirationTimeouts().inactivity;

        const currentSession = new FoalSession();
        currentSession.sessionID = 'a';
        currentSession.sessionContent = {};
        currentSession.createdAt = Date.now();
        currentSession.updatedAt = Date.now() - inactivityTimeout * 1000 + 5000;

        const expiredSession = new FoalSession();
        expiredSession.sessionID = 'b';
        expiredSession.sessionContent = {};
        expiredSession.createdAt = Date.now();
        expiredSession.updatedAt = Date.now() - inactivityTimeout * 1000;

        await getRepository(FoalSession).save([ currentSession, expiredSession ]);

        let sessions = await getRepository(FoalSession).find();
        strictEqual(sessions.length, 2);
        notStrictEqual(sessions.find(session => session.sessionID === currentSession.sessionID), undefined);
        notStrictEqual(sessions.find(session => session.sessionID === expiredSession.sessionID), undefined);

        await store.cleanUpExpiredSessions();

        sessions = await getRepository(FoalSession).find();
        strictEqual(sessions.length, 1);
        notStrictEqual(sessions.find(session => session.sessionID === currentSession.sessionID), undefined);
        strictEqual(sessions.find(session => session.sessionID === expiredSession.sessionID), undefined);
      });

      it('should remove expired sessions due to absolute timeout.', async () => {
        const absoluteTimeout = SessionStore.getExpirationTimeouts().absolute;

        const currentSession = new FoalSession();
        currentSession.sessionID = 'a';
        currentSession.sessionContent = {};
        currentSession.createdAt = Date.now() - absoluteTimeout * 1000 + 5000;
        currentSession.updatedAt = Date.now();

        const expiredSession = new FoalSession();
        expiredSession.sessionID = 'b';
        expiredSession.sessionContent = {};
        expiredSession.createdAt = Date.now() - absoluteTimeout * 1000;
        expiredSession.updatedAt = Date.now();

        await getRepository(FoalSession).save([ currentSession, expiredSession ]);

        let sessions = await getRepository(FoalSession).find();
        strictEqual(sessions.length, 2);
        notStrictEqual(sessions.find(session => session.sessionID === currentSession.sessionID), undefined);
        notStrictEqual(sessions.find(session => session.sessionID === expiredSession.sessionID), undefined);

        await store.cleanUpExpiredSessions();

        sessions = await getRepository(FoalSession).find();
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
