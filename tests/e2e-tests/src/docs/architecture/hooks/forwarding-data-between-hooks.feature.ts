// 3p
import * as request from 'supertest';

// FoalTS
import { Context, controller, createApp, Get, Hook, HttpResponseOK, UserRequired } from '@foal/core';

describe('Feature: Forwarding data betweens hooks', () => {

  it('Example: Load and forward the org of the connected user.', async () => {

    class Org {

      static async findOneByOrFail({ id }: { id: number }) {
        return new Org('Hello!');
      }

      constructor(public name: string) {}

    }

    /* ======================= DOCUMENTATION BEGIN ======================= */

    function AddOrgToContext() {
      return Hook(async (ctx: Context<any, { org: Org }>) => {
        if (ctx.user) {
          ctx.state.org = await Org.findOneByOrFail({ id: ctx.user.orgId });
        }
      });
    }

    class ApiController {

      @Get('/org-name')
      @UserRequired()
      @AddOrgToContext()
      readOrgName(ctx: Context<any, { org: Org }>) {
        return new HttpResponseOK(ctx.state.org.name);
      }

    }

    /* ======================= DOCUMENTATION END ========================= */

    @Hook(ctx => { ctx.user = { orgId: 1 }; })
    class AppController {
      subControllers = [
        controller('/api', ApiController),
      ];
    }

    const app = await createApp(AppController);

    await request(app)
      .get('/api/org-name')
      .expect(200)
      .expect('Hello!');

  });

});
