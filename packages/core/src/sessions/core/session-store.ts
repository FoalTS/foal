// FoalTS
import { generateToken } from '../../common';
import { Session } from './session';
import { SessionState } from './session-state.interface';

export class SessionAlreadyExists extends Error {
  readonly name = 'SessionAlreadyExists';
}

/**
 * Store used to create, read, update and delete sessions.
 *
 * All session stores must inherit this abstract class.
 *
 * When this class is used with the `@dependency` decorator,
 * it returns the `ConcreteSessionStore` class from the file or the package specified
 * with the configuration key "settings.session.store".
 *
 * @export
 * @abstract
 * @class Store
 */
export abstract class Store {

  static readonly concreteClassConfigPath = 'settings.session.store';
  static readonly concreteClassName = 'ConcreteSessionStore';

  async createSession(): Promise<Session> {
    const date = Math.floor(Date.now() / 1000);

    const state: SessionState = {
      content: {
        csrfToken: await generateToken(),
      },
      createdAt: date,
      // The below line cannot be tested because of the encapsulation of Session.
      flash: {},
      id: await generateToken(),
      // Any value here is fine. updatedAt is set by Session.commit().
      updatedAt: date,
      userId: null,
    };

    return new Session(this, state, { exists: false });
  }

  async readSession(id: string): Promise<Session | null> {
    const state = await this.read(id);
    if (state === null) {
      return null;
    }

    const session = new Session(this, state, { exists: true });
    if (session.isExpired) {
      await session.destroy();
      return null;
    }

    return session;
  }

  /**
   * Saves the session for the first time.
   *
   * If a session already exists with the given ID, a SessionAlreadyExists error MUST be thrown.
   *
   * @abstract
   * @param {SessionState} state - The state of the session.
   * @param {number} maxInactivity - The maximum idle activity of the session (useful for cache stores).
   * @returns {Promise<void>}
   * @memberof Store
   */
  abstract save(state: SessionState, maxInactivity: number): Promise<void>;
  /**
   * Reads a session.
   *
   * If the session does not exist, the value `null` MUST be returned.
   *
   * @abstract
   * @param {string} id - The ID of the session.
   * @returns {(Promise<SessionState|null>)} The state of the session.
   * @memberof Store
   */
  abstract read(id: string): Promise<SessionState | null>;
  /**
   * Updates and extends the lifetime of a session.
   *
   * If the session no longer exists (i.e. has expired or been destroyed), the session MUST still be saved.
   *
   * @abstract
   * @param {SessionState} state - The state of the session.
   * @param {number} maxInactivity - The maximum idle activity of the session (useful for cache stores).
   * @returns {Promise<void>}
   * @memberof Store
   */
  abstract update(state: SessionState, maxInactivity: number): Promise<void>;
  /**
   * Deletes a session.
   *
   * If the session does not exist, NO error MUST be thrown.
   *
   * @abstract
   * @param {string} id - The ID of the session.
   * @returns {Promise<void>}
   * @memberof Store
   */
  abstract destroy(id: string): Promise<void>;
  /**
   * Clears all sessions.
   *
   * @abstract
   * @returns {Promise<void>}
   * @memberof Store
   */
  abstract clear(): Promise<void>;
  /**
   * Some session stores may need to run periodically background jobs to cleanup expired sessions.
   *
   * This method deletes all expired sessions.
   *
   * If the store manages a cache database, then this method can remain empty but it must NOT throw an error.
   *
   * @abstract
   * @param {number} maxInactivity - The maximum idle activity of a session.
   * @param {number} maxLifeTime - The maximum absolute life time of a session.
   * @returns {Promise<void>}
   * @memberof Store
   */
  abstract cleanUpExpiredSessions(maxInactivity: number, maxLifeTime: number): Promise<void>;

  boot(): void|Promise<void> {}
}

export { Store as SessionStore };
