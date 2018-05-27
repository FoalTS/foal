import {
  HttpResponseMethodNotAllowed,
} from '../../http';
import {
  PreHook,
} from '../../interfaces';

export function methodNotAllowed(): PreHook {
  return () => new HttpResponseMethodNotAllowed();
}
