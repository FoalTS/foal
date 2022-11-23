// std
import { execSync, spawn, SpawnOptions } from 'child_process';
import { red } from 'colors/safe';

// FoalTS
import { logger } from './logger';

function isYarnInstalled() {
  try {
    execSync('yarn --version', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

export async function installDependencies(cwd: string = ''): Promise<void> {
  const packageManager = isYarnInstalled() ? 'yarn' : 'npm';

  logger.log();
  const spinner = logger.log(`%s 📦 Installing dependencies (${packageManager})...`, true);

  const args = [ 'install' /*, '--ignore-engines'*/ ];
  const options: SpawnOptions = {
    cwd,
    shell: true,
    stdio: 'ignore',
  };

  const success = await new Promise(resolve => {
    spawn(packageManager, args, options)
      .on('close', (code: number) => resolve(code === 0));
  });

  if (spinner) {
    spinner.stop(true);
  }

  if (!success) {
    logger.log(`  ❗ Installing dependencies (${packageManager})...`);
    logger.log();
    logger.log(red('  Error: ') + 'A problem occurred during the installation of');
    logger.log('the dependencies. Try installing them manually by running');
    logger.log('the following commands:');
    logger.log();
    if (cwd) {
      logger.logCommand(`cd ${cwd}`);
    }
    logger.logCommand(`${packageManager} install`);
    logger.log();
    return;
  } else {
    logger.log(`  📦 Installing dependencies (${packageManager})...`);
  }
}