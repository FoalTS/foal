export interface Class<T> {
  new (...args: any[]): T;
}

export interface ObjectType {
  [name: string]: any;
}
