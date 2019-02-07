// FoalTS
import { TestEnvironment } from '../../utils';
import { createApp } from './create-app';

describe('createApp', () => {

  const testEnv = new TestEnvironment('app', 'test-foo-bar');

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
    testEnv.rmfileIfExists('config/mongodb.e2e.json');
    testEnv.rmfileIfExists('config/mongodb.development.json');
    testEnv.rmfileIfExists('config/settings.development.json');
    testEnv.rmfileIfExists('config/settings.json');
    testEnv.rmfileIfExists('config/settings.production.json');
    testEnv.rmdirIfExists('config');

    // Public
    testEnv.rmfileIfExists('public/logo.png');
    testEnv.rmfileIfExists('public/index.html');
    testEnv.rmdirIfExists('public');

    // Src
    testEnv.rmfileIfExists('src/app/controllers/index.ts');
    testEnv.rmfileIfExists('src/app/controllers/api.controller.spec.ts');
    testEnv.rmfileIfExists('src/app/controllers/api.controller.ts');
    testEnv.rmdirIfExists('src/app/controllers');

    testEnv.rmfileIfExists('src/app/hooks/index.ts');
    testEnv.rmdirIfExists('src/app/hooks');

    testEnv.rmfileIfExists('src/app/entities/index.ts');
    testEnv.rmfileIfExists('src/app/entities/user.entity.ts');
    testEnv.rmdirIfExists('src/app/entities');

    testEnv.rmfileIfExists('src/app/models/index.ts');
    testEnv.rmfileIfExists('src/app/models/user.model.ts');
    testEnv.rmdirIfExists('src/app/models');

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

  it('should render the config templates.', async () => {
    await createApp({ name: 'test-fooBar', sessionSecret: 'my-secret' });

    testEnv
      .shouldNotExist('config/mongodb.development.json')
      .shouldNotExist('config/mongodb.e2e.json')
      .validateSpec('config/settings.development.json')
      .validateSpec('config/settings.json')
      .validateSpec('config/settings.production.json');
  });

  it('should render the config templates (MongoDB option).', async () => {
    await createApp({ name: 'test-fooBar', sessionSecret: 'my-secret', mongodb: true });

    testEnv
      .validateSpec('config/mongodb.development.json')
      .validateSpec('config/mongodb.e2e.json')
      .validateSpec('config/settings.development.json')
      .validateSpec('config/settings.json')
      .validateSpec('config/settings.production.json');
  });

  it('should copy the public directory.', async () => {
    await createApp({ name: 'test-fooBar', sessionSecret: 'my-secret' });

    testEnv
      .validateSpec('public/index.html')
      .validateFileSpec('public/logo.png');
  });

  it('shoud copy the src/e2e templates.', async () => {
    await createApp({ name: 'test-fooBar', sessionSecret: 'my-secret' });

    testEnv
      .validateSpec('src/e2e/index.ts');
  });

  it('shoud copy the src/e2e templates (MongoDB option).', async () => {
    await createApp({ name: 'test-fooBar', sessionSecret: 'my-secret', mongodb: true });

    testEnv
      .validateSpec('src/e2e/index.mongodb.ts', 'src/e2e/index.ts');
  });

  it('shoud copy the src/scripts templates.', async () => {
    await createApp({ name: 'test-fooBar', sessionSecret: 'my-secret' });

    testEnv
      .validateSpec('src/scripts/create-group.ts')
      .validateSpec('src/scripts/create-perm.ts')
      .validateSpec('src/scripts/create-user.ts');
  });

  it('shoud copy the src/scripts templates (MongoDB option).', async () => {
    await createApp({ name: 'test-fooBar', sessionSecret: 'my-secret', mongodb: true });

    testEnv
      .shouldNotExist('src/scripts/create-group.ts')
      .shouldNotExist('src/scripts/create-perm.ts')
      .validateSpec(
        'src/scripts/create-user.mongodb.ts',
        'src/scripts/create-user.ts'
      );
  });

  it('should render the src/app/controllers templates.', async () => {
    await createApp({ name: 'test-fooBar', sessionSecret: 'my-secret' });

    testEnv
      .validateSpec('src/app/controllers/index.ts')
      .validateSpec('src/app/controllers/api.controller.spec.ts')
      .validateSpec('src/app/controllers/api.controller.ts');
  });

  it('should render the src/app/hooks templates.', async () => {
    await createApp({ name: 'test-fooBar', sessionSecret: 'my-secret' });

    testEnv
      .validateSpec('src/app/hooks/index.ts');
  });

  it('should render the src/app/entities templates.', async () => {
    await createApp({ name: 'test-fooBar', sessionSecret: 'my-secret' });

    testEnv
      .validateSpec('src/app/entities/index.ts')
      .validateSpec('src/app/entities/user.entity.ts')
      .shouldNotExist('src/app/models');
  });

  it('should render the src/app/models templates (MongoDB option).', async () => {
    await createApp({ name: 'test-fooBar', sessionSecret: 'my-secret', mongodb: true });

    testEnv
      .validateSpec('src/app/models/index.ts')
      .validateSpec('src/app/models/user.model.ts')
      .shouldNotExist('src/app/entities');
  });

  it('should render the src/app/sub-apps templates.', async () => {
    await createApp({ name: 'test-fooBar', sessionSecret: 'my-secret' });

    testEnv
      .validateSpec('src/app/sub-apps/index.ts');
  });

  it('should render the src/app/services templates.', async () => {
    await createApp({ name: 'test-fooBar', sessionSecret: 'my-secret' });

    testEnv
      .validateSpec('src/app/services/index.ts');
 });

  it('should render the src/app templates.', async () => {
    await createApp({ name: 'test-fooBar', sessionSecret: 'my-secret' });

    testEnv
      .validateSpec('src/app/app.controller.ts');
  });

  it('should render the src templates.', async () => {
    await createApp({ name: 'test-fooBar', sessionSecret: 'my-secret' });

    testEnv
      .validateSpec('src/e2e.ts')
      .validateSpec('src/index.ts')
      .validateSpec('src/test.ts');
  });

  it('should render the src templates (MongoDB option).', async () => {
    await createApp({ name: 'test-fooBar', sessionSecret: 'my-secret', mongodb: true });

    testEnv
      .validateSpec('src/e2e.ts')
      .validateSpec('src/index.mongodb.ts', 'src/index.ts')
      .validateSpec('src/test.ts');
  });

  it('should render the root templates.', async () => {
    await createApp({ name: 'test-fooBar', sessionSecret: 'my-secret' });

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

  it('should render the root templates (MongoDB option).', async () => {
    await createApp({ name: 'test-fooBar', sessionSecret: 'my-secret', mongodb: true });

    testEnv
      .validateSpec('gitignore', '.gitignore')
      .shouldNotExist('ormconfig.json')
      .validateSpec('package.mongodb.json', 'package.json')
      .validateSpec('tsconfig.json')
      .validateSpec('tsconfig.app.json')
      .validateSpec('tsconfig.e2e.json')
      .validateSpec('tsconfig.json')
      .shouldNotExist('tsconfig.migrations.json')
      .validateSpec('tsconfig.scripts.json')
      .validateSpec('tsconfig.test.json')
      .validateSpec('tslint.json');
  });

});
