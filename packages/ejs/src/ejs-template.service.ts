import { ViewService } from '@foal/common';
import { ObjectType, Service } from '@foal/core';
import * as ejs from 'ejs';
import * as fs from 'fs';
import { promisify } from 'util';

export abstract class EjsTemplateService implements ViewService {
  constructor(private filePath: string) {}

  public async render(locals: ObjectType): Promise<string> {
    const template = await promisify(fs.readFile)(this.filePath, 'utf8');
    return ejs.render(template, locals);
  }
}
