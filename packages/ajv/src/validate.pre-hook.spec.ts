import { Context, HttpResponseBadRequest, ServiceManager } from '@foal/core';
import * as Ajv from 'ajv';
import { expect } from 'chai';

import { validate } from './validate.pre-hook';

describe('validate', () => {

  it('should not return an HttpResponseBadRequest if ctx.request.body is validated '
      + ' by ajv for the given schema.', () => {
    const schema = {
      properties: {
        foo: { type: 'integer' }
      },
      type: 'object',
    };
    const hook = validate(schema);
    const ctx = new Context();
    ctx.request.body = {
      foo: 3
    };

    const actual = hook(ctx, new ServiceManager());
    expect(actual).not.to.be.instanceOf(HttpResponseBadRequest);
  });

  it('should return an HttpResponseBadRequest if ctx.request.body is not validated by '
      + ' ajv for the given schema.', () => {
    const schema = {
      properties: {
        foo: { type: 'integer' }
      },
      type: 'object',
    };
    const hook = validate(schema);

    function context(body) {
      const ctx = new Context();
      ctx.request.body = body;
      return ctx;
    }

    expect(hook(context(null), new ServiceManager())).to.be.instanceOf(HttpResponseBadRequest);
    expect(hook(context(undefined), new ServiceManager())).to.be.instanceOf(HttpResponseBadRequest);
    expect(hook(context('foo'), new ServiceManager())).to.be.instanceOf(HttpResponseBadRequest);
    expect(hook(context(3), new ServiceManager())).to.be.instanceOf(HttpResponseBadRequest);
    expect(hook(context(true), new ServiceManager())).to.be.instanceOf(HttpResponseBadRequest);
    expect(hook(context({ foo: '3' }), new ServiceManager())).to.be.instanceOf(HttpResponseBadRequest);
  });

  it('should return an HttpResponseBadRequest with a defined `content` property if '
      + 'ctx.request.body is not validated by ajv.', () => {
    const schema = {
      properties: {
        foo: { type: 'integer' }
      },
      type: 'object',
    };
    const hook = validate(schema);
    const ctx = new Context();

    const actual = hook(ctx, new ServiceManager());
    expect(actual).to.be.instanceOf(HttpResponseBadRequest);
    expect((actual as HttpResponseBadRequest).content).not.to.equal(undefined);
  });

  it('should use the given ajv instance if it exists.', () => {
    const schema = {
      properties: {
        bar: { type: 'integer', default: 4 },
        foo: { type: 'integer' },
      },
      type: 'object',
    };
    const ctx = new Context();
    ctx.request.body = {
      foo: 3,
    };

    let hook = validate(schema);
    hook(ctx, new ServiceManager());
    expect(ctx.request.body.bar).to.equal(undefined);

    hook = validate(schema, new Ajv({ useDefaults: true }));
    hook(ctx, new ServiceManager());
    expect(ctx.request.body.bar).to.equal(4);
  });

});
