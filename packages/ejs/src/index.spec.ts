// std
import { strictEqual, throws } from 'assert';

// FoalTS
import { renderToString } from './index';

describe('renderToString', () => {

  const template = 'Hello <%= name %>! How are you?';

  it('should render the ejs template with the given locals if it is correct.', () => {
    const name = 'Foobar';
    const expected = `Hello ${name}! How are you?`;
    strictEqual(renderToString(template, { name }), expected);
  });

  it('should throw an Error if the template and/or locals are incorrect.', () => {
    throws(() => renderToString(template, {}));
  });

});
