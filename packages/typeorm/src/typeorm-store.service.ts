import { Config, dependency, Session, SessionOptions, SessionStore } from '@foal/core';
import { Column, Entity, getRepository, LessThan, PrimaryColumn } from 'typeorm';

/**
 *
 *
 * @export
 * @class FoalSession
 */
@Entity()
export class FoalSession {
  @PrimaryColumn()
  sessionID: string;

  @Column('simple-json')
  sessionContent: object;

  @Column({ type: 'bigint' })
  createdAt: number;

  @Column({ type: 'bigint' })
  updatedAt: number;
}

/**
 * TypeORM store.
 *
 * @export
 * @class TypeORMStore
 * @extends {SessionStore}
 */
export class TypeORMStore extends SessionStore {
  @dependency
  config: Config;

  async createAndSaveSession(sessionContent: object, options: SessionOptions = {}): Promise<Session> {
    const sessionID = await this.generateSessionID();
    await this.applySessionOptions(sessionContent, options);

    const date = Date.now();

    const session = new FoalSession();
    session.sessionID = sessionID;
    session.sessionContent = sessionContent;
    session.updatedAt = date;
    session.createdAt = date;

    await getRepository(FoalSession).save(session);

    return new Session(sessionID, sessionContent, date);
  }

  async update(session: Session): Promise<void> {
    const foalSession = new FoalSession();
    foalSession.sessionID = session.sessionID;
    foalSession.sessionContent = session.getContent();
    foalSession.createdAt = session.createdAt;
    foalSession.updatedAt = Date.now();
    await getRepository(FoalSession).save(foalSession);
  }

  async destroy(sessionID: string): Promise<void> {
    await getRepository(FoalSession).delete({ sessionID });
  }

  async read(sessionID: string): Promise<Session | undefined> {
    const timeouts = SessionStore.getExpirationTimeouts();

    const session = await getRepository(FoalSession).findOne({ sessionID });
    if (!session) {
      return undefined;
    }

    // TypeORM bug?: depending on the database "createAt" and "updatedAt" may be a string or a number.
    const createdAt = parseInt(session.createdAt.toString(), 10);
    const updatedAt = parseInt(session.updatedAt.toString(), 10);

    if (Date.now() - updatedAt > timeouts.inactivity * 1000) {
      await this.destroy(sessionID);
      return undefined;
    }

    if (Date.now() - createdAt > timeouts.absolute * 1000) {
      await this.destroy(sessionID);
      return undefined;
    }

    return new Session(session.sessionID, session.sessionContent, createdAt);
  }

  async extendLifeTime(sessionID: string): Promise<void> {
    await getRepository(FoalSession).update({ sessionID }, { updatedAt: Date.now() });
  }

  async clear(): Promise<void> {
    await getRepository(FoalSession).delete({});
  }

  async cleanUpExpiredSessions(): Promise<void> {
    const expiredTimeouts = SessionStore.getExpirationTimeouts();
    await getRepository(FoalSession)
      .createQueryBuilder()
      .delete()
      .where([
        { updatedAt: LessThan(Date.now() - expiredTimeouts.inactivity * 1000) },
        { createdAt: LessThan(Date.now() - expiredTimeouts.absolute * 1000) },
      ])
      .execute();
  }
}
