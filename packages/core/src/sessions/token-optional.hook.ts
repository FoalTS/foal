// FoalTS
import { Config, HookDecorator } from '../core';
import { ApiDefineSecurityScheme, ApiResponse, IApiSecurityScheme } from '../openapi';
import { Token, TokenOptions } from './token.hook';

export function TokenOptional(options: TokenOptions): HookDecorator {
  return (target: any, propertyKey?: string) =>  {
    Token(false, options)(target, propertyKey);

    if (options.openapi === false || (options.openapi === undefined && !Config.get('settings.openapi.useHooks'))) {
      return;
    }

    const securityScheme: IApiSecurityScheme = {
      scheme: 'bearer',
      type: 'http',
    };

    ApiDefineSecurityScheme('bearerAuth', securityScheme)(target, propertyKey);
    ApiResponse(401, { description: 'Auth token is invalid.' })(target, propertyKey);
  };
}
