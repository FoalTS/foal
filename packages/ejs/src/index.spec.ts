import { HttpResponseOK } from '@foal/core';
import { expect } from 'chai';

import { render, renderToString } from './index';

describe('renderToString', () => {

  const template1 = 'Hi!';
  const template2 = 'Hello <%= name %>! How are you?';

  it('should return the ejs template with no locals if it is correct.', () => {
    expect(renderToString(template1)).equal(template1);
  });

  it('should render the ejs template with the given locals if it is correct.', () => {
    const name = 'Foobar';
    const expected = `Hello ${name}! How are you?`;
    expect(renderToString(template2, { name })).to.equal(expected);
  });

  it('should throw an Error if the template and/or locals are incorrect.', () => {
    expect(() => renderToString(template2, {})).to.throw();
  });

});

describe('render', () => {

  const template1 = 'Hi!';
  const template2 = 'Hello <%= name %>! How are you?';

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
