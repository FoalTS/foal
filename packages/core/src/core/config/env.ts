import { existsSync, readFileSync } from 'fs';

export class Env {
  /**
   * Clear the cache of the loaded file .env (if it exists).
   *
   * @static
   * @memberof Config
   */
  static clearCache() {
    this.dotEnv = null;
  }

  static get(key: string): string|undefined {
    if (this.dotEnv === null) {
      this.dotEnv = {};

      if (existsSync('.env')) {
        const envFileContent = readFileSync('.env', 'utf8');
        for (const line of envFileContent.split('\n')) {
          if (line.startsWith('#')) {
            continue;
          }

          const [ key, ...values ] = line.split('=');
          const value = values.join('=').trim();

          if (
            (value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith('\'') && value.endsWith('\''))
          ) {
            this.dotEnv[key] = value.substr(1, value.length - 2);
            continue;
          }

          this.dotEnv[key] = value;
        }
      }
    }

    if (this.dotEnv[key] !== undefined) {
      return this.dotEnv[key];
    }

    return process.env[key];
  }

  private static dotEnv: { [key: string]: any }|null = null;
}
