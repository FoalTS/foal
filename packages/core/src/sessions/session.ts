export class Session {

  static verifyTokenAndGetId(token: string): string|false {
    return false;
  }

  private modified = false;

  constructor(readonly sessionId, private sessionContent: object, readonly maxAge: number) {}

  get isModified() {
    return this.modified;
  }

  set(key: string, value: any): void {
    this.sessionContent[key] = value;
    this.modified = true;
  }

  get<T>(key: string, defaultValue?: T): T|undefined {
    if (!this.sessionContent.hasOwnProperty(key)) {
      return defaultValue;
    }
    return this.sessionContent[key];
  }

  getToken(): string {
    // Use signature.
    return this.sessionId;
  }

}
