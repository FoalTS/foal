import { expect } from 'chai';

import { escapeHTML } from './escape-html';

describe('escapeHTML', () => {

  it('should escape the property of the given object if it is a string.', () => {
    const o = {
      foobar: '<script>alert(\'XSS\')</script>'
    };
    escapeHTML(o, 'foobar');
    expect(o.foobar).to.equal('&lt;script&gt;alert(&#x27;XSS&#x27;)&lt;&#x2F;script&gt;');
  });

  it('should throw an error if the property is not a string (potentially undefined).', () => {
    const o = {};
    expect(() => escapeHTML(o, 'foobar')).to.throw(TypeError, 'foobar should be a string (got undefined).');
  });

});
