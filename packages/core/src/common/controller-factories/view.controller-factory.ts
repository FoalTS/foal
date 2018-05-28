import { Controller, HttpResponseOK, readConfig } from '../../core';

const { templateEngine } = readConfig('base');

export function render(template: string, locals?: object): HttpResponseOK {
  const { renderToString } = require(templateEngine);
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
