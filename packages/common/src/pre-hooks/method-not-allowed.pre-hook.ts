import {
  Hook,
  HttpResponseMethodNotAllowed,
} from '@foal/core';

export function methodNotAllowed(): Hook {
  return () => new HttpResponseMethodNotAllowed();
}
