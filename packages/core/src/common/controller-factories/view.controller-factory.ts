import { Config, Context, Controller2, HttpResponseOK } from '../../core';

export function render(template: string, locals?: object): HttpResponseOK {
  const templateEngine = Config.get('settings', 'templateEngine', '@foal/ejs') as string;
  const { renderToString } = require(templateEngine);
  if (!renderToString) {
    throw new Error(`${templateEngine} is not a template engine.`);
  }
  return new HttpResponseOK(renderToString(template, locals));
}

export function view(path: string, template: string,
                     locals?: object|((ctx: Context) => object)): Controller2<'main'> {
  const controller = new Controller2<'main'>();
  if (typeof locals === 'function') {
    controller.addRoute('main', 'GET', path, ctx => render(template, locals(ctx)));
  } else {
    controller.addRoute('main', 'GET', path, ctx => render(template, locals));
  }
  return controller;
}
