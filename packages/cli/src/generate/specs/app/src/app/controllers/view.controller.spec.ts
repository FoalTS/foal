// std
import { ok, strictEqual } from 'assert';

// 3p
import { Context, createController, getHttpMethod, getPath, HttpResponseOK } from '@foal/core';

// App
import { ViewController } from './view.controller';

describe('ViewController', () => {

  describe('has a "index" method that', () => {

    it('should handle requests at Get /.', () => {
      strictEqual(getHttpMethod(ViewController, 'index'), 'GET');
      strictEqual(getPath(ViewController, 'index'), '/');
    });

    it('should return a HttpResponseOK.', () => {
      const controller = createController(ViewController);
      const ctx = new Context({
        csrfToken: () => {}
      });
      ok(controller.index(ctx) instanceof HttpResponseOK);
    });

  });

});
