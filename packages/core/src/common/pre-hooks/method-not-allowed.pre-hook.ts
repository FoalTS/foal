import {
  HttpResponseMethodNotAllowed,
  PreHook,
} from '../../core';

export function methodNotAllowed(): PreHook {
  return () => new HttpResponseMethodNotAllowed();
}
