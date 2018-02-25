import {
  PreHook,
  HttpResponseMethodNotAllowed,
} from '@foal/core';

export function methodNotAllowed(): PreHook {
  return () => new HttpResponseMethodNotAllowed();
}
