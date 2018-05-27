import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

import * as Ajv from 'ajv';

const ajv = new Ajv();

export class ConfigReader<Config> {

  constructor(private configName: string, private schema) {}

  get environment(): string {
    return process.env.NODE_ENV || 'production';
  }

  loadFile(filename: string): any {
    if (fs.existsSync(`./config/${filename}.json`)) {
      const config = require(path.join(process.cwd(), `config/${filename}.json`));
      if (!ajv.validate(this.schema, config)) {
        throw new Error(`Error while parsing ./config/${filename}.json:\n ${JSON.stringify(ajv.errors)}`);
      }
      return config;
    }
    return {};
  }

  load(): any {
    const config: any = {};
    Object.assign(
      config,
      this.loadFile(this.configName),
      this.loadFile(`${this.configName}.${this.environment}`),
    );
    return config;
  }

  get<T>(name: string, defaultValue?: T): T {
    return this.load()[name] || defaultValue;
  }

}
