import {
  Config, Context, generateSignedToken, generateToken, Hook,
  HookDecorator, HttpResponse, HttpResponseForbidden, verifySignedToken
} from '@foal/core';

function getRequestToken(req: Context['request']): string | undefined {
  return (req.body && req.body._csrf)
    || (req.query && req.query._csrf)
    || req.headers['csrf-token']
    || req.headers['xsrf-token']
    || req.headers['x-csrf-token']
    || req.headers['x-xsrf-token'];
}

export function CsrfTokenRequired(options: { doubleSubmitCookie?: boolean } = {}): HookDecorator {
  return Hook(async (ctx, services) => {
    const config = services.get(Config);

    if (!config.get('settings.csrf.enabled', true)) {
      return;
    }

    let expectedToken: string;

    if (options.doubleSubmitCookie) {
      const secret = config.get<string|undefined>('settings.csrf.secret');
      if (!secret) {
        throw new Error(
          '[CONFIG] You must provide a secret with the configuration key settings.csrf.secret.'
        );
      }

      const token: string|undefined = ctx.request.cookies.csrfToken;
      if (!token) {
        return new HttpResponseForbidden('Cookie "csrfToken" not found.');
      }

      if (!verifySignedToken(token, secret)) {
        return new HttpResponseForbidden('Bad csrf token.');
      }

      expectedToken = token;
    } else {
      if (!ctx.session) {
        throw new Error(
          '@CsrfTokenRequired requires the use of sessions. Use @TokenRequired or set "doubleSubmitCookie" to true.'
        );
      }

      const token = ctx.session.get<string>('csrfToken');
      if (!token) {
        const token = await generateToken();
        ctx.session.set('csrfToken', token);
        expectedToken = token;
      } else {
        expectedToken = token;
      }
    }

    if ([ 'GET', 'HEAD', 'OPTIONS' ].includes(ctx.request.method)) {
      return;
    }

    if (expectedToken !== getRequestToken(ctx.request)) {
      return new HttpResponseForbidden('Bad csrf token.');
    }

    return async (response: HttpResponse) => {
      // TODO: ONLY IF DOUBLE SUBMIT COOKIE
      // TODO: just once
      const secret = config.get<string>('settings.csrf.secret');
      const token = await generateSignedToken(secret);
      response.setCookie('csrfToken', token);

      // ELSE
      // refresh csrf session cookie if it exists.
    };
  });
}
