// 3p
import { expect } from 'chai';

// FoalTS
import { readFileFromRoot, readFileFromTemplatesSpec, rmfileIfExists } from '../../utils';
import { createEntity } from './create-entity';

describe('createEntity', () => {

  it('should render the templates.', () => {

    createEntity({ name: 'test-fooBar' });

    const expected = readFileFromTemplatesSpec('entity/test-foo-bar.entity.1.ts');
    const actual = readFileFromRoot('test-foo-bar.entity.ts');
    expect(actual).to.equal(expected);

    rmfileIfExists('test-foo-bar.entity.ts');

  });

});
