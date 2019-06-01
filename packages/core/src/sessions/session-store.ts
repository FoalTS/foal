// std
import { randomBytes } from 'crypto';
import { promisify } from 'util';

// FoalTS
import { convertBase64ToBase64url, Session } from './session';

export abstract class SessionStore {
  abstract createAndSaveSession(sessionContent: object): Promise<Session>;
  abstract update(session: Session): Promise<void>;
  abstract destroy(sessionID: string): Promise<void>;
  abstract read(sessionID: string): Promise<Session>;
  abstract extendLifeTime(sessionID: string): Promise<void>;

  protected async generateSessionID(): Promise<string> {
    const buff = await promisify(randomBytes)(32);
    return convertBase64ToBase64url(buff.toString('base64'));
  }
}
