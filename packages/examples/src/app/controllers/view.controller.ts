import { Context, Controller, Get, LoginRequired, PermissionRequired, render } from '@foal/core';

@Controller()
export class ViewController {

  @Get('/')
  @LoginRequired({ redirect: '/login' })
  home(ctx: Context) {
    return render('./templates/home.html', {
      csrfToken: ctx.request.csrfToken()
    }, __dirname);
  }

  @Get('/admin')
  @PermissionRequired('admin', { redirect: '/login' })
  admin(ctx: Context) {
    return render('./templates/admin.html', {
      csrfToken: ctx.request.csrfToken()
    }, __dirname);
  }

}
