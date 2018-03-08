import {
  createEmptyPostContext,
  HttpResponseBadRequest,
  HttpResponseOK,
  ServiceManager,
} from '@foal/core';
import { expect } from 'chai';

import { afterThatRemoveField } from './after-that-remove-field.post-hook';

describe('afterThatRemoveField', () => {

  it('should not throw an Error if ctx.result is undefined.', () => {
    const postHook = afterThatRemoveField('foo');
    const ctx = createEmptyPostContext();

    expect(() => postHook(ctx, new ServiceManager())).not.to.throw();
  });

  it('should not throw an Error if ctx.result.content is undefined.', () => {
    const postHook = afterThatRemoveField('foo');
    const ctx = createEmptyPostContext();
    ctx.result = new HttpResponseOK();

    expect(() => postHook(ctx, new ServiceManager())).not.to.throw();
  });

  it('should not modify ctx.result.content if ctx.result is not an instance'
      + ' of HttpResponseSuccess.', () => {
    const postHook = afterThatRemoveField('foo');
    const ctx = createEmptyPostContext();
    ctx.result = new HttpResponseBadRequest({
      foo: 'bar'
    });

    postHook(ctx, new ServiceManager());

    expect(ctx.result.content).to.deep.equal({ foo: 'bar' });
  });

  it('should not throw an Error if ctx.result is an instance of HttpResponseSuccess'
      + ' and the object ctx.result.content does not have the given field.', () => {
    const postHook = afterThatRemoveField('foo');
    const ctx = createEmptyPostContext();
    ctx.result = new HttpResponseOK({});

    expect(() => postHook(ctx, new ServiceManager())).not.to.throw();
  });

  it('should not throw an Error if ctx.result is an instance of HttpResponseSuccess'
      + ' and one item of the array ctx.result.content does not have the given field.', () => {
    const postHook = afterThatRemoveField('foo');
    const ctx = createEmptyPostContext();
    ctx.result = new HttpResponseOK([{}]);
    expect(() => postHook(ctx, new ServiceManager())).not.to.throw();
  });

  it('should remove the given field from the object context.result.content if context.result'
      + ' is an instance of HttpResponseSuccess.', () => {
    const postHook = afterThatRemoveField('foo');
    const ctx = createEmptyPostContext();
    ctx.result = new HttpResponseOK({
      bar: 'foobar2',
      foo: 'foobar',
    });
    postHook(ctx, new ServiceManager());

    expect(ctx.result.content).to.deep.equal({ bar: 'foobar2' });
  });

  it('should remove the given field from each item of the array context.result.content if'
      + ' context.result is an instance of HttpResponseSuccess.', () => {
    const postHook = afterThatRemoveField('foo');
    const ctx = createEmptyPostContext();
    ctx.result = new HttpResponseOK([
      {
        bar: 'foobar2',
        foo: 'foobar'
      },
      {
        bar: 'barfoo2',
        foo: 'barfoo'
      }
    ]);
    postHook(ctx, new ServiceManager());

    expect(ctx.result.content).to.be.an('array').and.to.have.lengthOf(2);
    expect(ctx.result.content[0]).to.deep.equal({ bar: 'foobar2' });
    expect(ctx.result.content[1]).to.deep.equal({ bar: 'barfoo2' });
  });
});
