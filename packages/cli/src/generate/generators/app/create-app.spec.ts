// 3p
import { expect } from 'chai';

// FoalTS
import {
  readFileFromNodeModules,
  readFileFromRoot,
  readFileFromTemplatesSpec,
  rmdirIfExists,
  rmfileIfExists
} from '../../utils';
import { createApp } from './create-app';

describe('createApp', () => {

  beforeEach(() => createApp({ name: 'test-fooBar', sessionSecret: 'my-secret', log: false }));

  afterEach(() => {
    rmfileIfExists('test-foo-bar/.gitignore');
    rmfileIfExists('test-foo-bar/ormconfig.json');
    rmfileIfExists('test-foo-bar/package.json');
    rmfileIfExists('test-foo-bar/tsconfig.json');
    rmfileIfExists('test-foo-bar/tslint.json');

    // Config
    rmfileIfExists('test-foo-bar/config/app.development.json');
    rmfileIfExists('test-foo-bar/config/app.production.json');
    rmfileIfExists('test-foo-bar/config/app.test.json');
    rmfileIfExists('test-foo-bar/config/settings.development.json');
    rmfileIfExists('test-foo-bar/config/settings.json');
    rmfileIfExists('test-foo-bar/config/settings.production.json');
    rmdirIfExists('test-foo-bar/config');

    // Public
    rmfileIfExists('test-foo-bar/public/logo.png');
    rmfileIfExists('test-foo-bar/public/bootstrap.min.css');
    rmdirIfExists('test-foo-bar/public');

    // Src
    rmfileIfExists('test-foo-bar/src/app/controllers/templates/index.html');
    rmfileIfExists('test-foo-bar/src/app/controllers/templates/index.ts');
    rmfileIfExists('test-foo-bar/src/app/controllers/templates/test.ts');
    rmdirIfExists('test-foo-bar/src/app/controllers/templates');

    rmfileIfExists('test-foo-bar/src/app/controllers/index.ts');
    rmfileIfExists('test-foo-bar/src/app/controllers/test.ts');
    rmfileIfExists('test-foo-bar/src/app/controllers/view.controller.ts');
    rmdirIfExists('test-foo-bar/src/app/controllers');

    rmfileIfExists('test-foo-bar/src/app/hooks/index.ts');
    rmfileIfExists('test-foo-bar/src/app/hooks/test.ts');
    rmdirIfExists('test-foo-bar/src/app/hooks');

    rmfileIfExists('test-foo-bar/src/app/entities/index.ts');
    rmfileIfExists('test-foo-bar/src/app/entities/test.ts');
    rmfileIfExists('test-foo-bar/src/app/entities/user.entity.ts');
    rmdirIfExists('test-foo-bar/src/app/entities');

    rmfileIfExists('test-foo-bar/src/app/sub-modules/index.ts');
    rmfileIfExists('test-foo-bar/src/app/sub-modules/test.ts');
    rmdirIfExists('test-foo-bar/src/app/sub-modules');

    rmfileIfExists('test-foo-bar/src/app/services/index.ts');
    rmfileIfExists('test-foo-bar/src/app/services/test.ts');
    rmdirIfExists('test-foo-bar/src/app/services');

    rmfileIfExists('test-foo-bar/src/app/app.module.ts');
    rmfileIfExists('test-foo-bar/src/app/test.ts');
    rmdirIfExists('test-foo-bar/src/app');

    rmfileIfExists('test-foo-bar/src/index.ts');
    rmfileIfExists('test-foo-bar/src/test.ts');
    rmdirIfExists('test-foo-bar/src');

    // Root
    rmdirIfExists('test-foo-bar');
  });

  it('should render the config templates.', () => {

    let expected = readFileFromTemplatesSpec('app/config/app.development.1.json');
    let actual = readFileFromRoot('test-foo-bar/config/app.development.json');
    expect(actual).to.equal(expected);

    expected = readFileFromTemplatesSpec('app/config/app.production.1.json');
    actual = readFileFromRoot('test-foo-bar/config/app.production.json');
    expect(actual).to.equal(expected);

    expected = readFileFromTemplatesSpec('app/config/app.test.1.json');
    actual = readFileFromRoot('test-foo-bar/config/app.test.json');
    expect(actual).to.equal(expected);

    expected = readFileFromTemplatesSpec('app/config/settings.1.json');
    actual = readFileFromRoot('test-foo-bar/config/settings.json');
    expect(actual).to.equal(expected);

    expected = readFileFromTemplatesSpec('app/config/settings.development.1.json');
    actual = readFileFromRoot('test-foo-bar/config/settings.development.json');
    expect(actual).to.equal(expected);

    expected = readFileFromTemplatesSpec('app/config/settings.production.1.json');
    actual = readFileFromRoot('test-foo-bar/config/settings.production.json');
    expect(actual).to.equal(expected);

  });

  it('should copy the logo image.', () => {

    const expected = readFileFromTemplatesSpec('app/public/logo.1.png');
    const actual = readFileFromRoot('test-foo-bar/public/logo.png');
    expect(actual).to.equal(expected);

  });

  it('should copy the bootstrap css file.', () => {

    const expected = readFileFromNodeModules('bootstrap/dist/css/bootstrap.min.css');
    const actual = readFileFromRoot('test-foo-bar/public/bootstrap.min.css');
    expect(actual).to.equal(expected);

  });

  it('should render the src/app/controllers templates.', () => {

    let expected = readFileFromTemplatesSpec('app/src/app/controllers/index.1.ts');
    let actual = readFileFromRoot('test-foo-bar/src/app/controllers/index.ts');
    expect(actual).to.equal(expected);

    expected = readFileFromTemplatesSpec('app/src/app/controllers/test.1.ts');
    actual = readFileFromRoot('test-foo-bar/src/app/controllers/test.ts');
    expect(actual).to.equal(expected);

    expected = readFileFromTemplatesSpec('app/src/app/controllers/view.controller.1.ts');
    actual = readFileFromRoot('test-foo-bar/src/app/controllers/view.controller.ts');
    expect(actual).to.equal(expected);

  });

  it('should render the src/app/hooks templates.', () => {

    let expected = readFileFromTemplatesSpec('app/src/app/hooks/index.1.ts');
    let actual = readFileFromRoot('test-foo-bar/src/app/hooks/index.ts');
    expect(actual).to.equal(expected);

    expected = readFileFromTemplatesSpec('app/src/app/hooks/test.1.ts');
    actual = readFileFromRoot('test-foo-bar/src/app/hooks/test.ts');
    expect(actual).to.equal(expected);

  });

  it('should render the src/app/entities templates.', () => {

    let expected = readFileFromTemplatesSpec('app/src/app/entities/index.1.ts');
    let actual = readFileFromRoot('test-foo-bar/src/app/entities/index.ts');
    expect(actual).to.equal(expected);

    expected = readFileFromTemplatesSpec('app/src/app/entities/test.1.ts');
    actual = readFileFromRoot('test-foo-bar/src/app/entities/test.ts');
    expect(actual).to.equal(expected);

    expected = readFileFromTemplatesSpec('app/src/app/entities/user.entity.1.ts');
    actual = readFileFromRoot('test-foo-bar/src/app/entities/user.entity.ts');
    expect(actual).to.equal(expected);

  });

  it('should render the src/app/sub-modules templates.', () => {

    let expected = readFileFromTemplatesSpec('app/src/app/sub-modules/index.1.ts');
    let actual = readFileFromRoot('test-foo-bar/src/app/sub-modules/index.ts');
    expect(actual).to.equal(expected);

    expected = readFileFromTemplatesSpec('app/src/app/sub-modules/test.1.ts');
    actual = readFileFromRoot('test-foo-bar/src/app/sub-modules/test.ts');
    expect(actual).to.equal(expected);

  });

  it('should render the src/app/services templates.', () => {

    let expected = readFileFromTemplatesSpec('app/src/app/services/index.1.ts');
    let actual = readFileFromRoot('test-foo-bar/src/app/services/index.ts');
    expect(actual).to.equal(expected);

    expected = readFileFromTemplatesSpec('app/src/app/services/test.1.ts');
    actual = readFileFromRoot('test-foo-bar/src/app/services/test.ts');
    expect(actual).to.equal(expected);

  });

  it('should render the src/app/controllers/templates templates.', () => {

    let expected = readFileFromTemplatesSpec('app/src/app/controllers/templates/index.1.html');
    let actual = readFileFromRoot('test-foo-bar/src/app/controllers/templates/index.html');
    expect(actual).to.equal(expected);

    expected = readFileFromTemplatesSpec('app/src/app/controllers/templates/index.1.ts');
    actual = readFileFromRoot('test-foo-bar/src/app/controllers/templates/index.ts');
    expect(actual).to.equal(expected);

    expected = readFileFromTemplatesSpec('app/src/app/controllers/templates/test.1.ts');
    actual = readFileFromRoot('test-foo-bar/src/app/controllers/templates/test.ts');
    expect(actual).to.equal(expected);

  });

  it('should render the src/app templates.', () => {

    let expected = readFileFromTemplatesSpec('app/src/app/app.module.1.ts');
    let actual = readFileFromRoot('test-foo-bar/src/app/app.module.ts');
    expect(actual).to.equal(expected);

    expected = readFileFromTemplatesSpec('app/src/app/test.1.ts');
    actual = readFileFromRoot('test-foo-bar/src/app/test.ts');
    expect(actual).to.equal(expected);

  });

  it('should render the src templates.', () => {

    let expected = readFileFromTemplatesSpec('app/src/index.1.ts');
    let actual = readFileFromRoot('test-foo-bar/src/index.ts');
    expect(actual).to.equal(expected);

    expected = readFileFromTemplatesSpec('app/src/test.1.ts');
    actual = readFileFromRoot('test-foo-bar/src/test.ts');
    expect(actual).to.equal(expected);

  });

  it('should render the root templates.', () => {

    let expected = readFileFromTemplatesSpec('app/gitignore.1');
    let actual = readFileFromRoot('test-foo-bar/.gitignore');
    expect(actual).to.equal(expected);

    expected = readFileFromTemplatesSpec('app/ormconfig.1.json');
    actual = readFileFromRoot('test-foo-bar/ormconfig.json');
    expect(actual).to.equal(expected);

    expected = readFileFromTemplatesSpec('app/package.1.json');
    actual = readFileFromRoot('test-foo-bar/package.json');
    expect(actual).to.equal(expected);

    expected = readFileFromTemplatesSpec('app/tsconfig.1.json');
    actual = readFileFromRoot('test-foo-bar/tsconfig.json');
    expect(actual).to.equal(expected);

    expected = readFileFromTemplatesSpec('app/tslint.1.json');
    actual = readFileFromRoot('test-foo-bar/tslint.json');
    expect(actual).to.equal(expected);

  });

});
