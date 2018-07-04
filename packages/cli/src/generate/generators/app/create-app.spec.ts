// 3p
import { expect } from 'chai';

// FoalTS
import { readFileFromRoot, readFileFromTemplatesSpec, rmdirIfExists, rmfileIfExists } from '../../utils';
import { createApp } from './create-app';

describe('createApp', () => {

  it('should render the config templates.', () => {

    createApp({ name: 'test-fooBar', sessionSecret: 'my-secret' });

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

  });

  it('should render the src/app/controllers templates.', () => {

    createApp({ name: 'test-fooBar' });

    let expected = readFileFromTemplatesSpec('app/src/app/controllers/index.1.ts');
    let actual = readFileFromRoot('test-foo-bar/src/app/controllers/index.ts');
    expect(actual).to.equal(expected);

    expected = readFileFromTemplatesSpec('app/src/app/controllers/test.1.ts');
    actual = readFileFromRoot('test-foo-bar/src/app/controllers/test.ts');
    expect(actual).to.equal(expected);

  });

  it('should render the src/app/hooks templates.', () => {

    createApp({ name: 'test-fooBar' });

    let expected = readFileFromTemplatesSpec('app/src/app/hooks/index.1.ts');
    let actual = readFileFromRoot('test-foo-bar/src/app/hooks/index.ts');
    expect(actual).to.equal(expected);

    expected = readFileFromTemplatesSpec('app/src/app/hooks/test.1.ts');
    actual = readFileFromRoot('test-foo-bar/src/app/hooks/test.ts');
    expect(actual).to.equal(expected);

  });

  it('should render the src/app/entities templates.', () => {

    createApp({ name: 'test-fooBar' });

    let expected = readFileFromTemplatesSpec('app/src/app/entities/index.1.ts');
    let actual = readFileFromRoot('test-foo-bar/src/app/entities/index.ts');
    expect(actual).to.equal(expected);

    expected = readFileFromTemplatesSpec('app/src/app/entities/test.1.ts');
    actual = readFileFromRoot('test-foo-bar/src/app/entities/test.ts');
    expect(actual).to.equal(expected);

  });

  it('should render the src/app/sub-modules templates.', () => {

    createApp({ name: 'test-fooBar' });

    let expected = readFileFromTemplatesSpec('app/src/app/sub-modules/index.1.ts');
    let actual = readFileFromRoot('test-foo-bar/src/app/sub-modules/index.ts');
    expect(actual).to.equal(expected);

    expected = readFileFromTemplatesSpec('app/src/app/sub-modules/test.1.ts');
    actual = readFileFromRoot('test-foo-bar/src/app/sub-modules/test.ts');
    expect(actual).to.equal(expected);

  });

  it('should render the src/app/services templates.', () => {

    createApp({ name: 'test-fooBar' });

    let expected = readFileFromTemplatesSpec('app/src/app/services/index.1.ts');
    let actual = readFileFromRoot('test-foo-bar/src/app/services/index.ts');
    expect(actual).to.equal(expected);

    expected = readFileFromTemplatesSpec('app/src/app/services/test.1.ts');
    actual = readFileFromRoot('test-foo-bar/src/app/services/test.ts');
    expect(actual).to.equal(expected);

  });

  it('should render the src/app/templates templates.', () => {

    createApp({ name: 'test-fooBar' });

    let expected = readFileFromTemplatesSpec('app/src/app/templates/index.1.html');
    let actual = readFileFromRoot('test-foo-bar/src/app/templates/index.html');
    expect(actual).to.equal(expected);

    expected = readFileFromTemplatesSpec('app/src/app/templates/index.1.ts');
    actual = readFileFromRoot('test-foo-bar/src/app/templates/index.ts');
    expect(actual).to.equal(expected);

    expected = readFileFromTemplatesSpec('app/src/app/templates/test.1.ts');
    actual = readFileFromRoot('test-foo-bar/src/app/templates/test.ts');
    expect(actual).to.equal(expected);

  });

  it('should render the src/app templates.', () => {

    createApp({ name: 'test-fooBar' });

    let expected = readFileFromTemplatesSpec('app/src/app/app.module.1.ts');
    let actual = readFileFromRoot('test-foo-bar/src/app/app.module.ts');
    expect(actual).to.equal(expected);

    expected = readFileFromTemplatesSpec('app/src/app/test.1.ts');
    actual = readFileFromRoot('test-foo-bar/src/app/test.ts');
    expect(actual).to.equal(expected);

  });

  afterEach(() => {
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
    rmdirIfExists('test-foo-bar/public');

    // Src
    rmfileIfExists('test-foo-bar/src/app/controllers/index.ts');
    rmfileIfExists('test-foo-bar/src/app/controllers/test.ts');
    rmdirIfExists('test-foo-bar/src/app/controllers');

    rmfileIfExists('test-foo-bar/src/app/hooks/index.ts');
    rmfileIfExists('test-foo-bar/src/app/hooks/test.ts');
    rmdirIfExists('test-foo-bar/src/app/hooks');

    rmfileIfExists('test-foo-bar/src/app/entities/index.ts');
    rmfileIfExists('test-foo-bar/src/app/entities/test.ts');
    rmdirIfExists('test-foo-bar/src/app/entities');

    rmfileIfExists('test-foo-bar/src/app/sub-modules/index.ts');
    rmfileIfExists('test-foo-bar/src/app/sub-modules/test.ts');
    rmdirIfExists('test-foo-bar/src/app/sub-modules');

    rmfileIfExists('test-foo-bar/src/app/services/index.ts');
    rmfileIfExists('test-foo-bar/src/app/services/test.ts');
    rmdirIfExists('test-foo-bar/src/app/services');

    rmfileIfExists('test-foo-bar/src/app/templates/index.html');
    rmfileIfExists('test-foo-bar/src/app/templates/index.ts');
    rmfileIfExists('test-foo-bar/src/app/templates/test.ts');
    rmdirIfExists('test-foo-bar/src/app/templates');

    rmfileIfExists('test-foo-bar/src/app/app.module.ts');
    rmfileIfExists('test-foo-bar/src/app/test.ts');
    rmdirIfExists('test-foo-bar/src/app');

    rmfileIfExists('test-foo-bar/src/index.ts');
    rmfileIfExists('test-foo-bar/src/test.ts');
    rmdirIfExists('test-foo-bar/src');

    // Root
    rmdirIfExists('test-foo-bar');
  });

});
