import { Context, Controller, Get, LoginRequired, render } from '@foal/core';

import { home } from './templates';

@Controller()
export class ViewController {

  @Get('/')
  @LoginRequired({ redirect: '/login' })
  home(ctx: Context) {
    return render(home, {
      csrfToken: ctx.request.csrfToken()
    });
  }

}
