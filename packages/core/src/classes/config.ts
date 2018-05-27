import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

import * as Ajv from 'ajv';
import * as merge from 'lodash.merge';

const ajv = new Ajv();

export class Config<Config> {

  private pConfig: Config;

  constructor(private configName: string) {}

  get config(): Config {
    if (!this.pConfig) {
      this.pConfig = this.load();
    }
    return this.pConfig;
  }

  private load(): Config {
    const env = process.env.NODE_ENV || 'production';
    return merge(
      this.loadFile(this.configName),
      this.loadFile(`${this.configName}.${env}`),
    );
  }

  private loadFile(filename: string): Config|undefined {
    if (fs.existsSync(`./config/${filename}.js`)) {
      return require(path.join(process.cwd(), `config/${filename}.js`));
    }
  }

}
