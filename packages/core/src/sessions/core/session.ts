// FoalTS
import { generateToken } from '../../common';
import { Config } from '../../core';
import {
  SESSION_DEFAULT_ABSOLUTE_TIMEOUT,
  SESSION_DEFAULT_GARBAGE_COLLECTOR_PERIODICITY,
  SESSION_DEFAULT_INACTIVITY_TIMEOUT,
} from './constants';
import { SessionState } from './session-state.interface';
import { SessionStore } from './session-store';

/**
 * Representation of a server/database/file session.
 *
 * @export
 * @class Session
 */
export class Session {

  private readonly oldFlash: { [key: string]: any };
  private oldId = '';
  private status: 'new'|'exists'|'regenerated'|'destroyed';

  /**
   * Retuns the user ID. If the session is anonymous, the value is null.
   *
   * @readonly
   * @type {(string|number|null)}
   * @memberof Session
   */
  get userId(): string|number|null {
    return this.state.userId;
  }

  /**
   * Returns true if the session has expired due to inactivity
   * or because it reached the maximum lifetime allowed.
   *
   * @readonly
   * @type {boolean}
   * @memberof Session
   */
  get isExpired(): boolean {
    const { absoluteTimeout, inactivityTimeout } = this.getTimeouts();
    const now = this.getTime();

    if (now - this.state.updatedAt >= inactivityTimeout) {
      return true;
    }
    if (now - this.state.createdAt >= absoluteTimeout) {
      return true;
    }

    return false;
  }

  /**
   * Returns the session expiration time in seconds.
   *
   * @readonly
   * @type {number}
   * @memberof Session
   */
  get expirationTime(): number {
    const { absoluteTimeout, inactivityTimeout } = this.getTimeouts();
    return Math.min(
      this.state.updatedAt + inactivityTimeout,
      this.state.createdAt + absoluteTimeout,
    );
  }

  constructor(
    private readonly store: SessionStore,
    private readonly state: SessionState,
    options: { exists: boolean },
  ) {
    this.status = options.exists ? 'exists' : 'new';
    this.oldFlash = state.flash;
    state.flash = {};
  }

  /**
   * Sets or replaces the userId associated with the session.
   *
   * @param {({ id: number|string })} user - The user containing the ID.
   * @memberof Session
   */
  setUser(user: { id: number|string|object } | { _id: number|string|object }): void {
    // tslint:disable-next-line
    const id: number|string|object = (user as any).id ?? (user as any)._id;
    if (typeof id === 'object') {
      this.state.userId = id.toString();
      return;
    }
    this.state.userId = id;
  }

  /**
   * Adds or replaces an element in the session. This operation is not saved
   * in the saved unless you call the "commit" function.
   *
   * @param {string} key - The property key.
   * @param {*} value - The property value.
   * @param {{ flash?: boolean }} [options={}] If flash is true, the key/value
   * will be erased at the end of the next request.
   * @memberof Session
   */
  set(key: string, value: any, options: { flash?: boolean } = {}): void {
    if (options.flash) {
      this.state.flash[key] = value;
    } else {
      this.state.content[key] = value;
    }
  }

  /**
   * Gets the value of a key in the session content.
   *
   * @template T
   * @param {string} key - The property key.
   * @returns {(T | undefined)} The property value.
   * @memberof Session
   */
  get<T>(key: string): T | undefined;
  get<T>(key: string, defaultValue: any): T;
  get(key: string, defaultValue?: any): any {
    if (this.oldFlash.hasOwnProperty(key)) {
      return this.oldFlash[key];
    }
    if (this.state.content.hasOwnProperty(key)) {
      return this.state.content[key];
    }
    return defaultValue;
  }

  /**
   * Gets the session ID.
   *
   * @returns {string} - The session ID.
   * @memberof Session
   */
  getToken(): string {
    return this.state.id;
  }

  /**
   * Regenerates the session with a new ID. It is recommended
   * to regenerate the session ID after any privilege level change
   * within the associated user session.
   *
   * Common scenario: an anonymous user is authenticated.
   *
   * @returns {Promise<void>}
   * @memberof Session
   */
  async regenerateID(): Promise<void> {
    this.oldId = this.state.id;
    this.state.id = await generateToken();
    this.status = 'regenerated';
  }

  /**
   * Destroys the session.
   *
   * @returns {Promise<void>}
   * @memberof Session
   */
  async destroy(): Promise<void> {
    await this.store.destroy(this.state.id);
    this.status = 'destroyed';
  }

  /**
   * Returns true if the method `destroy` has previously been called.
   *
   * @readonly
   * @type {boolean}
   * @memberof Session
   */
  get isDestroyed(): boolean {
    return this.status === 'destroyed';
  }

  /**
   * Saves or updates the session and extends its lifetime.
   *
   * If the session has already been destroyed, an error is thrown.
   *
   * This function calls periodically the store method "cleanUpExpiredSessions".
   *
   * @returns {Promise<void>}
   * @memberof Session
   */
  async commit(): Promise<void> {
    const { absoluteTimeout, inactivityTimeout } = this.getTimeouts();

    if (this.shouldCleanUpExpiredSessions()) {
      await this.store.cleanUpExpiredSessions(
        inactivityTimeout,
        absoluteTimeout,
      );
    }

    this.state.updatedAt = this.getTime();

    switch (this.status) {
      case 'regenerated':
        await this.store.destroy(this.oldId);
        await this.store.save(this.state, inactivityTimeout);
        this.status = 'exists';
        break;
      case 'new':
        await this.store.save(this.state, inactivityTimeout);
        this.status = 'exists';
        break;
      case 'exists':
        await this.store.update(this.state, inactivityTimeout);
        break;
      case 'destroyed':
        throw new Error('Impossible to commit the session. Session already destroyed.');
      default:
        break;
    }
  }

  /**
   * Returns the current time in seconds.
   *
   * @private
   * @returns {number} The current time.
   * @memberof Session
   */
  private getTime(): number {
    return Math.trunc(Date.now() / 1000);
  }

  private shouldCleanUpExpiredSessions(): boolean {
    const periodicity = Config.get(
      'settings.session.garbageCollector.periodicity',
      'number',
      SESSION_DEFAULT_GARBAGE_COLLECTOR_PERIODICITY,
    );
    return Math.trunc(Math.random() * periodicity) === 0;
  }

  private getTimeouts(): { absoluteTimeout: number, inactivityTimeout: number} {
    const inactivityTimeout = Config.get(
      'settings.session.expirationTimeouts.inactivity',
      'number',
      SESSION_DEFAULT_INACTIVITY_TIMEOUT
    );
    if (inactivityTimeout < 0) {
      throw new Error(
        '[CONFIG] The value of settings.session.expirationTimeouts.inactivity must be a positive number.'
      );
    }

    const absoluteTimeout = Config.get(
      'settings.session.expirationTimeouts.absolute',
      'number',
      SESSION_DEFAULT_ABSOLUTE_TIMEOUT,
    );
    if (absoluteTimeout < 0) {
      throw new Error(
        '[CONFIG] The value of settings.session.expirationTimeouts.absolute must be a positive number.'
      );
    }

    if (absoluteTimeout < inactivityTimeout) {
      throw new Error(
        '[CONFIG] The value of settings.session.expirationTimeouts.absolute must be greater than *.inactivity.'
      );
    }

    return { absoluteTimeout, inactivityTimeout };
  }

}
