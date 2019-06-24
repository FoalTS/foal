// FoalTS
import { TestEnvironment } from '../../utils';
import { createApp } from './create-app';

describe('createApp', () => {

  const testEnv = new TestEnvironment('app', 'test-foo-bar');

  afterEach(() => testEnv.rmDirAndFilesIfExist('../test-foo-bar'));

  it('should render the config templates.', async () => {
    await createApp({ name: 'test-fooBar', sessionSecret: 'my-secret' });

    testEnv
      .validateSpec('config/default.json')
      .shouldNotExist('config/default.yml')
      .validateSpec('config/development.json')
      .shouldNotExist('config/development.yml')
      .validateSpec('config/e2e.json')
      .shouldNotExist('config/e2e.yml')
      .validateSpec('config/production.json')
      .shouldNotExist('config/production.yml')
      .validateSpec('config/test.json')
      .shouldNotExist('config/test.yml');
  });

  it('should render the config templates (YAML option).', async () => {
    await createApp({ name: 'test-fooBar', sessionSecret: 'my-secret', yaml: true });

    testEnv
      .shouldNotExist('config/default.json')
      .validateSpec('config/default.yml')
      .shouldNotExist('config/development.json')
      .validateSpec('config/development.yml')
      .shouldNotExist('config/e2e.json')
      .validateSpec('config/e2e.yml')
      .shouldNotExist('config/production.json')
      .validateSpec('config/production.yml')
      .shouldNotExist('config/test.json')
      .validateSpec('config/test.yml');
  });

  it('should render the config templates (MongoDB option).', async () => {
    await createApp({ name: 'test-fooBar', sessionSecret: 'my-secret', mongodb: true });

    testEnv
      .validateSpec('config/default.json')
      .shouldNotExist('config/default.yml')
      .validateSpec('config/development.mongodb.json', 'config/development.json')
      .shouldNotExist('config/development.yml')
      .validateSpec('config/e2e.mongodb.json', 'config/e2e.json')
      .shouldNotExist('config/e2e.yml')
      .validateSpec('config/production.json')
      .shouldNotExist('config/production.yml')
      .validateSpec('config/test.json')
      .shouldNotExist('config/test.yml');
  });

  it('should render the config templates (MongoDB & YAML options).', async () => {
    await createApp({ name: 'test-fooBar', sessionSecret: 'my-secret', mongodb: true, yaml: true });

    testEnv
      .shouldNotExist('config/default.json')
      .validateSpec('config/default.yml')
      .shouldNotExist('config/development.json')
      .validateSpec('config/development.mongodb.yml', 'config/development.yml')
      .shouldNotExist('config/e2e.json')
      .validateSpec('config/e2e.mongodb.yml', 'config/e2e.yml')
      .shouldNotExist('config/production.json')
      .validateSpec('config/production.yml')
      .shouldNotExist('config/test.json')
      .validateSpec('config/test.yml');
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
      .validateSpec('src/scripts/create-user.ts');
  });

  it('shoud copy the src/scripts templates (MongoDB option).', async () => {
    await createApp({ name: 'test-fooBar', sessionSecret: 'my-secret', mongodb: true });

    testEnv
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
      .validateSpec('ormconfig.js')
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
  it('should render the root templates (YAML option).', async () => {
    await createApp({ name: 'test-fooBar', sessionSecret: 'my-secret', yaml: true });

    testEnv
      .validateSpec('gitignore', '.gitignore')
      .validateSpec('ormconfig.js')
      .validateSpec('package.yaml.json', 'package.json')
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
      .shouldNotExist('ormconfig.js')
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

  it('should render the root templates (MongoDB & YAML options).', async () => {
    await createApp({ name: 'test-fooBar', sessionSecret: 'my-secret', mongodb: true, yaml: true });

    testEnv
      .validateSpec('gitignore', '.gitignore')
      .shouldNotExist('ormconfig.js')
      .validateSpec('package.mongodb.yaml.json', 'package.json')
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
