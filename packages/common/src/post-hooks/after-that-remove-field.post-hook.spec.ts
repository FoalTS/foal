import { createEmptyContext, getPostMiddleware, ServiceManager } from '@foal/core';
import { expect } from 'chai';

import { afterThatRemoveField } from './after-that-remove-field.post-hook';

describe('afterThatRemoveField(name: string)', () => {

  it('should remove the given field from context.result if it is an object.', () => {
    const middleware = getPostMiddleware(afterThatRemoveField('foo'));
    const ctx = createEmptyContext();
    ctx.result = {
      bar: 'foobar2',
      foo: 'foobar',
    };
    middleware(ctx, new ServiceManager());

    expect(ctx.result).to.deep.equal({ bar: 'foobar2' });
  });

  it('should remove the given field from each item of context.result if it is an array.', () => {
    const middleware = getPostMiddleware(afterThatRemoveField('foo'));
    const ctx = createEmptyContext();
    ctx.result = [
      {
        bar: 'foobar2',
        foo: 'foobar'
      },
      {
        bar: 'barfoo2',
        foo: 'barfoo'
      }
    ];
    middleware(ctx, new ServiceManager());

    expect(ctx.result).to.be.an('array').and.to.have.lengthOf(2);
    expect(ctx.result[0]).to.deep.equal({ bar: 'foobar2' });
    expect(ctx.result[1]).to.deep.equal({ bar: 'barfoo2' });
  });

  it('should not throw an Error if the given field does not exist on ctx.result (object).', () => {
    const middleware = getPostMiddleware(afterThatRemoveField('foo'));
    const ctx = createEmptyContext();
    ctx.result = {};
    expect(() => middleware(ctx, new ServiceManager())).not.to.throw();
  });

  it('should not throw an Error if the given field does not exist in ctx.result (array).', () => {
    const middleware = getPostMiddleware(afterThatRemoveField('foo'));
    const ctx = createEmptyContext();
    ctx.result = [{}];
    expect(() => middleware(ctx, new ServiceManager())).not.to.throw();
  });
});
