import { Session, SessionOptions, SessionStore } from '@foal/core';
import { Connection, getConnection, ObjectLiteral, Table } from 'typeorm';

export interface DatabaseSession {
  session_id: string;
  session_content: string;
  created_at: string;
  updated_at: string;
}

/**
 * TypeORM store.
 *
 * @export
 * @class TypeORMStore
 * @extends {SessionStore}
 */
export class TypeORMStore extends SessionStore {
  private tableCreated = false;

  async createAndSaveSession(sessionContent: object, options: SessionOptions = {}): Promise<Session> {
    const sessionID = await this.generateSessionID();
    await this.applySessionOptions(sessionContent, options);

    const date = Date.now();

    await this.execQuery(
      `INSERT INTO foal_session (session_id, session_content, updated_at, created_at)
      VALUES (:sessionID, :sessionContent, :date, :date)`,
      {
        date,
        sessionContent: JSON.stringify(sessionContent),
        sessionID,
      }
    );

    return new Session(this, sessionID, sessionContent, date);
  }

  async update(session: Session): Promise<void> {
    await this.execQuery(
      `UPDATE foal_session
      SET updated_at=:updatedAt, created_at=:createdAt, session_content=:sessionContent
      WHERE session_id=:sessionID`,
      {
        createdAt: session.createdAt,
        sessionContent: JSON.stringify(session.getContent()),
        sessionID: session.sessionID,
        updatedAt: Date.now()
      }
    );
  }

  async destroy(sessionID: string): Promise<void> {
    await this.execQuery(
      `DELETE FROM foal_session WHERE session_id=:sessionID`,
      { sessionID }
    );
  }

  async read(sessionID: string): Promise<Session | undefined> {
    const timeouts = SessionStore.getExpirationTimeouts();

    const sessions = await this.execQuery(
      `SELECT * FROM foal_session WHERE session_id=:sessionID`,
      { sessionID }
    );
    if (sessions.length === 0) {
      return undefined;
    }
    const session: DatabaseSession = sessions[0];

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
    await this.execQuery(
      'UPDATE foal_session SET updated_at=:updatedAt WHERE session_id=:sessionID',
      { sessionID, updatedAt: Date.now() }
    );
  }

  async clear(): Promise<void> {
    await this.execQuery(`DELETE FROM foal_session`, {});
  }

  async cleanUpExpiredSessions(): Promise<void> {
    const expiredTimeouts = SessionStore.getExpirationTimeouts();
    await this.execQuery(
      `DELETE FROM foal_session
      WHERE updated_at < :updatedAtMax OR created_at < :createdAtMax`,
      {
        createdAtMax: Date.now() - expiredTimeouts.absolute * 1000,
        updatedAtMax: Date.now() - expiredTimeouts.inactivity * 1000,
      }
    );
  }

  private async execQuery(query: string, parameters: ObjectLiteral): Promise<any> {
    const connection = await this.getConnection();
    const [ escapedQuery, escapedParams ] = connection.driver.escapeQueryWithParameters(
      query, parameters, {}
    );
    return connection.query(escapedQuery, escapedParams);
  }

  private async getConnection(): Promise<Connection> {
    const connection = getConnection();
    if (!this.tableCreated) {
      const table = new Table({
        columns: [
          {
            isPrimary: true, // TODO: test isPrimary
            name: 'session_id',
            type: 'varchar',
          },
          {
            isNullable: false,
            name: 'session_content',
            type: 'text',
          },
          {
            isNullable: false,
            name: 'created_at',
            type: 'bigint',
          },
          {
            isNullable: false,
            name: 'updated_at',
            type: 'bigint',
          },
        ],
        name: 'foal_session',
      });
      const queryRunner = connection.createQueryRunner();
      try {
        await queryRunner.createTable(table, true);
      } catch (error) {
        throw error;
      } finally {
        await queryRunner.release();
      }
      this.tableCreated = true;
    }
    return connection;
  }

}
