// std
import { deepStrictEqual, strictEqual } from 'assert';

// 3p
import { Context, getHookFunction, isHttpResponseBadRequest, ServiceManager } from '@foal/core';
import { Expose } from 'class-transformer';

// FoalTS
import { UnserializeBody } from './unserialize-body.hook';

describe('UnserializeBody', () => {

  class Product {}

  it('should return an HttpResponseBadRequest instance if ctx.request.body is not an object.', () => {
    const hook = getHookFunction(UnserializeBody(Product));
    const ctx = new Context({});
    ctx.request.body = 3;

    const actual = hook(ctx, new ServiceManager());
    if (!isHttpResponseBadRequest(actual)) {
      throw new Error('The hook should have returned an HttpResponseBadRequest instance.');
    }
    deepStrictEqual(actual.body, {
      message: 'The request body should be a valid JSON object or array.'
    });

    const ctx2 = new Context({});
    ctx2.request.body = null;

    const actual2 = hook(ctx2, new ServiceManager());
    if (!isHttpResponseBadRequest(actual2)) {
      throw new Error('The hook should have returned an HttpResponseBadRequest instance.');
    }
    deepStrictEqual(actual2.body, {
      message: 'The request body should be a valid JSON object or array.'
    });
  });

  it('should unserialize the request body (plain object).', () => {
    const hook = getHookFunction(UnserializeBody(Product));
    const ctx = new Context({});
    ctx.request.body = {
      foo: 3
    };

    hook(ctx, new ServiceManager());

    strictEqual(ctx.request.body instanceof Product, true);
    deepStrictEqual(ctx.request.body, Object.assign(new Product(), {
      foo: 3
    }));
  });

  it('should unserialize the request body (plain object & options).', () => {
    class Product {
      @Expose() id: number;
      @Expose() firstName: string;
      @Expose() lastName: string;
    }

    const hook = getHookFunction(UnserializeBody(Product, { excludeExtraneousValues: true }));
    const ctx = new Context({});
    ctx.request.body = {
      firstName: 'Kelly',
      lastName: 'Smith',
      unkownProp: 'hello there',
    };

    hook(ctx, new ServiceManager());

    strictEqual(ctx.request.body instanceof Product, true);
    deepStrictEqual(ctx.request.body, Object.assign(new Product(), {
      firstName: 'Kelly',
      id: undefined,
      lastName: 'Smith',
    }));
  });

  it('should unserialize the request body (array of plain objects).', () => {
    const hook = getHookFunction(UnserializeBody(Product));
    const ctx = new Context({});
    ctx.request.body = [
      {
        foo: 4
      },
      {
        foo: 3
      }
    ];

    hook(ctx, new ServiceManager());

    strictEqual(ctx.request.body[0] instanceof Product, true);
    deepStrictEqual(ctx.request.body[0], Object.assign(new Product(), {
      foo: 4
    }));
    strictEqual(ctx.request.body[1] instanceof Product, true);
    deepStrictEqual(ctx.request.body[1], Object.assign(new Product(), {
      foo: 3
    }));
  });

});
