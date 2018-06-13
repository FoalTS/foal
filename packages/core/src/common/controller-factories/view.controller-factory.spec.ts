import { expect } from 'chai';

import { Context, HttpResponseOK, ServiceManager } from '../../core';
import { render, view } from './view.controller-factory';

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

describe('view', () => {

  describe('should return a controller with one "main" route that', () => {

    it('should respond to the GET /${path} requests', () => {
      const controller = view('/foo', template1, {});
      expect(controller.getRoute('main').path).to.equal('/foo');
      expect(controller.getRoute('main').httpMethod).to.equal('GET');
    });

    it('should render the ejs template (HttpResponseOK) with the given locals (object).', () => {
      const name = 'Foobar';
      const expected = `Hello ${name}! How are you?`;

      const controller = view('/foo', template2, { name });
      expect(controller.getRoute('main').handler(new Context(), new ServiceManager()))
        .to.be.an.instanceOf(HttpResponseOK)
        .with.property('content', expected);
    });

    it('should render the ejs template (HttpResponseOK) with the given locals (function).', () => {
      const name = 'Foobar';
      const expected = `Hello ${name}! How are you?`;
      const ctx = new Context();
      ctx.state = { name };

      const controller = view('/foo', template2, ctx => ctx.state);
      expect(controller.getRoute('main').handler(ctx, new ServiceManager()))
        .to.be.an.instanceOf(HttpResponseOK)
        .with.property('content', expected);
    });

  });

});
