// std
import { execSync, spawn, SpawnOptions } from 'child_process';

// 3p
import { cyan, red } from 'colors/safe';

// FoalTS
import { FileSystem } from '../../file-system';
import {
  getNames,
  initGitRepo,
} from '../../utils';

function isYarnInstalled() {
  try {
    execSync('yarn --version', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function log(msg: string) {
  if (process.env.P1Z7kEbSUUPMxF8GqPwD8Gx_FOAL_CLI_TEST !== 'true') {
    console.log(msg);
  }
}

export async function createApp({ name, autoInstall, initRepo, mongodb = false, yaml = false }:
  { name: string, autoInstall?: boolean, initRepo?: boolean, mongodb?: boolean,
    yaml?: boolean }) {
  const names = getNames(name);

  if (process.env.P1Z7kEbSUUPMxF8GqPwD8Gx_FOAL_CLI_TEST !== 'true') {
    console.log(cyan(
`====================================================================

     _______   ________   ____        ___     _________   _______
    /  ____/  / ____  /  / _  |      /  /    /___  ___/  / _____/
   /  /___   / /   / /  / /_| |     /  /        / /     / /____
  /  ____/  / /   / /  / ___  |    /  /        / /     /____  /
 /  /      / /__ / /  / /   | |   /  /____    / /     _____/ /
/__/      /_______/  /_/    |_|  /_______/   /_/     /______/


====================================================================
`
    ));
  }

  const locals = names;

  const fs = new FileSystem();

  if (fs.exists(names.kebabName)) {
    if (process.env.P1Z7kEbSUUPMxF8GqPwD8Gx_FOAL_CLI_TEST !== 'true') {
      console.log(
        red(`\n The target directory "${names.kebabName}" already exists. Please remove it before proceeding.`)
      );
    }
    return;
  }

  fs
    .ensureDir(names.kebabName)
    .cd(names.kebabName);

  log('  📂 Creating files...');

  fs
    .hideLogs()
    .copy('app/gitignore', '.gitignore')
    .copyOnlyIf(!mongodb, 'app/ormconfig.js', 'ormconfig.js')
    .renderOnlyIf(!mongodb && !yaml, 'app/package.json', 'package.json', locals)
    .renderOnlyIf(!mongodb && yaml, 'app/package.yaml.json', 'package.json', locals)
    .renderOnlyIf(mongodb && !yaml, 'app/package.mongodb.json', 'package.json', locals)
    .renderOnlyIf(mongodb && yaml, 'app/package.mongodb.yaml.json', 'package.json', locals)
    .copy('app/tsconfig.app.json', 'tsconfig.app.json')
    .copy('app/tsconfig.e2e.json', 'tsconfig.e2e.json')
    .copy('app/tsconfig.json', 'tsconfig.json')
    .copy('app/tsconfig.test.json', 'tsconfig.test.json')
    .copy('app/.eslintrc.js', '.eslintrc.js')
      // Config
      .ensureDir('config')
      .cd('config')
      .renderOnlyIf(!mongodb && !yaml, 'app/config/default.json', 'default.json', locals)
      .renderOnlyIf(!mongodb && yaml, 'app/config/default.yml', 'default.yml', locals)
      .renderOnlyIf(mongodb && !yaml, 'app/config/default.mongodb.json', 'default.json', locals)
      .renderOnlyIf(mongodb && yaml, 'app/config/default.mongodb.yml', 'default.yml', locals)
      .renderOnlyIf(!yaml, 'app/config/development.json', 'development.json', locals)
      .renderOnlyIf(yaml, 'app/config/development.yml', 'development.yml', locals)
      .renderOnlyIf(!mongodb && !yaml, 'app/config/e2e.json', 'e2e.json', locals)
      .renderOnlyIf(!mongodb && yaml, 'app/config/e2e.yml', 'e2e.yml', locals)
      .renderOnlyIf(mongodb && !yaml, 'app/config/e2e.mongodb.json', 'e2e.json', locals)
      .renderOnlyIf(mongodb && yaml, 'app/config/e2e.mongodb.yml', 'e2e.yml', locals)
      .renderOnlyIf(!yaml, 'app/config/production.json', 'production.json', locals)
      .renderOnlyIf(yaml, 'app/config/production.yml', 'production.yml', locals)
      .renderOnlyIf(!mongodb && !yaml, 'app/config/test.json', 'test.json', locals)
      .renderOnlyIf(!mongodb && yaml, 'app/config/test.yml', 'test.yml', locals)
      .renderOnlyIf(mongodb && !yaml, 'app/config/test.mongodb.json', 'test.json', locals)
      .renderOnlyIf(mongodb && yaml, 'app/config/test.mongodb.yml', 'test.yml', locals)
      .cd('..')
      // Public
      .ensureDir('public')
      .cd('public')
      .copy('app/public/index.html', 'index.html')
      .copy('app/public/logo.png', 'logo.png')
      .cd('..')
      // Src
      .ensureDir('src')
      .cd('src')
      .copy('app/src/e2e.ts', 'e2e.ts')
      .copy('app/src/index.ts', 'index.ts')
      .copy('app/src/test.ts', 'test.ts')
        // App
        .ensureDir('app')
        .cd('app')
        .copy('app/src/app/app.controller.ts', 'app.controller.ts')
          // Controllers
          .ensureDir('controllers')
          .cd('controllers')
          .copy('app/src/app/controllers/index.ts', 'index.ts')
          .copy('app/src/app/controllers/api.controller.ts', 'api.controller.ts')
          .copy('app/src/app/controllers/api.controller.spec.ts', 'api.controller.spec.ts')
          .cd('..')
          // Entities
          .ensureDir('entities')
          .cd('entities')
          .copyOnlyIf(!mongodb, 'app/src/app/entities/index.ts', 'index.ts')
          .copyOnlyIf(!mongodb, 'app/src/app/entities/user.entity.ts', 'user.entity.ts')
          .cd('..')
          // TODO: MongoDB entities
          // Hooks
          .ensureDir('hooks')
          .cd('hooks')
          .copy('app/src/app/hooks/index.ts', 'index.ts')
          .cd('..')
          // Services
          .ensureDir('services')
          .cd('services')
          .copy('app/src/app/services/index.ts', 'index.ts')
          .cd('..')
        .cd('..')
        // E2E
        .ensureDir('e2e')
        .cd('e2e')
        .copy('app/src/e2e/index.ts', 'index.ts')
        .cd('..')
        // Scripts
        .ensureDir('scripts')
        .cd('scripts')
        .copyOnlyIf(!mongodb, 'app/src/scripts/create-user.ts', 'create-user.ts')
        .copyOnlyIf(mongodb, 'app/src/scripts/create-user.mongodb.ts', 'create-user.ts');

  if (autoInstall) {
    log('');
    log('  📦 Installing the dependencies...');
    const packageManager = isYarnInstalled() ? 'yarn' : 'npm';
    // TODO: in version 2, remove the hack "--ignore-engines"
    const args = [ 'install', '--ignore-engines' ];
    const options: SpawnOptions = {
      cwd: names.kebabName,
      shell: true,
      stdio: 'inherit'
    };

    await new Promise(resolve => {
      spawn(packageManager, args, options)
        .on('close', (code: number) => {
          if (code !== 0) {
            log(red('A problem occurred when installing the dependencies. See above.'));
          }
          resolve();
        });
    });
  }

  if (initRepo) {
    log('  📔 Initializing git repository...');
    await initGitRepo(names.kebabName);
  }

  log(`
  👉 Run the following commands to get started:

` + [
  `cd ${names.kebabName}`,
  ...(autoInstall ? [] : [`npm install`]),
  'npm run develop'
].map(cmd => '    $ ' + cyan(cmd)).join('\n') + '\n'
  );
}
