// 3p
import { expect } from 'chai';
import 'reflect-metadata';

// FoalTS
import { Module } from './modules';

describe('Module', () => {

  it('should define the metadata path=${path} on the class.', () => {
    @Module('/foo')
    class Foobar {}

    const actual = Reflect.getOwnMetadata('path', Foobar);
    expect(actual).to.equal('/foo');
  });

});
