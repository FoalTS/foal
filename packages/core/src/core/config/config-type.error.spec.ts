// std
import { strictEqual } from 'assert';

// FoalTS
import { ConfigTypeError } from './config-type.error';

const errMessage = `

  --------------------------------------------------------
|                                                          |
|  Configuration file                                      |
|                                                          |
| -------------------------------------------------------- |
|                                                          |
|  {                                                       |
|    settings: {                                           |
|      session: {                                          |
|->      store: *************                              |
|      }                                                   |
|    }                                                     |
|  }                                                       |
|                                                          |
  --------------------------------------------------------

The value of the configuration key "settings.session.store" has an invalid type.

Expected a "string", but got a "boolean".
`;

describe('ConfigTypeError', () => {

  it('should set three properties "key", "expected" and "actual" from the constructor.', () => {
    const err = new ConfigTypeError('settings.xxx', 'string', 'boolean');
    strictEqual(err.key, 'settings.xxx');
    strictEqual(err.expected, 'string');
    strictEqual(err.actual, 'boolean');
  });

  it('should have the proper message.', () => {
    const err = new ConfigTypeError('settings.session.store', 'string', 'boolean');
    strictEqual(err.message, errMessage);
  });

});
