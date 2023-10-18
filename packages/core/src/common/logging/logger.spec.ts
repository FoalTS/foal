import { deepStrictEqual, strictEqual, throws } from 'assert';
import { Logger } from './logger';
import { Config } from '../../core';

const testStack = `Error: aaa
    at createTestParams (/somewhere/logger.spec.ts:6:11)
    at Context.<anonymous> (/somewhere/logger.spec.ts:129:13)`;

function createTestParams() {
  const err = new Error('aaa');
  err.stack = testStack;
  return {
    myBoolean: false,
    myNull: null,
    myUndefined: undefined,
    myNumber: 0,
    myString: 'xxx',
    mySymbol: Symbol('yyy'),
    myObject: { foo: 'bar' },
    err
  };
}

function createLogger(): {
  logger: Logger,
  mocks: { logWithConsoleHasBeenCalledWith: any },
  now: Date,
  isoNow: string,
  localTimeNow: string
} {
  const mocks: { logWithConsoleHasBeenCalledWith: any } = { logWithConsoleHasBeenCalledWith: undefined };

  const isoNow = '2023-02-03T01:12:03.000Z';
  const localTimeNow = '2:12:03 AM';
  const now = new Date(isoNow);

  class Logger2 extends Logger {
    logWithConsole(message: string): void {
      mocks.logWithConsoleHasBeenCalledWith = message;
    }

    getNow(): Date {
      return now;
    }
  }

  const logger = new Logger2();

  return {
    logger,
    mocks,
    now,
    isoNow,
    localTimeNow,
  };
}

