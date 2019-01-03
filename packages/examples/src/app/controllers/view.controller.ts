import { Context, Get, LoginRequired, render } from '@foal/core';
import { fetchUserWithPermissions, PermissionRequired } from '@foal/typeorm';

import { User } from '../entities';

@LoginRequired({ user: fetchUserWithPermissions(User), redirect: '/login' })
export class ViewController {

  @Get('/')
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
