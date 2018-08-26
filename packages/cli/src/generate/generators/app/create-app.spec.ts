// FoalTS
import { TestEnvironment } from '../../utils';
import { createApp } from './create-app';

describe('createApp', () => {

  const testEnv = new TestEnvironment('app');

  beforeEach(() => createApp({ name: 'test-fooBar', sessionSecret: 'my-secret' }));

  afterEach(() => {
    testEnv.rmfileIfExists('test-foo-bar/.gitignore');
    testEnv.rmfileIfExists('test-foo-bar/ormconfig.json');
    testEnv.rmfileIfExists('test-foo-bar/package.json');
    testEnv.rmfileIfExists('test-foo-bar/tsconfig.json');
    testEnv.rmfileIfExists('test-foo-bar/tsconfig.app.json');
    testEnv.rmfileIfExists('test-foo-bar/tslint.json');

    // Config
    testEnv.rmfileIfExists('test-foo-bar/config/app.development.json');
    testEnv.rmfileIfExists('test-foo-bar/config/app.production.json');
    testEnv.rmfileIfExists('test-foo-bar/config/app.test.json');
    testEnv.rmfileIfExists('test-foo-bar/config/settings.development.json');
    testEnv.rmfileIfExists('test-foo-bar/config/settings.json');
    testEnv.rmfileIfExists('test-foo-bar/config/settings.production.json');
    testEnv.rmdirIfExists('test-foo-bar/config');

    // Public
    testEnv.rmfileIfExists('test-foo-bar/public/logo.png');
    testEnv.rmdirIfExists('test-foo-bar/public');

    // Src
    testEnv.rmfileIfExists('test-foo-bar/src/app/controllers/templates/index.html');
    testEnv.rmdirIfExists('test-foo-bar/src/app/controllers/templates');

    testEnv.rmfileIfExists('test-foo-bar/src/app/controllers/index.ts');
    testEnv.rmfileIfExists('test-foo-bar/src/app/controllers/view.controller.ts');
    testEnv.rmdirIfExists('test-foo-bar/src/app/controllers');

    testEnv.rmfileIfExists('test-foo-bar/src/app/hooks/index.ts');
    testEnv.rmdirIfExists('test-foo-bar/src/app/hooks');

    testEnv.rmfileIfExists('test-foo-bar/src/app/entities/index.ts');
    testEnv.rmfileIfExists('test-foo-bar/src/app/entities/user.entity.ts');
    testEnv.rmdirIfExists('test-foo-bar/src/app/entities');

    testEnv.rmfileIfExists('test-foo-bar/src/app/sub-modules/index.ts');
    testEnv.rmdirIfExists('test-foo-bar/src/app/sub-modules');

    testEnv.rmfileIfExists('test-foo-bar/src/app/services/index.ts');
    testEnv.rmdirIfExists('test-foo-bar/src/app/services');

    testEnv.rmfileIfExists('test-foo-bar/src/app/app.module.ts');
    testEnv.rmdirIfExists('test-foo-bar/src/app');

    testEnv.rmfileIfExists('test-foo-bar/src/scripts/create-users.ts');
    testEnv.rmdirIfExists('test-foo-bar/src/scripts');

    testEnv.rmfileIfExists('test-foo-bar/src/index.ts');
    testEnv.rmdirIfExists('test-foo-bar/src');

    // Root
    testEnv.rmdirIfExists('test-foo-bar');
  });

  it('should render the config templates.', () => {
    testEnv
      .validateSpec('config/app.development.json', 'test-foo-bar/config/app.development.json')
      .validateSpec('config/app.production.json', 'test-foo-bar/config/app.production.json')
      .validateSpec('config/app.test.json', 'test-foo-bar/config/app.test.json')
      .validateSpec('config/settings.development.json', 'test-foo-bar/config/settings.development.json')
      .validateSpec('config/settings.json', 'test-foo-bar/config/settings.json')
      .validateSpec('config/settings.production.json', 'test-foo-bar/config/settings.production.json');
  });

  it('should copy the logo image.', () => {
    testEnv
      .validateFileSpec('public/logo.png', 'test-foo-bar/public/logo.png');
  });

  it('shoud copy the src/scripts templates.', () => {
    testEnv
      .validateSpec('src/scripts/create-users.ts', 'test-foo-bar/src/scripts/create-users.ts');
  });

  it('should render the src/app/controllers templates.', () => {
    testEnv
      .validateSpec('src/app/controllers/index.ts', 'test-foo-bar/src/app/controllers/index.ts')
      .validateSpec('src/app/controllers/view.controller.ts', 'test-foo-bar/src/app/controllers/view.controller.ts');
  });

  it('should render the src/app/hooks templates.', () => {
    testEnv
      .validateSpec('src/app/hooks/index.ts', 'test-foo-bar/src/app/hooks/index.ts');
  });

  it('should render the src/app/entities templates.', () => {
    testEnv
      .validateSpec('src/app/entities/index.ts', 'test-foo-bar/src/app/entities/index.ts')
      .validateSpec('src/app/entities/user.entity.ts', 'test-foo-bar/src/app/entities/user.entity.ts');
  });

  it('should render the src/app/sub-modules templates.', () => {
    testEnv
      .validateSpec('src/app/sub-modules/index.ts', 'test-foo-bar/src/app/sub-modules/index.ts');
  });

  it('should render the src/app/services templates.', () => {
    testEnv
      .validateSpec('src/app/services/index.ts', 'test-foo-bar/src/app/services/index.ts');
 });

  it('should render the src/app/controllers/templates templates.', () => {
    testEnv
      .validateSpec(
        'src/app/controllers/templates/index.html',
        'test-foo-bar/src/app/controllers/templates/index.html'
      );
  });

  it('should render the src/app templates.', () => {
    testEnv
      .validateSpec('src/app/app.module.ts', 'test-foo-bar/src/app/app.module.ts');
  });

  it('should render the src templates.', () => {
    testEnv
      .validateSpec('src/index.ts', 'test-foo-bar/src/index.ts');
  });

  it('should render the root templates.', () => {
    testEnv
      .validateSpec('gitignore', 'test-foo-bar/.gitignore')
      .validateSpec('ormconfig.json', 'test-foo-bar/ormconfig.json')
      .validateSpec('package.json', 'test-foo-bar/package.json')
      .validateSpec('tsconfig.json', 'test-foo-bar/tsconfig.json')
      .validateSpec('tsconfig.app.json', 'test-foo-bar/tsconfig.app.json')
      .validateSpec('tslint.json', 'test-foo-bar/tslint.json');
  });

});
