import { expect } from 'chai';

import { Context, getHttpMethod, getPath, HttpResponseOK, ServiceManager } from '../../core';
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

  describe('should return a controller with a "render" method that', () => {

    it('should handle requests at GET /${path}.', () => {
      const controllerClass = view('/foo', template1, {});
      expect(getHttpMethod(controllerClass, 'render')).to.equal('GET');
      expect(getPath(controllerClass, 'render')).to.equal('/foo');
    });

    it('should render the ejs template (HttpResponseOK) with the given locals (object).', () => {
      const name = 'Foobar';
      const expected = `Hello ${name}! How are you?`;

      const controllerClass = view('/foo', template2, { name });
      const controller = new controllerClass();

      const ctx = new Context({});

      expect(controller.render(ctx))
        .to.be.an.instanceOf(HttpResponseOK)
        .with.property('content', expected);
    });

    it('should render the ejs template (HttpResponseOK) with the given locals (function).', () => {
      const name = 'Foobar';
      const expected = `Hello ${name}! How are you?`;

      const controllerClass = view('/foo', template2, ctx => ctx.state);
      const controller = new controllerClass();

      const ctx = new Context({});
      ctx.state = { name };

      expect(controller.render(ctx))
        .to.be.an.instanceOf(HttpResponseOK)
        .with.property('content', expected);
    });

  });

});
