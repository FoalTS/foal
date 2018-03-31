import { IView } from '@foal/common';
import * as ejs from 'ejs';
import * as fs from 'fs';
import { promisify } from 'util';

export abstract class EjsTemplateService implements IView {
  constructor(private filePath: string) {}

  public async render(locals: object): Promise<string> {
    const template = await promisify(fs.readFile)(this.filePath, 'utf8');
    return ejs.render(template, locals);
  }
}
