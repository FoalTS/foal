// 3p
import { expect } from 'chai';
import 'reflect-metadata';

// FoalTS
import { Controller, Module } from './class';

describe('Controller', () => {

  it('should define the metadata path=${path} on the class.', () => {
    @Controller('/foo')
    class Foobar {}

    const actual = Reflect.getMetadata('path', Foobar);
    expect(actual).to.equal('/foo');
  });

});

describe('Module', () => {

  it('should define the metadata path=${path} on the class.', () => {
    @Module('/foo')
    class Foobar {}

    const actual = Reflect.getMetadata('path', Foobar);
    expect(actual).to.equal('/foo');
  });

});
