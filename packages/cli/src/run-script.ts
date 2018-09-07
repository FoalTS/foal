// std
import { existsSync } from 'fs';
import { join } from 'path';

export function runScript({ name }: { name: string }, log = console.log) {
  if (!existsSync(`lib/scripts/${name}.js`)) {
    if (existsSync(`src/scripts/${name}.ts`)) {
      log(
        `The script "${name}" does not exist in lib/scripts/. But it exists in src/scripts/.`
          + ' Please build your script by running the command "npm run build".'
      );
    } else {
      log(`The script "${name}" does not exist. You can create it by running the command "foal g script ${name}".`);
    }
    return;
  }

  const { main } = require(join(process.cwd(), `./lib/scripts/${name}`));

  if (!main) {
    log(`Error: No "main" function was found in lib/scripts/${name}.js.`);
    return;
  }

  main(process.argv);
}
