export class ConfigNotFoundError extends Error {
  readonly name = 'ConfigNotFoundError';

  constructor(readonly key: string, readonly msg?: string) {
    super();

    this.message = `No value found for the configuration key "${key}".${msg === undefined ? '' : ` ${msg}`}`;
  }

}
