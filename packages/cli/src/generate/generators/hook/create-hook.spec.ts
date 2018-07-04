// 3p
import { expect } from 'chai';

// FoalTS
import { readFileFromRoot, readFileFromTemplatesSpec, rmfileIfExists } from '../../utils';
import { createHook } from './create-hook';

describe('createHook', () => {

  afterEach(() => rmfileIfExists('test-foo-bar.hook.ts'));

  it('should render the templates.', () => {

    createHook({ name: 'test-fooBar' });

    const expected = readFileFromTemplatesSpec('hook/test-foo-bar.hook.1.ts');
    const actual = readFileFromRoot('test-foo-bar.hook.ts');
    expect(actual).to.equal(expected);

  });

});
