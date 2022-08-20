// std
import { notStrictEqual, ok, strictEqual } from 'assert';

// FoalTS
import { createService } from '../../core';
import { createSession } from './create-session';
import { Session } from './session';
import { SessionState } from './session-state.interface';
import { SessionStore } from './session-store';

describe('createSession', () => {

  class ConcreteSessionStore extends SessionStore {

    saveCalledWith: { state: SessionState, maxInactivity: number } | undefined;
    updateCalledWith: { state: SessionState, maxInactivity: number } | undefined;

    async save(state: SessionState, maxInactivity: number): Promise<void> {
      this.saveCalledWith = { state, maxInactivity };
    }
    read(id: string): Promise<SessionState | null> {
      throw new Error('Method not implemented.');
    }
    async update(state: SessionState, maxInactivity: number): Promise<void> {
      this.updateCalledWith = { state, maxInactivity };
    }
    destroy(id: string): Promise<void> {
      throw new Error('Method not implemented.');
    }
    clear(): Promise<void> {
      throw new Error('Method not implemented.');
    }
    async cleanUpExpiredSessions(maxInactivity: number, maxLifeTime: number): Promise<void> {
      // Ignore this call.
    }
  }

  let session: Session;
  let store: ConcreteSessionStore;

  beforeEach(async () => {
    store = createService(ConcreteSessionStore);
    session = await createSession(store);
  });

  it('should return an instance of Session.', () => {
    strictEqual(session instanceof Session, true);
  });

  describe('should create the session', () => {

    it('with an empty userId.', async () => {
      await session.commit();

      // tslint:disable-next-line
      const state = store.updateCalledWith?.state ?? store.saveCalledWith?.state;

      // tslint:disable-next-line
      strictEqual(state?.userId, null);
    });

    it('with a csrfToken generated randomly (256-bit base64url-encoded string).', async () => {
      await session.commit();

      // tslint:disable-next-line
      const state = store.updateCalledWith?.state ?? store.saveCalledWith?.state;
      if (!state) {
        throw new Error('Unexpected error.');
      }

      strictEqual(Object.keys(state.content).length, 1);
      ok(typeof state.content.csrfToken === 'string');
      strictEqual(state.content.csrfToken.length >= 43, true);
      strictEqual(state.content.csrfToken.length <= 44, true);
    });

    it('with a proper createdAt date.', async () => {
      // updatedAt is managed by Session.commit().
      const dateBefore = Math.trunc(Date.now() / 1000);
      await session.commit();
      const dateAfter = Math.trunc(Date.now() / 1000) + 1;

      // tslint:disable-next-line
      const state = store.updateCalledWith?.state ?? store.saveCalledWith?.state;

      if (!state) {
        throw new Error('state should be defined.');
      }

      strictEqual(Number.isInteger(state.createdAt), true, `${state.createdAt} should be an integer.`);
      strictEqual(state.createdAt >= dateBefore, true, `${state.createdAt} should be greated than ${dateBefore}.`);
      strictEqual(state.createdAt <= dateAfter, true, `${state.createdAt} should be lower than ${dateAfter}.`);
    });

    it('with a generated random ID.', async () => {
      const id1 = session.getToken();
      notStrictEqual(id1.length, 0);

      const session2 = await createSession(store);
      const id2 = session2.getToken();
      notStrictEqual(id1, id2);
    });

    it('that should be marked as "non-existing".', async () => {
      await session.commit();

      // tslint:disable-next-line
      strictEqual(store.updateCalledWith?.state, undefined);
      // tslint:disable-next-line
      notStrictEqual(store.saveCalledWith?.state, undefined);
    });

  });

});
