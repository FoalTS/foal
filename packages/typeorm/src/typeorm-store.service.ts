import { Session, SessionOptions, SessionStore } from '@foal/core';
import {  Column, Entity, getRepository, IsNull, LessThan, Not, PrimaryColumn } from 'typeorm';

@Entity()
export class DatabaseSession {
  @PrimaryColumn()
  id: string;

  @Column({ nullable: true })
  // Use snake case because camelCase does not work well with PostgreSQL.
  // tslint:disable-next-line: variable-name
  user_id: number;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'text' })
  flash: string;

  @Column({ type: 'bigint' })
  // Use snake case because camelCase does not work well with PostgreSQL.
  // tslint:disable-next-line: variable-name
  updated_at: number;

  @Column({ type: 'bigint' })
  // Use snake case because camelCase does not work well with PostgreSQL.
  // tslint:disable-next-line: variable-name
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
  async createAndSaveSession(content: object, options: SessionOptions = {}): Promise<Session> {
    if (typeof options.userId === 'string') {
      throw new Error('[TypeORMStore] Impossible to save the session. The user ID must be a number.');
    }

    const sessionID = await this.generateSessionID();
    await this.applySessionOptions(content, options);

    const date = Date.now();
    const flash = {};

    // TODO: test that the method throws if the ID is already taken.
    await getRepository(DatabaseSession)
      .createQueryBuilder()
      .insert()
      .values({
        content: JSON.stringify(content),
        created_at: date,
        // TODO: test this line
        flash: JSON.stringify(flash),
        id: sessionID,
        updated_at: date,
        user_id: options.userId,
      })
      .execute();

    return new Session(this, {
      content,
      createdAt: date,
      // TODO: test this line
      flash,
      id: sessionID,
      userId: options.userId,
    });
  }

  async update(session: Session): Promise<void> {
    await getRepository(DatabaseSession)
      .createQueryBuilder()
      .update()
      .set({
        content: JSON.stringify(session.getState().content),
        flash: JSON.stringify(session.getState().flash),
        updated_at: Date.now()
      })
      .where({ id: session.getState().id })
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

    const createdAt = parseInt(session.created_at.toString(), 10);
    const updatedAt = parseInt(session.updated_at.toString(), 10);
    const content = JSON.parse(session.content);
    const flash = JSON.parse(session.flash);

    if (Date.now() - updatedAt > timeouts.inactivity * 1000) {
      await this.destroy(sessionID);
      return undefined;
    }

    if (Date.now() - createdAt > timeouts.absolute * 1000) {
      await this.destroy(sessionID);
      return undefined;
    }

    return new Session(this, {
      content,
      createdAt,
      flash,
      id: session.id,
      userId: session.user_id,
    });
  }

  async extendLifeTime(sessionID: string): Promise<void> {
    await getRepository(DatabaseSession)
      .createQueryBuilder()
      .update()
      .set({ updated_at: Date.now() })
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
        { created_at: LessThan(Date.now() - expiredTimeouts.absolute * 1000) },
        { updated_at: LessThan(Date.now() - expiredTimeouts.inactivity * 1000) }
      ])
      .execute();
  }

  async getAuthenticatedUserIds(): Promise<number[]> {
    const sessions = await getRepository(DatabaseSession)
      .createQueryBuilder()
      .select('DISTINCT user_id')
      .where({
        user_id: Not(IsNull())
      })
      .getRawMany();
    return sessions.map(({ user_id }) => user_id);
  }

  async destroyAllSessionsOf(user: { id: number }): Promise<void> {
    await getRepository(DatabaseSession).delete({ user_id: user.id });
  }

  async getSessionsOf(user: { id: number }): Promise<Session[]> {
    const databaseSessions = await getRepository(DatabaseSession).find({ user_id: user.id });
    return databaseSessions.map(databaseSession => new Session(this, {
      content: JSON.parse(databaseSession.content),
      createdAt: parseInt(databaseSession.created_at.toString(), 10),
      flash: JSON.parse(databaseSession.flash),
      id: databaseSession.id,
      userId: user.id,
    }));
  }

}
