// std
import { ok, strictEqual } from 'assert';

// 3p
import { Context, createController, getHttpMethod, getPath, isHttpResponseOK } from '@foal/core';

// App
import { /* upperFirstCamelName */Controller } from './/* kebabName */.controller';

describe('/* upperFirstCamelName */Controller', () => {

  let controller: /* upperFirstCamelName */Controller;

  beforeEach(() => controller = createController(/* upperFirstCamelName */Controller));

  describe('has a "foo" method that', () => {

    it('should handle requests at GET /.', () => {
      strictEqual(getHttpMethod(/* upperFirstCamelName */Controller, 'foo'), 'GET');
      strictEqual(getPath(/* upperFirstCamelName */Controller, 'foo'), '/');
    });

    it('should return an HttpResponseOK.', () => {
      const ctx = new Context({});
      ok(isHttpResponseOK(controller.foo(ctx)));
    });

  });

});
