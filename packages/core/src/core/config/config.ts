// 3p
import { existsSync, readFileSync } from 'fs';

// FoalTS
import { dotToUnderscore } from './utils';

/**
 * Static class to access environment variables and configuration files.
 *
 * This class can also be used as a service.
 *
 * @export
 * @class Config
 */
export class Config {

  /**
   * Access environment variables and configuration files.
   *
   * For example, if it is called with the string `settings.session.secret`,
   * the method will go through these steps:
   *
   * 1. If the environment variable `SETTINGS_SESSION_SECRET` exists, then return its value.
   * 2. If `.env` exists and has a line `SETTINGS_SESSION_SECRET=`, then return its value.
   * 3. If `config/${NODE_ENV}.json` exists and the property `config['settings']['session']['secret']`
   * does too, then return its value.
   * 4. Same with `config/${NODE_ENV}.yml`.
   * 5. If `config/default.json` exists and the property `config['settings']['session']['secret']`
   * does too, then return its value.
   * 6. Same with `config/default.yml`.
   *
   * If none value is found, then the method returns the default value provided as second argument
   * to the function. If none was given, it returns undefined.
   *
   * @static
   * @template T - TypeScript type of the returned value. Default is `any`.
   * @param {string} key - Name of the config key using dots and camel case.
   * @param {T} [defaultValue] - Default value to return if no configuration is found with that key.
   * @returns {T} The configuration value.
   * @memberof Config
   */
  static get<T = any>(key: string, defaultValue?: T): T {
    let value = this.readConfigValue(key);
    if (typeof value === 'string') {
      value = this.convertType(value);
    }
    if (value !== undefined) {
      return value;
    }
    return defaultValue as T;
  }

  /**
   * Clear the cache of the loaded files.
   *
   * @static
   * @memberof Config
   */
  static clearCache() {
    this.cache = {
      dotEnv: undefined,
      json: {},
      yaml: {},
    };
  }

  private static yaml: any;
  private static cache: { dotEnv: any, json: any, yaml: any } = {
    dotEnv: undefined,
    json: {},
    yaml: {},
  };

  private static readConfigValue(key: string): any {
    const underscoreName = dotToUnderscore(key);

    const envValue = process.env[underscoreName];
    if (envValue !== undefined) {
      return envValue;
    }

    const dotEnvValue = this.readDotEnvValue(underscoreName);
    if (dotEnvValue !== undefined) {
      return dotEnvValue;
    }

    const envJSONFilePath = `config/${process.env.NODE_ENV || 'development'}.json`;
    const envJSONValue = this.readJSONValue(envJSONFilePath, key);
    if (envJSONValue !== undefined) {
      return envJSONValue;
    }

    const envYamlFilePath = `config/${process.env.NODE_ENV || 'development'}.yml`;
    const envYAMLValue = this.readYAMLValue(envYamlFilePath, key);
    if (envYAMLValue !== undefined) {
      return envYAMLValue;
    }

    const defaultJSONValue = this.readJSONValue('config/default.json', key);
    if (defaultJSONValue !== undefined) {
      return defaultJSONValue;
    }

    const defaultYAMLValue = this.readYAMLValue('config/default.yml', key);
    if (defaultYAMLValue !== undefined) {
      return defaultYAMLValue;
    }
  }

  private static readDotEnvValue(name: string): string | undefined {
    if (!this.cache.dotEnv) {
      if (!existsSync('.env')) {
        return;
      }

      const envFileContent = readFileSync('.env', 'utf8');
      this.cache.dotEnv = {};
      envFileContent.replace(/\r\n/g, '\n').split('\n').forEach(line => {
        const [ key, ...values ] = line.split('=');
        const value = values.join('=');
        this.cache.dotEnv[key] = value;
      });
    }

    if (this.cache.dotEnv[name] !== undefined) {
      return this.cache.dotEnv[name];
    }
  }

  private static readJSONValue(path: string, key: string): any {
    if (!this.cache.json[path]) {
      if (!existsSync(path)) {
        return;
      }

      const fileContent = readFileSync(path, 'utf8');
      this.cache.json[path] = JSON.parse(fileContent);
    }

    return this.getValue(this.cache.json[path], key);
  }

  private static readYAMLValue(path: string, key: string): any {
    if (!this.cache.yaml[path]) {
      if (!existsSync(path)) {
        return;
      }

      const yaml = this.getYAMLInstance();
      if (!yaml) {
        console.log(`Impossible to read ${path}. The package "yamljs" is not installed.`);
        return;
      }

      const fileContent = readFileSync(path, 'utf8');
      this.cache.yaml[path] = yaml.parse(fileContent);
    }

    return this.getValue(this.cache.yaml[path], key);
  }

  private static getYAMLInstance(): false | any {
    if (this.yaml === false) {
      return false;
    }
    try {
      this.yaml = require('yamljs');
    } catch (err) {
      if (err.code !== 'MODULE_NOT_FOUND') {
        throw err;
      }
      this.yaml = false;
    }
    return this.yaml;
  }

  private static convertType(value: string): boolean | number | string {
    if (value === 'true') {
      return true;
    }
    if (value === 'false') {
      return false;
    }
    if (value.replace(/ /g, '') === '') {
      return value;
    }
    const n = Number(value);
    if (!isNaN(n)) {
      return n;
    }
    return value;
  }

  private static getValue(config: any, propertyPath: string): any {
    const properties = propertyPath.split('.');
    let result = config;
    for (const property of properties) {
      result = result[property];
      if (result === undefined) {
        break;
      }
    }
    return result;
  }

  /**
   * Access environment variables and configuration files.
   *
   * For example, if it is called with the string `settings.session.secret`,
   * the method will go through these steps:
   *
   * 1. If the environment variable `SETTINGS_SESSION_SECRET` exists, then return its value.
   * 2. If `.env` exists and has a line `SETTINGS_SESSION_SECRET=`, then return its value.
   * 3. If `config/${NODE_ENV}.json` exists and the property `config['settings']['session']['secret']`
   * does too, then return its value.
   * 4. Same with `config/${NODE_ENV}.yml`.
   * 5. If `config/default.json` exists and the property `config['settings']['session']['secret']`
   * does too, then return its value.
   * 6. Same with `config/default.yml`.
   *
   * If none value is found, then the method returns the default value provided as second argument
   * to the function. If none was given, it returns undefined.
   *
   * @template T - TypeScript type of the returned value. Default is `any`.
   * @param {string} key - Name of the config key using dots and camel case.
   * @param {T} [defaultValue] - Default value to return if no configuration is found with that key.
   * @returns {T} The configuration value.
   * @memberof Config
   */
  get<T = any>(key: string, defaultValue?: T): T {
    return Config.get<T>(key, defaultValue);
  }

}
