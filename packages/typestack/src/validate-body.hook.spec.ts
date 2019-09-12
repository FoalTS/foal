// std
import { deepStrictEqual, strictEqual } from 'assert';

// 3p
import { Context, getHookFunction, isHttpResponseBadRequest, ServiceManager } from '@foal/core';
import { Expose } from 'class-transformer';
import { IsDefined, IsNumber, Min } from 'class-validator';

// FoalTS
import { ValidateBody } from './validate-body.hook';

describe('ValidateBody', () => {

  class Product {}

  it('should return an HttpResponseBadRequest instance if ctx.request.body is not an object.', async () => {
    const hook = getHookFunction(ValidateBody(Product));
    const ctx = new Context({});
    ctx.request.body = 3;

    const actual = await hook(ctx, new ServiceManager());
    if (!isHttpResponseBadRequest(actual)) {
      throw new Error('The hook should have returned an HttpResponseBadRequest instance.');
    }
    deepStrictEqual(actual.body, {
      message: 'The request body should be a valid JSON object or array.'
    });

    const ctx2 = new Context({});
    ctx2.request.body = null;

    const actual2 = await hook(ctx2, new ServiceManager());
    if (!isHttpResponseBadRequest(actual2)) {
      throw new Error('The hook should have returned an HttpResponseBadRequest instance.');
    }
    deepStrictEqual(actual2.body, {
      message: 'The request body should be a valid JSON object or array.'
    });
  });

  it('should unserialize the request body (plain object).', async () => {
    const hook = getHookFunction(ValidateBody(Product));
    const ctx = new Context({});
    ctx.request.body = {
      foo: 3
    };

    await hook(ctx, new ServiceManager());

    strictEqual(ctx.request.body instanceof Product, true);
    deepStrictEqual(ctx.request.body, Object.assign(new Product(), {
      foo: 3
    }));
  });

  it('should unserialize the request body (plain object & options).', async () => {
    class Product {
      @Expose() id: number;
      @Expose() firstName: string;
      @Expose() lastName: string;
    }

    const hook = getHookFunction(ValidateBody(Product, {
      transformer: {  excludeExtraneousValues: true  }
    }));
    const ctx = new Context({});
    ctx.request.body = {
      firstName: 'Kelly',
      lastName: 'Smith',
      unkownProp: 'hello there',
    };

    await hook(ctx, new ServiceManager());

    strictEqual(ctx.request.body instanceof Product, true);
    deepStrictEqual(ctx.request.body, Object.assign(new Product(), {
      firstName: 'Kelly',
      id: undefined,
      lastName: 'Smith',
    }));
  });

  it('should unserialize the request body (array of plain objects).', async () => {
    const hook = getHookFunction(ValidateBody(Product));
    const ctx = new Context({});
    ctx.request.body = [
      {
        foo: 4
      },
      {
        foo: 3
      }
    ];

    await hook(ctx, new ServiceManager());

    strictEqual(ctx.request.body[0] instanceof Product, true);
    deepStrictEqual(ctx.request.body[0], Object.assign(new Product(), {
      foo: 4
    }));
    strictEqual(ctx.request.body[1] instanceof Product, true);
    deepStrictEqual(ctx.request.body[1], Object.assign(new Product(), {
      foo: 3
    }));
  });

  describe('should validate the request body and', () => {

    class Product {
      @IsNumber()
      foo: number;
    }

    it('return an HttpResponseBadRequest instance if the validation fails (plain object).', async () => {
      const hook = getHookFunction(ValidateBody(Product));
      const ctx = new Context({});
      ctx.request.body = {
        foo: 'hello'
      };

      const actual = await hook(ctx, new ServiceManager());
      if (!isHttpResponseBadRequest(actual)) {
        throw new Error('The hook should have returned an HttpResponseBadRequest instance.');
      }
      if (!Array.isArray(actual.body)) {
        throw new Error('The hook should have returned the errors');
      }
      strictEqual(actual.body.length, 1);
    });

    it('return an HttpResponseBadRequest instance if the validation fails (plain object & options).', async () => {
      class Product {
        @Min(10, {
          groups: [ 'a' ]
        })
        foo: number;

        @Min(10)
        bar: number;
      }
      const hook = getHookFunction(ValidateBody(Product, {
        validator: { groups: [ 'a' ] }
      }));
      const ctx = new Context({});
      ctx.request.body = {
        bar: 3,
        foo: 3,
      };

      const actual = await hook(ctx, new ServiceManager());
      if (!isHttpResponseBadRequest(actual)) {
        throw new Error('The hook should have returned an HttpResponseBadRequest instance.');
      }
      if (!Array.isArray(actual.body)) {
        throw new Error('The hook should have returned the errors');
      }
      strictEqual(actual.body.length, 1);
    });

    it('return nothing if the validation succeeds.', async () => {
      const hook = getHookFunction(ValidateBody(Product));
      const ctx = new Context({});
      ctx.request.body = {
        foo: 13
      };

      const actual = await hook(ctx, new ServiceManager());
      strictEqual(actual, undefined);
    });

  });

});
