// std
import { deepStrictEqual, notStrictEqual, strictEqual } from 'assert';

// 3p
import { ConfigMock, createService, Session, SessionStore } from '@foal/core';
import { MongoClient } from 'mongodb';

// FoalTS
import { MongoDBStore } from './mongodb-store.service';

interface PlainSession {
  _id: string;
  sessionContent: object;
  createdAt: number;
  updatedAt: number;
}

describe('MongoDBStore', () => {
  let store: MongoDBStore;
  const MONGODB_URI = 'mongodb://localhost:27017';
  const config = new ConfigMock();
  let mongoDBClient: MongoClient;

  async function insertSessionIntoDB(session: PlainSession): Promise<PlainSession> {
    await mongoDBClient.db().collection('foalSessions').insertOne(session);
    return session;
  }

  async function readSessionsFromDB(): Promise<PlainSession[]> {
    return mongoDBClient.db().collection('foalSessions').find({}).toArray();
  }

  async function findByID(sessionID: string): Promise<PlainSession> {
    const session = await mongoDBClient.db().collection('foalSessions').findOne({ _id: sessionID });
    if (!session) {
      throw new Error('Session not found');
    }
    return session;
  }

  before(async () => {
    mongoDBClient = await MongoClient.connect(MONGODB_URI);
    store = createService(MongoDBStore, { config });
  });

  beforeEach(async () => {
    config.reset();
    config.set('mongodb.uri', MONGODB_URI);
    await mongoDBClient.db().collection('foalSessions').remove({});
  });

  after(async () => Promise.all([
    mongoDBClient.close(),
    (await store.getMongoDBInstance()).close()
  ]));

  describe('has a "createAndSaveSession" method that', () => {

    it('should generate an ID and create a new session in the database.', async () => {
      const dateBefore = Date.now();
      await store.createAndSaveSession({ foo: 'bar' });
      const dateAfter = Date.now();

      const sessions = await readSessionsFromDB();
      strictEqual(sessions.length, 1);
      const sessionA = sessions[0];

      notStrictEqual(sessionA._id, undefined);
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

      strictEqual(session.sessionID, sessionA._id);
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
        _id: 'a',
        createdAt: Date.now(),
        sessionContent: {},
        updatedAt: Date.now(),
      });
      const session2 = await insertSessionIntoDB({
        _id: 'b',
        createdAt: Date.now(),
        sessionContent: {},
        updatedAt: Date.now(),
      });

      await store.update(new Session(session1._id, { bar: 'foo' }, session1.createdAt));

      const sessionA = await findByID(session1._id);
      deepStrictEqual(sessionA.sessionContent, { bar: 'foo' });
      deepStrictEqual(sessionA.createdAt, session1.createdAt);

      const sessionB = await findByID(session2._id);
      deepStrictEqual(sessionB.sessionContent, {});
      deepStrictEqual(sessionB.createdAt, session2.createdAt);
    });

    it('should update the lifetime (inactiviy) if the session exists.', async () => {
      const session1 = await insertSessionIntoDB({
        _id: 'a',
        createdAt: Date.now(),
        sessionContent: {},
        updatedAt: Date.now(),
      });
      const session2 = await insertSessionIntoDB({
        _id: 'b',
        createdAt: Date.now(),
        sessionContent: {},
        updatedAt: Date.now(),
      });

      const dateBefore = Date.now();
      await store.update(new Session(session1._id, session1.sessionContent, session1.createdAt));
      const dateAfter = Date.now();

      const sessionA = await findByID(session1._id);
      const updatedAtA = sessionA.updatedAt;
      strictEqual(dateBefore <= sessionA.updatedAt, true);
      strictEqual(updatedAtA <= dateAfter, true);

      const sessionB = await findByID(session2._id);
      strictEqual(sessionB.updatedAt, session2.updatedAt);
    });

  });

  describe('has a "destroy" method that', () => {

    it('should delete the session from its ID.', async () => {
      const session1 = await insertSessionIntoDB({
        _id: 'a',
        createdAt: Date.now(),
        sessionContent: {},
        updatedAt: Date.now(),
      });
      const session2 = await insertSessionIntoDB({
        _id: 'b',
        createdAt: Date.now(),
        sessionContent: {},
        updatedAt: Date.now(),
      });

      strictEqual((await readSessionsFromDB()).length, 2);

      await store.destroy(session1._id);

      const sessions = await readSessionsFromDB();
      strictEqual(sessions.length, 1);
      strictEqual(sessions.find(session => session._id === session1._id), undefined);
      notStrictEqual(sessions.find(session => session._id === session2._id), undefined);
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
        _id: 'a',
        createdAt: Date.now(),
        sessionContent: {},
        updatedAt: Date.now() - inactivity * 1000,
      });

      const session = await store.read(session1._id);
      strictEqual(session, undefined);
    });

    it('should delete the session if it has expired (inactivity).', async () => {
      const inactivity = SessionStore.getExpirationTimeouts().inactivity;
      const session1 = await insertSessionIntoDB({
        _id: 'a',
        createdAt: Date.now(),
        sessionContent: {},
        updatedAt: Date.now(),
      });
      const session2 = await insertSessionIntoDB({
        _id: 'b',
        createdAt: Date.now(),
        sessionContent: {},
        updatedAt: Date.now() - inactivity * 1000,
      });

      let sessions = await readSessionsFromDB();
      strictEqual(sessions.length, 2);
      notStrictEqual(sessions.find(session => session._id === session1._id), undefined);
      notStrictEqual(sessions.find(session => session._id === session2._id), undefined);

      await store.read(session2._id);

      sessions = await readSessionsFromDB();
      strictEqual(sessions.length, 1);
      notStrictEqual(sessions.find(session => session._id === session1._id), undefined);
      strictEqual(sessions.find(session => session._id === session2._id), undefined);
    });

    it('should return undefined if the session has expired (absolute).', async () => {
      const absolute = SessionStore.getExpirationTimeouts().absolute;

      const session1 = await insertSessionIntoDB({
        _id: 'a',
        createdAt: Date.now() - absolute * 1000,
        sessionContent: {},
        updatedAt: Date.now(),
      });

      const session = await store.read(session1._id);
      strictEqual(session, undefined);
    });

    it('should delete the session if it has expired (absolute).', async () => {
      const absolute = SessionStore.getExpirationTimeouts().absolute;

      const session1 = await insertSessionIntoDB({
        _id: 'a',
        createdAt: Date.now(),
        sessionContent: {},
        updatedAt: Date.now(),
      });
      const session2 = await insertSessionIntoDB({
        _id: 'b',
        createdAt: Date.now() - absolute * 1000,
        sessionContent: {},
        updatedAt: Date.now(),
      });

      let sessions = await readSessionsFromDB();
      strictEqual(sessions.length, 2);
      notStrictEqual(sessions.find(session => session._id === session1._id), undefined);
      notStrictEqual(sessions.find(session => session._id === session2._id), undefined);

      await store.read(session2._id);

      sessions = await readSessionsFromDB();
      strictEqual(sessions.length, 1);
      notStrictEqual(sessions.find(session => session._id === session1._id), undefined);
      strictEqual(sessions.find(session => session._id === session2._id), undefined);
    });

    it('should return the session.', async () => {
      await insertSessionIntoDB({
        _id: 'a',
        createdAt: Date.now(),
        sessionContent: {},
        updatedAt: Date.now(),
      });
      const session2 = await insertSessionIntoDB({
        _id: 'b',
        createdAt: Date.now(),
        sessionContent: { foo: 'bar' },
        updatedAt: Date.now(),
      });

      const session = await store.read(session2._id);
      if (!session) {
        throw new Error('TypeORMStore.read should not return undefined.');
      }
      strictEqual(session.sessionID, session2._id);
      strictEqual(session.get('foo'), 'bar');
      strictEqual(session.createdAt, session2.createdAt);
    });

  });

  describe('has a "extendLifeTime" method that', () => {

    it('should extend the lifetime of session (inactivity).', async () => {
      const inactivity = SessionStore.getExpirationTimeouts().inactivity;

      const session1 = await insertSessionIntoDB({
        _id: 'a',
        createdAt: Date.now(),
        sessionContent: {},
        updatedAt: Date.now() - Math.round(inactivity * 1000 / 2),
      });
      const session2 = await insertSessionIntoDB({
        _id: 'b',
        createdAt: Date.now(),
        sessionContent: {},
        updatedAt: Date.now() - Math.round(inactivity * 1000 / 2),
      });

      const dateBefore = Date.now();
      await store.extendLifeTime(session1._id);
      const dateAfter = Date.now();

      const session = await findByID(session1._id);
      notStrictEqual(session1.updatedAt, session.updatedAt);
      strictEqual(dateBefore <= session.updatedAt, true);
      strictEqual(session.updatedAt <= dateAfter, true);

      const sessionB = await findByID(session2._id);
      strictEqual(session2.updatedAt, sessionB.updatedAt);
    });

    it('should not throw if no session matches the given session ID.', () => {
      return store.extendLifeTime('c');
    });

  });

  describe('has a "clear" method that', () => {

    it('should remove all sessions.', async () => {
      await insertSessionIntoDB({
        _id: 'a',
        createdAt: Date.now(),
        sessionContent: {},
        updatedAt: Date.now(),
      });
      await insertSessionIntoDB({
        _id: 'b',
        createdAt: Date.now(),
        sessionContent: { foo: 'bar' },
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
        _id: 'a',
        createdAt: Date.now(),
        sessionContent: {},
        updatedAt: Date.now() - inactivityTimeout * 1000 + 5000,
      });
      const expiredSession = await insertSessionIntoDB({
        _id: 'b',
        createdAt: Date.now(),
        sessionContent: {},
        updatedAt: Date.now() - inactivityTimeout * 1000,
      });

      let sessions = await readSessionsFromDB();
      strictEqual(sessions.length, 2);
      notStrictEqual(sessions.find(session => session._id === currentSession._id), undefined);
      notStrictEqual(sessions.find(session => session._id === expiredSession._id), undefined);

      await store.cleanUpExpiredSessions();

      sessions = await readSessionsFromDB();
      strictEqual(sessions.length, 1);
      notStrictEqual(sessions.find(session => session._id === currentSession._id), undefined);
      strictEqual(sessions.find(session => session._id === expiredSession._id), undefined);
    });

    it('should remove expired sessions due to absolute timeout.', async () => {
      const absoluteTimeout = SessionStore.getExpirationTimeouts().absolute;

      const currentSession = await insertSessionIntoDB({
        _id: 'a',
        createdAt: Date.now() - absoluteTimeout * 1000 + 5000,
        sessionContent: {},
        updatedAt: Date.now(),
      });
      const expiredSession = await insertSessionIntoDB({
        _id: 'b',
        createdAt: Date.now() - absoluteTimeout * 1000,
        sessionContent: {},
        updatedAt: Date.now(),
      });

      let sessions = await readSessionsFromDB();
      strictEqual(sessions.length, 2);
      notStrictEqual(sessions.find(session => session._id === currentSession._id), undefined);
      notStrictEqual(sessions.find(session => session._id === expiredSession._id), undefined);

      await store.cleanUpExpiredSessions();

      sessions = await readSessionsFromDB();
      strictEqual(sessions.length, 1);
      notStrictEqual(sessions.find(session => session._id === currentSession._id), undefined);
      strictEqual(sessions.find(session => session._id === expiredSession._id), undefined);
    });

  });

});
