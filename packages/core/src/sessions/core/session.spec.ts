// std
import { deepStrictEqual, notStrictEqual, rejects, strictEqual } from 'assert';

// FoalTS
import { Config, ConfigTypeError, createService } from '../../core';
import { SESSION_DEFAULT_ABSOLUTE_TIMEOUT, SESSION_DEFAULT_INACTIVITY_TIMEOUT } from './constants';
import { Session } from './session';
import { SessionState } from './session-state.interface';
import {  SessionStore } from './session-store';

function createState(): SessionState {
  return {
    content: {},
    createdAt: 0,
    flash: {
      hello2: 'world'
    },
    id: '',
    updatedAt: 0,
    userId: null,
  };
}

describe('Session', () => {

  class ConcreteSessionStore extends SessionStore {

    saveCalledWith: { state: SessionState, maxInactivity: number } | undefined;
    // read
    updateCalledWith: { state: SessionState, maxInactivity: number } | undefined;
    destroyCalledWith: string | undefined;
    // clear
    cleanUpExpiredSessionsCalledWith: { maxInactivity: number, maxLifeTime: number } | undefined;

    async save(state: SessionState, maxInactivity: number): Promise<void> {
      // This line is required to test the use of "await".
      await new Promise<void>(resolve => setTimeout(() => resolve(), 0));
      this.saveCalledWith = { state, maxInactivity };
    }
    read(id: string): Promise<SessionState | null> {
      throw new Error('Method not implemented.');
    }
    async update(state: SessionState, maxInactivity: number): Promise<void> {
      // This line is required to test the use of "await".
      await new Promise<void>(resolve => setTimeout(() => resolve(), 0));
      this.updateCalledWith = { state, maxInactivity };
    }
    async destroy(id: string): Promise<void> {
      // This line is required to test the use of "await".
      await new Promise<void>(resolve => setTimeout(() => resolve(), 0));
      this.destroyCalledWith = id;
    }
    clear(): Promise<void> {
      throw new Error('Method not implemented.');
    }
    async cleanUpExpiredSessions(maxInactivity: number, maxLifeTime: number): Promise<void> {
      // These lines are required to test the use of "await".
      await new Promise<void>(resolve => setTimeout(() => resolve(), 0));
      await new Promise<void>(resolve => setTimeout(() => resolve(), 0));
      this.cleanUpExpiredSessionsCalledWith = { maxInactivity, maxLifeTime };
    }
  }

  let store: ConcreteSessionStore;

  beforeEach(() => {
    store = createService(ConcreteSessionStore);
  });

  describe('has a "userId" property that', () => {

    it('should return the user ID.', () => {
      const session = new Session(
        store,
        {
          ...createState(),
          userId: 3
        },
        { exists: true }
      );
      strictEqual(session.userId, 3);
    });

  });

  describe('has a "isExpired" property that', () => {

    afterEach(() => {
      Config.remove('settings.session.expirationTimeouts.inactivity');
      Config.remove('settings.session.expirationTimeouts.absolute');
    });

    it('should return false is the session has not expired.', () => {
      const session = new Session(
        store,
        {
          ...createState(),
          createdAt: Math.floor(Date.now() / 1000),
          updatedAt: Math.floor(Date.now() / 1000),
        },
        { exists: true }
      );
      strictEqual(session.isExpired, false);
    });

    it('should return true is the session has expired (inactivity, default timeout).', () => {
      const session = new Session(
        store,
        {
          ...createState(),
          createdAt: Math.floor(Date.now() / 1000),
          updatedAt: Math.floor(Date.now() / 1000) - SESSION_DEFAULT_INACTIVITY_TIMEOUT,
        },
        { exists: true }
      );
      strictEqual(session.isExpired, true);
    });

    it('should return true is the session has expired (absolute, default timeout).', () => {
      const session = new Session(
        store,
        {
          ...createState(),
          createdAt: Math.floor(Date.now() / 1000) - SESSION_DEFAULT_ABSOLUTE_TIMEOUT,
          updatedAt: Math.floor(Date.now() / 1000),
        },
        { exists: true }
      );
      strictEqual(session.isExpired, true);
    });

    it('should return true is the session has expired (inactivity, custom timeout).', () => {
      const timeout = Math.floor(SESSION_DEFAULT_INACTIVITY_TIMEOUT / 2);
      Config.set('settings.session.expirationTimeouts.inactivity', timeout);

      const session = new Session(
        store,
        {
          ...createState(),
          createdAt: Math.floor(Date.now() / 1000),
          updatedAt: Math.floor(Date.now() / 1000) - timeout,
        },
        { exists: true }
      );
      strictEqual(session.isExpired, true);
    });

    it('should return true is the session has expired (absolute, custom timeout).', () => {
      const timeout = Math.floor(SESSION_DEFAULT_ABSOLUTE_TIMEOUT / 2);
      Config.set('settings.session.expirationTimeouts.absolute', timeout);

      const session = new Session(
        store,
        {
          ...createState(),
          createdAt: Math.floor(Date.now() / 1000) - timeout,
          updatedAt: Math.floor(Date.now() / 1000),
        },
        { exists: true }
      );
      strictEqual(session.isExpired, true);
    });

  });

  describe('has an "expirationTime" property that', () => {

    afterEach(() => {
      Config.remove('settings.session.expirationTimeouts.inactivity');
      Config.remove('settings.session.expirationTimeouts.absolute');
    });

    describe('should return the session expiration time in seconds', () => {

      // Note: SESSION_DEFAULT_INACTIVITY_TIMEOUT is always << SESSION_DEFAULT_ABSOLUTE_TIMEOUT.

      it('when updatedAt + timeout < createdAt + timeout.', () => {
        const state: SessionState = {
          ...createState(),
          createdAt: 1,
          updatedAt: 1,
        };
        const session = new Session(
          store,
          state,
          { exists: true },
        );

        strictEqual(session.expirationTime, state.updatedAt + SESSION_DEFAULT_INACTIVITY_TIMEOUT);
      });

      it('when updatedAt + timeout < createdAt + timeout (custom timeout).', () => {
        const timeout = Math.floor(SESSION_DEFAULT_INACTIVITY_TIMEOUT / 2);
        Config.set('settings.session.expirationTimeouts.inactivity', timeout);

        const state: SessionState = {
          ...createState(),
          createdAt: 1,
          updatedAt: 1,
        };
        const session = new Session(
          store,
          state,
          { exists: true },
        );

        strictEqual(session.expirationTime, state.updatedAt + timeout);
      });

      it('when createdAt + timeout < updatedAt + timeout.', () => {
        const state: SessionState = {
          ...createState(),
          createdAt: 1,
          updatedAt: 1 + SESSION_DEFAULT_ABSOLUTE_TIMEOUT,
        };
        const session = new Session(
          store,
          state,
          { exists: true },
        );

        strictEqual(session.expirationTime, state.createdAt + SESSION_DEFAULT_ABSOLUTE_TIMEOUT);
      });

      it('when createdAt + timeout < updatedAt + timeout (custom timeout).', () => {
        const timeout = Math.floor(SESSION_DEFAULT_ABSOLUTE_TIMEOUT / 2);
        Config.set('settings.session.expirationTimeouts.absolute', timeout);

        const state: SessionState = {
          ...createState(),
          createdAt: 1,
          updatedAt: 1 + timeout,
        };
        const session = new Session(
          store,
          state,
          { exists: true },
        );

        strictEqual(session.expirationTime, state.createdAt + timeout);
      });

    });

    context('given the "commit" has been called', () => {

      it('should return an increased expiration timeout.', async () => {
        const state: SessionState = {
          ...createState(),
          createdAt: Math.trunc(Date.now() / 1000 - SESSION_DEFAULT_ABSOLUTE_TIMEOUT / 2),
          updatedAt: Math.trunc(Date.now() / 1000 - SESSION_DEFAULT_INACTIVITY_TIMEOUT / 2),
        };
        const session = new Session(
          store,
          state,
          { exists: true },
        );

        strictEqual(session.expirationTime, state.updatedAt + SESSION_DEFAULT_INACTIVITY_TIMEOUT);

        await session.commit();

        strictEqual(session.expirationTime, Math.trunc(Date.now() / 1000) + SESSION_DEFAULT_INACTIVITY_TIMEOUT);
      });

    });

  });

  describe('has a "get" method that', () => {

    it('should return the value of the key given in the param "state.content" during instantiation.', () => {
      const session = new Session(
        store,
        {
          ...createState(),
          content: { foo: 'bar' },
        },
        { exists: true }
      );
      strictEqual(session.get('foo'), 'bar');
    });

    it('should return the value of the key given in the param "state.flash" during instantiation.', () => {
      const session = new Session(
        store,
        {
          ...createState(),
          flash: { hello: 'world' },
        },
        { exists: true }
      );
      strictEqual(session.get('hello'), 'world');
    });

    it('should return the default value if the key does not exist in neither "state.flash" or "state.content".', () => {
      const session = new Session(
        store,
        {
          ...createState(),
          content: { foo: 'bar' },
          flash: { hello: 'world' },
        },
        { exists: true }
      );
      strictEqual(session.get<string>('foobar', 'barfoo'), 'barfoo');
    });

    it(
      'should return undefined if there is no default value and if the key does not exist'
      + ' in neither "state.flash" or "state.content".',
      () => {
        const session = new Session(
          store,
          {
            ...createState(),
            content: { foo: 'bar' },
            flash: { hello: 'world' },
          },
          { exists: true }
        );
        strictEqual(session.get('foobar'), undefined);
      }
    );

    it('should return the value of the key provided with the "set" method.', () => {
      const session = new Session(
        store,
        {
          ...createState(),
        },
        { exists: true }
      );
      strictEqual(session.get<string>('foo'), undefined);
      session.set('foo', 'bar');
      strictEqual(session.get<string>('foo'), 'bar');
    });

  });

  describe('has a "getToken" method that', () => {

    it('should return the session ID.', () => {
      const sessionID = 'zMd0TkVoMlj7qrJ54+G3idn0plDwQGqS/n6VVwKC4qM=';
      const session = new Session(
        store,
        {
          ...createState(),
          id: sessionID,
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

  describe('has a "regenerateID" that', () => {

    it('should regenerate the session ID with a random string.', async () => {
      const sessionID = 'a';
      const session = new Session(
        store,
        {
          ...createState(),
          id: sessionID,
        },
        { exists: true }
      );
      strictEqual(session.getToken(), sessionID);
      await session.regenerateID();
      notStrictEqual(session.getToken(), sessionID);
      notStrictEqual(session.getToken(), '');
      strictEqual(typeof session.getToken(), 'string');
    });

  });

  describe('has a "destroy" method that', () => {

    it('should call the "destroy" method of the store to destroy itself.', async () => {
      const sessionID = 'a';
      const session = new Session(
        store,
        {
          ...createState(),
          id: sessionID,
        },
        { exists: true }
      );

      await session.destroy();
      strictEqual(store.destroyCalledWith, sessionID);
    });

  });

  describe('has a "isDestroyed" property that', () => {

    it('should return false if the session has NOT been destroyed.', () => {
      const session = new Session(
        store,
        {
          ...createState(),
        },
        { exists: true }
      );
      strictEqual(session.isDestroyed, false);
    });

    it('should return true if the session has been destroyed.', async () => {
      const session = new Session(
        store,
        {
          ...createState(),
        },
        { exists: true }
      );
      await session.destroy();
      strictEqual(session.isDestroyed, true);
    });

  });

  describe('has a "commit" method that', () => {

    // Warning: only immutable objects must be used in these tests.

    let session: Session;

    function shouldSaveOrUpdateTheSession(
      calledWithPropertyName: 'saveCalledWith'|'updateCalledWith',
      state: SessionState|(() => SessionState)
    ) {

      it('with the proper id, userId, content and createdAt values.', async () => {
        await session.commit();

        state = typeof state === 'function' ? state() : state;
        // tslint:disable-next-line
        strictEqual(store[calledWithPropertyName]?.state.id, state.id);
        // tslint:disable-next-line
        strictEqual(store[calledWithPropertyName]?.state.userId, state.userId);
        // tslint:disable-next-line
        deepStrictEqual(store[calledWithPropertyName]?.state.content, state.content);
        // tslint:disable-next-line
        strictEqual(store[calledWithPropertyName]?.state.createdAt, state.createdAt);
      });

      it('with the proper userId modified with the "setUser" method (number).', async () => {
        // Use 0 here to detect errors on falsy values.
        const user = { id: 0 };
        session.setUser(user);
        await session.commit();

        // tslint:disable-next-line
        strictEqual(store[calledWithPropertyName]?.state.userId, user.id);
      });

      it('with the proper userId modified with the "setUser" method (string).', async () => {
        // Use empty string here to detect errors on falsy values.
        const user = { id: '' };
        session.setUser(user);
        await session.commit();

        // tslint:disable-next-line
        strictEqual(store[calledWithPropertyName]?.state.userId, user.id);
      });

      it('with the proper userId modified with the "setUser" method (toString).', async () => {
        const user = { id: { toString() { return 1; }} };
        session.setUser(user);
        await session.commit();

        // tslint:disable-next-line
        strictEqual(store[calledWithPropertyName]?.state.userId, 1);
      });

      it('with the proper userId modified with the "setUser" method (_id).', async () => {
        const user = { _id: 'xxx' };
        session.setUser(user as any);
        await session.commit();

        // tslint:disable-next-line
        strictEqual(store[calledWithPropertyName]?.state.userId, user._id);
      });

      it('with the proper content modified with the "set" method.', async () => {
        session.set('foo', 'bar');
        await session.commit();

        // tslint:disable-next-line
        deepStrictEqual(store[calledWithPropertyName]?.state.content, {
          foo: 'bar'
        });
        // tslint:disable-next-line
        deepStrictEqual(store[calledWithPropertyName]?.state.flash, {});
      });

      it('with the proper flash content modified with the "set" method.', async () => {
        session.set('hello', 'world', { flash: true });
        await session.commit();

        state = typeof state === 'function' ? state() : state;
        // tslint:disable-next-line
        deepStrictEqual(store[calledWithPropertyName]?.state.content, state.content);
        // tslint:disable-next-line
        deepStrictEqual(store[calledWithPropertyName]?.state.flash, {
          hello: 'world'
        });
      });

      it('with the proper updatedAt value (in seconds).', async () => {
        const dateBefore = Math.floor(Date.now() / 1000);
        await session.commit();
        const dateAfter = Math.floor(Date.now() / 1000) + 1;

        const calledWith = store[calledWithPropertyName];
        if (!calledWith) {
          throw new Error('SessionStore.update should have been called.');
        }

        const updatedAt = calledWith.state.updatedAt;
        strictEqual(Number.isInteger(updatedAt), true, `${updatedAt} should be an integer`);
        strictEqual(dateBefore <= updatedAt, true, `${updatedAt} should older than dateBefore`);
        strictEqual(dateAfter >= updatedAt, true, `${updatedAt} should newer than dateBefore`);

        const max = 2147483647;
        const tenYears = 60 * 60 * 24 * 365 * 10;
        strictEqual(updatedAt < max, true, `${updatedAt} should be less than 4 bytes.`);
        strictEqual(updatedAt + tenYears < max, true, `${updatedAt} should be less than 4 bytes within 10 years.`);
      });

      describe('providing an idle timeout', () => {

        afterEach(() => Config.remove('settings.session.expirationTimeouts.inactivity'));

        it('from the framework default values.', async () => {
          await session.commit();
          // tslint:disable-next-line
          strictEqual(store[calledWithPropertyName]?.maxInactivity, SESSION_DEFAULT_INACTIVITY_TIMEOUT);
        });

        it('from the configuration.', async () => {
          Config.set('settings.session.expirationTimeouts.inactivity', 1);

          await session.commit();
          // tslint:disable-next-line
          strictEqual(store[calledWithPropertyName]?.maxInactivity, 1);
        });

        it('and should throw an error if the configuration value is not a number.', async () => {
          Config.set('settings.session.expirationTimeouts.inactivity', 'a');

          await rejects(
            () => session.commit(),
            new ConfigTypeError('settings.session.expirationTimeouts.inactivity', 'number', 'string')
          );
        });

        it('and should throw an error if the configuration value is negative.', async () => {
          Config.set('settings.session.expirationTimeouts.inactivity', -1);

          await rejects(
            () => session.commit(),
            new Error('[CONFIG] The value of settings.session.expirationTimeouts.inactivity must be a positive number.')
          );
        });

      });

    }

    function shouldSaveTheSession(state: SessionState|(() => SessionState)): void {

      describe('should save the session', () => {
        shouldSaveOrUpdateTheSession('saveCalledWith', state);
      });

    }
    function shouldUpdateTheSession(state: SessionState|(() => SessionState)): void {

      describe('should update the session', () => {
        shouldSaveOrUpdateTheSession('updateCalledWith', state);
      });

    }
    function shouldDestroyTheSession(id: string): void {
      it('should destroy the session.', async () => {
        await session.commit();
        deepStrictEqual(store.destroyCalledWith, id);
      });
    }

    function shouldNotSaveTheSession(): void {
      it('should NOT save the session.', async () => {
        await session.commit();
        strictEqual(store.saveCalledWith, undefined);
      });
    }
    function shouldNotUpdateTheSession(): void {
      it('should NOT update the session.', async () => {
        await session.commit();
        strictEqual(store.updateCalledWith, undefined);
      });
    }
    function shouldNotDestroyTheSession(): void {
      it('should NOT destroy the session.', async () => {
        await session.commit();
        strictEqual(store.destroyCalledWith, undefined);
      });
    }

    context('given the session has been created with exists=true', () => {

      beforeEach(async () => {
        session = new Session(
          store,
          {
            ...createState()
          },
          { exists: true }
        );
      });

      shouldNotSaveTheSession();
      shouldUpdateTheSession({
        ...createState(),
      });
      shouldNotDestroyTheSession();

    });

    context('given the session has been created with exists=false', () => {

      context('and the session has not been commited yet', () => {

        beforeEach(async () => {
          session = new Session(
            store,
            {
              ...createState()
            },
            { exists: false }
          );
        });

        shouldSaveTheSession({
          ...createState()
        });
        shouldNotUpdateTheSession();
        shouldNotDestroyTheSession();

      });

      context('and the session has already been commited', () => {

        beforeEach(async () => {
          session = new Session(
            store,
            {
              ...createState()
            },
            { exists: false }
          );
          await session.commit();
          store.saveCalledWith = undefined;
        });

        shouldNotSaveTheSession();
        shouldUpdateTheSession({
          ...createState()
        });
        shouldNotDestroyTheSession();

      });

    });

    context('given the session ID has been re-generated', () => {

      context('and the session has not been commited yet', () => {

        const firstID = 'xxx';
        let secondID: string = '';

        beforeEach(async () => {
          session = new Session(
            store,
            {
              ...createState(),
              id: firstID
            },
            { exists: false }
          );
          await session.regenerateID();
          secondID = session.getToken();
        });

        shouldDestroyTheSession(firstID);
        shouldSaveTheSession(() => ({
          ...createState(),
          id: secondID,
        }));
        shouldNotUpdateTheSession();

      });

      context('and the session has already been commited', () => {

        const firstID = 'xxx';
        let secondID: string = '';

        beforeEach(async () => {
          session = new Session(
            store,
            {
              ...createState(),
              id: firstID
            },
            { exists: false }
          );
          await session.regenerateID();
          secondID = session.getToken();
          await session.commit();
          store.saveCalledWith = undefined;
          store.destroyCalledWith = undefined;
        });

        shouldNotDestroyTheSession();
        shouldNotSaveTheSession();
        shouldUpdateTheSession(() => ({
          ...createState(),
          id: secondID,
        }));

      });

    });

    context('given the "destroy" method has been called', () => {

      beforeEach(async () => {
        session = new Session(
          store,
          {
            ...createState()
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

    describe('should periodically clean up the expired sessions', () => {

      beforeEach(async () => {
        session = new Session(
          store,
          {
            ...createState()
          },
          { exists: true }
        );
      });

      afterEach(() => {
        Config.remove('settings.session.garbageCollector.periodicity');
        Config.remove('settings.session.expirationTimeouts.inactivity');
        Config.remove('settings.session.expirationTimeouts.absolute');
      });

      it('with a frequency defined in the configuration (periodicity = 1).', async () => {
        Config.set('settings.session.garbageCollector.periodicity', 1);

        await session.commit();

        deepStrictEqual(store.cleanUpExpiredSessionsCalledWith, {
          maxInactivity: SESSION_DEFAULT_INACTIVITY_TIMEOUT,
          maxLifeTime: SESSION_DEFAULT_ABSOLUTE_TIMEOUT,
        });
      });

      it('with a frequency defined in the configuration (periodicity = 1 000 000 000).', async () => {
        Config.set('settings.session.garbageCollector.periodicity', 1000000000);

        await session.commit();

        strictEqual(store.cleanUpExpiredSessionsCalledWith, undefined);
      });

      it('and should throw an error if the periodicity provided in the configuration is not a number.', async () => {
        Config.set('settings.session.garbageCollector.periodicity', 'a');

        await rejects(
          () => session.commit(),
          new ConfigTypeError('settings.session.garbageCollector.periodicity', 'number', 'string')
        );
      });

      it('with idle and absolute timeouts defined in the configuration.', async () => {
        Config.set('settings.session.garbageCollector.periodicity', 1);

        Config.set('settings.session.expirationTimeouts.inactivity', 15);
        Config.set('settings.session.expirationTimeouts.absolute', 30);

        await session.commit();

        deepStrictEqual(store.cleanUpExpiredSessionsCalledWith, {
          maxInactivity: 15,
          maxLifeTime: 30,
        });
      });

      it(
        'and should throw an error if the inactivity timeout provided in the configuration is not a number.',
        async () => {
          Config.set('settings.session.expirationTimeouts.inactivity', 'a');

          await rejects(
            () => session.commit(),
            new ConfigTypeError('settings.session.expirationTimeouts.inactivity', 'number', 'string')
          );
        }
      );

      it('and should throw an error the inactivity timeout provided in the configuration is negative.', async () => {
        Config.set('settings.session.expirationTimeouts.inactivity', -1);

        await rejects(
          () => session.commit(),
          new Error('[CONFIG] The value of settings.session.expirationTimeouts.inactivity must be a positive number.')
        );
      });

      it(
        'and should throw an error if the absolute timeout provided in the configuration is not a number.',
        async () => {
          Config.set('settings.session.expirationTimeouts.absolute', 'a');

          await rejects(
            () => session.commit(),
            new ConfigTypeError('settings.session.expirationTimeouts.absolute', 'number', 'string')
          );
        }
      );

      it('and should throw an error the inactivity timeout provided in the configuration is negative.', async () => {
        Config.set('settings.session.expirationTimeouts.absolute', -1);

        await rejects(
          () => session.commit(),
          new Error('[CONFIG] The value of settings.session.expirationTimeouts.absolute must be a positive number.')
        );
      });

      it(
        'and should throw an error if the absolute timeout provided in the configuration is lower '
        + 'than the inactivity timeout.',
        async () => {
          Config.set('settings.session.expirationTimeouts.inactivity', 2);
          Config.set('settings.session.expirationTimeouts.absolute', 1);

          await rejects(
            () => session.commit(),
            new Error(
              '[CONFIG] The value of settings.session.expirationTimeouts.absolute must be greater than *.inactivity.'
            )
          );
        }
      );

    });

  });

});