describe('Logger', () => {

  afterEach(() => {
    Config.remove('settings.logger.format');
  })

  describe('when debug is called', () => {
    context('given the configuration "settings.logger.format" is NOT defined', () => {
      it('should log a text with an exhaustive timestamp, with params but with no colors', () => {
        const { logger, mocks, isoNow } = createLogger();

        const message = 'Hello world';
        const params = createTestParams();

        logger.debug(message, params);

        const actual = mocks.logWithConsoleHasBeenCalledWith;
        const expected = `[${isoNow}] [DEBUG] Hello world`
          + `\n    myBoolean: false`
          + `\n    myNull: null`
          + `\n    myNumber: 0`
          + `\n    myString: "xxx"`
          + `\n    myObject: {`
          + `\n      "foo": "bar"`
          + `\n    }`
          + `\n    err: {`
          + `\n      name: "Error"`
          + `\n      message: "aaa"`
          + `\n      stack: Error: aaa`
          + `\n        at createTestParams (/somewhere/logger.spec.ts:6:11)`
          + `\n        at Context.<anonymous> (/somewhere/logger.spec.ts:129:13)`
          + `\n    }`;

        strictEqual(actual, expected);
      });
    });

    context('given the configuration "settings.logger.format" is "raw"', () => {
      beforeEach(() => {
        Config.set('settings.logger.format', 'raw');
      });

      it('should log a text with an exhaustive timestamp, with params but with no colors', () => {
        const { logger, mocks, isoNow } = createLogger();

        const message = 'Hello world';
        const params = createTestParams();

        logger.debug(message, params);

        const actual = mocks.logWithConsoleHasBeenCalledWith;
        const expected = `[${isoNow}] [DEBUG] Hello world`
          + `\n    myBoolean: false`
          + `\n    myNull: null`
          + `\n    myNumber: 0`
          + `\n    myString: "xxx"`
          + `\n    myObject: {`
          + `\n      "foo": "bar"`
          + `\n    }`
          + `\n    err: {`
          + `\n      name: "Error"`
          + `\n      message: "aaa"`
          + `\n      stack: Error: aaa`
          + `\n        at createTestParams (/somewhere/logger.spec.ts:6:11)`
          + `\n        at Context.<anonymous> (/somewhere/logger.spec.ts:129:13)`
          + `\n    }`;

        strictEqual(actual, expected);
      });
    });


    context('given the configuration "settings.logger.format" is "dev"', () => {
      beforeEach(() => {
        Config.set('settings.logger.format', 'dev');
      });

      it('should log a text with a short timestamp, with colors but with no params (except the "err" param)', () => {
        const { logger, mocks, localTimeNow } = createLogger();

        const message = 'Hello world';
        const params = createTestParams();

        logger.debug(message, params);

        const actual = mocks.logWithConsoleHasBeenCalledWith;
        // Pink color
        const expected = `\u001b[90m[${localTimeNow}]\u001b[39m \u001b[35mDEBUG\u001b[39m Hello world`
          + `\n    err: {`
          + `\n      name: "Error"`
          + `\n      message: "aaa"`
          + `\n      stack: Error: aaa`
          + `\n        at createTestParams (/somewhere/logger.spec.ts:6:11)`
          + `\n        at Context.<anonymous> (/somewhere/logger.spec.ts:129:13)`
          + `\n    }`;

        strictEqual(actual, expected);
      });
    });

    context('given the configuration "settings.logger.format" is "json"', () => {
      beforeEach(() => {
        Config.set('settings.logger.format', 'json');
      });

      it('should log a JSON', () => {
        const { logger, mocks, isoNow } = createLogger();

        const message = 'Hello world';
        const params = createTestParams();

        logger.debug(message, params);

        const actual = JSON.parse(mocks.logWithConsoleHasBeenCalledWith);
        const expected = {
          message,
          timestamp: isoNow,
          level: 'debug',
          myBoolean: false,
          myNull: null,
          myNumber: 0,
          myString: 'xxx',
          myObject: { foo: 'bar' },
          err: {
            name: 'Error',
            message: 'aaa',
            stack: testStack,
          }
        };

        deepStrictEqual(actual, expected);
      });
    });

    context('given the configuration "settings.logger.format" is "none"', () => {
      beforeEach(() => {
        Config.set('settings.logger.format', 'none');
      });

      it('should log nothing', () => {
        const { logger, mocks, isoNow } = createLogger();

        const message = 'Hello world';
        const params = createTestParams();

        logger.debug(message, params);

        const actual = mocks.logWithConsoleHasBeenCalledWith;
        const expected = undefined;

        strictEqual(actual, expected);
      });
    });

    context('given the configuration "settings.logger.format" has an incorrect value', () => {
      beforeEach(() => {
        Config.set('settings.logger.format', 'foobar');
      });

      it('should throw an error', () => {
        const { logger } = createLogger();

        const message = 'Hello world';

        throws(
          () => logger.debug(message),
          (error: any) => error.message === '[CONFIG] Invalid "settings.logger.format" configuration value: "foobar"'
        );
      });
    });
  });

  describe('when info is called', () => {
    context('given the configuration "settings.logger.format" is "dev"', () => {
      beforeEach(() => {
        Config.set('settings.logger.format', 'dev');
      });

      it('should log a text with the proper color on the log level', () => {
        const { logger, mocks, localTimeNow } = createLogger();

        const message = 'Hello world';
        const params = createTestParams();

        logger.info(message, params);

        const actual = mocks.logWithConsoleHasBeenCalledWith;
        // Cyan color
        const expected = `\u001b[90m[${localTimeNow}]\u001b[39m \u001b[36mINFO\u001b[39m Hello world`;

        strictEqual(actual.split('\n')[0], expected);
      });
    });
  });

  describe('when warn is called', () => {
    context('given the configuration "settings.logger.format" is "dev"', () => {
      beforeEach(() => {
        Config.set('settings.logger.format', 'dev');
      });

      it('should log a text with the proper color on the log level', () => {
        const { logger, mocks, localTimeNow } = createLogger();

        const message = 'Hello world';
        const params = createTestParams();

        logger.warn(message, params);

        const actual = mocks.logWithConsoleHasBeenCalledWith;
        // Yellow color
        const expected = `\u001b[90m[${localTimeNow}]\u001b[39m \u001b[33mWARN\u001b[39m Hello world`;

        strictEqual(actual.split('\n')[0], expected);
      });
    });
  });

  describe('when error is called', () => {
    context('given the configuration "settings.logger.format" is "dev"', () => {
      beforeEach(() => {
        Config.set('settings.logger.format', 'dev');
      });

      it('should log a text with the proper color on the log level', () => {
        const { logger, mocks, localTimeNow } = createLogger();

        const message = 'Hello world';
        const params = createTestParams();

        logger.error(message, params);

        const actual = mocks.logWithConsoleHasBeenCalledWith;
        // Red color
        const expected = `\u001b[90m[${localTimeNow}]\u001b[39m \u001b[31mERROR\u001b[39m Hello world`;

        strictEqual(actual.split('\n')[0], expected);
      });
    });
  });
});
