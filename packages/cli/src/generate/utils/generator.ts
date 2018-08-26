// std
import { copyFileSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

// FoalTS
import { mkdirIfDoesNotExist } from './mkdir-if-does-not-exist';

export class Generator {
  constructor(private name: string, private root: string) {}

  /* Create architecture */

  mkdirIfDoesNotExist(path: string) {
    this.logCreate(path);
    mkdirIfDoesNotExist(join(this.root, path));
    return this;
  }

  /* Create files */

  copyFileFromTemplates(srcPath: string, destPath?: string) {
    destPath = destPath || srcPath;
    this.logCreate(destPath);
    copyFileSync(
      join(__dirname, '../templates', this.name, srcPath),
      join(this.root, destPath)
    );
    return this;
  }

  renderTemplate(templatePath: string, locals: object, destPath?: string) {
    destPath = destPath || templatePath;
    this.logCreate(destPath);
    const template = readFileSync(
      join(__dirname, '../templates', this.name, templatePath),
      'utf8'
    );
    let content = template;
    for (const key in locals) {
      if (locals.hasOwnProperty(key)) {
        content = content.split(`/* ${key} */`).join(locals[key]);
      }
    }
    writeFileSync(join(this.root, destPath), content, 'utf8');
    return this;
  }

  /* Update files */

  updateFile(path: string, cb: (content: string) => string) {
    const content = readFileSync(join(this.root, path), 'utf8');
    writeFileSync(join(this.root, path), cb(content), 'utf8');
    return this;
  }

  private logCreate(path: string) {
    if (this.root) {
      path = this.root + '/' + path;
    }
    if (process.env.NODE_ENV !== 'test') {
      console.log(`CREATE ${path}`);
    }
  }
}
