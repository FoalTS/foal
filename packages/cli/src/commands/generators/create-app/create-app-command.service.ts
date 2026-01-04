// 3p
import { red } from 'colors/safe';

// FoalTS
import { Generator } from '../../../services';
import {
  getNames,
  initGitRepo,
  logger,
  installDependencies,
} from '../utils';

/**
 * Service for creating a new FoalTS application.
 */
export class CreateAppCommandService {
  constructor(
    private generator: Generator,
  ) {}

  /**
   * Create a new FoalTS application.
   *
   * @param {string} name - The name of the application
   * @param {boolean} autoInstall - Whether to automatically install dependencies
   * @param {boolean} initRepo - Whether to initialize a git repository
   * @param {boolean} mongodb - Whether to use MongoDB instead of SQLite
   * @param {boolean} yaml - Whether to use YAML configuration instead of JSON
   * @returns {Promise<void>}
   */
  async run({ name, autoInstall, initRepo, mongodb = false, yaml = false }:
    { name: string, autoInstall?: boolean, initRepo?: boolean, mongodb?: boolean,
      yaml?: boolean }): Promise<void> {
    const names = getNames(name);

    logger.log();
    logger.log(' ------------------------------------------------- ');
    logger.log('|                                                 |');
    logger.log('|                     Foal                        |');
    logger.log('|                                                 |');
    logger.log(' ------------------------------------------------- ');
    logger.log();

    const locals = names;

    if (this.generator.exists(names.kebabName)) {
      logger.log(red('  Error: ') + `The target directory "${names.kebabName}" already exists.`);
      logger.log('Please remove it before proceeding.');
      logger.log();
      return;
    }

    this.generator
      .ensureDir(names.kebabName)
      .cd(names.kebabName);

    logger.log('  📂 Creating files...');
    logger.log();

    this.generator
      .hideLogs()
      .copyTemplate('app/gitignore', '.gitignore')
      .renderOnlyIf(!mongodb, 'app/package.json', 'package.json', locals)
      .renderOnlyIf(mongodb, 'app/package.mongodb.json', 'package.json', locals)
      .setOrUpdateProjectDependencyOnlyIf(yaml, 'yamljs', '~0.3.0')
      .copyTemplate('app/tsconfig.app.json', 'tsconfig.app.json')
      .copyTemplate('app/tsconfig.e2e.json', 'tsconfig.e2e.json')
      .copyTemplate('app/tsconfig.json', 'tsconfig.json')
      .copyTemplate('app/tsconfig.test.json', 'tsconfig.test.json')
      .copyTemplate('app/.eslintrc.js', '.eslintrc.js')
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
        .copyTemplate('app/public/index.html', 'index.html')
        .copyTemplate('app/public/logo.png', 'logo.png')
        .cd('..')
        // Src
        .ensureDir('src')
        .cd('src')
        .copyTemplate('app/src/db.ts', 'db.ts')
        .copyTemplate('app/src/e2e.ts', 'e2e.ts')
        .copyTemplate('app/src/index.ts', 'index.ts')
        .copyTemplate('app/src/test.ts', 'test.ts')
          // App
          .ensureDir('app')
          .cd('app')
          .copyTemplate('app/src/app/app.controller.ts', 'app.controller.ts')
            // Controllers
            .ensureDir('controllers')
            .cd('controllers')
            .copyTemplate('app/src/app/controllers/index.ts', 'index.ts')
            .copyTemplate('app/src/app/controllers/api.controller.ts', 'api.controller.ts')
            .copyTemplate('app/src/app/controllers/api.controller.spec.ts', 'api.controller.spec.ts')
            .cd('..')
            // Entities
            .ensureDir('entities')
            .cd('entities')
            .copyTemplate('app/src/app/entities/index.ts', 'index.ts')
            .copyTemplateOnlyIf(!mongodb, 'app/src/app/entities/user.entity.ts', 'user.entity.ts')
            .copyTemplateOnlyIf(mongodb, 'app/src/app/entities/user.entity.mongodb.ts', 'user.entity.ts')
            .cd('..')
            // Hooks
            .ensureDir('hooks')
            .cd('hooks')
            .copyTemplate('app/src/app/hooks/index.ts', 'index.ts')
            .cd('..')
            // Services
            .ensureDir('services')
            .cd('services')
            .copyTemplate('app/src/app/services/index.ts', 'index.ts')
            .cd('..')
          .cd('..')
          // E2E
          .ensureDir('e2e')
          .cd('e2e')
          .copyTemplate('app/src/e2e/index.ts', 'index.ts')
          .cd('..')
          // Scripts
          .ensureDir('scripts')
          .cd('scripts')
          .copyTemplate('app/src/scripts/create-user.ts', 'create-user.ts');

    if (autoInstall) {
      const { failed } = await installDependencies(names.kebabName);
      logger.log();
      if (failed) {
        return;
      }
    }

    if (initRepo) {
      logger.log('  📔 Initializing git repository...');
      logger.log();
      await initGitRepo(names.kebabName);
    }

    logger.log('✨ Project successfully created.');
    logger.log('👉 Here are the next steps:');

    logger.log();
    logger.logCommand(`cd ${names.kebabName}`);
    if (!autoInstall) {
      logger.logCommand('npm install');
    }
    logger.logCommand('npm run dev');

    logger.log();
  }
}

