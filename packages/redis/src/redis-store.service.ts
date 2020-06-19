import { Config, Session, SessionOptions, SessionStore } from '@foal/core';
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

  async createAndSaveSession(sessionContent: object, options: SessionOptions = {}): Promise<Session> {
    const inactivity = SessionStore.getExpirationTimeouts().inactivity;

    const createdAt = Date.now();
    const sessionID = await this.generateSessionID();
    await this.applySessionOptions(sessionContent, options);

    return new Promise<Session>((resolve, reject) => {
      const data = JSON.stringify({ content: sessionContent, createdAt });
      this.redisClient.set(`session:${sessionID}`, data, 'NX', 'EX', inactivity, (err: any) => {
        if (err) {
          return reject(err);
        }
        const session = new Session(this, sessionID, sessionContent, createdAt);
        resolve(session);
      });
    });
  }

  update(session: Session): Promise<void> {
    const inactivity = SessionStore.getExpirationTimeouts().inactivity;

    return new Promise<void>((resolve, reject) => {
      const data = JSON.stringify({ content: session.getContent(), createdAt: session.createdAt });
      this.redisClient.set(`session:${session.sessionID}`, data, 'EX', inactivity, (err: any) => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  }

  destroy(sessionID: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.redisClient.del(`session:${sessionID}`, (err: any) => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  }

  read(sessionID: string): Promise<Session | undefined> {
    const absolute = SessionStore.getExpirationTimeouts().absolute;

    return new Promise<Session | undefined>((resolve, reject) => {
      this.redisClient.get(`session:${sessionID}`, async (err: any, val: string|null) => {
        if (err) {
          return reject(err);
        }
        if (val === null) {
          return resolve(undefined);
        }
        const data = JSON.parse(val);
        const session = new Session(this, sessionID, data.content, data.createdAt);

        if (Date.now() - session.createdAt > absolute * 1000) {
          await this.destroy(sessionID);
          return resolve();
        }

        resolve(session);
      });
    });
  }

  extendLifeTime(sessionID: string): Promise<void> {
    const inactivity = SessionStore.getExpirationTimeouts().inactivity;

    return new Promise<void>((resolve, reject) => {
      this.redisClient.expire(`session:${sessionID}`, inactivity, (err: any) => {
        if (err) {
          return reject(err);
        }
        resolve();
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
