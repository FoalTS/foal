import { findProjectPath } from '../generate/utils';
import { createWatch } from './create-watcher';
import { readConfig } from './read-config';
import { startProcess } from './start-process';

export function develop(name: string) {
  const projectPath = findProjectPath();

  if (!projectPath) {
    console.error('Error: You\'re not running this command in a Foal project.');
    return;
  }

  const typescriptLocalPath = require.resolve('typescript', { paths: [ projectPath ] });
  // tslint:disable-next-line:no-var-requires
  const ts = require(typescriptLocalPath);

  const config = readConfig();

  const build = config.builds.find(build => build.name === name);
  if (!build) {
    console.error(`Error: No build item was found in foal.json or foal.yml with the name "${name}".`);
    return;
  }

  const configPath = ts.findConfigFile(
    findProjectPath(),
    ts.sys.fileExists,
    build.tsconfigPath
  );

  if (!configPath) {
    console.error(`Error: Could not find a valid ${build.tsconfigPath}.`);
    return;
  }

  let nodeProcess;

  createWatch(
    projectPath,
    configPath,
    () => {
      if (nodeProcess) { nodeProcess.kill(); }
    },
    diagnostics => {
      if (diagnostics.find(({ category }) => category === 1)) {
        console.log('Impossible to start the server: the TypeScript compilation failed.');
      } else {
        console.log(`${nodeProcess ? 'Res' : 'S'}tarting the server...\n`);
        nodeProcess = startProcess(projectPath);
      }
    }
  );
}
