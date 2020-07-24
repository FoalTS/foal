import { Session, SessionOptions, SessionStore } from '@foal/core';
import {  Column, Entity, getRepository,  LessThan, PrimaryColumn } from 'typeorm';

@Entity()
export class DatabaseSession {
  @PrimaryColumn()
  id: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'bigint' })
  updatedAt: number;

  @Column({ type: 'bigint' })
  createdAt: number;
}

/**
 * TypeORM store.
 *
 * @export
 * @class TypeORMStore
 * @extends {SessionStore}
 */
export class TypeORMStore extends SessionStore {
  async createAndSaveSession(sessionContent: object, options: SessionOptions = {}): Promise<Session> {
    const sessionID = await this.generateSessionID();
    await this.applySessionOptions(sessionContent, options);

    const date = Date.now();

    const databaseSession = new DatabaseSession();
    databaseSession.id = sessionID;
    databaseSession.content = JSON.stringify(sessionContent),
    databaseSession.updatedAt = date;
    databaseSession.createdAt = date;

    await getRepository(DatabaseSession)
      .save(databaseSession);

    return new Session(this, sessionID, sessionContent, date);
  }

  async update(session: Session): Promise<void> {
    await getRepository(DatabaseSession)
      .createQueryBuilder()
      .update()
      .set({
        createdAt: session.createdAt,
        content: JSON.stringify(session.getContent()),
        updatedAt: Date.now()
      })
      .where({ id: session.sessionID })
      .execute();
  }

  async destroy(sessionID: string): Promise<void> {
    await getRepository(DatabaseSession)
      .delete({ id: sessionID });
  }

  async read(sessionID: string): Promise<Session | undefined> {
    const timeouts = SessionStore.getExpirationTimeouts();

    const session = await getRepository(DatabaseSession).findOne({ id: sessionID });
    if (!session) {
      return undefined;
    }

    const createdAt = parseInt(session.createdAt.toString(), 10);
    const updatedAt = parseInt(session.updatedAt.toString(), 10);
    const sessionContent = JSON.parse(session.content);

    if (Date.now() - updatedAt > timeouts.inactivity * 1000) {
      await this.destroy(sessionID);
      return undefined;
    }

    if (Date.now() - createdAt > timeouts.absolute * 1000) {
      await this.destroy(sessionID);
      return undefined;
    }

    return new Session(this, session.id, sessionContent, createdAt);
  }

  async extendLifeTime(sessionID: string): Promise<void> {
    await getRepository(DatabaseSession)
      .createQueryBuilder()
      .update()
      .set({ updatedAt: Date.now() })
      .where({ id: sessionID })
      .execute();
  }

  async clear(): Promise<void> {
    await getRepository(DatabaseSession)
      .clear();
  }

  async cleanUpExpiredSessions(): Promise<void> {
    const expiredTimeouts = SessionStore.getExpirationTimeouts();
    await getRepository(DatabaseSession)
      .createQueryBuilder()
      .delete()
      .where([
        { createdAt: LessThan(Date.now() - expiredTimeouts.absolute * 1000) },
        { updatedAt: LessThan(Date.now() - expiredTimeouts.inactivity * 1000) }
      ])
      .execute();
  }

}
