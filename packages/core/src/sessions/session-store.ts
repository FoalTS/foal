// FoalTS
import { generateToken } from '../common';
import { Config } from '../core';
import { SESSION_DEFAULT_ABSOLUTE_TIMEOUT, SESSION_DEFAULT_INACTIVITY_TIMEOUT } from './constants';
import { Session } from './session';

/**
 * Abstract class to be override when creating a session storage service.
 *
 * A session store peforms CRUD operations on sessions and can store them in
 * a database, file system, memory, etc.
 *
 * Examples of SessionStore: TypeORMStore, RedisStore.
 *
 * @export
 * @abstract
 * @class SessionStore
 */
export abstract class SessionStore {

  /**
   * Read session expiration timeouts from the configuration.
   *
   * The values are in seconds.
   *
   * Default values are:
   * - 15 min for inactivity timeout
   * - 1 week for absolute timeout
   *
   * This method throws an error if one of the following is true:
   * - The given inactivity timeout is negative.
   * - The given absolute timeout is negative.
   * - The given inactivity timeout is greater than the absolute timeout.
   *
   * @static
   * @returns {{ inactivity: number , absolute: number }} The expiration timeouts
   * @memberof SessionStore
   */
  static getExpirationTimeouts(): { inactivity: number , absolute: number } {
    const result = {
      absolute: Config.get('settings.session.expirationTimeouts.absolute', SESSION_DEFAULT_ABSOLUTE_TIMEOUT),
      inactivity: Config.get('settings.session.expirationTimeouts.inactivity', SESSION_DEFAULT_INACTIVITY_TIMEOUT),
    };
    if (result.absolute < 0) {
      throw new Error('[CONFIG] The value of settings.session.expirationTimeouts.absolute must be a positive number.');
    }
    if (result.inactivity < 0) {
      throw new Error(
        '[CONFIG] The value of settings.session.expirationTimeouts.inactivity must be a positive number.'
      );
    }
    if (result.absolute < result.inactivity) {
      throw new Error(
        '[CONFIG] The value of settings.session.expirationTimeouts.absolute must be greater than *.inactivity.'
      );
    }
    return result;
  }

  createAndSaveSessionFromUser(user: { id: string|number }): Promise<Session> {
    return this.createAndSaveSession({ userId: user.id });
  }

  /**
   * Create and save a new session.
   *
   * This method *MUST* call the `generateSessionID` method to generate the session ID.
   *
   * @abstract
   * @param {object} sessionContent - The content of the session (often includes the user ID).
   * @returns {Promise<Session>} The created session.
   * @memberof SessionStore
   */
  abstract createAndSaveSession(sessionContent: object): Promise<Session>;
  /**
   * Update and extend the lifetime of a session.
   *
   * The internal behavior is similar to "update or insert".
   *
   * @abstract
   * @param {Session} session - The session containaing the updated content.
   * @returns {Promise<void>}
   * @memberof SessionStore
   */
  abstract update(session: Session): Promise<void>;
  /**
   * Delete a session, whether it exists or not.
   *
   * @abstract
   * @param {string} sessionID - The ID of the session.
   * @returns {Promise<void>}
   * @memberof SessionStore
   */
  abstract destroy(sessionID: string): Promise<void>;
  /**
   * Read a session from its ID.
   *
   * Returns `undefined` if the session does not exist or has expired.
   *
   * @abstract
   * @param {string} sessionID - The ID of the session.
   * @returns {(Promise<Session|undefined>)} The Session object.
   * @memberof SessionStore
   */
  abstract read(sessionID: string): Promise<Session|undefined>;
  /**
   * Extend the lifetime of a session from its ID. The duration is
   * the inactivity timeout.
   *
   * If the session does not exist, the method does not throw an error.
   *
   * @abstract
   * @param {string} sessionID - The ID of the session.
   * @returns {Promise<void>}
   * @memberof SessionStore
   */
  abstract extendLifeTime(sessionID: string): Promise<void>;
  /**
   * Clear all sessions.
   *
   * @abstract
   * @returns {Promise<void>}
   * @memberof SessionStore
   */
  abstract clear(): Promise<void>;
  /**
   * Some session stores may need to run periodically background jobs to cleanup expired sessions.
   *
   * This method deletes all expired sessions.
   *
   * @abstract
   * @returns {Promise<void>}
   * @memberof SessionStore
   */
  abstract cleanUpExpiredSessions(): Promise<void>;

  /**
   * Generate a 128-bit base64url-encoded session ID.
   *
   * @protected
   * @returns {Promise<string>} - The session ID.
   * @memberof SessionStore
   */
  protected async generateSessionID(): Promise<string> {
    return generateToken();
  }
}
