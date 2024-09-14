// std
import { existsSync } from 'fs';
import { randomUUID } from 'crypto';

// 3p
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import type { Logger, ServiceManager } from '@foal/core';

// FoalTS
import { getCommandLineArguments } from './get-command-line-arguments.util';

// TODO: test this function
export async function runScript({ name }: { name: string }, argv: string[]) {
  try {
    const { Logger, ServiceManager } = require(require.resolve('@foal/core', {
      paths: [ process.cwd() ],
    })) as typeof import('@foal/core');

    const services = new ServiceManager();
    const logger = services.get(Logger);

    logger.initLogContext(() => execScript({ name }, argv, services, logger).catch(error => console.error(error)))
  } catch (error: any) {
    if (error.code === 'MODULE_NOT_FOUND') {
      console.error('@foal/core module not found. Are you sure you are in a FoalTS project?');
      return;
    }

    throw error;
  }
}

export async function execScript({ name }: { name: string }, argv: string[], services: ServiceManager, logger: Logger) {
  logger.addLogContext({
    scriptId: randomUUID(),
    scriptName: name
  });

  if (!existsSync(`build/scripts/${name}.js`)) {
    if (existsSync(`src/scripts/${name}.ts`)) {
      logger.error(`Script "${name}" not found in build/scripts/ but found in src/scripts/. Did you forget to build it?`);
    } else {
      logger.error(`Script "${name}" not found.`);
    }
    return;
  }

  const { main, schema } = require(require.resolve(`./build/scripts/${name}`, {
    paths: [ process.cwd() ],
  }));

  if (!main) {
    logger.error(`No "main" function found in script "${name}".`);
    return;
  }

  const args = getCommandLineArguments(argv);

  if (schema) {
    const ajv = new Ajv({ useDefaults: true, allErrors: true });
    addFormats(ajv);
    if (!ajv.validate(schema, args)) {
      ajv.errors!.forEach(err => {
        if (err.instancePath) {
          logger.error(`Script argument "${err.instancePath.split('/')[1]}" ${err.message}.`);
        } else {
          logger.error(`Script arguments ${err.message}.`);
        }
      });
      return;
    }
  }

  try {
    await main(args, services, logger);
    logger.info(`Script "${name}" completed.`);
  } catch (error: any) {
    logger.error(error.message, { error });
    logger.error(`Script "${name}" failed.`);
  }
}
