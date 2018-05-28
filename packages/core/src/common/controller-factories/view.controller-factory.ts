import { Controller, getConfig, HttpResponseOK } from '../../core';

export function render(template: string, locals?: object): HttpResponseOK {
  const { templateEngine } = getConfig('base');
  const { renderToString } = require(templateEngine || '@foal/ejs');
  if (!renderToString) {
    throw new Error(`${templateEngine} is not a template engine.`);
  }
  return new HttpResponseOK(renderToString(template, locals));
}

export function view(path: string, template: string, locals?: object): Controller<'main'> {
  const controller = new Controller<'main'>();
  controller.addRoute('main', 'GET', path, ctx => render(template, locals));
  return controller;
}
