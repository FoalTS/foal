import {
  createEmptyPostContext,
  Handler,
  HttpResponse,
  HttpResponseBadRequest,
  PostHook,
  PreHook,
  ServiceManager,
} from '@foal/core';
import { expect } from 'chai';

import { getResponse } from './get-response';

describe('getResponse', () => {

  it('should execute the pre-hooks, the handler and the post-hooks in the right order.', async () => {
    const ctx = createEmptyPostContext();
    ctx.state = { text: '' };

    const preHook1: PreHook = ctx => { ctx.state.text += 'a'; };
    const preHook2: PreHook = async ctx => { ctx.state.text += 'b'; };
    const handler: Handler = async ctx => { ctx.state.text += 'c'; };
    const postHook1: PostHook = ctx => { ctx.state.text += 'd'; };
    const postHook2: PostHook = async ctx => { ctx.state.text += 'e'; };

    await getResponse({
      handler,
      httpMethod: 'GET',
      path: '',
      postHooks: [
        postHook1,
        postHook2
      ],
      preHooks: [
        preHook1,
        preHook2
      ],
    }, ctx, new ServiceManager());

    expect(ctx.state.text).to.equal('abcde');
  });

  it('should stop the execution of the remaining pre-hooks and the handler if an HttpResponse is '
     + 'returned by a pre-hook. This response should be assigned to the context result.', async () => {
      const ctx = createEmptyPostContext();
      ctx.state = { text: '' };
      const response = new HttpResponseBadRequest();
      let resultInPostHook: undefined | HttpResponse;

      const preHook1: PreHook = async ctx => { ctx.state.text += 'a'; };
      const preHook2: PreHook = ctx => response;
      const preHook3: PreHook = async ctx => { ctx.state.text += 'b'; };
      const handler: Handler = async ctx => { ctx.state.text += 'c'; };
      const postHook1: PostHook = ctx => {
        resultInPostHook = ctx.result;
        ctx.state.text += 'd';
      };
      const postHook2: PostHook = async ctx => { ctx.state.text += 'e'; };

      await getResponse({
        handler,
        httpMethod: 'GET',
        path: '',
        postHooks: [
          postHook1,
          postHook2
        ],
        preHooks: [
          preHook1,
          preHook2,
          preHook3
        ],
      }, ctx, new ServiceManager());

      expect(ctx.state.text).to.equal('ade');
      expect(resultInPostHook).to.equal(response);
      expect(ctx.result).to.equal(response);
  });

  it('should return the context result.', async () => {
    const ctx = createEmptyPostContext();
    ctx.result = new HttpResponseBadRequest();

    const expected = ctx.result;
    const actual = await getResponse({
      handler: () => {},
      httpMethod: 'GET',
      path: '',
      postHooks: [],
      preHooks: [],
    }, ctx, new ServiceManager());

    expect(actual).to.equal(expected);
  });

});
