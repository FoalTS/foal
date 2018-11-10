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
    testEnv.rmfileIfExists('tsconfig.app.json');
    testEnv.rmfileIfExists('tsconfig.e2e.json');
    testEnv.rmfileIfExists('tsconfig.json');
    testEnv.rmfileIfExists('tsconfig.migrations.json');
    testEnv.rmfileIfExists('tsconfig.scripts.json');
    testEnv.rmfileIfExists('tsconfig.test.json');
    testEnv.rmfileIfExists('tslint.json');

    // Config
    testEnv.rmfileIfExists('config/app.development.json');
    testEnv.rmfileIfExists('config/app.e2e.json');
    testEnv.rmfileIfExists('config/app.production.json');
    testEnv.rmfileIfExists('config/app.test.json');
    testEnv.rmfileIfExists('config/settings.development.json');
    testEnv.rmfileIfExists('config/settings.json');
    testEnv.rmfileIfExists('config/settings.production.json');
    testEnv.rmdirIfExists('config');

    // Public
    testEnv.rmfileIfExists('public/logo.svg');
    testEnv.rmdirIfExists('public');

    // Src
    testEnv.rmfileIfExists('src/app/controllers/templates/index.html');
    testEnv.rmdirIfExists('src/app/controllers/templates');

    testEnv.rmfileIfExists('src/app/controllers/index.ts');
    testEnv.rmfileIfExists('src/app/controllers/view.controller.spec.ts');
    testEnv.rmfileIfExists('src/app/controllers/view.controller.ts');
    testEnv.rmdirIfExists('src/app/controllers');

    testEnv.rmfileIfExists('src/app/hooks/index.ts');
    testEnv.rmdirIfExists('src/app/hooks');

    testEnv.rmfileIfExists('src/app/entities/index.ts');
    testEnv.rmfileIfExists('src/app/entities/user.entity.ts');
    testEnv.rmdirIfExists('src/app/entities');

    testEnv.rmfileIfExists('src/app/sub-apps/index.ts');
    testEnv.rmdirIfExists('src/app/sub-apps');

    testEnv.rmfileIfExists('src/app/services/index.ts');
    testEnv.rmdirIfExists('src/app/services');

    testEnv.rmfileIfExists('src/app/app.controller.ts');
    testEnv.rmdirIfExists('src/app');

    testEnv.rmfileIfExists('src/e2e/index.ts');
    testEnv.rmdirIfExists('src/e2e');

    testEnv.rmfileIfExists('src/scripts/create-group.ts');
    testEnv.rmfileIfExists('src/scripts/create-perm.ts');
    testEnv.rmfileIfExists('src/scripts/create-user.ts');
    testEnv.rmdirIfExists('src/scripts');

    testEnv.rmfileIfExists('src/e2e.ts');
    testEnv.rmfileIfExists('src/index.ts');
    testEnv.rmfileIfExists('src/test.ts');
    testEnv.rmdirIfExists('src');

    // Root
    testEnv.rmdirIfExists('../test-foo-bar');
  });

  it('should render the config templates.', () => {
    testEnv
      .validateSpec('config/app.development.json')
      .validateSpec('config/app.e2e.json')
      .validateSpec('config/app.production.json')
      .validateSpec('config/app.test.json')
      .validateSpec('config/settings.development.json')
      .validateSpec('config/settings.json')
      .validateSpec('config/settings.production.json');
  });

  it('should copy the logo image.', () => {
    testEnv
      .validateFileSpec('public/logo.svg');
  });

  it('shoud copy the src/e2e templates.', () => {
    testEnv
      .validateSpec('src/e2e/index.ts');
  });

  it('shoud copy the src/scripts templates.', () => {
    testEnv
      .validateSpec('src/scripts/create-group.ts')
      .validateSpec('src/scripts/create-perm.ts')
      .validateSpec('src/scripts/create-user.ts');
  });

  it('should render the src/app/controllers templates.', () => {
    testEnv
      .validateSpec('src/app/controllers/index.ts')
      .validateSpec('src/app/controllers/view.controller.spec.ts')
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

  it('should render the src/app/sub-apps templates.', () => {
    testEnv
      .validateSpec('src/app/sub-apps/index.ts');
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
      .validateSpec('src/app/app.controller.ts');
  });

  it('should render the src templates.', () => {
    testEnv
      .validateSpec('src/e2e.ts')
      .validateSpec('src/index.ts')
      .validateSpec('src/test.ts');
  });

  it('should render the root templates.', () => {
    testEnv
      .validateSpec('gitignore', '.gitignore')
      .validateSpec('ormconfig.json')
      .validateSpec('package.json')
      .validateSpec('tsconfig.json')
      .validateSpec('tsconfig.app.json')
      .validateSpec('tsconfig.e2e.json')
      .validateSpec('tsconfig.json')
      .validateSpec('tsconfig.migrations.json')
      .validateSpec('tsconfig.scripts.json')
      .validateSpec('tsconfig.test.json')
      .validateSpec('tslint.json');
  });

});
