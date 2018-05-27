import { renderToString } from '@foal/ejs';

import { Controller } from '../classes';
import { HttpResponseOK } from '../http';

export function render(template: string, locals?: object): HttpResponseOK {
  return new HttpResponseOK(renderToString(template, locals));
}

export function view(path: string, template: string, locals?: object): Controller<'main'> {
  const controller = new Controller<'main'>();
  controller.addRoute('main', 'GET', path, ctx => render(template, locals));
  return controller;
}
