// 3p
import 'reflect-metadata';

export function Controller(path?: string) {
  return Reflect.metadata('path', path);
}

export function Module(path?: string) {
  return Reflect.metadata('path', path);
}
