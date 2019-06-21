// FoalTS
import { signToken, verifySignedToken } from '../common';
import { Config } from '../core';

export class Session {

  static verifyTokenAndGetId(token: string): string|false {
    const secret = Config.get<string|undefined>('settings.session.secret');
    if (!secret) {
      throw new Error('[CONFIG] You must provide a secret with the configuration key settings.session.secret.');
    }

    return verifySignedToken(token, secret);
  }

  private modified = false;

  constructor(readonly sessionID: string, private sessionContent: object, readonly createdAt: number) {
    if (sessionID.includes('.')) {
      throw new Error('A session ID cannot include dots.');
    }
  }

  get isModified(): boolean {
    return this.modified;
  }

  set(key: string, value: any): void {
    this.sessionContent[key] = value;
    this.modified = true;
  }

  get<T>(key: string): T | undefined;
  get<T>(key: string, defaultValue: any): T;
  get(key: string, defaultValue?: any): any {
    if (!this.sessionContent.hasOwnProperty(key)) {
      return defaultValue;
    }
    return this.sessionContent[key];
  }

  getToken(): string {
    const secret = Config.get<string|undefined>('settings.session.secret');
    if (!secret) {
      throw new Error('[CONFIG] You must provide a secret with the configuration key settings.session.secret.');
    }
    return signToken(this.sessionID, secret);
  }

  getContent(): object {
    return { ...this.sessionContent };
  }

}
