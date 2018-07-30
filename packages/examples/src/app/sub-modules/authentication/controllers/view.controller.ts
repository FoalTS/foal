import { Context, Controller, Get, render } from '@foal/core';

import { login } from './templates';

@Controller()
export class ViewController {

  @Get('/')
  index(ctx: Context) {
    return render(login, { csrfToken: ctx.request.csrfToken() });
  }

}
