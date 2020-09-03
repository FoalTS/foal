// std
import { strictEqual } from 'assert';

// 3p
import { Config } from '@foal/core';

// FoalTS
import { maskAndLogError } from './mask-and-log-error';

describe('maskAndLogError', () => {

  afterEach(() => Config.remove('settings.debug'));

  it('should return the error if the config key settings.debug is true.', () => {
    Config.set('settings.debug', true);

    const err = new Error('This is an error (that should be shown in the logs)');

    const result = maskAndLogError(err);
    strictEqual(result, err);
  });

  it('should return an "Internal Server Error" otherwise.', () => {
    const err = new Error('This is an error (that should be shown in the logs)');

    const result = maskAndLogError(err);
    strictEqual(result.message, 'Internal Server Error');
  });

});
