// FoalTS
import { Config, HookDecorator } from '../core';
import { ApiDefineSecurityScheme, ApiResponse, ApiSecurityRequirement, IApiSecurityScheme } from '../openapi';
import { SESSION_DEFAULT_COOKIE_NAME } from './constants';
import { Token, TokenOptions } from './token.hook';

// TODO: Add missing documentation.

export function TokenRequired(options: TokenOptions): HookDecorator {
  return (target: any, propertyKey?: string) =>  {
    Token(true, options)(target, propertyKey);

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
      ApiSecurityRequirement({ cookieAuth: [] })(target, propertyKey);
    } else {
      const securityScheme: IApiSecurityScheme = {
        scheme: 'bearer',
        type: 'http',
      };
      ApiDefineSecurityScheme('bearerAuth', securityScheme)(target, propertyKey);
      ApiSecurityRequirement({ bearerAuth: [] })(target, propertyKey);
    }

    ApiResponse(401, { description: 'Auth token is missing or invalid.' })(target, propertyKey);
  };
}
