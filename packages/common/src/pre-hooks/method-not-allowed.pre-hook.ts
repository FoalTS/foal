import {
  HttpResponseMethodNotAllowed,
  PreHook,
} from '@foal/core';

export function methodNotAllowed(): PreHook {
  return () => new HttpResponseMethodNotAllowed();
}
