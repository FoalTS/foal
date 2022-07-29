// 3p
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

// FoalTS
import { ConfigNotFoundError } from './config-not-found.error';
import { ConfigTypeError } from './config-type.error';
import { Env } from './env';

type ValueStringType = 'string'|'number'|'boolean'|'boolean|string'|'number|string'|'any';

type ValueType<T extends ValueStringType> =
  T extends 'string' ? string :
  T extends 'number' ? number :
  T extends 'boolean' ? boolean :
  T extends 'boolean|string' ? boolean|string :
  T extends 'number|string' ? number|string :
  any;

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
   * Read the configuration value associated with the given key. Optionaly check its type.
   *
   * @static
   * @template T
   * @param {string} key - The configuration key.
   * @param {T} [type] - The expected type of the returned value.
   * @param {ValueType<T>} [defaultValue] - A default value if none is found.
   * @returns {ValueType<T>|undefined} The configuration value
   * @memberof Config
   */
  static get<T extends ValueStringType>(key: string, type: T, defaultValue: ValueType<T>): ValueType<T>;
  static get<T extends ValueStringType>(key: string, type?: T): ValueType<T>|undefined;
  static get<T extends ValueStringType>(key: string, type?: T, defaultValue?: ValueType<T>): ValueType<T>|undefined {
    const value = this.readConfigValue(key);

    if (value === undefined) {
      return defaultValue;
    }

    if (type === 'string' && typeof value !== 'string') {
      throw new ConfigTypeError(key, 'string', typeof value);
    }

    if (type === 'boolean' && typeof value !== 'boolean') {
      if (value === 'true') {
        return true as any;
      }
      if (value === 'false') {
        return false as any;
      }
      throw new ConfigTypeError(key, 'boolean', typeof value);
    }

    if (type === 'number' && typeof value !== 'number') {
      if (typeof value === 'string' && value.replace(/ /g, '') !== '') {
        const n = Number(value);
        if (!isNaN(n)) {
          return n as any;
        }
      }
      throw new ConfigTypeError(key, 'number', typeof value);
    }

    if (type === 'boolean|string' && typeof value !== 'boolean') {
      if (value === 'true') {
        return true as any;
      }
      if (value === 'false') {
        return false as any;
      }
      if (typeof value !== 'string') {
        throw new ConfigTypeError(key, 'boolean|string', typeof value);
      }
    }

    if (type === 'number|string' && typeof value !== 'number') {
      if (typeof value !== 'string') {
        throw new ConfigTypeError(key, 'number|string', typeof value);
      }
      if (value.replace(/ /g, '') !== '') {
        const n = Number(value);
        if (!isNaN(n)) {
          return n as any;
        }
      }
    }

    return value;
  }

  /**
   * Read the configuration value associated with the given key. Optionaly check its type.
   *
   * Throw an ConfigNotFoundError if no value is found.
   *
   * @static
   * @template T
   * @param {string} key - The configuration key.
   * @param {T} [type] - The expected type of the returned value.
   * @param {string} [msg] - The message of the ConfigNotFoundError if no value is found.
   * @returns {ValueType<T>} The configuration value.
   * @memberof Config
   */
  static getOrThrow<T extends ValueStringType>(key: string, type?: T, msg?: string): ValueType<T> {
    const value = this.get(key, type);
    if (value === undefined) {
      throw new ConfigNotFoundError(key, msg);
    }
    return value;
  }

  /**
   * Clear the cache of the loaded files.
   *
   * @static
   * @memberof Config
   */
  static clearCache() {
    this.config = null;
    this.testConfig.clear();
  }

  static set(key: string, value: string|number|boolean): void {
    this.testConfig.set(key, value);
  }

  static remove(key: string): void {
    this.testConfig.delete(key);
  }

  private static yaml: any;
  private static config: { [key: string ]: any } | null = null;
  private static testConfig: Map<string, string|number|boolean> = new Map();

  private static readJSON(path: string): { [key: string ]: any } {
    if (!existsSync(path)) {
      return {};
    }

    const fileContent = readFileSync(path, 'utf8');
    return JSON.parse(fileContent);
  }

  private static readYAML(path: string): { [key: string ]: any } {
    if (!existsSync(path)) {
      return {};
    }

    const yaml = this.getYAMLInstance();
    if (!yaml) {
      console.log(`Impossible to read ${path}. The package "yamljs" is not installed.`);
      return {};
    }

    const fileContent = readFileSync(path, 'utf8');
    return yaml.parse(fileContent);
  }

  private static readJS(path: string): { [key: string ]: any } {
    if (!existsSync(path)) {
      return {};
    }

    return require(join(process.cwd(), path));
  }

  private static readConfigValue(key: string): any {
    if (this.testConfig.has(key)) {
      return this.testConfig.get(key);
    }

    if (this.config === null) {
      this.config = [
        this.readJS('config/default.js'),
        this.readYAML('config/default.yml'),
        this.readJSON('config/default.json'),
        this.readJS(`config/${Env.getEnvironmentName()}.js`),
        this.readYAML(`config/${Env.getEnvironmentName()}.yml`),
        this.readJSON(`config/${Env.getEnvironmentName()}.json`),
      ].reduce((config1, config2) => this.mergeDeep(config1, config2));
    }

    const properties = key.split('.');
    let result: any = this.config;
    for (const property of properties) {
      result = result[property];
      if (result === undefined) {
        break;
      }
    }

    if (typeof result === 'string' && result.startsWith('env(') && result.endsWith(')')) {
      const envVarName = result.substr(4, result.length - 5);
      return Env.get(envVarName);
    }

    return result;
  }

  private static mergeDeep(target: { [key: string]: any }, source: { [key: string]: any } ): { [key: string]: any } {
    // TODO: improve the tests of this function.
    function isObject(o: any): o is { [key: string]: any } {
      return typeof o === 'object' && o !== null;
    }

    for (const key in source) {
      if (isObject(target[key]) && isObject(source[key])) {
        this.mergeDeep(target[key], source[key]);
      } else if (source[key] !== undefined) {
        target[key] = source[key];
      }
    }

    return target;
  }

  private static getYAMLInstance(): false | any {
    // TODO: test this method (hard).
    if (this.yaml === false) {
      return false;
    }

    try {
      this.yaml = require('yamljs');
    } catch (err: any) {
      if (err.code !== 'MODULE_NOT_FOUND') {
        throw err;
      }
      this.yaml = false;
    }
    return this.yaml;
  }

}
