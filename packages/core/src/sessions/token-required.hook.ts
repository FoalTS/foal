// FoalTS
import { Config, HookDecorator } from '../core';
import { ApiDefineSecurityScheme, ApiResponse, ApiSecurityRequirement, IApiSecurityScheme } from '../openapi';
import { Token, TokenOptions } from './token.hook';

export function TokenRequired(options: TokenOptions): HookDecorator {
  return (target: any, propertyKey?: string) =>  {
    Token(true, options)(target, propertyKey);

    if (options.openapi === false || (options.openapi === undefined && !Config.get('settings.openapi.useHooks'))) {
      return;
    }

    const securityScheme: IApiSecurityScheme = {
      scheme: 'bearer',
      type: 'http',
    };

    ApiDefineSecurityScheme('bearerAuth', securityScheme)(target, propertyKey);
    ApiSecurityRequirement({ bearerAuth: [] })(target, propertyKey);
    ApiResponse(401, { description: 'Auth token is missing or invalid.' })(target, propertyKey);
  };
}
