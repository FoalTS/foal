// std
import { deepStrictEqual, rejects, strictEqual } from 'assert';

// FoalTS
import { createService } from '../core';
import { Session } from './session';
import { SessionState } from './session-state.interface';
import { SessionOptions, SessionStore } from './session-store';

describe('Session', () => {

  class ConcreteSessionStore extends SessionStore {
    // saveCalledWith: SessionState;
    updateCalledWith: SessionState | undefined;
    destroyCalledWith: string | undefined;

    createAndSaveSession(sessionContent: object, options?: SessionOptions | undefined): Promise<Session> {
      throw new Error('Method not implemented.');
    }
    async update(state: SessionState): Promise<void> {
      this.updateCalledWith = state;
    }
    async destroy(id: string): Promise<void> {
      this.destroyCalledWith = id;
    }
    read(id: string): Promise<SessionState | undefined> {
      throw new Error('Method not implemented.');
    }
    clear(): Promise<void> {
      throw new Error('Method not implemented.');
    }
    cleanUpExpiredSessions(): Promise<void> {
      throw new Error('Method not implemented.');
    }
  }

  let store: ConcreteSessionStore;

  beforeEach(() => store = createService(ConcreteSessionStore));

  describe('when it is instanciated', () => {

    it('should set three readonly properties "store", "sessionID", "createdAt" and "updatedAt" from the given arguments.', () => {
      const store = new ConcreteSessionStore();
      const session = new Session(
        store,
        {
          content: {},
          createdAt: 3,
          flash: {},
          id: 'xxx',
          updatedAt: 4,
          userId: null,
        },
        { exists: true }
      );
      strictEqual(session.store, store);
      strictEqual(session.getState().id, 'xxx');
      strictEqual(session.getState().createdAt, 3);
      strictEqual(session.getState().updatedAt, 4);
    });

    it('should set the readonly property "userId" if it is property in the constructor', () => {
      const store = new ConcreteSessionStore();

      const session1 = new Session(
        store,
        {
          content: {},
          createdAt: 3,
          flash: {},
          id: 'xxx',
          updatedAt: 0,
          userId: null,
        },
      { exists: true }
    );
      strictEqual(session1.getState().userId, null);

      const session2 = new Session(
        store,
          {
          content: {},
          createdAt: 3,
          flash: {},
          id: 'xxx',
          updatedAt: 0,
          userId: 'e',
        },
        { exists: true }
      );
      strictEqual(session2.getState().userId, 'e');

      const session3 = new Session(
        store,
        {
          content: {},
          createdAt: 3,
          flash: {},
          id: 'xxx',
          updatedAt: 0,
          userId: 22,
        },
        { exists: true }
      );
      strictEqual(session3.getState().userId, 22);
    });

  });

  describe('has a "get" method that', () => {

    it('should return the value of the key given in the param "content" during instantiation.', () => {
      const session = new Session(
        new ConcreteSessionStore(),
        {
          content: { foo: 'bar' },
          createdAt: 0,
          flash: {},
          id: '',
          updatedAt: 0,
          userId: null,
        },
        { exists: true }
      );
      strictEqual(session.get('foo'), 'bar');
    });

    it('should return the value of the key given in the param "flash" during instantiation.', () => {
      const session = new Session(
        new ConcreteSessionStore(),
        {
          content: {},
          createdAt: 0,
          flash: { foo: 'bar' },
          id: '',
          updatedAt: 0,
          userId: null,
        },
        { exists: true }
      );
      strictEqual(session.get('foo'), 'bar');
    });

    it('should return the default value if the key does not exist.', () => {
      const session = new Session(
        new ConcreteSessionStore(),
        {
          content: { foo: 'bar' },
          createdAt: 0,
          flash: {},
          id: '',
          updatedAt: 0,
          userId: null,
        },
        { exists: true }
      );
      strictEqual(session.get<string>('foobar', 'barfoo'), 'barfoo');
    });

    it('should return undefined if there is no default value and if the key does not exist.', () => {
      const session = new Session(
        new ConcreteSessionStore(),
          {
          content: { foo: 'bar' },
          createdAt: 0,
          flash: {},
          id: '',
          updatedAt: 0,
          userId: null,
        },
        { exists: true }
      );
      strictEqual(session.get('foobar'), undefined);
    });

  });

  describe('has a "set" method that', () => {

    it('should modify the session content...', () => {
      const session = new Session(
        new ConcreteSessionStore(),
        {
          content: {},
          createdAt: 0,
          flash: {},
          id: '',
          updatedAt: 0,
          userId: null,
        },
        { exists: true }
      );
      session.set('foo', 'bar');
      strictEqual(session.get('foo'), 'bar');
    });

    it('should modifu the session flash content if the flash option is true.', () => {
      const session = new Session(
        new ConcreteSessionStore(),
        {
          content: {},
          createdAt: 0,
          flash: {},
          id: '',
          updatedAt: 0,
          userId: null,
        },
        { exists: true }
      );
      session.set('foo', 'bar', { flash: true });
      deepStrictEqual(session.getState().flash, { foo: 'bar' });
    });

  });

  describe('has a "getToken" method that', () => {

    it('should return the session ID.', () => {
      const sessionID = 'zMd0TkVoMlj7qrJ54+G3idn0plDwQGqS/n6VVwKC4qM=';
      const session = new Session(
        new ConcreteSessionStore(),
        {
          content: {},
          createdAt: 0,
          flash: {},
          id: sessionID,
          updatedAt: 0,
          userId: null,
        },
        { exists: true }
      );
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
        {
          content,
          createdAt,
          flash: { hello: 'world' },
          id,
          updatedAt: 0,
          userId,
        },
        { exists: true }
      );
      session.set('foo', 'bar', { flash: true });

      deepStrictEqual(session.getState().content, { foo: 'bar' });
      strictEqual(session.getState().id, id);
      strictEqual(session.getState().createdAt, createdAt);
      strictEqual(session.getState().userId, userId);
      deepStrictEqual(session.getState().flash, { foo: 'bar' });
    });

  });

  describe('has a "commit" method that', () => {

    // Warning: immutable objects must be used in these tests.

    let session: Session;

    function shouldSaveTheSession(): void {
      xit('should save the session.');
    }
    function shouldUpdateTheSession(state: SessionState): void {
      it('should update the session.', async () => {
        // TODO: add the test on flash.
        // C'est ici que l'on teste set(flash or not), setUser conjointement avec le test sur get
        // with the proper createdAt, content, etc value.
        // with an updated updatedAt field.
        // with the proper flash session.
        const dateBefore = Date.now();
        await session.commit();
        const dateAfter = Date.now();

        if (!store.updateCalledWith) {
          throw new Error('SessionStore.update should have been called.');
        }

        strictEqual(dateBefore <= store.updateCalledWith.updatedAt, true);
        strictEqual(dateAfter >= store.updateCalledWith.updatedAt, true);

        delete store.updateCalledWith.updatedAt;
        delete state.updatedAt;
        deepStrictEqual(store.updateCalledWith, state);
      });
    }

    function shouldNotSaveTheSession(): void {
      xit('should NOT save the session.');
    }
    function shouldNotUpdateTheSession(): void {
      it('should NOT update the session.', async () => {
        await session.commit();
        strictEqual(store.updateCalledWith, undefined);
      });
    }
    context('given the session has been created with exists=true', () => {
      shouldNotSaveTheSession();
      shouldUpdateTheSession();
    });

    context('given the session has been created with exists=false', () => {

      context('and the session has NOT been commited yet', () => {
        shouldSaveTheSession();
        shouldNotUpdateTheSession();
      });
      context('and the session has already been commited', () => {
        shouldNotSaveTheSession();
        shouldUpdateTheSession();
      });

    });

    // context('given the session ID has been re-generated', () => {
    //   it('should destroy the previous session.');
    //   it('should save the new session.');
    // });

    context('given the "destroy" method has been called', () => {

      beforeEach(async () => {
        session = new Session(
          store,
          {
            content: {},
            createdAt: 0,
            flash: {},
            id: 'xxx',
            updatedAt: 0,
            userId: null,
          },
          { exists: true }
        );
        await session.destroy();
      });

      it('should throw an error.', async () => {
        await rejects(
          () => session.commit(),
          {
            message: 'Impossible to commit the session. Session already destroyed.'
          }
        );
      });

    });

  });

  describe('has a "destroy" method that', () => {

    it('should call the "destroy" method of the store to destroy itself.', async () => {
      const session = new Session(
        store,
        {
          content: {},
          createdAt: 0,
          flash: {},
          id: 'a',
          updatedAt: 0,
          userId: null,
        },
        { exists: true }
      );

      await session.destroy();
      strictEqual(store.destroyCalledWith, 'a');
    });

  });

  describe('has a "isDestroyed" property that', () => {

    it('should return false if the session has NOT been destroyed.', () => {
      const session = new Session(
        store,
        {
          content: {},
          createdAt: 0,
          flash: {},
          id: 'xxx',
          updatedAt: 0,
          userId: null,
        },
        { exists: true }
      );
      strictEqual(session.isDestroyed, false);
    });

    it('should return true if the session has been destroyed.', async () => {
      const session = new Session(
        store,
          {
          content: {},
          createdAt: 0,
          flash: {},
          id: 'xxx',
          updatedAt: 0,
          userId: null,
        },
        { exists: true }
      );
      await session.destroy();
      strictEqual(session.isDestroyed, true);
    });

  });

});
