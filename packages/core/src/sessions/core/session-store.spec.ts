// std
import { deepStrictEqual, notStrictEqual, strictEqual } from 'assert';
import { createService } from '../../core';

// FoalTS
import { SessionState } from './session-state.interface';
import { SessionStore } from './session-store';

describe('SessionStore', () => {
  class Store extends SessionStore {

    save(state: SessionState, maxInactivity: number): Promise<void> {
      throw new Error('Method not implemented.');
    }
    read(id: string): Promise<SessionState | null> {
      throw new Error('Method not implemented.');
    }
    update(state: SessionState, maxInactivity: number): Promise<void> {
      throw new Error('Method not implemented.');
    }
    destroy(id: string): Promise<void> {
      throw new Error('Method not implemented.');
    }
    clear(): Promise<void> {
      throw new Error('Method not implemented.');
    }
    cleanUpExpiredSessions(maxInactivity: number, maxLifeTime: number): Promise<void> {
      throw new Error('Method not implemented.');
    }
  }

  it('should support concrete services.', () => {
    strictEqual(SessionStore.concreteClassConfigPath, 'settings.session.store');
    strictEqual(SessionStore.concreteClassName, 'ConcreteSessionStore');
  });

  it('should have a boot method that does nothing.', async () => {
    const store = createService(Store);
    await store.boot();
  });

  describe('has a "readSession" method that', () => {
    class ConcreteSessionStore extends SessionStore {

      sessionStates: Map<string, SessionState> = new Map();
      date: number;

      saveCalledWith: { state: SessionState, maxInactivity: number } | undefined;
      updateCalledWith: { state: SessionState, maxInactivity: number } | undefined;
      destroyCalledWith: string | undefined;

      constructor() {
        super();
        this.date = Math.floor(Date.now() / 1000);
        this.sessionStates.set('xxx', {
          content: { foo: 'bar' },
          createdAt: this.date,
          flash: { hello: 'world' },
          id: 'xxx',
          updatedAt: this.date,
          userId: null,
        });
        this.sessionStates.set('yyy', {
          content: { foo: 'bar' },
          createdAt: 0,
          flash: { hello: 'world' },
          id: 'yyy',
          updatedAt: this.date,
          userId: null,
        });
      }

      async save(state: SessionState, maxInactivity: number): Promise<void> {
        this.saveCalledWith = { state, maxInactivity };
      }
      async read(id: string): Promise<SessionState | null> {
        // tslint:disable-next-line
        return this.sessionStates.get(id) ?? null;
      }
      async update(state: SessionState, maxInactivity: number): Promise<void> {
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
        // Ignore this call.
      }
    }

    let store: ConcreteSessionStore;

    beforeEach(async () => {
      store = createService(ConcreteSessionStore);
    });

    context('given no session matches the ID', () => {

      it('should return null.', async () => {
        const session = await store.readSession('aaa');
        strictEqual(session, null);
      });

    });

    context('given a session matches the ID', () => {

      context('and given the session is not expired', () => {

        describe('should return the session', () => {

          it('with its proper state.', async () => {
            const session = await store.readSession('xxx');
            if (!session) {
              throw new Error('The session should have been returned.');
            }

            strictEqual(session.get('hello'), 'world');

            await session.commit();

            // tslint:disable-next-line
            const state = store.updateCalledWith?.state ?? store.saveCalledWith?.state;
            if (!state) {
              throw new Error('state should be defined.');
            }
            deepStrictEqual(state, {
              content: { foo: 'bar' },
              createdAt: store.date,
              flash: {},
              id: 'xxx',
              updatedAt: store.date,
              userId: null,
            });
          });

          it('marked as "existing".', async () => {
            const session = await store.readSession('xxx');
            if (!session) {
              throw new Error('The session should have been returned.');
            }

            await session.commit();

            // tslint:disable-next-line
            notStrictEqual(store.updateCalledWith?.state, undefined);
            // tslint:disable-next-line
            strictEqual(store.saveCalledWith?.state, undefined);
          });

        });

      });

      context('and given the session has expired', () => {

        it('should return null.', async () => {
          const session = await store.readSession('yyy');
          strictEqual(session, null);
        });

        it('should destroy the session.', async () => {
          await store.readSession('yyy');
          strictEqual(store.destroyCalledWith, 'yyy');
        });

      });

    });
  })

});
