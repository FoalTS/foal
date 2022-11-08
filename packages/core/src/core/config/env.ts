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

  static getEnvironmentName(): string {
    return process.env.FOAL_ENV || process.env.NODE_ENV || 'development';
  }

  static get(key: string): string|undefined {
    if (process.env[key] !== undefined) {
      return process.env[key];
    }

    if (this.dotEnv === null) {
      this.dotEnv = {};
      this.loadEnv('.env');
      this.loadEnv('.env.local');
      this.loadEnv(`.env.${this.getEnvironmentName()}`);
      this.loadEnv(`.env.${this.getEnvironmentName()}.local`);
    }

    return this.dotEnv[key];
  }

  private static dotEnv: { [key: string]: any }|null = null;

  private static loadEnv(filename: string): void {
    if (!existsSync(filename)) {
      return;
    }

    if (this.dotEnv === null) {
      this.dotEnv = {};
    }

    const envFileContent = readFileSync(filename, 'utf8');

    for (const line of envFileContent.split('\n')) {
      if (line.startsWith('#')) {
        continue;
      }

      const [ key, ...values ] = line.split('=');
      const value = values.join('=').trim();
      const trimmedKey = key.trim();

      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith('\'') && value.endsWith('\''))
      ) {
        this.dotEnv[trimmedKey] = value.substr(1, value.length - 2);
        continue;
      }

      this.dotEnv[trimmedKey] = value;
    }
  }
}
