import { Dependency, SessionAlreadyExists, SessionState, SessionStore } from '@foal/core';
import { Column, DataSource, Entity, IsNull, LessThan, Not, PrimaryColumn } from 'typeorm';
import { TYPEORM_DATA_SOURCE_KEY } from './common';

@Entity({
  name: 'sessions'
})
export class DatabaseSession {
  @PrimaryColumn({ length: 44 })
  id: string;

  @Column({ nullable: true })
  // Use snake case because camelCase does not work well with PostgreSQL.
  // tslint:disable-next-line: variable-name
  user_id: number;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'text' })
  flash: string;

  @Column()
  // Use snake case because camelCase does not work well with PostgreSQL.
  // tslint:disable-next-line: variable-name
  updated_at: number;

  @Column()
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

  @Dependency(TYPEORM_DATA_SOURCE_KEY)
  dataSource: DataSource;

  async save(state: SessionState, maxInactivity: number): Promise<void> {
    if (typeof state.userId === 'string') {
      throw new Error('[TypeORMStore] Impossible to save the session. The user ID must be a number.');
    }

    try {
      await this.dataSource
        .getRepository(DatabaseSession)
        .createQueryBuilder()
        .insert()
        .values({
          content: JSON.stringify(state.content),
          created_at: state.createdAt,
          flash: JSON.stringify(state.flash),
          id: state.id,
          updated_at: state.updatedAt,
          // tslint:disable-next-line
          user_id: state.userId ?? undefined,
        })
        .execute();
    } catch (error: any) {
      // SQLite, MariaDB & MySQL, PostgreSQL
      if (
        ['SQLITE_CONSTRAINT', 'ER_DUP_ENTRY', '23505'].includes(error.code)
        || error.message === 'SqliteError: UNIQUE constraint failed: sessions.id'
      ) {
        throw new SessionAlreadyExists();
      }
      // TODO: test this line.
      throw error;
    }
  }

  async read(id: string): Promise<SessionState | null> {
    const session = await this.dataSource.getRepository(DatabaseSession).findOneBy({ id });
    if (!session) {
      return null;
    }

    return {
      content: JSON.parse(session.content),
      createdAt: session.created_at,
      flash: JSON.parse(session.flash),
      id: session.id,
      updatedAt: session.updated_at,
      // Note: session.user_id is actually a number or null (not undefined).
      userId: session.user_id,
    };
  }

  async update(state: SessionState, maxInactivity: number): Promise<void> {
    if (typeof state.userId === 'string') {
      throw new Error('[TypeORMStore] Impossible to save the session. The user ID must be a number.');
    }

    const dbSession = this.dataSource.getRepository(DatabaseSession).create({
      content: JSON.stringify(state.content),
      created_at: state.createdAt,
      flash: JSON.stringify(state.flash),
      id: state.id,
      updated_at: state.updatedAt,
      // tslint:disable-next-line
      user_id: state.userId ?? undefined,
    });

    // The "save" method performs an UPSERT.
    await this.dataSource.getRepository(DatabaseSession).save(dbSession);
  }

  async destroy(sessionID: string): Promise<void> {
    await this.dataSource.getRepository(DatabaseSession)
      .delete({ id: sessionID });
  }

  async clear(): Promise<void> {
    await this.dataSource.getRepository(DatabaseSession)
      .clear();
  }

  async cleanUpExpiredSessions(maxInactivity: number, maxLifeTime: number): Promise<void> {
    await this.dataSource
      .getRepository(DatabaseSession)
      .createQueryBuilder()
      .delete()
      .where([
        { created_at: LessThan(Math.trunc(Date.now() / 1000) - maxLifeTime) },
        { updated_at: LessThan(Math.trunc(Date.now() / 1000) - maxInactivity) },
      ])
      .execute();
  }

  async getAuthenticatedUserIds(): Promise<number[]> {
    const sessions = await this.dataSource
      .getRepository(DatabaseSession)
      .createQueryBuilder()
      .select('DISTINCT user_id')
      .where({
        user_id: Not(IsNull())
      })
      .getRawMany();
    return sessions.map(({ user_id }) => user_id);
  }

  async destroyAllSessionsOf(user: { id: number }): Promise<void> {
    await this.dataSource.getRepository(DatabaseSession).delete({ user_id: user.id });
  }

  async getSessionIDsOf(user: { id: number }): Promise<string[]> {
    const databaseSessions = await this.dataSource.getRepository(DatabaseSession).find({
      // Do not select unused fields.
      select: { id: true },
      where: { user_id: user.id },
    });
    return databaseSessions.map(dbSession => dbSession.id);
  }

  /**
   * Closes the connection to the database.
   *
   * @memberof RedisStore
   */
  async close(): Promise<void> {
    await this.dataSource.close();
  }

}
