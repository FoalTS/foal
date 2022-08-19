import { Config, Context } from '../../../core';
import { UseSessionOptions } from '../use-sessions.hook';

export function shouldVerifyCsrfToken(request: Context['request'], options: UseSessionOptions): boolean {
  return (
    options.cookie === true &&
    (options.csrf ?? Config.get('settings.session.csrf.enabled', 'boolean', false)) &&
    [ 'DELETE', 'PATCH', 'POST', 'PUT' ].includes(request.method)
  );
}