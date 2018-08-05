// std
import { strictEqual } from 'assert';

// 3p
import 'reflect-metadata';

// FoalTS
import { Controller } from './controllers';

describe('Controller', () => {

  it('should define the metadata path=${path} on the class.', () => {
    @Controller('/foo')
    class Foobar {}

    const actual = Reflect.getOwnMetadata('path', Foobar);
    strictEqual(actual, '/foo');
  });

});
