// 3p
import { expect } from 'chai';

// FoalTS
import { readFileFromRoot, readFileFromTemplatesSpec, rmdirIfExists, rmfileIfExists } from '../../utils';
import { createModule } from './create-module';

describe('createModule', () => {

  it('should render the templates.', () => {

    createModule({ name: 'test-fooBar' });

    let expected = readFileFromTemplatesSpec('module/index.1.ts');
    let actual = readFileFromRoot('test-foo-bar/index.ts');
    expect(actual).to.equal(expected);

    expected = readFileFromTemplatesSpec('module/test-foo-bar.module.1.ts');
    actual = readFileFromRoot('test-foo-bar/test-foo-bar.module.ts');
    expect(actual).to.equal(expected);

    rmfileIfExists('test-foo-bar/index.ts');
    rmfileIfExists('test-foo-bar/test-foo-bar.module.ts');
    rmdirIfExists('test-foo-bar');

  });

});
