// FoalTS
import { signToken } from '../common';
import { Config } from '../core';
import { SessionStore } from './session-store';

/**
 * Representation of a server/database session.
 *
 * @export
 * @class Session
 */
export class Session {

  private modified = false;
  private destroyed = false;

  constructor(
    readonly store: SessionStore,
    readonly sessionID: string,
    private sessionContent: any,
    readonly createdAt: number
  ) {
    if (sessionID.includes('.')) {
      throw new Error('A session ID cannot include dots.');
    }
  }

  /**
   * Return true if an element was added/replaced in the session
   *
   * @readonly
   * @type {boolean}
   * @memberof Session
   */
  get isModified(): boolean {
    return this.modified;
  }

  /**
   * Return true if the session has been destroyed.
   *
   * @readonly
   * @type {boolean}
   * @memberof Session
   */
  get isDestroyed(): boolean {
    return this.destroyed;
  }

  /**
   * Add/replace an element in the session. This operation is not saved
   * in the saved unless you call SessionStore.update(session).
   *
   * @param {string} key
   * @param {*} value
   * @memberof Session
   */
  set(key: string, value: any): void {
    this.sessionContent[key] = value;
    this.modified = true;
  }

  /**
   * The value of an element in the session content.
   *
   * @template T
   * @param {string} key - The property key
   * @returns {(T | undefined)} The property valye
   * @memberof Session
   */
  get<T>(key: string): T | undefined;
  get<T>(key: string, defaultValue: any): T;
  get(key: string, defaultValue?: any): any {
    if (!this.sessionContent.hasOwnProperty(key)) {
      return defaultValue;
    }
    return this.sessionContent[key];
  }

  /**
   * Get the session token. This token is used by `@TokenRequired` and `@TokenOptional` to retreive
   * the session and the authenticated user if she/he exists.
   *
   * @returns {string} - The session token.
   * @memberof Session
   */
  getToken(): string {
    const secret = Config.getOrThrow(
      'settings.session.secret',
      'string',
      'You must provide a secret when using sessions.'
    );
    return signToken(this.sessionID, secret);
  }

  /**
   * Get a copy of the session content.
   *
   * @returns {object} - The session content copy.
   * @memberof Session
   */
  getContent(): object {
    return { ...this.sessionContent };
  }

  /**
   * Destroy the session in the session store.
   *
   * @returns {Promise<void>}
   * @memberof Session
   */
  async destroy(): Promise<void> {
    await this.store.destroy(this.sessionID);
    this.destroyed = true;
  }

}
