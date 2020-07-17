/**
 * Interface of a class from its class definition.
 *
 * @export
 */
export type Class<T = any> = new(...args: any[]) => T;

/**
 * Interface of a concrete or abstract class from its class definition.
 *
 * @export
 */
export interface ClassOrAbstractClass<T = any> extends Function {
  prototype: T;
}
