
// FoalTS
import {
  Context,
  getHookFunction,
  Hook,
  HttpResponseBadRequest,
  isHttpResponseBadRequest,
  ServiceManager
} from '@foal/core';

describe('[Docs] Hooks', () => {

  it('Testing Hooks', () => {
    // validate-body.hook.ts
    function ValidateBody() {
      return Hook(ctx => {
        if (typeof ctx.request.body.name !== 'string') {
          return new HttpResponseBadRequest();
        }
      });
    }

    // validate-body.hook.spec.ts
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

  it('Testing Hooks Using this', () => {
    // validate-param-type.hook.ts
    function ValidateParamType() {
      return Hook(function(this: any, ctx: Context) {
        if (typeof ctx.request.params.id !== this.paramType) {
          return new HttpResponseBadRequest();
        }
      });
    }

    // validate-param-type.hook.spec.ts
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

});
