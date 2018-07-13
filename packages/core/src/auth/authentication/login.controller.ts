import { Context, Get, HttpResponseNoContent, HttpResponseRedirect, Post } from '../../core';

export abstract class LoginController {
  redirect: { logout?: string } | undefined;

  @Get('/logout')
  logout(ctx: Context): any {
    delete ctx.request.session.authentication;
    if (this.redirect && this.redirect.logout) {
      return new HttpResponseRedirect(this.redirect.logout);
    }
    return new HttpResponseNoContent();
  }

  // @Post('/:strategy')
  // login() {}
}
