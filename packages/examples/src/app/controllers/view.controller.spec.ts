// std
import { strictEqual } from 'assert';

// 3p
import { getHttpMethod, getPath } from '@foal/core';

// App
import { ViewController } from './view.controller';

describe('ViewController', () => {

  describe('should has an "index" method that', () => {

    it('should handle requests at GET /.', () => {
      strictEqual(getHttpMethod(ViewController, 'index'), 'GET');
      strictEqual(getPath(ViewController, 'index'), '/');
    });

  });

  describe('should has an "home" method that', () => {

    it('should handle requests at GET /home.', () => {
      strictEqual(getHttpMethod(ViewController, 'home'), 'GET');
      strictEqual(getPath(ViewController, 'home'), '/home');
    });

  });

});
