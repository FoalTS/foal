import { Context, Controller, Get, LoginRequired, PermissionRequired, render } from '@foal/core';

import { admin, home } from './templates';

@Controller()
export class ViewController {

  @Get('/')
  @LoginRequired({ redirect: '/login' })
  home(ctx: Context) {
    return render(home, {
      csrfToken: ctx.request.csrfToken()
    });
  }

  @Get('/admin')
  @PermissionRequired('admin', { redirect: '/login' })
  admin(ctx: Context) {
    return render(admin, {
      csrfToken: ctx.request.csrfToken()
    });
  }

}
