// std
import { ok, strictEqual } from 'assert';

// 3p
import { Context, createController, getHttpMethod, getPath, isHttpResponseOK } from '@foal/core';

// App
import { ApiV2Controller } from './api-v2.controller';

describe('ApiV2Controller', () => {

  let controller: ApiV2Controller;

  beforeEach(() => controller = createController(ApiV2Controller));

  describe('has a "foo" method that', () => {

    it('should handle requests at GET /.', () => {
      strictEqual(getHttpMethod(ApiV2Controller, 'foo'), 'GET');
      strictEqual(getPath(ApiV2Controller, 'foo'), '/');
    });

    it('should return an HttpResponseOK.', () => {
      const ctx = new Context({});
      ok(isHttpResponseOK(controller.foo(ctx)));
    });

  });

});
