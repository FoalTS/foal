import { Config } from '@foal/core';

export function maskAndLogErrors(err: any): any {
  console.log(err);

  if (Config.get('settings.debug')) {
    return err;
  }

  return new Error('Internal Server Error');
}
