// std
import { existsSync, readFileSync } from 'fs';

// 3p
import * as Ajv from 'ajv';
import { join } from 'path';
import { findProjectPath } from '../generate/utils';

const ajv = new Ajv();

export interface Config {
  builds: {
    name: string;
    tsconfigPath: string;
    filesToCopy: string[];
  }[];
}

const configSchema = {
  additionalProperties: false,
  properties: {
    builds: {
      items: {
        properties: {
          filesToCopy: { type: 'array', items: { type: 'string' } },
          name: { type: 'string' },
          tsconfigPath: { type: 'string' }
        },
        required: [ 'filesToCopy', 'name', 'tsconfigPath' ],
        type: 'object',
      },
      type: 'array',
    }
  },
  required: [ 'builds' ],
  type: 'object',
};

const defaultConfig: Config = {
  builds: [
    {
      filesToCopy: [ 'src/**/*.html' ],
      name: 'app',
      tsconfigPath: 'tsconfig.app.json'
    }
  ]
};

export function readConfig(): Config {
  const projectPath = findProjectPath() || '';

  const yamlConfigPath = join(findProjectPath() || '', 'foal.yml');
  const jsonConfigPath = join(findProjectPath() || '', 'foal.json');

  let config: Config;
  if (existsSync(yamlConfigPath)) {
    const YAML = require('yamljs');
    const configString = readFileSync(yamlConfigPath, 'utf8');
    try {
      config = YAML.parse(configString);
    } catch (error) {
      throw new SyntaxError('foal.yml file does not contain a valid YAML:\n -> ' + error.message + '.');
    }

  } else if (existsSync(jsonConfigPath)) {
    const configString = readFileSync(jsonConfigPath, 'utf8');
    try {
      config = JSON.parse(configString);
    } catch (error) {
      throw new SyntaxError('foal.json file does not contain a valid JSON:\n -> ' + error.message + '.');
    }
  } else {
    return defaultConfig;
  }

  ajv.validate(configSchema, config);
  if (ajv.errors) {
    throw new Error('Error in foal.json (or foal.yml):\n' + JSON.stringify(ajv.errors, null, 2));
  }

  if (!config.builds.find(build => build.name === 'app')) {
    throw new Error(
      'Error in foal.json (or foal.yml): the "builds" array should have at least one item with the name "app".'
    );
  }

  return config;
}
