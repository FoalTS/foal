import { expect } from 'chai';

import { escape } from './escape';

describe('escape', () => {

  it('should escape &.', () => {
    const actual = escape('foo& &');
    const expected = 'foo&amp; &amp;';

    expect(actual).to.equal(expected);
  });

  it('should escape <.', () => {
    const actual = escape('foo< <');
    const expected = 'foo&lt; &lt;';

    expect(actual).to.equal(expected);
  });

  it('should escape >.', () => {
    const actual = escape('foo> >');
    const expected = 'foo&gt; &gt;';

    expect(actual).to.equal(expected);
  });

  it('should escape ".', () => {
    const actual = escape('foo" "');
    const expected = 'foo&quot; &quot;';

    expect(actual).to.equal(expected);
  });

  it('should escape \'.', () => {
    const actual = escape('foo\' \'');
    const expected = 'foo&#x27; &#x27;';

    expect(actual).to.equal(expected);
  });

  it('should escape /.', () => {
    const actual = escape('foo/ /');
    const expected = 'foo&#x2F; &#x2F;';

    expect(actual).to.equal(expected);
  });

});
