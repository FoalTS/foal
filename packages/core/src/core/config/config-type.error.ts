export class ConfigTypeError extends Error {
  constructor(readonly key: string, readonly expected: string, readonly actual: string) {
    super(
      `The value of the configuration key "${key}" has an invalid type.\n`
      + '\n'
      + `Expected a "${expected}", but got a "${actual}".`
    );
  }
}
