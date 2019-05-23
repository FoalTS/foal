// std
import { strictEqual } from 'assert';

// FoalTS
import { maskAndLogErrors } from './mask-and-log-errors';

describe('maskAndLogErrors', () => {

  afterEach(() => delete process.env.SETTINGS_DEBUG);

  it('should return the error if the config key settings.debug is true.', () => {
    process.env.SETTINGS_DEBUG = 'true';
    const err = new Error('This is an error (that should be shown in the logs)');

    const result = maskAndLogErrors(err);
    strictEqual(result, err);
  });

  it('should return an "Internal Server Error" otherwise.', () => {
    const err = new Error('This is an error (that should be shown in the logs)');

    const result = maskAndLogErrors(err);
    strictEqual(result.message, 'Internal Server Error');
  });

});
