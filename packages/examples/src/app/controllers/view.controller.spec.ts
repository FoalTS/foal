// std
import { strictEqual } from 'assert';

// 3p
import { getHttpMethod, getPath } from '@foal/core';

// App
import { ViewController } from './view.controller';

describe('ViewController', () => {

  describe('should has an "home" method that', () => {

    it('should handle requests at GET /.', () => {
      strictEqual(getHttpMethod(ViewController, 'home'), 'GET');
      strictEqual(getPath(ViewController, 'home'), '/');
    });

  });

  describe('should has an "admin" method that', () => {

    it('should handle requests at GET /admin.', () => {
      strictEqual(getHttpMethod(ViewController, 'admin'), 'GET');
      strictEqual(getPath(ViewController, 'admin'), '/admin');
    });

  });

});
