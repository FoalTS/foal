// std
import { strictEqual } from 'assert';

// FoalTS
import { escape } from './escape';

describe('escape', () => {

  it('should escape &.', () => {
    const actual = escape('foo& &');
    const expected = 'foo&amp; &amp;';

    strictEqual(actual, expected);
  });

  it('should escape <.', () => {
    const actual = escape('foo< <');
    const expected = 'foo&lt; &lt;';

    strictEqual(actual, expected);
  });

  it('should escape >.', () => {
    const actual = escape('foo> >');
    const expected = 'foo&gt; &gt;';

    strictEqual(actual, expected);
  });

  it('should escape ".', () => {
    const actual = escape('foo" "');
    const expected = 'foo&quot; &quot;';

    strictEqual(actual, expected);
  });

  it('should escape \'.', () => {
    const actual = escape('foo\' \'');
    const expected = 'foo&#x27; &#x27;';

    strictEqual(actual, expected);
  });

  it('should escape /.', () => {
    const actual = escape('foo/ /');
    const expected = 'foo&#x2F; &#x2F;';

    strictEqual(actual, expected);
  });

});
