// std
import * as fs from 'fs';
import { join } from 'path';

export function mkdirIfNotExists(path: string) {
  if (process.env.NODE_ENV !== 'test') {
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

export function renderTemplate(src: string, dest: string, locals: object) {
  if (process.env.NODE_ENV !== 'test') {
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

export function updateFile(path: string, cb: (content: string) => string) {
  const content = fs.readFileSync(path, 'utf8');
  fs.writeFileSync(path, cb(content), 'utf8');
}

export function copyFileFromNodeModules(src: string, dest: string) {
  if (process.env.NODE_ENV !== 'test') {
    console.log(`CREATE ${dest}`);
  }
  fs.copyFileSync(join(__dirname, '../../node_modules', src), dest);
}

export function copyFileFromTemplates(src: string, dest: string) {
  if (process.env.NODE_ENV !== 'test') {
    console.log(`CREATE ${dest}`);
  }
  fs.copyFileSync(join(__dirname, './templates', src), dest);
}

export function readFileFromTemplatesSpec(src: string): string {
  return fs.readFileSync(join(__dirname, './templates-spec', src), 'utf8');
}

export function readFileFromNodeModules(src: string): string {
  return fs.readFileSync(join(__dirname, '../../node_modules', src), 'utf8');
}

export function readFileFromRoot(src: string): string {
  return fs.readFileSync(src, 'utf8');
}

export function getNames(name: string): { camelName: string, kebabName: string, upperFirstCamelName: string } {
  const camelName = name.replace(/-([a-z])/gi, g => g[1].toUpperCase());
  const kebabName = name.replace(/([a-z][A-Z])/g, g => `${g[0]}-${g[1].toLowerCase()}`);
  const upperFirstCamelName = camelName.charAt(0).toUpperCase() + camelName.slice(1);

  return { camelName, kebabName, upperFirstCamelName };
}
