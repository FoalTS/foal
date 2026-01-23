// 3p
import { SessionAlreadyExists, SessionState, SessionStore } from '@foal/core';
import { BaseEntity, Column, Entity, IsNull, LessThan, Not, PrimaryColumn, Repository } from 'typeorm';

@Entity({
  name: 'sessions'
})
export class DatabaseSession extends BaseEntity {
  @PrimaryColumn({ length: 44 })
  id: string;

  @Column({ nullable: true, type: 'int' })
  // Use snake case because camelCase does not work well with PostgreSQL.
  // tslint:disable-next-line: variable-name
  user_id: number | null;

  @Column({ nullable: true, type: 'varchar', length: 64 })
  // Use snake case because camelCase does not work well with PostgreSQL.
  // tslint:disable-next-line: variable-name
  user_id_str: string | null;

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

  private get repository(): Repository<DatabaseSession> {
    return DatabaseSession.getRepository();
  }

  async save(state: SessionState, maxInactivity: number): Promise<void> {
    if (typeof state.userId === 'string' && state.userId.length > 64) {
      throw new Error('[TypeORMStore] Impossible to save the session. The user ID is too long (max 64 characters).');
    }

    const userIdNumber = typeof state.userId === 'number' ? state.userId : null;
    const userIdStr = typeof state.userId === 'string' ? state.userId : null;

    try {
      await this.repository
        .createQueryBuilder()
        .insert()
        .values({
          content: JSON.stringify(state.content),
          created_at: state.createdAt,
          flash: JSON.stringify(state.flash),
          id: state.id,
          updated_at: state.updatedAt,
          user_id: userIdNumber ?? undefined,
          user_id_str: userIdStr ?? undefined,
        })
        .execute();
    } catch (error: any) {
      // SQLite, MySQL, PostgreSQL
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
    const session = await this.repository.findOneBy({ id });
    if (!session) {
      return null;
    }

    return {
      content: JSON.parse(session.content),
      createdAt: session.created_at,
      flash: JSON.parse(session.flash),
      id: session.id,
      updatedAt: session.updated_at,
      userId: session.user_id ?? session.user_id_str,
    };
  }

  async update(state: SessionState, maxInactivity: number): Promise<void> {
    if (typeof state.userId === 'string' && state.userId.length > 64) {
      throw new Error('[TypeORMStore] Impossible to save the session. The user ID is too long (max 64 characters).');
    }

    const userIdNumber = typeof state.userId === 'number' ? state.userId : null;
    const userIdStr = typeof state.userId === 'string' ? state.userId : null;

    const dbSession = this.repository.create({
      content: JSON.stringify(state.content),
      created_at: state.createdAt,
      flash: JSON.stringify(state.flash),
      id: state.id,
      updated_at: state.updatedAt,
      user_id: userIdNumber ?? undefined,
      user_id_str: userIdStr ?? undefined,
    });

    // The "save" method performs an UPSERT.
    await this.repository.save(dbSession);
  }

  async destroy(sessionID: string): Promise<void> {
    await this.repository
      .delete({ id: sessionID });
  }

  async clear(): Promise<void> {
    await this.repository
      .clear();
  }

  async cleanUpExpiredSessions(maxInactivity: number, maxLifeTime: number): Promise<void> {
    await this.repository
      .createQueryBuilder()
      .delete()
      .where([
        { created_at: LessThan(Math.trunc(Date.now() / 1000) - maxLifeTime) },
        { updated_at: LessThan(Math.trunc(Date.now() / 1000) - maxInactivity) },
      ])
      .execute();
  }

  async getAuthenticatedUserIds(): Promise<(number | string)[]> {
    const [numberSessions, stringSessions] = await Promise.all([
      this.repository
        .createQueryBuilder()
        .select('DISTINCT user_id')
        .where({
          user_id: Not(IsNull())
        })
        .getRawMany(),
      this.repository
        .createQueryBuilder()
        .select('DISTINCT user_id_str')
        .where({
          user_id_str: Not(IsNull())
        })
        .getRawMany(),
    ]);

    return [
      ...numberSessions.map(({ user_id }) => user_id),
      ...stringSessions.map(({ user_id_str }) => user_id_str),
    ];
  }

  async destroyAllSessionsOf(userId: number | string): Promise<void> {
    if (typeof userId === 'number') {
      await this.repository.delete({ user_id: userId });
    } else {
      await this.repository.delete({ user_id_str: userId });
    }
  }

  async getSessionIDsOf(userId: number | string): Promise<string[]> {
    const where = typeof userId === 'number'
      ? { user_id: userId }
      : { user_id_str: userId };

    const databaseSessions = await this.repository.find({
      // Do not select unused fields.
      select: { id: true },
      where,
    });
    return databaseSessions.map(dbSession => dbSession.id);
  }

}