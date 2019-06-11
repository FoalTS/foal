import { createHmac, timingSafeEqual } from 'crypto';
import { Config } from '../core';

export function convertBase64ToBase64url(str: string): string {
  return str
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

function sign(base64Value: string, base64Secret: string): Buffer {
  return createHmac('sha256', Buffer.from(base64Secret, 'base64'))
    .update(Buffer.from(base64Value, 'base64'))
    .digest();
}

export class Session {

  static verifyTokenAndGetId(token: string): string|false {
    const secret = Config.get<string|undefined>('settings.session.secret');
    if (!secret) {
      throw new Error('You must provide a secret with the configuration key settings.session.secret.');
    }

    if (typeof token !== 'string') {
      return false;
    }
    const [ sessionID, signature ] = token.split('.');
    // signature is potentially undefined
    if (signature === undefined) {
      return false;
    }

    const expectedSignatureBuffer = sign(sessionID, secret);
    const actualSignatureBuffer = Buffer.alloc(expectedSignatureBuffer.length);
    actualSignatureBuffer.write(signature, 0, actualSignatureBuffer.length, 'base64');

    if (timingSafeEqual(expectedSignatureBuffer, actualSignatureBuffer)) {
      return sessionID;
    }
    return false;
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
      throw new Error('You must provide a secret with the configuration key settings.session.secret.');
    }
    const signature = sign(this.sessionID, secret).toString('base64');
    return `${this.sessionID}.${convertBase64ToBase64url(signature)}`;
  }

  getContent(): object {
    return { ...this.sessionContent };
  }

}
