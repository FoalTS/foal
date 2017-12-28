import { expect } from 'chai';
import 'reflect-metadata';

import { defineMetadata, getMetadata } from './metadatas';

describe('defineMetadata(metadataKey: any, metadataValue: any, target: any, '
    + 'propertyKey: string|undefined): any', () => {

  it('should add the given metadata to the class if the propertyKey is undefined.', () => {
    class Foobar {}
    defineMetadata('foo', 'my metadata', Foobar, undefined);

    expect(Reflect.getMetadata('foo', Foobar)).to.equal('my metadata');
  });

  it('should add the given metadata to the method if the propertyKey is defined.', () => {
    class Foobar {
      public bar() {}
    }
    defineMetadata('foo', 'my metadata', Foobar, 'bar');

    expect(Reflect.getMetadata('foo', Foobar, 'bar')).to.equal('my metadata');
  });

});

describe('getMetadata(metadataKey: any, target: any, propertyKey: string|undefined): any', () => {

  it('should get the given metadata from the class if the propertyKey is undefined.', () => {
    class Foobar {}
    Reflect.defineMetadata('foo', 'my metadata', Foobar);

    expect(getMetadata('foo', Foobar, undefined)).to.equal('my metadata');
  });

  it('should get the given metadata from the method if the propertyKey is defined.', () => {
    class Foobar {
      public bar() {}
    }
    Reflect.defineMetadata('foo', 'my metadata', Foobar, 'bar');

    expect(getMetadata('foo', Foobar, 'bar')).to.equal('my metadata');
  });

});
