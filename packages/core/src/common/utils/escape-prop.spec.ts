// std
import { strictEqual, throws } from 'assert';

// FoalTS
import { escapeProp } from './escape-prop';

describe('escapeProp', () => {

  it('should escape the property of the given object if it is a string.', () => {
    const o = {
      foobar: '<script>alert(\'XSS\')</script>'
    };
    escapeProp(o, 'foobar');
    strictEqual(o.foobar, '&lt;script&gt;alert(&#x27;XSS&#x27;)&lt;&#x2F;script&gt;');
  });

  it('should throw an error if the property is not a string (potentially undefined).', () => {
    const o = {};
    throws(
      () => escapeProp(o, 'foobar'),
      err => err instanceof TypeError && err.message === 'foobar should be a string (got undefined).',
    );
  });

});
