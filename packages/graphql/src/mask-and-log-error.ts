import { Config } from '@foal/core';

/**
 * Log errors and mask them if the configuration key "settings.debug" is not true.
 *
 * If "settings.debug" is true, then the error is returned.
 * If it is not, then an error whose message is "Internal Server Error" is returned.
 *
 * @export
 * @param {*} err - The error thrown or rejected in the resolver.
 * @returns {*} The error to return to the client.
 */
export function maskAndLogError(err: any): any {
  console.log(err);

  if (Config.get('settings.debug', 'boolean')) {
    return err;
  }

  return new Error('Internal Server Error');
}
