// std
import { strictEqual } from 'assert';

// FoalTS
import { dotToUnderscore } from './utils';

describe('dotToUnderscore', () => {

  it('should properly convert dot keys to underscore keys.', () => {
    const actual = dotToUnderscore('test.foo.fooBar.barFoo1');
    const expected = 'TEST_FOO_FOO_BAR_BAR_FOO1';

    strictEqual(actual, expected);
  });

});
