// std
import { strictEqual } from 'assert';

// FoalTS
import { ConfigTypeError } from './config-type.error';

describe('ConfigTypeError', () => {

  it('should set three properties "key", "expected" and "actual" from the constructor.', () => {
    const err = new ConfigTypeError('settings.xxx', 'string', 'boolean');
    strictEqual(err.key, 'settings.xxx');
    strictEqual(err.expected, 'string');
    strictEqual(err.actual, 'boolean');
  });

  it('should have the proper message.', () => {
    const err = new ConfigTypeError('settings.session.store', 'string', 'boolean');

    const expected = `The value of the configuration key "settings.session.store" has an invalid type. Expected a "string", but got a "boolean".`;
    const actual = err.message;

    strictEqual(actual, expected);
  });

});
