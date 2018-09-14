// std
import { existsSync } from 'fs';
import { join } from 'path';

// 3p
import * as Ajv from 'ajv';

// FoalTS
import { getCommandLineArguments } from './get-command-line-arguments.util';

export function runScript({ name }: { name: string }, argv: string[], log = console.log) {
  if (!existsSync(`lib/scripts/${name}.js`)) {
    if (existsSync(`src/scripts/${name}.ts`)) {
      log(
        `The script "${name}" does not exist in lib/scripts/. But it exists in src/scripts/.`
          + ' Please build your script by running the command "npm run build:scripts".'
      );
    } else {
      log(`The script "${name}" does not exist. You can create it by running the command "foal g script ${name}".`);
    }
    return;
  }

  const { main, schema } = require(join(process.cwd(), `./lib/scripts/${name}`));

  if (!main) {
    log(`Error: No "main" function was found in lib/scripts/${name}.js.`);
    return;
  }

  const args = getCommandLineArguments(argv);

  if (schema) {
    const ajv = new Ajv();
    if (!ajv.validate(schema, args)) {
      (ajv.errors as Ajv.ErrorObject[]).forEach(err => {
        log(`Error: The command line arguments ${err.message}.`);
      });
      return;
    }
  }

  main(args);
}
