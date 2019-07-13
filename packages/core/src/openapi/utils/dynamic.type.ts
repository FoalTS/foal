/**
 * Make every property of T accept a function.
 *
 * @interface Dynamic
 */
export type Dynamic<T> = {
  [P in keyof T]: T[P] | ((controller: any) => Exclude<T[P], undefined>);
};
