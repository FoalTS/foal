import { Config, dependency, Session, SessionOptions, SessionStore } from '@foal/core';
import { Collection, MongoClient } from 'mongodb';

export interface DatabaseSession {
  _id: string;
  sessionContent: object;
  createdAt: number;
  updatedAt: number;
}

/**
 * MongoDB store.
 *
 * @export
 * @class MongoDBStore
 * @extends {SessionStore}
 */
export class MongoDBStore extends SessionStore {
  @dependency
  config: Config;

  private mongoDBClient: MongoClient;

  async createAndSaveSession(sessionContent: object, options: SessionOptions = {}): Promise<Session> {
    const sessionID = await this.generateSessionID();
    await this.applySessionOptions(sessionContent, options);

    const date = Date.now();
    await (await this.getSessionCollection()).insertOne({
      _id: sessionID,
      createdAt: date,
      sessionContent,
      updatedAt: date,
    });

    return new Session(sessionID, sessionContent, date);
  }

  async update(session: Session): Promise<void> {
    await (await this.getSessionCollection()).updateOne(
      {
        _id: session.sessionID
      },
      {
        $set: {
          // createdAt: session.createdAt,
          sessionContent: session.getContent(),
          updatedAt: Date.now()
        }
      }
    );
  }

  async destroy(sessionID: string): Promise<void> {
    await (await this.getSessionCollection()).deleteOne({ _id: sessionID });
  }

  async read(sessionID: string): Promise<Session | undefined> {
    const timeouts = SessionStore.getExpirationTimeouts();

    const sessions = await (await this.getSessionCollection()).find({ _id: sessionID }).toArray();
    if (sessions.length === 0) {
      return undefined;
    }
    const session: DatabaseSession = sessions[0];

    if (Date.now() - session.updatedAt > timeouts.inactivity * 1000) {
      await this.destroy(sessionID);
      return undefined;
    }

    if (Date.now() - session.createdAt > timeouts.absolute * 1000) {
      await this.destroy(sessionID);
      return undefined;
    }

    return new Session(session._id, session.sessionContent, session.createdAt);
  }

  async extendLifeTime(sessionID: string): Promise<void> {
    await (await this.getSessionCollection()).updateOne(
      { _id: sessionID },
      {
        $set: {
          updatedAt: Date.now()
        }
      }
    );
  }

  async clear(): Promise<void> {
    await (await this.getSessionCollection()).deleteMany({});
  }

  async cleanUpExpiredSessions(): Promise<void> {
    const expiredTimeouts = SessionStore.getExpirationTimeouts();
    await (await this.getSessionCollection()).deleteMany({
      $or: [
        { createdAt: { $lt: Date.now() - expiredTimeouts.absolute * 1000 } },
        { updatedAt: { $lt: Date.now() - expiredTimeouts.inactivity * 1000 } }
      ]
    });
  }

  async getMongoDBInstance(): Promise<MongoClient> {
    if (!this.mongoDBClient) {
      const mongoDBURI = this.config.get('mongodb.uri');
      this.mongoDBClient = await MongoClient.connect(mongoDBURI);
    }
    return this.mongoDBClient;
  }

  private async getSessionCollection(): Promise<Collection> {
    const mongoClient = await this.getMongoDBInstance();
    return mongoClient.db().collection('foalSessions');
  }

}
