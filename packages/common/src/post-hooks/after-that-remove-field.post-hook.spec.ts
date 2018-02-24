import { createEmptyContext, ServiceManager } from '@foal/core';
import { expect } from 'chai';

import { afterThatRemoveField } from './after-that-remove-field.post-hook';

describe('afterThatRemoveField(name: string)', () => {

  it('should remove the given field from context.result if it is an object.', () => {
    const hook = afterThatRemoveField('foo');
    const ctx = createEmptyContext();
    ctx.result = {
      bar: 'foobar2',
      foo: 'foobar',
    };
    hook(ctx, new ServiceManager());

    expect(ctx.result).to.deep.equal({ bar: 'foobar2' });
  });

  it('should remove the given field from each item of context.result if it is an array.', () => {
    const hook = afterThatRemoveField('foo');
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
    hook(ctx, new ServiceManager());

    expect(ctx.result).to.be.an('array').and.to.have.lengthOf(2);
    expect(ctx.result[0]).to.deep.equal({ bar: 'foobar2' });
    expect(ctx.result[1]).to.deep.equal({ bar: 'barfoo2' });
  });

  it('should not throw an Error if the given field does not exist on ctx.result (object).', () => {
    const hook = afterThatRemoveField('foo');
    const ctx = createEmptyContext();
    ctx.result = {};
    expect(() => hook(ctx, new ServiceManager())).not.to.throw();
  });

  it('should not throw an Error if the given field does not exist in ctx.result (array).', () => {
    const hook = afterThatRemoveField('foo');
    const ctx = createEmptyContext();
    ctx.result = [{}];
    expect(() => hook(ctx, new ServiceManager())).not.to.throw();
  });
});
