// std
import { strictEqual, throws } from 'assert';

// FoalTS
import { renderToString } from './index';

describe('renderToString', () => {

  const template1 = 'Hi!';
  const template2 = 'Hello <%= name %>! How are you?';

  it('should return the ejs template with no locals if it is correct.', () => {
    strictEqual(renderToString(template1), template1);
  });

  it('should render the ejs template with the given locals if it is correct.', () => {
    const name = 'Foobar';
    const expected = `Hello ${name}! How are you?`;
    strictEqual(renderToString(template2, { name }), expected);
  });

  it('should throw an Error if the template and/or locals are incorrect.', () => {
    throws(() => renderToString(template2, {}));
  });

});
