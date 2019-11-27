import { Context, controller, Get, render, Session, TokenRequired } from '@foal/core';
import { TypeORMStore } from '@foal/typeorm';

import { AuthController } from './controllers';

export class AppController {
  subControllers = [
    controller('', AuthController),
  ];

  @Get('/')
  @TokenRequired({ cookie: true, store: TypeORMStore, redirectTo: '/signin' })
  index(ctx: Context<any, Session>) {
    return render('./templates/index.html', {
      profile: JSON.stringify(ctx.session.get('profile'))
    });
  }

  @Get('/signin')
  signin() {
    return render('./templates/signin.html');
  }
}
