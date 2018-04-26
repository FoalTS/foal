export interface Class<T = any> {
  new (...args: any[]): T;
}
