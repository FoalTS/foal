import { expect } from 'chai';

import {
  Handler,
  HttpResponse,
  HttpResponseBadRequest,
  HttpResponseOK,
  PostContext,
  PostHook,
  PreHook,
  ServiceManager,
} from '../../core';
import { getResponse } from './get-response';

describe('getResponse', () => {

  it('should execute the pre-hooks, the handler and the post-hooks in the right order.', async () => {
    const ctx = new PostContext();
    ctx.state = { text: '' };

    const preHook1: PreHook = ctx => { ctx.state.text += 'a'; };
    const preHook2: PreHook = async ctx => { ctx.state.text += 'b'; };
    const handler: Handler = async ctx => {
      ctx.state.text += 'c';
      return new HttpResponseOK();
    };
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
     + 'returned by a pre-hook. This response should be assigned to the context response.', async () => {
      const ctx = new PostContext();
      ctx.state = { text: '' };
      const response = new HttpResponseBadRequest();
      let responseInPostHook: undefined | HttpResponse;

      const preHook1: PreHook = async ctx => { ctx.state.text += 'a'; };
      const preHook2: PreHook = ctx => response;
      const preHook3: PreHook = async ctx => { ctx.state.text += 'b'; };
      const handler: Handler = async ctx => {
        ctx.state.text += 'c';
        return new HttpResponseOK();
      };
      const postHook1: PostHook = ctx => {
        responseInPostHook = ctx.response;
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
      expect(responseInPostHook).to.equal(response);
      expect(ctx.response).to.equal(response);
  });

  it('should return the context response.', async () => {
    const ctx = new PostContext();
    const response = new HttpResponseBadRequest();

    const actual = await getResponse({
      handler: () => response,
      httpMethod: 'GET',
      path: '',
      postHooks: [],
      preHooks: [],
    }, ctx, new ServiceManager());

    expect(ctx.response).to.equal(response);
    expect(actual).to.equal(response);
  });

});
