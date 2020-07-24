// std
import { deepStrictEqual, notStrictEqual, strictEqual } from 'assert';

// FoalTS
import { Session } from './session';
import { SessionOptions, SessionStore } from './session-store';

describe('Session', () => {

  class ConcreteSessionStore extends SessionStore {
    createAndSaveSession(sessionContent: object, options?: SessionOptions | undefined): Promise<Session> {
      throw new Error('Method not implemented.');
    }
    update(session: Session): Promise<void> {
      throw new Error('Method not implemented.');
    }
    destroy(sessionID: string): Promise<void> {
      throw new Error('Method not implemented.');
    }
    read(sessionID: string): Promise<Session | undefined> {
      throw new Error('Method not implemented.');
    }
    extendLifeTime(sessionID: string): Promise<void> {
      throw new Error('Method not implemented.');
    }
    clear(): Promise<void> {
      throw new Error('Method not implemented.');
    }
    cleanUpExpiredSessions(): Promise<void> {
      throw new Error('Method not implemented.');
    }
  }

  describe('when it is instanciated', () => {

    it('should set three readonly properties "store", "sessionID" and "createdAt" from the given arguments.', () => {
      const store = new ConcreteSessionStore();
      const session = new Session({ store, id: 'xxx', content: {}, createdAt: 3 });
      strictEqual((session as any).store, store);
      strictEqual(session.sessionID, 'xxx');
      strictEqual(session.createdAt, 3);
    });

    it('should not be "modified".', () => {
      const session = new Session({ store: new ConcreteSessionStore(), id: 'xxx', content: {}, createdAt: 0 });
      strictEqual(session.isModified, false);
    });

  });

  describe('has a "get" method that', () => {

    it('should return the value of the key given in the param "content" during instantiation.', () => {
      const session = new Session({ store: new ConcreteSessionStore(), id: '', content: { foo: 'bar' }, createdAt: 0 });
      strictEqual(session.get('foo'), 'bar');
    });

    it('should return the default value if the key does not exist.', () => {
      const session = new Session({ store: new ConcreteSessionStore(), id: '', content: { foo: 'bar' }, createdAt: 0 });
      strictEqual(session.get<string>('foobar', 'barfoo'), 'barfoo');
    });

    it('should return undefined if there is no default value and if the key does not exist.', () => {
      const session = new Session({ store: new ConcreteSessionStore(), id: '', content: { foo: 'bar' }, createdAt: 0 });
      strictEqual(session.get('foobar'), undefined);
    });

  });

  describe('has a "set" method that', () => {

    it('should modify the session content...', () => {
      const session = new Session({ store: new ConcreteSessionStore(), id: '', content: {}, createdAt: 0 });
      session.set('foo', 'bar');
      strictEqual(session.get('foo'), 'bar');
    });

    it('...and mark it as modified.', () => {
      const session = new Session({ store: new ConcreteSessionStore(), id: '', content: {}, createdAt: 0 });
      strictEqual(session.isModified, false);

      session.set('foo', 'bar');
      strictEqual(session.isModified, true);
    });

  });

  describe('has a "getToken" method that', () => {

    it('should return the session ID.', () => {
      const sessionID = 'zMd0TkVoMlj7qrJ54+G3idn0plDwQGqS/n6VVwKC4qM=';
      const session = new Session({ store: new ConcreteSessionStore(), id: sessionID, content: {}, createdAt: 0 });
      const token = session.getToken();

      strictEqual(
        token,
        sessionID
      );
    });

  });

  describe('has a "getContent" method that', () => {

    it('should return a copy of the session content', () => {
      const content = { foo: 'bar' };
      const session = new Session({ store: new ConcreteSessionStore(), id: 'a', content, createdAt: 0 });

      deepStrictEqual(session.getContent(), content);
      notStrictEqual(session.getContent(), content);
    });

  });

  describe('has a "destroy" method that', () => {

    class ConcreteSessionStore2 extends ConcreteSessionStore {
      calledWith: string|undefined;

      async destroy(sessionID: string): Promise<void> {
        this.calledWith = sessionID;
      }
    }

    it('should call the "destroy" method of the store to destroy itself.', async () => {
      const store = new ConcreteSessionStore2();
      const session = new Session({ store, id: 'a', content: {}, createdAt: 0 });

      await session.destroy();
      strictEqual(store.calledWith, 'a');
    });

    it('should make this.isDestroyed return "true".', async () => {
      const store = new ConcreteSessionStore2();
      const session = new Session({ store, id: 'a', content: {}, createdAt: 0 });

      strictEqual(session.isDestroyed, false);
      await session.destroy();
      strictEqual(session.isDestroyed, true);
    });
  });

});
