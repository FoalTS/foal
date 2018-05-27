import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

import * as merge from 'lodash.merge';

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
      // Note: require has a cache. So once a config file is loaded, it is kept in cache.
      return require(path.join(process.cwd(), `config/${filename}.js`));
    }
  }

}
