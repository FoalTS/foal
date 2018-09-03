// FoalTS
import { TestEnvironment } from '../../utils';
import { createApp } from './create-app';

describe('createApp', () => {

  const testEnv = new TestEnvironment('app', 'test-foo-bar');

  beforeEach(() => createApp({ name: 'test-fooBar', sessionSecret: 'my-secret' }));

  afterEach(() => {
    testEnv.rmfileIfExists('.gitignore');
    testEnv.rmfileIfExists('ormconfig.json');
    testEnv.rmfileIfExists('package.json');
    testEnv.rmfileIfExists('tsconfig.json');
    testEnv.rmfileIfExists('tsconfig.app.json');
    testEnv.rmfileIfExists('tslint.json');

    // Config
    testEnv.rmfileIfExists('config/app.development.json');
    testEnv.rmfileIfExists('config/app.production.json');
    testEnv.rmfileIfExists('config/app.test.json');
    testEnv.rmfileIfExists('config/settings.development.json');
    testEnv.rmfileIfExists('config/settings.json');
    testEnv.rmfileIfExists('config/settings.production.json');
    testEnv.rmdirIfExists('config');

    // Public
    testEnv.rmfileIfExists('public/logo.png');
    testEnv.rmdirIfExists('public');

    // Src
    testEnv.rmfileIfExists('src/app/controllers/templates/index.html');
    testEnv.rmdirIfExists('src/app/controllers/templates');

    testEnv.rmfileIfExists('src/app/controllers/index.ts');
    testEnv.rmfileIfExists('src/app/controllers/view.controller.ts');
    testEnv.rmdirIfExists('src/app/controllers');

    testEnv.rmfileIfExists('src/app/hooks/index.ts');
    testEnv.rmdirIfExists('src/app/hooks');

    testEnv.rmfileIfExists('src/app/entities/index.ts');
    testEnv.rmfileIfExists('src/app/entities/user.entity.ts');
    testEnv.rmdirIfExists('src/app/entities');

    testEnv.rmfileIfExists('src/app/sub-modules/index.ts');
    testEnv.rmdirIfExists('src/app/sub-modules');

    testEnv.rmfileIfExists('src/app/services/index.ts');
    testEnv.rmdirIfExists('src/app/services');

    testEnv.rmfileIfExists('src/app/app.module.ts');
    testEnv.rmdirIfExists('src/app');

    testEnv.rmfileIfExists('src/scripts/create-group.ts');
    testEnv.rmfileIfExists('src/scripts/create-perm.ts');
    testEnv.rmfileIfExists('src/scripts/create-users.ts');
    testEnv.rmdirIfExists('src/scripts');

    testEnv.rmfileIfExists('src/index.ts');
    testEnv.rmdirIfExists('src');

    // Root
    testEnv.rmdirIfExists('../test-foo-bar');
  });

  it('should render the config templates.', () => {
    testEnv
      .validateSpec('config/app.development.json')
      .validateSpec('config/app.production.json')
      .validateSpec('config/app.test.json')
      .validateSpec('config/settings.development.json')
      .validateSpec('config/settings.json')
      .validateSpec('config/settings.production.json');
  });

  it('should copy the logo image.', () => {
    testEnv
      .validateFileSpec('public/logo.png');
  });

  it('shoud copy the src/scripts templates.', () => {
    testEnv
      .validateSpec('src/scripts/create-group.ts')
      .validateSpec('src/scripts/create-perm.ts')
      .validateSpec('src/scripts/create-users.ts');

  });

  it('should render the src/app/controllers templates.', () => {
    testEnv
      .validateSpec('src/app/controllers/index.ts')
      .validateSpec('src/app/controllers/view.controller.ts');
  });

  it('should render the src/app/hooks templates.', () => {
    testEnv
      .validateSpec('src/app/hooks/index.ts');
  });

  it('should render the src/app/entities templates.', () => {
    testEnv
      .validateSpec('src/app/entities/index.ts')
      .validateSpec('src/app/entities/user.entity.ts');
  });

  it('should render the src/app/sub-modules templates.', () => {
    testEnv
      .validateSpec('src/app/sub-modules/index.ts');
  });

  it('should render the src/app/services templates.', () => {
    testEnv
      .validateSpec('src/app/services/index.ts');
 });

  it('should render the src/app/controllers/templates templates.', () => {
    testEnv
      .validateSpec('src/app/controllers/templates/index.html');
  });

  it('should render the src/app templates.', () => {
    testEnv
      .validateSpec('src/app/app.module.ts');
  });

  it('should render the src templates.', () => {
    testEnv
      .validateSpec('src/index.ts');
  });

  it('should render the root templates.', () => {
    testEnv
      .validateSpec('gitignore', '.gitignore')
      .validateSpec('ormconfig.json')
      .validateSpec('package.json')
      .validateSpec('tsconfig.json')
      .validateSpec('tsconfig.app.json')
      .validateSpec('tslint.json');
  });

});
