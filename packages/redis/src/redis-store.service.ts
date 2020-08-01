import { Config, Session, SessionOptions, SessionState, SessionStore } from '@foal/core';
import { createClient } from 'redis';

/**
 * Redis Store
 *
 * @export
 * @class RedisStore
 * @extends {SessionStore}
 */
export class RedisStore extends SessionStore {

  private redisClient: any;

  boot() {
    const redisURI = Config.get('redis.uri', 'string');
    this.redisClient = createClient(redisURI);
  }

  async createAndSaveSession(content: object, options: SessionOptions = {}): Promise<Session> {
    const inactivity = SessionStore.getExpirationTimeouts().inactivity;

    const date = Date.now();
    const sessionID = await this.generateSessionID();
    await this.applySessionOptions(content, options);

    return new Promise<Session>((resolve, reject) => {
      const data = JSON.stringify({
        content,
        createdAt: date,
        flash: {},
        updatedAt: date,
        userId: options.userId,
      });
      this.redisClient.set(`sessions:${sessionID}`, data, 'NX', 'EX', inactivity, (err: any) => {
        if (err) {
          return reject(err);
        }
        const session = new Session(this, {
          content,
          createdAt: date,
          flash: {},
          id: sessionID,
          updatedAt: date,
          userId: options.userId ?? null
        });
        resolve(session);
      });
    });
  }

  update(state: SessionState): Promise<void> {
    const inactivity = SessionStore.getExpirationTimeouts().inactivity;

    return new Promise<void>((resolve, reject) => {
      const data = JSON.stringify({
        content: state.content,
        createdAt: state.createdAt,
        flash: state.flash,
        updatedAt: state.updatedAt,
        userId: state.userId
      });
      this.redisClient.set(`sessions:${state.id}`, data, 'EX', inactivity, (err: any) => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  }

  destroy(sessionID: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.redisClient.del(`sessions:${sessionID}`, (err: any) => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  }

  read(sessionID: string): Promise<SessionState | undefined> {
    const absolute = SessionStore.getExpirationTimeouts().absolute;

    return new Promise<SessionState | undefined>((resolve, reject) => {
      this.redisClient.get(`sessions:${sessionID}`, async (err: any, val: string|null) => {
        if (err) {
          return reject(err);
        }
        if (val === null) {
          return resolve(undefined);
        }
        const data = JSON.parse(val);
        const state: SessionState = {
          content: data.content,
          createdAt: data.createdAt,
          flash: data.flash,
          id: sessionID,
          updatedAt: data.updatedAt,
          userId: data.userId,
        };

        if (Date.now() - state.createdAt > absolute * 1000) {
          await this.destroy(sessionID);
          return resolve();
        }

        resolve(state);
      });
    });
  }

  clear(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.redisClient.flushdb((err: any) => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  }

  async cleanUpExpiredSessions(): Promise<void> {}

  /**
   * This method should only be used to close the redis connection.
   *
   * @returns The redis connection.
   * @memberof RedisStore
   */
  getRedisInstance() {
    return this.redisClient;
  }

}
