export interface Type<T> {
  new (...args: any[]): T;
}

export interface ObjectType {
  [name: string]: any;
}

export type Hook = (target: any, methodName?: string) => void;
