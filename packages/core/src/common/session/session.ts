export class Session {
  isModified = false;
  private dict = {};
  set(key: string, value: any): void {}
  get(key: string, defaultValue?: any) {}
  pop(key: string, defaultValue?: any) {}
  isEmpty(): boolean {}
  clear() {} // flush
  commit() {}
  clearExpired() {}
}
