import { Class, Config, Context, Controller, Get, HttpResponseOK } from '../../core';

export function render(template: string, locals?: object): HttpResponseOK {
  const templateEngine = Config.get('settings', 'templateEngine', '@foal/ejs') as string;
  const { renderToString } = require(templateEngine);
  if (!renderToString) {
    throw new Error(`${templateEngine} is not a template engine.`);
  }
  return new HttpResponseOK(renderToString(template, locals));
}

export function view(path: string, template: string,
                     locals?: object|((ctx: Context) => object)): Class {
  @Controller()
  class ViewController {

    @Get(path)
    render(ctx) {
      if (typeof locals === 'function') {
        return render(template, locals(ctx));
      } else {
        return render(template, locals);
      }
    }

  }
  return ViewController;
}
