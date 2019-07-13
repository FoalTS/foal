import { Config, dependency, Session, SessionOptions, SessionStore } from '@foal/core';
import { createClient } from 'redis';

/**
 * Redis Store
 *
 * @export
 * @class RedisStore
 * @extends {SessionStore}
 */
export class RedisStore extends SessionStore {

  @dependency
  config: Config;

  private redisClient;

  async createAndSaveSession(sessionContent: object, options: SessionOptions = {}): Promise<Session> {
    const inactivity = SessionStore.getExpirationTimeouts().inactivity;

    const createdAt = Date.now();
    const sessionID = await this.generateSessionID();
    await this.applySessionOptions(sessionContent, options);

    return new Promise<Session>((resolve, reject) => {
      const data = JSON.stringify({ content: sessionContent, createdAt });
      this.getRedisInstance().set(`session:${sessionID}`, data, 'NX', 'EX', inactivity, err => {
        if (err) {
          return reject(err);
        }
        const session = new Session(sessionID, sessionContent, createdAt);
        resolve(session);
      });
    });
  }

  update(session: Session): Promise<void> {
    const inactivity = SessionStore.getExpirationTimeouts().inactivity;

    return new Promise<void>((resolve, reject) => {
      const data = JSON.stringify({ content: session.getContent(), createdAt: session.createdAt });
      this.getRedisInstance().set(`session:${session.sessionID}`, data, 'EX', inactivity, err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  }

  destroy(sessionID: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.getRedisInstance().del(`session:${sessionID}`, err => {
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
      this.getRedisInstance().get(`session:${sessionID}`, async (err, val: string|null) => {
        if (err) {
          return reject(err);
        }
        if (val === null) {
          return resolve(undefined);
        }
        const data = JSON.parse(val);
        const session = new Session(sessionID, data.content, data.createdAt);

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
      this.getRedisInstance().expire(`session:${sessionID}`, inactivity, err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  }

  clear(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.getRedisInstance().flushdb(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  }

  async cleanUpExpiredSessions(): Promise<void> {}

  getRedisInstance() {
    if (!this.redisClient) {
      const redisURI = this.config.get('redis.uri');
      this.redisClient = createClient(redisURI);
    }
    return this.redisClient ;
  }

}
