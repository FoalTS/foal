import { Session, SessionOptions, SessionStore } from '@foal/core';
import {  Column, Entity, getRepository,  LessThan, PrimaryColumn} from 'typeorm';

@Entity()
export class FoalSession {
  @PrimaryColumn()
  session_id: string;

  @Column({ type: 'text' })
  session_content: string;

  @Column({ type: 'bigint' })
  updated_at: number;

  @Column({ type: 'bigint' })
  created_at: number;
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

    const databaseSession = new FoalSession();
    databaseSession.session_id = sessionID;
    databaseSession.session_content = JSON.stringify(sessionContent),
    databaseSession.updated_at = date;
    databaseSession.created_at = date;

    await getRepository(FoalSession)
      .save(databaseSession);

    return new Session(this, sessionID, sessionContent, date);
  }

  async update(session: Session): Promise<void> {
    await getRepository(FoalSession)
      .createQueryBuilder()
      .update()
      .set({
        created_at: session.createdAt,
        session_content: JSON.stringify(session.getContent()),
        updated_at: Date.now()
      })
      .where({ session_id: session.sessionID })
      .execute();
  }

  async destroy(sessionID: string): Promise<void> {
    await getRepository(FoalSession)
      .delete({ session_id: sessionID });
  }

  async read(sessionID: string): Promise<Session | undefined> {
    const timeouts = SessionStore.getExpirationTimeouts();

    const session = await getRepository(FoalSession).findOne({ session_id: sessionID });
    if (!session) {
      return undefined;
    }

    const createdAt = parseInt(session.created_at.toString(), 10);
    const updatedAt = parseInt(session.updated_at.toString(), 10);
    const sessionContent = JSON.parse(session.session_content);

    if (Date.now() - updatedAt > timeouts.inactivity * 1000) {
      await this.destroy(sessionID);
      return undefined;
    }

    if (Date.now() - createdAt > timeouts.absolute * 1000) {
      await this.destroy(sessionID);
      return undefined;
    }

    return new Session(this, session.session_id, sessionContent, createdAt);
  }

  async extendLifeTime(sessionID: string): Promise<void> {
    await getRepository(FoalSession)
      .createQueryBuilder()
      .update()
      .set({ updated_at: Date.now() })
      .where({ session_id: sessionID })
      .execute();
  }

  async clear(): Promise<void> {
    await getRepository(FoalSession)
      .clear();
  }

  async cleanUpExpiredSessions(): Promise<void> {
    const expiredTimeouts = SessionStore.getExpirationTimeouts();
    await getRepository(FoalSession)
      .createQueryBuilder()
      .delete()
      .where([
        { created_at: LessThan(Date.now() - expiredTimeouts.absolute * 1000) },
        { updated_at: LessThan(Date.now() - expiredTimeouts.inactivity * 1000) }
      ])
      .execute();
  }

}
