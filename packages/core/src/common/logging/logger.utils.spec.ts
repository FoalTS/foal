import { deepStrictEqual, strictEqual, throws } from 'assert';
import { formatMessage, shouldLog } from './logger.utils';

const testStack = `Error: aaa
    at createTestParams (/somewhere/logger.spec.ts:6:11)
    at Context.<anonymous> (/somewhere/logger.spec.ts:129:13)`;

function createTestParams() {
  const error = new Error('aaa');
  error.stack = testStack;
  return {
    myBoolean: false,
    myNull: null,
    myUndefined: undefined,
    myNumber: 0,
    myString: 'xxx',
    mySymbol: Symbol('yyy'),
    myObject: { foo: 'bar' },
    error
  };
}

describe('formatMessage', () => {
  const isoNow = '2023-02-03T01:12:03.000Z';
  const now = new Date(isoNow);
  const localeTimeNow = now.toLocaleTimeString();

  context('given format is "raw"', () => {
    it('should return a raw text with a full timestamp, detailed params but with no colors.', () => {
      const message = 'Hello world';
      const params = createTestParams();

      const actual = formatMessage('debug', message, params, 'raw', now);
      const expected = `[${isoNow}] [DEBUG] Hello world`
        + `\n    myBoolean: false`
        + `\n    myNull: null`
        + `\n    myNumber: 0`
        + `\n    myString: "xxx"`
        + `\n    myObject: {`
        + `\n      "foo": "bar"`
        + `\n    }`
        + `\n    error: {`
        + `\n      name: "Error"`
        + `\n      message: "aaa"`
        + `\n      stack: Error: aaa`
        + `\n        at createTestParams (/somewhere/logger.spec.ts:6:11)`
        + `\n        at Context.<anonymous> (/somewhere/logger.spec.ts:129:13)`
        + `\n    }`;

      strictEqual(actual, expected);
    });
  });

  context('given format is "dev"', () => {
    context('given level is "debug"', () => {
      it('should return a text with gray and pink colors, a short timestamp but with no detailed params (expect for the "error" param).', () => {
        const message = 'Hello world';
        const params = createTestParams();

        const actual = formatMessage('debug', message, params, 'dev', now)
        const expected = `\u001b[90m[${localeTimeNow}]\u001b[39m \u001b[35mDEBUG\u001b[39m Hello world`
          + `\n    error: {`
          + `\n      name: "Error"`
          + `\n      message: "aaa"`
          + `\n      stack: Error: aaa`
          + `\n        at createTestParams (/somewhere/logger.spec.ts:6:11)`
          + `\n        at Context.<anonymous> (/somewhere/logger.spec.ts:129:13)`
          + `\n    }`;

        strictEqual(actual, expected);
      });
    });

    context('given level is "info"', () => {
      it('should return a text with gray and cyan colors, a short timestamp but with no detailed params (expect for the "error" param).', () => {
        const message = 'Hello world';
        const params = createTestParams();

        const actual = formatMessage('info', message, params, 'dev', now)
        const expected = `\u001b[90m[${localeTimeNow}]\u001b[39m \u001b[36mINFO\u001b[39m Hello world`
          + `\n    error: {`
          + `\n      name: "Error"`
          + `\n      message: "aaa"`
          + `\n      stack: Error: aaa`
          + `\n        at createTestParams (/somewhere/logger.spec.ts:6:11)`
          + `\n        at Context.<anonymous> (/somewhere/logger.spec.ts:129:13)`
          + `\n    }`;

        strictEqual(actual, expected);
      });
    });

    context('given level is "warn"', () => {
      it('should return a text with gray and yellow colors, a short timestamp but with no detailed params (expect for the "error" param).', () => {
        const message = 'Hello world';
        const params = createTestParams();

        const actual = formatMessage('warn', message, params, 'dev', now)
        const expected = `\u001b[90m[${localeTimeNow}]\u001b[39m \u001b[33mWARN\u001b[39m Hello world`
          + `\n    error: {`
          + `\n      name: "Error"`
          + `\n      message: "aaa"`
          + `\n      stack: Error: aaa`
          + `\n        at createTestParams (/somewhere/logger.spec.ts:6:11)`
          + `\n        at Context.<anonymous> (/somewhere/logger.spec.ts:129:13)`
          + `\n    }`;

        strictEqual(actual, expected);
      });
    });

    context('given level is "error"', () => {
      it('should return a text with gray and red colors, a short timestamp but with no detailed params (expect for the "error" param).', () => {
        const message = 'Hello world';
        const params = createTestParams();

        const actual = formatMessage('error', message, params, 'dev', now)
        const expected = `\u001b[90m[${localeTimeNow}]\u001b[39m \u001b[31mERROR\u001b[39m Hello world`
          + `\n    error: {`
          + `\n      name: "Error"`
          + `\n      message: "aaa"`
          + `\n      stack: Error: aaa`
          + `\n        at createTestParams (/somewhere/logger.spec.ts:6:11)`
          + `\n        at Context.<anonymous> (/somewhere/logger.spec.ts:129:13)`
          + `\n    }`;

        strictEqual(actual, expected);
      });
    });

    context('given the message is a HTTP log and is prefixed by "HTTP request -"', () => {
      it('should return a text with a well-formatted message (1xx status).', () => {
        const message = 'HTTP request - GET /foo/bar';
        const params = {
          statusCode: 100,
          responseTime: 123,
        };

        const actual = formatMessage('info', message, params, 'dev', now);
        const expected = `\u001b[90m[${localeTimeNow}]\u001b[39m \u001b[36mINFO\u001b[39m GET /foo/bar 100 - 123 ms`

        strictEqual(actual, expected);
      });

      it('should return a text with a well-formatted message (2xx status).', () => {
        const message = 'HTTP request - GET /foo/bar';
        const params = {
          statusCode: 200,
          responseTime: 123,
        };

        const actual = formatMessage('info', message, params, 'dev', now);
        const expected = `\u001b[90m[${localeTimeNow}]\u001b[39m \u001b[36mINFO\u001b[39m GET /foo/bar \u001b[32m200\u001b[39m - 123 ms`

        strictEqual(actual, expected);
      });

      it('should return a text with a well-formatted message (3xx status).', () => {
        const message = 'HTTP request - GET /foo/bar';
        const params = {
          statusCode: 300,
          responseTime: 123,
        };

        const actual = formatMessage('info', message, params, 'dev', now);
        const expected = `\u001b[90m[${localeTimeNow}]\u001b[39m \u001b[36mINFO\u001b[39m GET /foo/bar \u001b[36m300\u001b[39m - 123 ms`

        strictEqual(actual, expected);
      });

      it('should return a text with a well-formatted message (4xx status).', () => {
        const message = 'HTTP request - GET /foo/bar';
        const params = {
          statusCode: 400,
          responseTime: 123,
        };

        const actual = formatMessage('info', message, params, 'dev', now);
        const expected = `\u001b[90m[${localeTimeNow}]\u001b[39m \u001b[36mINFO\u001b[39m GET /foo/bar \u001b[33m400\u001b[39m - 123 ms`

        strictEqual(actual, expected);
      });

      it('should return a text with a well-formatted message (5xx status).', () => {
        const message = 'HTTP request - GET /foo/bar';
        const params = {
          statusCode: 500,
          responseTime: 123,
        };

        const actual = formatMessage('info', message, params, 'dev', now);
        const expected = `\u001b[90m[${localeTimeNow}]\u001b[39m \u001b[36mINFO\u001b[39m GET /foo/bar \u001b[31m500\u001b[39m - 123 ms`

        strictEqual(actual, expected);
      });

      it('should return a text with a well-formatted message (no status code).', () => {
        const message = 'HTTP request - GET /foo/bar';
        const params = {
          statusCode: null,
          responseTime: null,
        };

        const actual = formatMessage('info', message, params, 'dev', now);
        const expected = `\u001b[90m[${localeTimeNow}]\u001b[39m \u001b[36mINFO\u001b[39m GET /foo/bar null - null ms`

        strictEqual(actual, expected);
      });

      it('should return a text with a well-formatted message (unexpected undefined status code).', () => {
        const message = 'HTTP request - GET /foo/bar';
        const params = {
          statusCode: undefined,
          responseTime: null,
        };

        const actual = formatMessage('info', message, params, 'dev', now);
        const expected = `\u001b[90m[${localeTimeNow}]\u001b[39m \u001b[36mINFO\u001b[39m GET /foo/bar undefined - null ms`

        strictEqual(actual, expected);
      });
    });

    context('given the message is a socket.io log and is prefixed by "Socket.io message received -"', () => {
      it('should return a text with a well-formatted message (status "ok").', () => {
        const message = 'Socket.io message received - create user';
        const params = {
          status: 'ok'
        };

        const actual = formatMessage('info', message, params, 'dev', now);
        const expected = `\u001b[90m[${localeTimeNow}]\u001b[39m \u001b[36mINFO\u001b[39m Socket.io create user \u001b[32mok\u001b[39m`

        strictEqual(actual, expected);
      });

      it('should return a text with a well-formatted message (status "error").', () => {
        const message = 'Socket.io message received - create user';
        const params = {
          status: 'error'
        };

        const actual = formatMessage('info', message, params, 'dev', now);
        const expected = `\u001b[90m[${localeTimeNow}]\u001b[39m \u001b[36mINFO\u001b[39m Socket.io create user \u001b[31merror\u001b[39m`

        strictEqual(actual, expected);
      });
    });
  });

  context('given format is "json"', () => {
    it('should return a JSON string.', () => {
      const message = 'Hello world';
      const params = createTestParams();

      const actual = JSON.parse(formatMessage('debug', message, params, 'json', now) || '');
      const expected = {
        message,
        timestamp: isoNow,
        level: 'debug',
        myBoolean: false,
        myNull: null,
        myNumber: 0,
        myString: 'xxx',
        myObject: { foo: 'bar' },
        error: {
          name: 'Error',
          message: 'aaa',
          stack: testStack,
        }
      };

      deepStrictEqual(actual, expected);
    });
  });

  context('given format is invalid', () => {
    it('should throw an error.', () => {
      const message = 'Hello world';
      const params = createTestParams();

      throws(
        () => formatMessage('debug', message, params, 'invalid', now),
        (error: any) => error.message === 'Invalid logging format: "invalid"'
      );
    });
  });
});

