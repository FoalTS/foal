/**
 * Interface of a class from its class definition.
 *
 * @export
 */
export type Class<T = any> = new (...args: any[]) => T;
