import { ObjectType } from '@foal/core';

import { escape } from './escape';

export function escapeHTML(object: ObjectType, propName: string): void {
  const type = typeof object[propName];
  if (type !== 'string') {
    throw new TypeError(`${propName} should be a string (got ${type}).`);
  }
  object[propName] = escape(object[propName]);
}
