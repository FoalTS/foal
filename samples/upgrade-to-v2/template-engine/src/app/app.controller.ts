import { controller, Get, render } from '@foal/core';

export class AppController {
  @Get('/')
  index() {
    return render('templates/index.html', { message: 'hello world!' });
  }
}
