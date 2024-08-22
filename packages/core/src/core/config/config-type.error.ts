export class ConfigTypeError extends Error {
  readonly name = 'ConfigTypeError';

  constructor(readonly key: string, readonly expected: string, readonly actual: string) {
    super();
    this.message = `The value of the configuration key "${key}" has an invalid type. Expected a "${expected}", but got a "${actual}".`
  }
}
