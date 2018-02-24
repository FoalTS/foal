import {
  HttpResponseMethodNotAllowed,
  Hook,
} from '@foal/core';

export function methodNotAllowed(): Hook {
  return () => new HttpResponseMethodNotAllowed();
}
