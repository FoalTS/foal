// FoalTS
import { SessionState } from './session-state.interface';
import { SessionStore } from './session-store';

/**
 * Representation of a server/database session.
 *
 * @export
 * @class Session
 */
export class Session {

  private status: 'modified'|'destroyed'|false = false;
  private readonly newFlash: SessionState['flash'] = {};

  constructor(
    readonly store: SessionStore,
    private readonly state: SessionState
  ) {
    if (Object.keys(state.flash).length > 0) {
      this.status = 'modified';
    }
  }

  get isModified(): boolean {
    return this.status === 'modified';
  }
  get isDestroyed(): boolean {
    return this.status === 'destroyed';
  }

  /**
   * Add/replace an element in the session. This operation is not saved
   * in the saved unless you call SessionStore.update(session).
   *
   * @param {string} key
   * @param {*} value
   * @memberof Session
   */
  set(key: string, value: any, options: { flash?: boolean } = {}): void {
    if (options.flash) {
      this.newFlash[key] = value;
    } else {
      this.state.content[key] = value;
    }
    this.status = 'modified';
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
    if (this.state.flash.hasOwnProperty(key)) {
      return this.state.flash[key];
    }
    if (this.state.content.hasOwnProperty(key)) {
      return this.state.content[key];
    }
    return defaultValue;
  }

  /**
   * Get the session ID. This ID is used by `@TokenRequired` and `@TokenOptional` to retreive
   * the session and the authenticated user if she/he exists.
   *
   * @returns {string} - The session token.
   * @memberof Session
   */
  getToken(): string {
    return this.state.id;
  }

  /**
   * Return the session state.
   *
   * @returns {object} - The session content copy.
   * @memberof Session
   */
  getState(): SessionState {
    return {
      ...this.state,
      flash: this.newFlash,
    };
  }

  /**
   * Destroy the session in the session store.
   *
   * @returns {Promise<void>}
   * @memberof Session
   */
  async destroy(): Promise<void> {
    await this.store.destroy(this.state.id);
    this.status = 'destroyed';
  }

}
