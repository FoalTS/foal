export function isFunction(schema: object | ((controller: any) => object)): schema is ((controller: any) => object) {
  return typeof schema === 'function';
}
