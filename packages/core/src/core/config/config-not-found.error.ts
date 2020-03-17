import { dotToUnderscore } from './utils';

export class ConfigNotFoundError extends Error {
  readonly name = 'ConfigNotFoundError';

  constructor(readonly key: string, readonly msg?: string) {
    super(
      `No value found for the configuration key "${key}".\n\n`
      + (msg ? `${msg}\n\n` : '')
      + 'To pass a value, you can use:\n'
      + `- the environment variable ${dotToUnderscore(key)},\n`
      + `- the ".env" file with the variable ${dotToUnderscore(key)},\n`
      + `- the JSON file "config/${process.env.NODE_ENV || 'development'}.json" with the path "${key}",\n`
      + `- the YAML file "config/${process.env.NODE_ENV || 'development'}.yml" with the path "${key}",\n`
      + `- the JSON file "config/default.json" with the path "${key}", or\n`
      + `- the YAML file "config/default.yml" with the path "${key}".`
    );
  }
}
