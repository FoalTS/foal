import {
  HttpResponseForbidden,
  HttpResponseUnauthorized,
} from '../../http';
import {
  PreHook,
} from '../../interfaces';

export function restrictAccessToAdmin(): PreHook {
  return ctx => {
    if (!ctx.user) {
      return new HttpResponseUnauthorized();
    }
    if (!ctx.user.hasRole('admin')) {
      return new HttpResponseForbidden();
    }
  };
}
