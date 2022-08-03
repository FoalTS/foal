// std
import { existsSync } from 'fs';
import { join } from 'path';

// 3p
import Ajv from 'ajv';

// FoalTS
import { getCommandLineArguments } from './get-command-line-arguments.util';

export async function runScript({ name }: { name: string }, argv: string[], log = console.log) {
  if (!existsSync(`build/scripts/${name}.js`)) {
    if (existsSync(`src/scripts/${name}.ts`)) {
      log(
        `The script "${name}" does not exist in build/scripts/. But it exists in src/scripts/.`
          + ' Please build your script by running the command "npm run build" or using "npm run develop".'
      );
    } else {
      log(`The script "${name}" does not exist. You can create it by running the command "foal g script ${name}".`);
    }
    return;
  }

  const { main, schema } = require(join(process.cwd(), `./build/scripts/${name}`));

  if (!main) {
    log(`Error: No "main" function was found in build/scripts/${name}.js.`);
    return;
  }

  const args = getCommandLineArguments(argv);

  if (schema) {
    const ajv = new Ajv({ useDefaults: true });
    if (!ajv.validate(schema, args)) {
      ajv.errors!.forEach(err => {
        log(`Error: The command line arguments ${err.message}.`);
      });
      return;
    }
  }

  try {
    await main(args);
  } catch (error: any) {
    log(error);
  }
}
