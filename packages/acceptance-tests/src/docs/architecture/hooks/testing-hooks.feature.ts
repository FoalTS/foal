// std
import { strictEqual } from 'assert';

// FoalTS
import {
  Context,
  getHookFunction,
  Hook,
  HttpResponseBadRequest,
  HttpResponseOK,
  isHttpResponse,
  isHttpResponseBadRequest,
  ServiceManager
} from '@foal/core';

describe('Feature: Testing hooks', () => {

  describe('Example: A simple test.', () => {

    /* ======================= DOCUMENTATION BEGIN ======================= */

    // validate-body.hook.ts
    function ValidateBody() {
      return Hook(ctx => {
        if (typeof ctx.request.body.name !== 'string') {
          return new HttpResponseBadRequest();
        }
      });
    }

    // validate-body.hook.spec.ts
    it('ValidateBody', () => {
      const ctx = new Context({
        // fake request object
        body: { name: 3 }
      });
      const hook = getHookFunction(ValidateBody());

      const response = hook(ctx, new ServiceManager());

      if (!isHttpResponseBadRequest(response)) {
        throw new Error('The hook should return an HttpResponseBadRequest object.');
      }
    });

    /* ======================= DOCUMENTATION END ========================= */

  });

  describe('Example: Testing hook post functions.', () => {

    /* ======================= DOCUMENTATION BEGIN ======================= */

    // add-xxx-header.hook.ts
    function AddXXXHeader() {
      return Hook(ctx => response => {
        response.setHeader('XXX', 'YYY');
      });
    }

    // add-xxx-header.hook.spec.ts
    it('AddXXXHeader', async () => {
      const ctx = new Context({});
      const hook = getHookFunction(AddXXXHeader());

      const postHookFunction = await hook(ctx, new ServiceManager());
      if (postHookFunction === undefined || isHttpResponse(postHookFunction)) {
        throw new Error('The hook should return a post hook function');
      }

      const response = new HttpResponseOK();
      await postHookFunction(response);

      strictEqual(response.getHeader('XXX'), 'YYY');
    });

    /* ======================= DOCUMENTATION END ========================= */

  });

  describe('Example: Testing hooks that use `this`', () => {

    /* ======================= DOCUMENTATION BEGIN ======================= */

    // validate-param-type.hook.ts
    function ValidateParamType() {
      return Hook(function(this: any, ctx: Context) {
        if (typeof ctx.request.params.id !== this.paramType) {
          return new HttpResponseBadRequest();
        }
      });
    }

    // validate-param-type.hook.spec.ts
    it('ValidateParamType', () => {
      const ctx = new Context({
        // fake request object
        params: { id: 'xxx' }
      });
      const controller = {
        paramType: 'number'
      };
      const hook = getHookFunction(ValidateParamType()).bind(controller);

      const response = hook(ctx, new ServiceManager());

      if (!isHttpResponseBadRequest(response)) {
        throw new Error('The hook should return an HttpResponseBadRequest object.');
      }
    });

    /* ======================= DOCUMENTATION END ========================= */

  });

});
