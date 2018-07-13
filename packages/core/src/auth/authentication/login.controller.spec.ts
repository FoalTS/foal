// 3p
import { expect } from 'chai';

// FoalTS
import { Context, Controller, getHttpMethod, getPath, HttpResponseNoContent, HttpResponseRedirect } from '../../core';
import { LoginController } from './login.controller';

describe('LoginController', () => {

  describe('has a "logout" method that', () => {
    // @Controller()
    // TODO: uncomment the above line.
    class ConcreteController extends LoginController {}

    it('should handle requests at GET /logout.', () => {
      expect(getHttpMethod(ConcreteController, 'logout')).to.equal('GET');
      expect(getPath(ConcreteController, 'logout')).to.equal('/logout');
    });

    it('should delete ctx.session.authentication if it exists.', async () => {
      const ctx = new Context({});
      ctx.request.session = {
        authentication: {
          userId: 1
        }
      };

      const controller = new ConcreteController();
      await controller.logout(ctx);

      expect(ctx.request.session).to.deep.equal({});
    });

    it('should not throw an error if ctx.session.authentication is undefined.', async () => {
      const ctx = new Context({});
      ctx.request.session = {};

      const controller = new ConcreteController();
      await controller.logout(ctx);
    });

    it('should return an HttpResponseNoContent if redirect.logout is undefined.', async () => {
      const ctx = new Context({});
      ctx.request.session = {};

      const controller = new ConcreteController();
      const response = await controller.logout(ctx);

      expect(response).to.be.an.instanceOf(HttpResponseNoContent);
    });

    it('should return an HttpResponseRedirect if redirect.logout is not empty.', async () => {
      const ctx = new Context({});
      ctx.request.session = {};

      // @Controller()
      // TODO: uncomment the above line.
      class ConcreteController2 extends LoginController {
        redirect = {
          logout: '/foo'
        };
      }

      const controller = new ConcreteController2();
      const response = await controller.logout(ctx);

      expect(response).to.be.an.instanceOf(HttpResponseRedirect);
      expect((response as HttpResponseRedirect).path).to.equal('/foo');
    });

  });

});
