// FoalTS
import { Config, HookDecorator } from '../core';
import { ApiDefineSecurityScheme, ApiResponse, IApiSecurityScheme } from '../openapi';
import { SESSION_DEFAULT_COOKIE_NAME } from './constants';
import { Token, TokenOptions } from './token.hook';

// TODO: Add missing documentation.

export function TokenOptional(options: TokenOptions = {}): HookDecorator {
  return (target: any, propertyKey?: string) =>  {
    Token(false, options)(target, propertyKey);

    if (options.openapi === false ||
      (options.openapi === undefined && !Config.get2('settings.openapi.useHooks', 'boolean'))
    ) {
      return;
    }

    if (options.cookie) {
      const securityScheme: IApiSecurityScheme = {
        in: 'cookie',
        name: Config.get2('settings.session.cookie.name', 'string', SESSION_DEFAULT_COOKIE_NAME),
        type: 'apiKey',
      };
      ApiDefineSecurityScheme('cookieAuth', securityScheme)(target, propertyKey);
    } else {
      const securityScheme: IApiSecurityScheme = {
        scheme: 'bearer',
        type: 'http',
      };
      ApiDefineSecurityScheme('bearerAuth', securityScheme)(target, propertyKey);
    }

    ApiResponse(401, { description: 'Auth token is invalid.' })(target, propertyKey);
  };
}
