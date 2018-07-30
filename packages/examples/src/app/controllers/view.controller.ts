import { Controller, Get, LoginRequired, render } from '@foal/core';

import { home, index } from './templates';

@Controller()
export class ViewController {

  @Get('/')
  index() {
    return render(index, { name: 'FoalTS' });
  }

  @Get('/home')
  @LoginRequired()
  home() {
    return render(home);
  }

}
