import {
  HttpResponseMethodNotAllowed,
  preHook,
} from '@foal/core';

export function methodNotAllowed() {
  return preHook(() => new HttpResponseMethodNotAllowed());
}
