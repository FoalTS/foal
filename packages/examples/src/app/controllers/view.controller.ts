import { Context, Get, render, TokenRequired } from '@foal/core';
import { fetchUserWithPermissions, PermissionRequired, TypeORMStore } from '@foal/typeorm';

import { User } from '../entities';

@TokenRequired({ store: TypeORMStore, user: fetchUserWithPermissions(User), redirectTo: '/login', cookie: true })
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
