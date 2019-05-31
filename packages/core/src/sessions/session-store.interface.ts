// FoalTS
import { Session } from './session';

export interface  ISessionStore {
  createAndSaveSession(sessionContent: object): Promise<Session>;
  update(session: Session): Promise<void>;
  destroy(sessionId: string): Promise<void>;
  read(sessionId: string): Promise<Session>;
  extendLifeTime(session: Session): Promise<void>;
}
