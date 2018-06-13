import { expect } from 'chai';

import {
  HttpResponseBadRequest,
  HttpResponseOK,
  PostContext,
  ServiceManager,
} from '../../core';
import { onSuccessKeepFields } from './on-success-keep-fields.post-hook';

describe('onSuccessKeepFields', () => {

  it('should not throw an Error if ctx.response is undefined.', () => {
    const postHook = onSuccessKeepFields(['foo']);
    const ctx = new PostContext();

    expect(() => postHook(ctx, new ServiceManager())).not.to.throw();
  });

  it('should not throw an Error if ctx.response.content is undefined.', () => {
    const postHook = onSuccessKeepFields(['foo']);
    const ctx = new PostContext();
    ctx.response = new HttpResponseOK();

    expect(() => postHook(ctx, new ServiceManager())).not.to.throw();
  });

  it('should not modify ctx.response.content if ctx.response is not an instance'
      + ' of HttpResponseSuccess.', () => {
    const postHook = onSuccessKeepFields(['foo']);
    const ctx = new PostContext();
    ctx.response = new HttpResponseBadRequest({
      bar: 'foobar2',
      foo: 'bar',
    });

    postHook(ctx, new ServiceManager());

    expect(ctx.response.content).to.deep.equal({
      bar: 'foobar2',
      foo: 'bar',
    });
  });

  it('should create a new response.content with the given fields if context.response'
      + ' is an instance of HttpResponseSuccess (object).', () => {
    const postHook = onSuccessKeepFields([ 'bar', 'foobar' ]);
    const ctx = new PostContext();
    const content = {
      bar: 'foobar2',
      foo: 'foobar',
    };
    ctx.response = new HttpResponseOK(content);
    postHook(ctx, new ServiceManager());

    expect(ctx.response.content).not.to.equal(content);
    expect(ctx.response.content).to.deep.equal({ bar: 'foobar2' });
  });

  it('should create a new response.content with the given fields if context.response'
      + ' is an instance of HttpResponseSuccess (array).', () => {
    const postHook = onSuccessKeepFields([ 'bar', 'foobar' ]);
    const ctx = new PostContext();
    const item1 = {
      bar: 'foobar2',
      foo: 'foobar'
    };
    const item2 = {
      bar: 'barfoo2',
      foo: 'barfoo'
    };
    ctx.response = new HttpResponseOK([ item1, item2 ]);
    postHook(ctx, new ServiceManager());
    console.log(ctx.response.content);
    expect(ctx.response.content).to.be.an('array').and.to.have.lengthOf(2);
    expect(ctx.response.content[0]).not.to.equal(item1);
    expect(ctx.response.content[0]).to.deep.equal({ bar: 'foobar2' });
    expect(ctx.response.content[1]).not.to.equal(item2);
    expect(ctx.response.content[1]).to.deep.equal({ bar: 'barfoo2' });
  });
});
