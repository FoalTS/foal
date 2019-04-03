// std
import { ok, strictEqual } from 'assert';

// 3p
import { Context, createController, getHttpMethod, getPath, isHttpResponseOK } from '@foal/core';

// App
import { ApiV1Controller } from './api-v1.controller';

describe('ApiV1Controller', () => {

  let controller: ApiV1Controller;

  beforeEach(() => controller = createController(ApiV1Controller));

  describe('has a "foo" method that', () => {

    it('should handle requests at GET /.', () => {
      strictEqual(getHttpMethod(ApiV1Controller, 'foo'), 'GET');
      strictEqual(getPath(ApiV1Controller, 'foo'), '/');
    });

    it('should return an HttpResponseOK.', () => {
      const ctx = new Context({});
      ok(isHttpResponseOK(controller.foo(ctx)));
    });

  });

});
