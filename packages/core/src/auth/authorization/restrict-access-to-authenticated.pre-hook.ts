import {
  HttpResponseUnauthorized,
} from '../../http';
import {
  PreHook,
} from '../../interfaces';

export function restrictAccessToAuthenticated(): PreHook {
  return ctx => {
    if (!ctx.user) {
      return new HttpResponseUnauthorized();
    }
  };
}
