// 3p
import { expect } from 'chai';

// FoalTS
import { IModule, Module } from '../../core';
import { getMetadata } from '../../core/routes/utils';
import { subModule } from './sub-module.util';

describe('subModule util', () => {

  it('should return the given sub-module class.', () => {
    @Module()
    class Foobar implements IModule {}

    expect(subModule('', Foobar)).to.equal(Foobar);
  });

  it('should define the metadata path={path} of the sub-module class.', () => {
    @Module()
    class Foobar implements IModule {}

    subModule('/foo', Foobar);

    expect(getMetadata('path', Foobar)).to.equal('/foo');
  });

});
