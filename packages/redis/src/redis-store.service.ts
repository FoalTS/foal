import { Config, SessionAlreadyExists, SessionState, SessionStore } from '@foal/core';
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
    const redisURI = Config.get('settings.redis.uri', 'string');
    this.redisClient = createClient(redisURI);
  }

  getRedisClient() {
    return this.redisClient;
  }

  save(state: SessionState, maxInactivity: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const payload = JSON.stringify(state);
      this.redisClient.set(`sessions:${state.id}`, payload, 'NX', 'EX', maxInactivity, (err: any, val: string | null) => {
        // TODO: test this line.
        if (err) {
          return reject(err);
        }
        if (val !== 'OK') {
          return reject(new SessionAlreadyExists());
        }
        resolve();
      });
    });
  }

  read(id: string): Promise<SessionState | null> {
    return new Promise<SessionState | null>((resolve, reject) => {
      this.redisClient.get(`sessions:${id}`, async (err: any, val: string | null) => {
        // TODO: test this line.
        if (err) {
          return reject(err);
        }
        if (val === null) {
          return resolve(null);
        }
        const state = JSON.parse(val);
        resolve(state);
      });
    });
  }

  update(state: SessionState, maxInactivity: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const payload = JSON.stringify(state);
      this.redisClient.set(`sessions:${state.id}`, payload, 'EX', maxInactivity, (err: any) => {
        // TODO: test this line.
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  }

  destroy(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.redisClient.del(`sessions:${id}`, (err: any) => {
        // TODO: test this line.
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
        // TODO: test this line.
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  }

  async cleanUpExpiredSessions(): Promise<void> { }

  /**
   * Closes the connection to the database.
   *
   * @memberof RedisStore
   */
  async close(): Promise<void> {
    await this.redisClient.end(true);
  }
}
