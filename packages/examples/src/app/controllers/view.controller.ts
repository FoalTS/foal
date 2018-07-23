import { Controller, Get, LoginRequired, render } from '@foal/core';

import home = require('./templates/home.html');
import index = require('./templates/index.html');

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
