import { MultipleViewsService } from '@foal/common';
import { ObjectType, Service } from '@foal/core';
import * as ejs from 'ejs';
import * as fs from 'fs';
import { promisify } from 'util';

@Service()
export abstract class MultipleEjsTemplatesService<View extends string> implements MultipleViewsService<View> {
  constructor(private templates: Record<View, string>) {}

  public async render(name: View, locals: ObjectType): Promise<string> {
    if (!this.templates.hasOwnProperty(name)) {
      throw new Error(`Template ${name} does not exist.`);
    }
    const template = await promisify(fs.readFile)(this.templates[name], 'utf8');
    return ejs.render(template, locals);
  }
}
