// 3p
import { expect } from 'chai';
import 'reflect-metadata';

// FoalTS
import { Controller } from './controllers';

describe('Controller', () => {

  it('should define the metadata path=${path} on the class.', () => {
    @Controller('/foo')
    class Foobar {}

    const actual = Reflect.getMetadata('path', Foobar);
    expect(actual).to.equal('/foo');
  });

});
