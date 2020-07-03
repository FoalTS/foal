import { Config, Session, SessionOptions, SessionStore } from '@foal/core';
import { MongoClient } from 'mongodb';

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

  private mongoDBClient: any;
  private collection: any;

  async boot() {
    const mongoDBURI = Config.getOrThrow(
      'mongodb.uri',
      'string',
      'You must provide the URI of your database when using MongoDBStore.'
    );
    this.mongoDBClient = await MongoClient.connect(mongoDBURI, { useNewUrlParser: true });
    this.collection = this.mongoDBClient.db().collection('foalSessions');
  }

  async createAndSaveSession(sessionContent: object, options: SessionOptions = {}): Promise<Session> {
    const sessionID = await this.generateSessionID();
    await this.applySessionOptions(sessionContent, options);

    const date = Date.now();
    await this.collection.insertOne({
      _id: sessionID,
      createdAt: date,
      sessionContent,
      updatedAt: date,
    });

    return new Session(this, sessionID, sessionContent, date);
  }

  async update(session: Session): Promise<void> {
    await this.collection.updateOne(
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
    await this.collection.deleteOne({ _id: sessionID });
  }

  async read(sessionID: string): Promise<Session | undefined> {
    const timeouts = SessionStore.getExpirationTimeouts();

    const sessions = await this.collection.find({ _id: sessionID }).toArray();
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

    return new Session(this, session._id, session.sessionContent, session.createdAt);
  }

  async extendLifeTime(sessionID: string): Promise<void> {
    await this.collection.updateOne(
      { _id: sessionID },
      {
        $set: {
          updatedAt: Date.now()
        }
      }
    );
  }

  async clear(): Promise<void> {
    await this.collection.deleteMany({});
  }

  async cleanUpExpiredSessions(): Promise<void> {
    const expiredTimeouts = SessionStore.getExpirationTimeouts();
    await this.collection.deleteMany({
      $or: [
        { createdAt: { $lt: Date.now() - expiredTimeouts.absolute * 1000 } },
        { updatedAt: { $lt: Date.now() - expiredTimeouts.inactivity * 1000 } }
      ]
    });
  }

  /**
   * This method should only be used to close the MongoDB connection.
   *
   * @returns {*} The MongoDB connection.
   * @memberof MongoDBStore
   */
  getMongoDBInstance(): any {
    return this.mongoDBClient;
  }

}
