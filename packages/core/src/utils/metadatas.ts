import 'reflect-metadata';

export function getMetadata(metadataKey: any, target: any, propertyKey: string|undefined): any {
  if (propertyKey) {
    return Reflect.getMetadata(metadataKey, target, propertyKey);
  }
  return Reflect.getMetadata(metadataKey, target);
}

export function defineMetadata(metadataKey: any, metadataValue: any, target: any,
                               propertyKey: string|undefined): any {
  if (propertyKey) {
    return Reflect.defineMetadata(metadataKey, metadataValue, target, propertyKey);
  }
  return Reflect.defineMetadata(metadataKey, metadataValue, target);
}
