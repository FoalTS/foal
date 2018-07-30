// 3p
import { expect } from 'chai';

// FoalTS
import { readFileFromRoot, readFileFromTemplatesSpec, rmdirIfExists, rmfileIfExists } from '../../utils';
import { createModule } from './create-module';

describe('createModule', () => {

  beforeEach(() => createModule({ name: 'test-fooBar', log: false }));

  afterEach(() => {
    rmfileIfExists('test-foo-bar/controllers/templates/index.ts');
    rmfileIfExists('test-foo-bar/controllers/templates/test.ts');
    rmdirIfExists('test-foo-bar/controllers/templates');
    rmfileIfExists('test-foo-bar/controllers/index.ts');
    rmfileIfExists('test-foo-bar/controllers/test.ts');
    rmdirIfExists('test-foo-bar/controllers');

    rmfileIfExists('test-foo-bar/hooks/index.ts');
    rmfileIfExists('test-foo-bar/hooks/test.ts');
    rmdirIfExists('test-foo-bar/hooks');

    rmfileIfExists('test-foo-bar/entities/index.ts');
    rmfileIfExists('test-foo-bar/entities/test.ts');
    rmdirIfExists('test-foo-bar/entities');

    rmfileIfExists('test-foo-bar/sub-modules/index.ts');
    rmfileIfExists('test-foo-bar/sub-modules/test.ts');
    rmdirIfExists('test-foo-bar/sub-modules');

    rmfileIfExists('test-foo-bar/services/index.ts');
    rmfileIfExists('test-foo-bar/services/test.ts');
    rmdirIfExists('test-foo-bar/services');

    rmfileIfExists('test-foo-bar/test-foo-bar.module.ts');
    rmfileIfExists('test-foo-bar/index.ts');
    rmfileIfExists('test-foo-bar/test.ts');

    rmdirIfExists('test-foo-bar');
  });

  it('should render the root templates.', () => {

    let expected = readFileFromTemplatesSpec('module/index.1.ts');
    let actual = readFileFromRoot('test-foo-bar/index.ts');
    expect(actual).to.equal(expected);

    expected = readFileFromTemplatesSpec('module/test-foo-bar.module.1.ts');
    actual = readFileFromRoot('test-foo-bar/test-foo-bar.module.ts');
    expect(actual).to.equal(expected);

    expected = readFileFromTemplatesSpec('module/test.1.ts');
    actual = readFileFromRoot('test-foo-bar/test.ts');
    expect(actual).to.equal(expected);

  });

  it('should render the controllers templates.', () => {

    let expected = readFileFromTemplatesSpec('module/controllers/index.1.ts');
    let actual = readFileFromRoot('test-foo-bar/controllers/index.ts');
    expect(actual).to.equal(expected);

    expected = readFileFromTemplatesSpec('module/controllers/test.1.ts');
    actual = readFileFromRoot('test-foo-bar/controllers/test.ts');
    expect(actual).to.equal(expected);

  });

  it('should render the hooks templates.', () => {

    let expected = readFileFromTemplatesSpec('module/hooks/index.1.ts');
    let actual = readFileFromRoot('test-foo-bar/hooks/index.ts');
    expect(actual).to.equal(expected);

    expected = readFileFromTemplatesSpec('module/hooks/test.1.ts');
    actual = readFileFromRoot('test-foo-bar/hooks/test.ts');
    expect(actual).to.equal(expected);

  });

  it('should render the entities templates.', () => {

    let expected = readFileFromTemplatesSpec('module/entities/index.1.ts');
    let actual = readFileFromRoot('test-foo-bar/entities/index.ts');
    expect(actual).to.equal(expected);

    expected = readFileFromTemplatesSpec('module/entities/test.1.ts');
    actual = readFileFromRoot('test-foo-bar/entities/test.ts');
    expect(actual).to.equal(expected);

  });

  it('should render the sub-modules templates.', () => {

    let expected = readFileFromTemplatesSpec('module/sub-modules/index.1.ts');
    let actual = readFileFromRoot('test-foo-bar/sub-modules/index.ts');
    expect(actual).to.equal(expected);

    expected = readFileFromTemplatesSpec('module/sub-modules/test.1.ts');
    actual = readFileFromRoot('test-foo-bar/sub-modules/test.ts');
    expect(actual).to.equal(expected);

  });

  it('should render the services templates.', () => {

    let expected = readFileFromTemplatesSpec('module/services/index.1.ts');
    let actual = readFileFromRoot('test-foo-bar/services/index.ts');
    expect(actual).to.equal(expected);

    expected = readFileFromTemplatesSpec('module/services/test.1.ts');
    actual = readFileFromRoot('test-foo-bar/services/test.ts');
    expect(actual).to.equal(expected);

  });

  it('should render the templates templates.', () => {

    let expected = readFileFromTemplatesSpec('module/controllers/templates/index.1.ts');
    let actual = readFileFromRoot('test-foo-bar/controllers/templates/index.ts');
    expect(actual).to.equal(expected);

    expected = readFileFromTemplatesSpec('module/controllers/templates/test.1.ts');
    actual = readFileFromRoot('test-foo-bar/controllers/templates/test.ts');
    expect(actual).to.equal(expected);

  });

});
