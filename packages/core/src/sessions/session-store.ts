// std
import { randomBytes } from 'crypto';
import { promisify } from 'util';

// FoalTS
import { Config } from '../core';
import { SESSION_DEFAULT_ABSOLUTE_TIMEOUT, SESSION_DEFAULT_INACTIVITY_TIMEOUT } from './constants';
import { convertBase64ToBase64url, Session } from './session';

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
   * The method returns `true` on success and `false` on failure. Failure can happen
   * if the session has expired or does not exist.
   *
   * @abstract
   * @param {Session} session - The session containaing the updated content.
   * @returns {Promise<boolean>} The success of the operation.
   * @memberof SessionStore
   */
  abstract update(session: Session): Promise<boolean>;
  /**
   * Delete a session.
   *
   * The method returns `true` on success and `false` on failure. Failure can happen
   * if the session has previously expired or does not exist.
   *
   * @abstract
   * @param {string} sessionID - The ID of the session.
   * @returns {Promise<boolean>} The success of the operation.
   * @memberof SessionStore
   */
  abstract destroy(sessionID: string): Promise<boolean>;
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
   * The method returns `true` on success and `false` on failure. Failure can happen
   * if the session has previously expired or does not exist.
   *
   * @abstract
   * @param {string} sessionID - The ID of the session.
   * @returns {Promise<boolean>} The success of the operation.
   * @memberof SessionStore
   */
  abstract extendLifeTime(sessionID: string): Promise<boolean>;
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
    const buff = await promisify(randomBytes)(32);
    return convertBase64ToBase64url(buff.toString('base64'));
  }
}
