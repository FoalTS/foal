import { strictEqual } from 'assert';
import { FormatError } from './format-error.decorator';

describe('FormatError', () => {

  it('should wrap the method with the given function formatError.', () => {
    class Foobar {
      @FormatError(err => new Error(err.message + '!!!'))
      async foo() {
        throw new Error('hello');
      }
    }

    const foobar = new Foobar();
    return foobar.foo()
      .catch(err => strictEqual(err.message, 'hello!!!'));

  });

});
