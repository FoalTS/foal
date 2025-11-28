import { spawn } from 'child_process';

// This file is inspired by the Angular CLI (MIT License: https://angular.io/license).
// See https://github.com/angular/angular-cli/blob/master/packages/angular_devkit/schematics/tasks/repo-init/executor.ts

export async function initGitRepo(root: string) {

  function execute(args: string[]) {
    return new Promise<void>((resolve, reject) => {
      spawn('git', args, { cwd: root, shell: true })
        .on('close', (code: number) => code === 0 ? resolve() : reject(code));
    });
  }

  const hasCommand = await execute(['--version']).then(() => true, () => false);
  if (!hasCommand) {
    console.log('    Git not installed. Skipping initialization of git.');
    return;
  }

  const insideRepo = await execute(['rev-parse', '--is-inside-work-tree'])
    .then(() => true, () => false);
  if (insideRepo) {
    console.log('     Directory is already under version control. Skipping initialization of git.');
    return;
  }

  try {
    await execute(['init']);
    await execute(['add', '.']);
    await execute(['commit', '-m "Initial commit"']);
  } catch {
    console.log('    Initialization of git failed.');
  }

}
