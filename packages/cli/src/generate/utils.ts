// std
import * as fs from 'fs';
import { join } from 'path';

// 3p
import { camelCase, kebabCase, upperFirst } from 'lodash';

export function mkdirIfNotExists(path: string, log: boolean = true) {
  if (log) {
    console.log(`CREATE ${path}`);
  }
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
}

export function rmfileIfExists(path: string) {
  if (fs.existsSync(path)) {
    fs.unlinkSync(path);
  }
}

export function rmdirIfExists(path: string) {
  if (fs.existsSync(path)) {
    fs.rmdirSync(path);
  }
}

export function renderTemplate(src: string, dest: string, locals: object, log: boolean = true) {
  if (log) {
    console.log(`CREATE ${dest}`);
  }
  const template = fs.readFileSync(join(__dirname, './templates', src), 'utf8');
  let content = template;
  for (const key in locals) {
    if (locals.hasOwnProperty(key)) {
      content = content.split(`/* ${key} */`).join(locals[key]);
    }
  }
  fs.writeFileSync(dest, content, 'utf8');
}

export function copyFileFromNodeModules(src: string, dest: string, log: boolean = true) {
  if (log) {
    console.log(`CREATE ${dest}`);
  }
  fs.copyFileSync(join('./node_modules', src), dest);
}

export function copyFileFromTemplates(src: string, dest: string, log: boolean = true) {
  if (log) {
    console.log(`CREATE ${dest}`);
  }
  fs.copyFileSync(join(__dirname, './templates', src), dest);
}

export function readFileFromTemplatesSpec(src: string): string {
  return fs.readFileSync(join(__dirname, './templates-spec', src), 'utf8');
}

export function readFileFromRoot(src: string): string {
  return fs.readFileSync(src, 'utf8');
}

export function getNames(name: string): { camelName: string, kebabName: string, upperFirstCamelName: string } {
  return {
    camelName: camelCase(name),
    kebabName: kebabCase(name),
    upperFirstCamelName: upperFirst(camelCase(name)),
  };
}
