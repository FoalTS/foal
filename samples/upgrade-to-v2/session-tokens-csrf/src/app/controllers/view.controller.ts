import { Context, Get, HttpResponseOK, render, Session, TokenRequired } from '@foal/core';
import { CsrfTokenRequired, getCsrfToken } from '@foal/csrf';
import { fetchUser, TypeORMStore } from '@foal/typeorm';
import { User } from '../entities';

export class ViewController {
  @Get('/home')
  @TokenRequired({ store: TypeORMStore, cookie: true, redirectTo: '/login', user: fetchUser(User) })
  @CsrfTokenRequired()
  async home(ctx: Context<User>) {
    return render('templates/home.html', {
      email: ctx.user.email,
      csrfToken: await getCsrfToken(ctx.session)
    });
  }

  @Get('/login')
  async login(ctx: Context<User>) {
    return render('templates/login.html', { csrfToken: await getCsrfToken(ctx.session) });
  }

  @Get('/signup')
  async signup(ctx: Context<User>) {
    return render('templates/signup.html', { csrfToken: await getCsrfToken(ctx.session) });
  }
}
