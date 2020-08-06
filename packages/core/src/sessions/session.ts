// FoalTS
import { generateToken } from '../common';
import { SessionState } from './session-state.interface';
import { SessionStore } from './session-store';

/**
 * Representation of a server/database session.
 *
 * @export
 * @class Session
 */
export class Session {

  // static async create(store: SessionStore): Promise<Session> {
  //   return null as any;
  // }

  // static async read(store: SessionStore, id: string): Promise<Session|null> {
  //   return null;
  // }

  private readonly oldFlash: { [key: string]: any };
  private oldId = '';
  private status: 'new'|'exists'|'regenerated'|'destroyed';

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
      // this.flash
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
   * @returns {Promise<void>}
   * @memberof Session
   */
  async commit(): Promise<void> {
    const state = {
      ...this.state,
      updatedAt: Math.floor(Date.now() / 1000),
    };
    switch (this.status) {
      case 'regenerated':
        await this.store.destroy(this.oldId);
        await this.store.save(state, -1);
        this.status = 'exists';
        break;
      case 'new':
        await this.store.save(state, -1);
        this.status = 'exists';
        break;
      case 'exists':
        await this.store.update(state, -1);
        break;
      case 'destroyed':
        throw new Error('Impossible to commit the session. Session already destroyed.');
      default:
        break;
    }
  }

}
