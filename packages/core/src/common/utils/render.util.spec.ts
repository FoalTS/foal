// std
import { ok, strictEqual, throws } from 'assert';

// FoalTS
import { HttpResponseOK } from '../../core';
import { render } from './render.util';

const template1 = 'Hi!';
const template2 = 'Hello <%= name %>! How are you?';

describe('render', () => {

  it('should return the ejs template (HttpResponseOK) with no locals if it is correct.', () => {
    const actual = render(template1);
    ok(actual instanceof HttpResponseOK);
    strictEqual(actual.content, template1);
  });

  it('should render the ejs template (HttpResponseOK) with the given locals if it is correct.', () => {
    const name = 'Foobar';
    const expected = `Hello ${name}! How are you?`;
    const actual = render(template2, { name });
    ok(actual instanceof HttpResponseOK);
    strictEqual(actual.content, expected);
  });

  it('should throw an Error if the template and/or locals are incorrect.', () => {
    throws(() => render(template2, {}));
  });

});
