import { Context, Get, render, Session, UserRequired, UseSessions } from '@foal/core';
import { fetchUser } from '@foal/typeorm';
import { User } from '../entities';

@UseSessions({
  cookie: true,
  user: fetchUser(User)
})
export class ViewController {
  @Get('/home')
  @UserRequired({ redirectTo: '/login' })
  async home(ctx: Context<User, Session>) {
    return render('templates/home.html', {
      email: ctx.user.email,
      csrfToken: ctx.session.get('csrfToken')
    });
  }

  @Get('/login')
  async login(ctx) {
    return render('templates/login.html', { csrfToken: ctx.session.get('csrfToken') });
  }

  @Get('/signup')
  async signup(ctx) {
    return render('templates/signup.html', { csrfToken: ctx.session.get('csrfToken') });
  }
}
