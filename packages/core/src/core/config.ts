import * as fs from 'fs';
import * as path from 'path';

export class Config {

  static root = path.join(process.cwd(), 'config');

  static get(configName: string, propName: string,
             defaultValue?: number | string | boolean): number | string | boolean | undefined {
    const value = Config.getEnvironmentVariable(configName, propName);
    if (value !== undefined) {
      return value;
    }
    const environment = process.env.NODE_ENV || 'development';
    const value2 = Config.getJsonVariable(configName, propName, environment);
    if (value2 !== undefined) {
      return value2;
    }
    const value3 = Config.getJsonVariable(configName, propName);
    if (value3 !== undefined) {
      return value3;
    }
    return defaultValue;
  }

  private static getEnvironmentVariable(configName: string, propName: string): string | number | boolean | undefined {
    const name = `${Config.toUnderscoreUpperCase(configName)}_${Config.toUnderscoreUpperCase(propName)}`;
    const config = process.env[name];
    if (config === undefined) {
      return undefined;
    }
    if (config === 'true') {
      return true;
    }
    if (config === 'false') {
      return false;
    }
    const num = parseInt(config, 10);
    if (!isNaN(num)) {
      return num;
    }
    return config;
  }

  private static getJsonVariable(configName: string, propName: string, env?: string):
      string | number | boolean | undefined {
    const filename = env ? `${configName}.${env}.json` : `${configName}.json`;
    const filePath = path.join(Config.root, filename);

    if (!fs.existsSync(filePath)) {
      return;
    }
    const config = require(filePath);

    const propType = typeof config[propName];
    if (!['string', 'number', 'boolean', 'undefined'].includes(propType)) {
      throw new Error(
        'Config: only string, number and boolean values are supported.'
        + ` ${propName} type is "${propType}" in ${filename}.`
      );
    }

    return config[propName];
  }

  private static toUnderscoreUpperCase(camelCase: string): string {
    let result = camelCase.replace(/([A-Z])/g, letter => `_${letter}`);
    if (result.startsWith('_')) {
      result = result.substring(1);
    }
    return result.toUpperCase();
  }
}
