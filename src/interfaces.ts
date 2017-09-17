export interface Type<T> {
  new (...args: any[]): T;
}
