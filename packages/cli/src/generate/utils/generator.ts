// std
import { copyFileSync, existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

// 3p
import { cyan, green } from 'colors/safe';

// FoalTS
import { mkdirIfDoesNotExist } from './mkdir-if-does-not-exist';

export class Generator {
  constructor(
    private name: string,
    private root: string,
    private options: {
      noLogs?: boolean
    } = {}
  ) {}

  /* Create architecture */

  mkdirIfDoesNotExist(path: string) {
    mkdirIfDoesNotExist(join(this.root, path));
    return this;
  }

  /* Create files */

  copyFileFromTemplates(srcPath: string, destPath?: string) {
    destPath = destPath || srcPath;

    const absoluteSrcPath = join(__dirname, '../templates', this.name, srcPath);

    if (!existsSync(absoluteSrcPath)) {
      throw new Error(`Template not found: ${srcPath}`);
    }

    this.logCreate(destPath);
    copyFileSync(absoluteSrcPath, join(this.root, destPath));
    return this;
  }

  renderTemplate(templatePath: string, locals: object, destPath?: string) {
    destPath = destPath || templatePath;

    const absoluteTemplatePath = join(__dirname, '../templates', this.name, templatePath);

    if (!existsSync(absoluteTemplatePath)) {
      throw new Error(`Template not found: ${templatePath}`);
    }

    this.logCreate(destPath);
    const template = readFileSync(absoluteTemplatePath, 'utf8');
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

  updateFile(path: string, cb: (content: string) => string, options: { allowFailure?: boolean } = {}) {
    let content: string;
    try {
      content = readFileSync(join(this.root, path), 'utf8');
    } catch (err) {
      if (options.allowFailure) {
        return this;
      }
      throw err;
    }
    this.logUpdate(path);
    writeFileSync(join(this.root, path), cb(content), 'utf8');
    return this;
  }

  private logCreate(path: string) {
    if (this.root) {
      path = join(this.root, path);
    }
    if (process.env.NODE_ENV !== 'test' && !this.options.noLogs) {
      console.log(`${green('CREATE')} ${path}`);
    }
  }

  private logUpdate(path: string) {
    if (this.root) {
      path = join(this.root, path);
    }
    if (process.env.NODE_ENV !== 'test' && !this.options.noLogs) {
      console.log(`${cyan('UPDATE')} ${path}`);
    }
  }
}
