// 3p
import { expect } from 'chai';
import 'reflect-metadata';

// FoalTS
import { getHttpMethod, getMetadata, getPath, join } from './utils';

describe('getMetadata', () => {

  it('should return the class metadata if no propertyKey is given.', () => {
    @Reflect.metadata('foo', 'bar')
    class Foobar {}

    expect(getMetadata('foo', Foobar)).to.equal('bar');
  });

  it('should return the method metadata if a propertyKey is given.', () => {
    class Foobar {

      @Reflect.metadata('foo', 'bar')
      barfoo() {}

    }

    expect(getMetadata('foo', Foobar, 'barfoo')).to.equal('bar');
  });

});

describe('getHttpMethod', () => {

  it('should return the class metadata "httpMethod" if no propertyKey is given.', () => {
    @Reflect.metadata('httpMethod', 'GET')
    class Foobar {}

    expect(getHttpMethod(Foobar)).to.equal('GET');
  });

  it('should return the method metadata "httpMethod" if a propertyKey is given.', () => {
    class Foobar {

      @Reflect.metadata('httpMethod', 'GET')
      barfoo() {}

    }

    expect(getHttpMethod(Foobar, 'barfoo')).to.equal('GET');
  });

});

describe('getPath', () => {

  it('should return the class metadata "path" if no propertyKey is given.', () => {
    @Reflect.metadata('path', '/foo')
    class Foobar {}

    expect(getPath(Foobar)).to.equal('/foo');
  });

  it('should return the method metadata "path" if a propertyKey is given.', () => {
    class Foobar {

      @Reflect.metadata('path', '/foo')
      barfoo() {}

    }

    expect(getPath(Foobar, 'barfoo')).to.equal('/foo');
  });

});

describe('join', () => {

  it('should join the given paths and escape duplicate slashed.', () => {
    const actual = join('/foo', 'bar/', '/foo', '/', '/bar/');

    expect(actual).to.equal('/foobar/foo/bar/');
  });

  it('should ignore undefined values', () => {
    const actual = join('a', undefined, 'b', undefined, 'c');

    expect(actual).to.equal('abc');
  });

});
