// std
import { strictEqual } from 'assert';

// FoalTS
import { IModule } from '../../core';
import { getMetadata } from '../../core/routes/utils';
import { subModule } from './sub-module.util';

describe('subModule util', () => {

  it('should return the given sub-module class.', () => {
    class Foobar implements IModule {}

    strictEqual(subModule('', Foobar), Foobar);
  });

  it('should define the metadata path={path} of the sub-module class.', () => {
    class Foobar implements IModule {}

    subModule('/foo', Foobar);

    strictEqual(getMetadata('path', Foobar), '/foo');
  });

});
