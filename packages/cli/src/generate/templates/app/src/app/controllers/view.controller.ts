import { Config, Controller, Get, render } from '@foal/core';

@Controller()
export class ViewController {

  @Get()
  index(ctx) {
    return render('./templates/index.html', {
      appName: Config.get('app', 'name'),
      csrfToken: ctx.request.csrfToken(),
    }, __dirname);
  }

}
