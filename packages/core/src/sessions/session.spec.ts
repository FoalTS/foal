// std
import { deepStrictEqual, strictEqual } from 'assert';

// FoalTS
import { Session } from './session';
import { SessionState } from './session-state.interface';
import { SessionOptions, SessionStore } from './session-store';

describe('Session', () => {

  class ConcreteSessionStore extends SessionStore {
    createAndSaveSession(sessionContent: object, options?: SessionOptions | undefined): Promise<Session> {
      throw new Error('Method not implemented.');
    }
    update(state: SessionState): Promise<void> {
      throw new Error('Method not implemented.');
    }
    destroy(sessionID: string): Promise<void> {
      throw new Error('Method not implemented.');
    }
    read(sessionID: string): Promise<SessionState | undefined> {
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
      const session = new Session(store, {
        content: {},
        createdAt: 3,
        flash: {},
        id: 'xxx',
      });
      strictEqual(session.store, store);
      strictEqual(session.getState().id, 'xxx');
      strictEqual(session.getState().createdAt, 3);
    });

    it('should set the readonly property "userId" if it is property in the constructor', () => {
      const store = new ConcreteSessionStore();

      const session1 = new Session(store, { id: 'xxx', content: {}, createdAt: 3, flash: {}, });
      strictEqual(session1.getState().userId, undefined);

      const session2 = new Session(store, { id: 'xxx', content: {}, createdAt: 3, userId: 'e', flash: {}, });
      strictEqual(session2.getState().userId, 'e');

      const session3 = new Session(store, { id: 'xxx', content: {}, createdAt: 3, userId: 22, flash: {}, });
      strictEqual(session3.getState().userId, 22);
    });

    it('should not be "modified" if flash is empty.', () => {
      const session = new Session(new ConcreteSessionStore(), { id: 'xxx', content: {}, createdAt: 0, flash: {}, });
      strictEqual(session.isModified, false);
    });

    it('should not "modified" if flash is not empty.', () => {
      const session = new Session(
        new ConcreteSessionStore(),
        { id: 'xxx', content: {}, createdAt: 0, flash: { bar: 'foo' }, })
      ;
      strictEqual(session.isModified, true);
    });

  });

  describe('has a "get" method that', () => {

    it('should return the value of the key given in the param "content" during instantiation.', () => {
      const session = new Session(new ConcreteSessionStore(), {
        content: { foo: 'bar' },
        createdAt: 0,
        flash: {},
        id: '',
      });
      strictEqual(session.get('foo'), 'bar');
    });

    it('should return the value of the key given in the param "flash" during instantiation.', () => {
      const session = new Session(new ConcreteSessionStore(), {
        content: {},
        createdAt: 0,
        flash: { foo: 'bar' },
        id: '',
      });
      strictEqual(session.get('foo'), 'bar');
    });

    it('should return the default value if the key does not exist.', () => {
      const session = new Session(new ConcreteSessionStore(), {
        content: { foo: 'bar' },
        createdAt: 0,
        flash: {},
        id: '',
      });
      strictEqual(session.get<string>('foobar', 'barfoo'), 'barfoo');
    });

    it('should return undefined if there is no default value and if the key does not exist.', () => {
      const session = new Session(new ConcreteSessionStore(), {
        content: { foo: 'bar' },
        createdAt: 0,
        flash: {},
        id: '',
      });
      strictEqual(session.get('foobar'), undefined);
    });

  });

  describe('has a "set" method that', () => {

    it('should modify the session content...', () => {
      const session = new Session(new ConcreteSessionStore(), { id: '', content: {}, createdAt: 0, flash: {}, });
      session.set('foo', 'bar');
      strictEqual(session.get('foo'), 'bar');
    });

    it('...and mark it as modified.', () => {
      const session = new Session(new ConcreteSessionStore(), { id: '', content: {}, createdAt: 0, flash: {}, });
      strictEqual(session.isModified, false);

      session.set('foo', 'bar');
      strictEqual(session.isModified, true);
    });

    it('should modifu the session flash content if the flash option is true.', () => {
      const session = new Session(new ConcreteSessionStore(), { id: '', content: {}, createdAt: 0, flash: {}, });
      session.set('foo', 'bar', { flash: true });
      deepStrictEqual(session.getState().flash, { foo: 'bar' });
    });

  });

  describe('has a "getToken" method that', () => {

    it('should return the session ID.', () => {
      const sessionID = 'zMd0TkVoMlj7qrJ54+G3idn0plDwQGqS/n6VVwKC4qM=';
      const session = new Session(new ConcreteSessionStore(), { id: sessionID, content: {}, createdAt: 0, flash: {}, });
      const token = session.getToken();

      strictEqual(
        token,
        sessionID
      );
    });

  });

  describe('has a "getState" method that', () => {

    it('should return the session state', () => {
      const content = { foo: 'bar' };
      const id = 'a';
      const createdAt = 888888888;
      const userId = 'xxx';
      const session = new Session(
        new ConcreteSessionStore(),
        { id, content, createdAt, userId, flash: { hello: 'world' }, }
      );
      session.set('foo', 'bar', { flash: true });

      deepStrictEqual(session.getState().content, { foo: 'bar' });
      strictEqual(session.getState().id, id);
      strictEqual(session.getState().createdAt, createdAt);
      strictEqual(session.getState().userId, userId);
      deepStrictEqual(session.getState().flash, { foo: 'bar' });
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
      const session = new Session(store, { id: 'a', content: {}, createdAt: 0, flash: {}, });

      await session.destroy();
      strictEqual(store.calledWith, 'a');
    });

    it('should make this.isDestroyed return "true".', async () => {
      const store = new ConcreteSessionStore2();
      const session = new Session(store, { id: 'a', content: {}, createdAt: 0, flash: {}, });

      strictEqual(session.isDestroyed, false);
      await session.destroy();
      strictEqual(session.isDestroyed, true);
    });
  });

});
