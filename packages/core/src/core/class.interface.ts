/**
 * Interface of a class from its class definition.
 *
 * @export
 */
export interface Class<T = any> extends Function {
  new(...args: any[]): T;
}

/**
 * Interface of a concrete or abstract class from its class definition.
 *
 * @export
 */
export interface ClassOrAbstractClass<T = any> extends Function {
  prototype: T;
}


