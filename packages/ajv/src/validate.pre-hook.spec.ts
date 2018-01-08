import { BadRequestError, createEmptyContext, getPreMiddleware, ServiceManager } from '@foal/core';
import * as Ajv from 'ajv';
import { expect } from 'chai';

import { validate } from './validate.pre-hook';

describe('validate(schema: ObjectType, ajv = defaultInstance)', () => {

  it('should not throw any errors if ctx.body is validated by ajv for the given schema.', () => {
    const schema = {
      properties: {
        foo: { type: 'integer' }
      },
      type: 'object',
    };
    const middleware = getPreMiddleware(validate(schema));
    const ctx = createEmptyContext();
    ctx.body = {
      foo: 3
    };

    expect(() => middleware(ctx, new ServiceManager())).not.to.throw();
  });

  it('should throw a BadRequestError if ctx.body is not validated by ajv for the given schema.', () => {
    const schema = {
      properties: {
        foo: { type: 'integer' }
      },
      type: 'object',
    };
    const middleware = getPreMiddleware(validate(schema));
    const ctx = createEmptyContext();

    function context(body) {
      return { ...ctx, body };
    }

    expect(() => middleware(context(null), new ServiceManager())).to.throw(BadRequestError);
    expect(() => middleware(context(undefined), new ServiceManager())).to.throw(BadRequestError);
    expect(() => middleware(context('foo'), new ServiceManager())).to.throw(BadRequestError);
    expect(() => middleware(context(3), new ServiceManager())).to.throw(BadRequestError);
    expect(() => middleware(context(true), new ServiceManager())).to.throw(BadRequestError);
    expect(() => middleware(context({ foo: '3' }), new ServiceManager())).to.throw(BadRequestError);
  });

  it('should throw an Error with a `details` property if ctx.body is not validated by ajv.', () => {
    const schema = {
      properties: {
        foo: { type: 'integer' }
      },
      type: 'object',
    };
    const middleware = getPreMiddleware(validate(schema));
    const ctx = createEmptyContext();

    expect(() => middleware(ctx, new ServiceManager())).to.throw(Error).with.property('details');
  });

  it('should use the given ajv instance if it exists.', () => {
    const schema = {
      properties: {
        bar: { type: 'integer', default: 4 },
        foo: { type: 'integer' },
      },
      type: 'object',
    };
    const ctx = createEmptyContext();
    ctx.body = {
      foo: 3,
    };

    let middleware = getPreMiddleware(validate(schema));
    middleware(ctx, new ServiceManager());
    expect(ctx.body.bar).to.equal(undefined);

    middleware = getPreMiddleware(validate(schema, new Ajv({ useDefaults: true })));
    middleware(ctx, new ServiceManager());
    expect(ctx.body.bar).to.equal(4);
  });

});
