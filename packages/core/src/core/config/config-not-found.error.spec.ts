// std
import { strictEqual } from 'assert';

// FoalTS
import { ConfigNotFoundError } from './config-not-found.error';

const errMessage = (msg: string) => `

  --------------------------------------------------------
|                                                          |
|  JSON file (config/default.json, config/test.json, ...)  |
|                                                          |
| -------------------------------------------------------- |
|                                                          |
|  {                                                       |
|    "settings": {                                         |
|      "session": {                                        |
|        "store": <your_value>                             |
|        // OR with an environment variable:               |
|        "store": "env(<YOUR_ENVIRONMENT_VARIABLE>)"       |
|      }                                                   |
|    }                                                     |
|  }                                                       |
|                                                          |
  --------------------------------------------------------

  --------------------------------------------------------
|                                                          |
|  YAML file (config/default.yml, config/test.yml, ...)    |
|                                                          |
| -------------------------------------------------------- |
|                                                          |
|  settings:                                               |
|    session:                                              |
|      store: <your_value>                                 |
|      # OR with an environment variable:                  |
|      store: env(<YOUR_ENVIRONMENT_VARIABLE>)             |
|                                                          |
  --------------------------------------------------------

  --------------------------------------------------------
|                                                          |
|  JS file (config/default.js, config/test.js, ...)        |
|                                                          |
| -------------------------------------------------------- |
|                                                          |
|  const { Env } = require('@foal/core');                  |
|                                                          |
|  {                                                       |
|    settings: {                                           |
|      session: {                                          |
|        store: <your_value>                               |
|        // OR with an environment variable:               |
|        store: Env.get('<YOUR_ENVIRONMENT_VARIABLE>')     |
|      }                                                   |
|    }                                                     |
|  }                                                       |
|                                                          |
  --------------------------------------------------------

No value found for the configuration key "settings.session.store".${msg}

To pass a value, use one of the examples above.
`;

describe('ConfigNotFoundError', () => {

  it('should set the property "key" and "msg" from the constructor.', () => {
    const err = new ConfigNotFoundError('settings.xxx');
    strictEqual(err.key, 'settings.xxx');
    strictEqual(err.msg, undefined);

    const err2 = new ConfigNotFoundError('settings.xxx', 'You must provide a secret.');
    strictEqual(err2.msg, 'You must provide a secret.');
  });

  it('should have the proper message.', () => {
    const err = new ConfigNotFoundError('settings.session.store');
    strictEqual(err.message, errMessage(''));
  });

  it('should have the proper message (custom message).', () => {
    const err = new ConfigNotFoundError('settings.session.store', 'Custom message');
    strictEqual(err.message, errMessage('\n\nCustom message'));
  });

});
