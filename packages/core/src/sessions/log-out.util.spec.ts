// std
import { strictEqual } from 'assert';

// FoalTS
import { Context } from '../core';
import { SESSION_DEFAULT_COOKIE_NAME } from './constants';
import { logOut } from './log-out.util';
import { Session } from './session';
import { SessionStore } from './session-store';

describe('logOut', () => {

  class Store extends SessionStore {
    destroyCalledWith: string|undefined = undefined;
    async createAndSaveSession(sessionContent: object): Promise<Session> {
      return new Session('aaaaaa', {}, 0);
    }
    update(session: Session): Promise<void> {
      throw new Error('Method not implemented.');
    }
    async destroy(sessionID: string): Promise<void> {
      this.destroyCalledWith = sessionID;
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

  const secret = 'my_secret';
  let store: Store;

  beforeEach(() => {
    process.env.SETTINGS_SESSION_SECRET = secret;
    store = new Store();
  });

  afterEach(() => {
    delete process.env.SETTINGS_SESSION_SECRET;
    delete process.env.SETTINGS_SESSION_COOKIE_NAME;
  });

  describe('should validate the request and', () => {

    describe('given options.cookie is false or not defined', () => {

      it('should return false if the Authorization header does not exist.', async () => {
        const ctx = new Context({ get(str: string) { return undefined; } });
        strictEqual(await logOut(ctx, store), false);
      });

      it('should return false if the Authorization header does not use the Bearer scheme.', async () => {
        const ctx = new Context({ get(str: string) { return str === 'Authorization' ? 'Basic hello' : undefined; } });
        strictEqual(await logOut(ctx, store), false);
      });

    });

    describe('given options.cookie is true', () => {

      it('should return false if the cookie does not exist.', async () => {
        const ctx = new Context({ get(str: string) { return undefined; }, cookies: {} });
        strictEqual(await logOut(ctx, store, { cookie: true }), false);
      });

    });

  });

  describe('should verify the token and', () => {

    it('should return false if the token is invalid.', async () => {
      const token = 'xxx';
      const ctx = new Context({
        get(str: string) { return str === 'Authorization' ? `Bearer ${token}` : undefined; }
      });

      strictEqual(await logOut(ctx, store), false);
    });

  });

  describe('should destroy the session', () => {

    it('given options.cookie is false or not defined.', async () => {
      const session = await store.createAndSaveSession({});
      const token = session.getToken();

      const ctx = new Context({
        get(str: string) { return str === 'Authorization' ? `Bearer ${token}` : undefined; }
      });

      strictEqual(store.destroyCalledWith, undefined);
      await logOut(ctx, store);
      strictEqual(store.destroyCalledWith, session.sessionID);
    });

    describe('given options.cookie is false or not defined', () => {

      it('with the default cookie name.', async () => {
        const session = await store.createAndSaveSession({});
        const token = session.getToken();

        const ctx = new Context({
          cookies: {
            [SESSION_DEFAULT_COOKIE_NAME]: token
          },
          get(str: string) { return undefined; }
        });

        strictEqual(store.destroyCalledWith, undefined);
        await logOut(ctx, store, { cookie: true });
        strictEqual(store.destroyCalledWith, session.sessionID);
      });

      it('with a custom cookie name.', async () => {
        process.env.SETTINGS_SESSION_COOKIE_NAME = 'auth2';
        const session = await store.createAndSaveSession({});
        const token = session.getToken();

        const ctx = new Context({
          cookies: {
            auth2: token
          },
          get(str: string) { return undefined; }
        });

        strictEqual(store.destroyCalledWith, undefined);
        await logOut(ctx, store, { cookie: true });
        strictEqual(store.destroyCalledWith, session.sessionID);
      });

    });

  });

});
