import { IMultipleViews } from '@foal/common';
import * as ejs from 'ejs';
import * as fs from 'fs';
import { promisify } from 'util';

export abstract class MultipleEjsTemplatesService implements IMultipleViews {
  constructor(private templates: object) {}

  public async render(name: string, locals: object): Promise<string> {
    if (!this.templates.hasOwnProperty(name)) {
      throw new Error(`Template ${name} does not exist.`);
    }
    const template = await promisify(fs.readFile)(this.templates[name], 'utf8');
    return ejs.render(template, locals);
  }
}
