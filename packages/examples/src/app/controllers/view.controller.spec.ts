import { getHttpMethod, getPath } from '@foal/core';
import { expect } from 'chai';

import { ViewController } from './view.controller';

describe('ViewController', () => {

  describe('should has an "index" method that', () => {

    it('should handle requests at GET /.', () => {
      expect(getHttpMethod(ViewController, 'index')).to.equal('GET');
      expect(getPath(ViewController, 'index')).to.equal('/');
    });

  });

  describe('should has an "home" method that', () => {

    it('should handle requests at GET /home.', () => {
      expect(getHttpMethod(ViewController, 'home')).to.equal('GET');
      expect(getPath(ViewController, 'home')).to.equal('/home');
    });

  });

});
