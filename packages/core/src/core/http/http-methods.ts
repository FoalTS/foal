// 3p
import 'reflect-metadata';

export type HttpMethod = 'POST' | 'GET' | 'PUT' | 'PATCH' | 'DELETE';

export function Get(path?: string) {
  return (target: any, propertyKey: string) => {
    Reflect.defineMetadata('httpMethod', 'GET', target, propertyKey);
    Reflect.defineMetadata('path', path, target, propertyKey);
  };
}

export function Post(path?: string) {
  return (target: any, propertyKey: string) => {
    Reflect.defineMetadata('httpMethod', 'POST', target, propertyKey);
    Reflect.defineMetadata('path', path, target, propertyKey);
  };
}

export function Put(path?: string) {
  return (target: any, propertyKey: string) => {
    Reflect.defineMetadata('httpMethod', 'PUT', target, propertyKey);
    Reflect.defineMetadata('path', path, target, propertyKey);
  };
}

export function Patch(path?: string) {
  return (target: any, propertyKey: string) => {
    Reflect.defineMetadata('httpMethod', 'PATCH', target, propertyKey);
    Reflect.defineMetadata('path', path, target, propertyKey);
  };
}

export function Delete(path?: string) {
  return (target: any, propertyKey: string) => {
    Reflect.defineMetadata('httpMethod', 'DELETE', target, propertyKey);
    Reflect.defineMetadata('path', path, target, propertyKey);
  };
}
