// std
import { strictEqual } from 'assert';

// 3p
import 'reflect-metadata';

// FoalTS
import { getHttpMethod, getMetadata, getPath, join } from './utils';

describe('getMetadata', () => {

  it('should return the class metadata if no propertyKey is given.', () => {
    @Reflect.metadata('foo', 'bar')
    class Foobar {}

    strictEqual(getMetadata('foo', Foobar), 'bar');
  });

  it('should return the method metadata if a propertyKey is given.', () => {
    class Foobar {

      @Reflect.metadata('foo', 'bar')
      barfoo() {}

    }

    strictEqual(getMetadata('foo', Foobar, 'barfoo'), 'bar');
  });

});

describe('getHttpMethod', () => {

  it('should return the class metadata "httpMethod" if no propertyKey is given.', () => {
    @Reflect.metadata('httpMethod', 'GET')
    class Foobar {}

    strictEqual(getHttpMethod(Foobar), 'GET');
  });

  it('should return the method metadata "httpMethod" if a propertyKey is given.', () => {
    class Foobar {

      @Reflect.metadata('httpMethod', 'GET')
      barfoo() {}

    }

    strictEqual(getHttpMethod(Foobar, 'barfoo'), 'GET');
  });

});

describe('getPath', () => {

  it('should return the class metadata "path" if no propertyKey is given.', () => {
    @Reflect.metadata('path', '/foo')
    class Foobar {}

    strictEqual(getPath(Foobar), '/foo');
  });

  it('should return the method metadata "path" if a propertyKey is given.', () => {
    class Foobar {

      @Reflect.metadata('path', '/foo')
      barfoo() {}

    }

    strictEqual(getPath(Foobar, 'barfoo'), '/foo');
  });

});

describe('join', () => {

  it('should join the given paths and escape duplicate slashed.', () => {
    const actual = join('/foo', 'bar/', '/foo', '/', '/bar/');

    strictEqual(actual, '/foobar/foo/bar/');
  });

  it('should ignore undefined values', () => {
    const actual = join('a', undefined, 'b', undefined, 'c');

    strictEqual(actual, 'abc');
  });

});
