// 3p
import { existsSync, readFileSync } from 'fs';

export class Config {

  static get<T = any>(key: string, defaultValue?: T): T {
    const underscoreName = this.dotToUnderscore(key);

    const envValue = process.env[underscoreName];
    if (envValue !== undefined) {
      return this.convertType(envValue) as any;
    }

    const dotEnvValue = this.readDotEnvValue(underscoreName);
    if (dotEnvValue !== undefined) {
      return dotEnvValue as any;
    }

    const defaultJSONValue = this.readJSONValue('config/default.json', key);
    if (defaultJSONValue !== undefined) {
      return defaultJSONValue;
    }

    const defaultYAMLValue = this.readYAMLValue('config/default.yml', key);
    if (defaultYAMLValue !== undefined) {
      return defaultYAMLValue;
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

    return defaultValue as T;
  }

  private static yaml;

  private static readDotEnvValue(name: string): string | boolean | number | undefined {
    if (!existsSync('.env')) {
      return;
    }

    const envFileContent = readFileSync('.env', 'utf8');
    const config = {};
    envFileContent.replace(/\r\n/g, '\n').split('\n').forEach(line => {
      const [ key, value ] = line.split('=');
      config[key] = value;
    });

    if (config[name] !== undefined) {
      return this.convertType(config[name]);
    }
  }

  private static readJSONValue(path: string, key: string): any {
    if (!existsSync(path)) {
      return;
    }

    const fileContent = readFileSync(path, 'utf8');
    const config = JSON.parse(fileContent);
    return this.getValue(config, key);
  }

  private static readYAMLValue(path: string, key: string): any {
    if (!existsSync(path)) {
      return;
    }

    const yaml = this.getYAMLInstance();
    if (!yaml) {
      console.log(`Impossible to read ${path}. The package "yamljs" is not installed.`);
      return;
    }

    const fileContent = readFileSync(path, 'utf8');
    const config = yaml.parse(fileContent);
    return this.getValue(config, key);
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

  private static dotToUnderscore(str: string): string {
    return str
      .replace(/([A-Z])/g, letter => `_${letter}`)
      .replace(/\./g, '_')
      .toUpperCase();
  }

  private static convertType(value: string): boolean | number | string {
    if (value === 'true') {
      return true;
    }
    if (value === 'false') {
      return false;
    }
    const n = parseInt(value, 10);
    if (!isNaN(n)) {
      return n;
    }
    return value;
  }

  private static getValue(config: object, propertyPath: string): any {
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

  get<T = any>(key: string, defaultValue?: T): T {
    return Config.get<T>(key, defaultValue);
  }

}
