import { Config, Controller, Get, render } from '@foal/core';

import { index } from './templates';

@Controller()
export class ViewController {

  @Get()
  index(ctx) {
    return render(index, {
      appName: Config.get('app', 'name'),
      csrfToken: ctx.request.csrfToken(),
    });
  }

}
