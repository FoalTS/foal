import { deepStrictEqual, strictEqual, throws } from 'assert';
import { formatMessage } from './logger.utils';

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
  const localTimeNow = '2:12:03 AM';
  const now = new Date(isoNow);

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
        const expected = `\u001b[90m[${localTimeNow}]\u001b[39m \u001b[35mDEBUG\u001b[39m Hello world`
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
        const expected = `\u001b[90m[${localTimeNow}]\u001b[39m \u001b[36mINFO\u001b[39m Hello world`
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
        const expected = `\u001b[90m[${localTimeNow}]\u001b[39m \u001b[33mWARN\u001b[39m Hello world`
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
        const expected = `\u001b[90m[${localTimeNow}]\u001b[39m \u001b[31mERROR\u001b[39m Hello world`
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
})