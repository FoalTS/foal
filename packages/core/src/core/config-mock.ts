import { Config } from './config';

/**
 * Mock the Config class when it is used as a service.
 *
 * @export
 * @class ConfigMock
 * @implements {Config}
 */
export class ConfigMock implements Config {

  private map: Map<string, any> = new Map();

  /**
   * Set an configuration variable.
   *
   * @param {string} key - Name of the config key using dots and camel case.
   * @param {*} value - The config value (ex: 36000).
   * @memberof ConfigMock
   */
  set(key: string, value: any) {
    this.map.set(key, value);
  }

  /**
   * Return the config value previously given with ConfigMock.set.
   *
   * @template T - TypeScript type of the returned value. Default is `any`.
   * @param {string} key - Name of the config key using dots and camel case.
   * @param {T} [defaultValue] - Default value to return if no configuration is found with that key.
   * @returns {T} The configuration value.
   * @memberof ConfigMock
   */
  get<T = any>(key: string, defaultValue?: T | undefined): T {
    return this.map.get(key) || defaultValue;
  }

  /**
   * Clear every config value previously given with Config.set.
   *
   * @memberof ConfigMock
   */
  reset(): void {
    this.map.clear();
  }

}
