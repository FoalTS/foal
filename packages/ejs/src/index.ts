import { HttpResponseOK } from '@foal/core';
import { render as renderEjs } from 'ejs';

// Use types.
export function renderToString(template: string, locals?: object): string {
  return renderEjs(template, locals);
}

export function render(template: string, locals?: object): HttpResponseOK {
  return new HttpResponseOK(renderToString(template, locals));
}
