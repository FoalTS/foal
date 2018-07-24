import { expect } from 'chai';

import { HttpResponseOK } from '../../core';
import { render } from './render.util';

const template1 = 'Hi!';
const template2 = 'Hello <%= name %>! How are you?';

describe('render', () => {

  it('should return the ejs template (HttpResponseOK) with no locals if it is correct.', () => {
    expect(render(template1))
      .to.be.an.instanceOf(HttpResponseOK)
      .with.property('content', template1);
  });

  it('should render the ejs template (HttpResponseOK) with the given locals if it is correct.', () => {
    const name = 'Foobar';
    const expected = `Hello ${name}! How are you?`;
    expect(render(template2, { name }))
      .to.be.an.instanceOf(HttpResponseOK)
      .with.property('content', expected);
  });

  it('should throw an Error if the template and/or locals are incorrect.', () => {
    expect(() => render(template2, {})).to.throw();
  });

});
