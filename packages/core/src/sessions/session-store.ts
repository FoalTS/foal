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
 * The `createAndSaveSession` method must call `generateSessionID` to generate the session ID.
 *
 * @export
 * @abstract
 * @class SessionStore
 */
export abstract class SessionStore {

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
   * The method *MUST* call the `generateSessionID` method to generate the session ID.
   *
   * The method *MAY* call the `getExpirationTimeouts` method to know the expiration timeout values. If
   * it is not called here, `getExpirationTimeouts` *MUST* be called in `read`.
   *
   * @abstract
   * @param {object} sessionContent
   * @returns {Promise<Session>}
   * @memberof SessionStore
   */
  abstract createAndSaveSession(sessionContent: object): Promise<Session>;
  /**
   * Update and extend the lifetime of a session.
   *
   * @abstract
   * @param {Session} session - The Session object with the updated data.
   * @returns {Promise<void>}
   * @memberof SessionStore
   */
  abstract update(session: Session): Promise<void>;
  abstract destroy(sessionID: string): Promise<void>;
  abstract read(sessionID: string): Promise<Session>;
  abstract extendLifeTime(sessionID: string): Promise<void>;
  /**
   * Clear all sessions.
   *
   * @abstract
   * @returns {Promise<void>}
   * @memberof SessionStore
   */
  // abstract clear(): Promise<void>;
  // abstract cleanUpExpiredSessions(): Promise<void>;

  protected async generateSessionID(): Promise<string> {
    const buff = await promisify(randomBytes)(32);
    return convertBase64ToBase64url(buff.toString('base64'));
  }
}
