// std
import { ok, strictEqual } from 'assert';

// 3p
import { Context, createController, getHttpMethod, getPath, isHttpResponseOK } from '@foal/core';

// App
import { OpenapiController } from './openapi.controller';

describe('OpenapiController', () => {

  let controller: OpenapiController;

  beforeEach(() => controller = createController(OpenapiController));

  describe('has a "foo" method that', () => {

    it('should handle requests at GET /.', () => {
      strictEqual(getHttpMethod(OpenapiController, 'foo'), 'GET');
      strictEqual(getPath(OpenapiController, 'foo'), '/');
    });

    it('should return an HttpResponseOK.', () => {
      const ctx = new Context({});
      ok(isHttpResponseOK(controller.foo(ctx)));
    });

  });

});
