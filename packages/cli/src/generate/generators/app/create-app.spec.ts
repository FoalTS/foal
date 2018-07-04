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
    rmdirIfExists('test-foo-bar/public');

    // Src
    rmdirIfExists('test-foo-bar/src');

    // Root
    rmdirIfExists('test-foo-bar');
  });

});