describe('shouldLog', () => {
  context('given the configLogLevel is "debug"', () => {
    it('should return true for all levels.', () => {
      strictEqual(shouldLog('debug', 'debug'), true);
      strictEqual(shouldLog('info', 'debug'), true);
      strictEqual(shouldLog('warn', 'debug'), true);
      strictEqual(shouldLog('error', 'debug'), true);
    });
  });

  context('given the configLogLevel is "info"', () => {
    it('should return false for "debug" and true for "info", "warn" and "error".', () => {
      strictEqual(shouldLog('debug', 'info'), false);
      strictEqual(shouldLog('info', 'info'), true);
      strictEqual(shouldLog('warn', 'info'), true);
      strictEqual(shouldLog('error', 'info'), true);
    });
  });

  context('given the configLogLevel is "warn"', () => {
    it('should return false for "debug" and "info" and true for "warn" and "error".', () => {
      strictEqual(shouldLog('debug', 'warn'), false);
      strictEqual(shouldLog('info', 'warn'), false);
      strictEqual(shouldLog('warn', 'warn'), true);
      strictEqual(shouldLog('error', 'warn'), true);
    });
  });

  context('given the configLogLevel is "error"', () => {
    it('should return false for "debug", "info" and "warn" and true for "error".', () => {
      strictEqual(shouldLog('debug', 'error'), false);
      strictEqual(shouldLog('info', 'error'), false);
      strictEqual(shouldLog('warn', 'error'), false);
      strictEqual(shouldLog('error', 'error'), true);
    });
  });

  context('given the configLogLevel is invalid', () => {
    it('should throw an error.', () => {
      throws(
        () => shouldLog('debug', 'invalid'),
        (error: any) => error.message === 'Invalid log level: "invalid"'
      );
    });
  });
});