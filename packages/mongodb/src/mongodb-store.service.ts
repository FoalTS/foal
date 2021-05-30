import { Config, SessionAlreadyExists, SessionState, SessionStore } from '@foal/core';
import { MongoClient } from 'mongodb';

interface DatabaseSession {
  sessionID: string;
  state: SessionState;
}

/**
 * MongoDB store.
 *
 * @export
 * @class MongoDBStore
 * @extends {SessionStore}
 */
export class MongoDBStore extends SessionStore {

  private mongoDBClient: any;
  private collection: any;

  async boot(uri?: string) {
    const mongoDBURI = uri || Config.getOrThrow(
      'settings.mongodb.uri',
      'string',
      'You must provide the URI of your database when using MongoDBStore.'
    );
    this.mongoDBClient = await MongoClient.connect(mongoDBURI, { useNewUrlParser: true, useUnifiedTopology: true });
    this.collection = this.mongoDBClient.db().collection('sessions');
    this.collection.createIndex({ sessionID: 1 }, { unique: true });
  }

  async save(state: SessionState, maxInactivity: number): Promise<void> {
    try {
      await this.collection.insertOne({
        sessionID: state.id,
        state,
      });
    } catch (error) {
      if (error.code === 11000) {
        throw new SessionAlreadyExists();
      }
      // TODO: test this line.
      throw error;
    }
  }

  async read(id: string): Promise<SessionState | null> {
    const session: DatabaseSession|null = await this.collection.findOne({ sessionID: id });
    if (session === null) {
      return session;
    }

    return session.state;
  }

  async update(state: SessionState, maxInactivity: number): Promise<void> {
    await this.collection.updateOne(
      {
        sessionID: state.id
      },
      {
        $set: { state }
      },
      {
        upsert: true,
      }
    );
  }

  async destroy(id: string): Promise<void> {
    await this.collection.deleteOne({ sessionID: id });
  }

  async clear(): Promise<void> {
    await this.collection.deleteMany({});
  }

  async cleanUpExpiredSessions(maxInactivity: number, maxLifeTime: number): Promise<void> {
    await this.collection.deleteMany({
      $or: [
        { 'state.createdAt': { $lt: Math.trunc(Date.now() / 1000) - maxLifeTime } },
        { 'state.updatedAt': { $lt: Math.trunc(Date.now() / 1000) - maxInactivity } }
      ]
    });
  }

  /**
   * Closes the connection to the database.
   *
   * @memberof MongoDBStore
   */
  async close(): Promise<void> {
    await this.mongoDBClient.close();
  }

}
