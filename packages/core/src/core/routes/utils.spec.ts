// 3p
import { expect } from 'chai';
import 'reflect-metadata';

// FoalTS
import { getMetadata, join } from './utils';

describe('getMetadata', () => {

  it('should return the metadata class if no propertyKey is given.', () => {
    @Reflect.metadata('foo', 'bar')
    class Foobar {}

    expect(getMetadata('foo', Foobar)).to.equal('bar');
  });

  it('should return the metadata method if a propertyKey is given.', () => {
    class Foobar {

      @Reflect.metadata('foo', 'bar')
      barfoo() {}

    }

    expect(getMetadata('foo', Foobar, 'barfoo')).to.equal('bar');
  });

});

describe('join', () => {

  it('should join the given paths and escape duplicate slashed.', () => {
    const actual = join('/foo', 'bar/', '/foo', '/', '/bar/');

    expect(actual).to.equal('/foobar/foo/bar/');
  });

});
