import {
  createEmptyPostContext,
  HttpResponseBadRequest,
  HttpResponseOK,
  ServiceManager,
} from '@foal/core';
import { expect } from 'chai';

import { afterThatRemoveField } from './after-that-remove-field.post-hook';

describe('afterThatRemoveField', () => {

  it('should not throw an Error if ctx.response is undefined.', () => {
    const postHook = afterThatRemoveField('foo');
    const ctx = createEmptyPostContext();

    expect(() => postHook(ctx, new ServiceManager())).not.to.throw();
  });

  it('should not throw an Error if ctx.response.content is undefined.', () => {
    const postHook = afterThatRemoveField('foo');
    const ctx = createEmptyPostContext();
    ctx.response = new HttpResponseOK();

    expect(() => postHook(ctx, new ServiceManager())).not.to.throw();
  });

  it('should not modify ctx.response.content if ctx.response is not an instance'
      + ' of HttpResponseSuccess.', () => {
    const postHook = afterThatRemoveField('foo');
    const ctx = createEmptyPostContext();
    ctx.response = new HttpResponseBadRequest({
      foo: 'bar'
    });

    postHook(ctx, new ServiceManager());

    expect(ctx.response.content).to.deep.equal({ foo: 'bar' });
  });

  it('should not throw an Error if ctx.response is an instance of HttpResponseSuccess'
      + ' and the object ctx.response.content does not have the given field.', () => {
    const postHook = afterThatRemoveField('foo');
    const ctx = createEmptyPostContext();
    ctx.response = new HttpResponseOK({});

    expect(() => postHook(ctx, new ServiceManager())).not.to.throw();
  });

  it('should not throw an Error if ctx.response is an instance of HttpResponseSuccess'
      + ' and one item of the array ctx.response.content does not have the given field.', () => {
    const postHook = afterThatRemoveField('foo');
    const ctx = createEmptyPostContext();
    ctx.response = new HttpResponseOK([{}]);
    expect(() => postHook(ctx, new ServiceManager())).not.to.throw();
  });

  it('should remove the given field from the object context.response.content if context.response'
      + ' is an instance of HttpResponseSuccess.', () => {
    const postHook = afterThatRemoveField('foo');
    const ctx = createEmptyPostContext();
    ctx.response = new HttpResponseOK({
      bar: 'foobar2',
      foo: 'foobar',
    });
    postHook(ctx, new ServiceManager());

    expect(ctx.response.content).to.deep.equal({ bar: 'foobar2' });
  });

  it('should remove the given field from each item of the array context.response.content if'
      + ' context.response is an instance of HttpResponseSuccess.', () => {
    const postHook = afterThatRemoveField('foo');
    const ctx = createEmptyPostContext();
    ctx.response = new HttpResponseOK([
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

    expect(ctx.response.content).to.be.an('array').and.to.have.lengthOf(2);
    expect(ctx.response.content[0]).to.deep.equal({ bar: 'foobar2' });
    expect(ctx.response.content[1]).to.deep.equal({ bar: 'barfoo2' });
  });
});
