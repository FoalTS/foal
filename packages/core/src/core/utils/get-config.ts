import * as fs from 'fs';
import * as path from 'path';

import * as merge from 'lodash.merge';

function loadFile(filename: string): any {
  if (fs.existsSync(`./config/${filename}.js`)) {
    // Note: require has a cache. So once a config file is loaded, it is kept in cache.
    return require(path.join(process.cwd(), `config/${filename}.js`));
  }
}

export function getConfig(configName: string): any {
  const env = process.env.NODE_ENV || 'production';
  return merge(
    {},
    loadFile(this.configName),
    loadFile(`${this.configName}.${env}`),
  );
}
