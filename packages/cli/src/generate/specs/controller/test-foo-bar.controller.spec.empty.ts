// std
import { ok, strictEqual } from 'assert';

// 3p
import { Context, createController, getHttpMethod, getPath, isHttpResponseOK } from '@foal/core';

// App
import { TestFooBarController } from './test-foo-bar.controller';

describe('TestFooBarController', () => {

  let controller: TestFooBarController;

  beforeEach(() => controller = createController(TestFooBarController));

  describe('has a "foo" method that', () => {

    it('should handle requests at GET /.', () => {
      strictEqual(getHttpMethod(TestFooBarController, 'foo'), 'GET');
      strictEqual(getPath(TestFooBarController, 'foo'), '/');
    });

    it('should return an HttpResponseOK.', () => {
      const ctx = new Context({});
      ok(isHttpResponseOK(controller.foo(ctx)));
    });

  });

});
