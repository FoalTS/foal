export type Dynamic<T> = {
  [P in keyof T]: T[P] | ((controller: any) => Exclude<T[P], undefined>);
};
