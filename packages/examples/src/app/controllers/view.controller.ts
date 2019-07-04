import { Context, Get, render, TokenRequired } from '@foal/core';
import { CsrfTokenRequired, getCsrfToken } from '@foal/csrf';
import { fetchUserWithPermissions, PermissionRequired, TypeORMStore } from '@foal/typeorm';

import { User } from '../entities';

@TokenRequired({ store: TypeORMStore, user: fetchUserWithPermissions(User), redirectTo: '/login', cookie: true })
@CsrfTokenRequired()
export class ViewController {

  @Get('/')
  home(ctx: Context) {
    return render('./templates/home.html', {
      csrfToken: getCsrfToken(ctx.session)
    });
  }

  @Get('/admin')
  @PermissionRequired('admin', { redirect: '/login' })
  admin(ctx: Context) {
    return render('./templates/admin.html', {
      csrfToken: getCsrfToken(ctx.session)
    });
  }

}
