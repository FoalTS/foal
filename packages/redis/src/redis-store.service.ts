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

  private redisClient: ReturnType<typeof createClient>;

  setRedisClient(redisClient: ReturnType<typeof createClient>): void {
    this.redisClient = redisClient;
  }

  async boot() {
    if (this.redisClient) {
      return;
    }
    const redisURI = Config.get('settings.redis.uri', 'string');
    this.redisClient = createClient({ url: redisURI });
    await this.redisClient.connect();
  }

  async save(state: SessionState, maxInactivity: number): Promise<void> {
    const payload = JSON.stringify(state);
    const val = await this.redisClient.set(`sessions:${state.id}`, payload, {
      NX: true,
      EX: maxInactivity,
    })

    if (val !== 'OK') {
      throw new SessionAlreadyExists();
    }
  }

  async read(id: string): Promise<SessionState | null> {
    const val = await this.redisClient.get(`sessions:${id}`);
    if (val === null) {
      return null;
    }
    return JSON.parse(val);
  }

  async update(state: SessionState, maxInactivity: number): Promise<void> {
    const payload = JSON.stringify(state);
    await this.redisClient.set(`sessions:${state.id}`, payload, {
      EX: maxInactivity,
    });
  }

  async destroy(id: string): Promise<void> {
    await this.redisClient.del(`sessions:${id}`);
  }

  async clear(): Promise<void> {
    await this.redisClient.flushDb();
  }

  async cleanUpExpiredSessions(): Promise<void> {}

  /**
   * Closes the connection to the database.
   *
   * @memberof RedisStore
   */
  async close(): Promise<void> {
    await this.redisClient.quit();
  }
}
