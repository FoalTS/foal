// std
import { strictEqual } from 'assert';

// FoalTS
import { Context, createController, Get, HttpResponseOK, isHttpResponseOK } from '@foal/core';
import { JWTRequired } from '@foal/jwt';

describe('Feature: Testing controllers', () => {

  describe('Example: A simple test', async () => {

    /* ======================= DOCUMENTATION BEGIN ======================= */

    class ApiController {
      @Get('/users/me')
      @JWTRequired()
      getCurrentUser(ctx: Context) {
        return new HttpResponseOK(ctx.user);
      }
    }

    describe('ApiController', () => {

      it('should return the current user.', () => {
        // Instantiate the controller.
        const controller = createController(ApiController);

        // Create a fake user (the current user)
        const user = { name: 'Alix' };

        // Create a fake Context object to simulate the request.
        const ctx = new Context({}); // "{}" is the request body.
        ctx.user = user;

        // Execute the controller method and save the response.
        const response = controller.getCurrentUser(ctx);

        if (!isHttpResponseOK(response)) {
          throw new Error('The response should be an HttpResponseOK');
        }

        strictEqual(response.body, user);
      });

    });

    /* ======================= DOCUMENTATION END ========================= */

  });

});
