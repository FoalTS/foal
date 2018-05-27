import { render } from 'ejs';

export function renderToString(template: string, locals?: object): string {
  return render(template, locals);
}
