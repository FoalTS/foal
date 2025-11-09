// std
import { notStrictEqual, strictEqual } from 'assert';
import { mock } from 'node:test';

// FoalTS
import { Logger } from './logger';
import { Config } from '../config';

describe('Logger', () => {

  afterEach(() => {
    mock.reset();
    Config.remove('settings.logger.format');
    Config.remove('settings.logger.logLevel');
  })

  describe('has a "log" method that', () => {

    context('given the log context has been initialized', () => {
      it('should log the message with the context.', () => {
        const consoleMock = mock.method(console, 'log', () => {}).mock;

        const logger = new Logger();
        logger.initLogContext(() => {
          logger.addLogContext({ foo: 'bar', jane: 'doe'});
          logger.log('error', 'Hello world', {});
        });
        logger.initLogContext(() => {
          logger.addLogContext({ foo2: 'bar2' });
          logger.log('error', 'Hello world 2', {});
        });

        strictEqual(consoleMock.callCount(), 2);

        const loggedMessage = consoleMock.calls[0].arguments[0];

        strictEqual(loggedMessage.includes('[ERROR]'), true);
        strictEqual(loggedMessage.includes('foo: "bar"'), true);
        strictEqual(loggedMessage.includes('jane: "doe"'), true);
        notStrictEqual(loggedMessage.includes('foo2: "bar2"'), true);

        const loggedMessage2 = consoleMock.calls[1].arguments[0];

        strictEqual(loggedMessage2.includes('[ERROR]'), true);
        strictEqual(loggedMessage2.includes('foo2: "bar2"'), true);
        notStrictEqual(loggedMessage2.includes('foo: "bar"'), true);
        notStrictEqual(loggedMessage2.includes('jane: "doe"'), true);
      });

      it('should let given params override the context.', () => {
        const consoleMock = mock.method(console, 'log', () => {}).mock;

        const logger = new Logger();
        logger.initLogContext(() => {
          logger.addLogContext({ foo: 'bar' });
          logger.log('error', 'Hello world', { foo: 'bar2' });
        });

        strictEqual(consoleMock.callCount(), 1);

        const loggedMessage = consoleMock.calls[0].arguments[0];

        strictEqual(loggedMessage.includes('[ERROR]'), true);
        strictEqual(loggedMessage.includes('foo: "bar2"'), true);
      });

      it('should log the message with error context for error-level logs.', () => {
        const consoleMock = mock.method(console, 'log', () => {}).mock;

        const logger = new Logger();
        logger.initLogContext(() => {
          logger.addErrorContext({ errorKey: 'errorValue', foo: 'errorBar' });
          logger.log('error', 'Hello world', {});
        });

        strictEqual(consoleMock.callCount(), 1);

        const loggedMessage = consoleMock.calls[0].arguments[0];

        strictEqual(loggedMessage.includes('[ERROR]'), true);
        strictEqual(loggedMessage.includes('foo: "errorBar"'), true);
        strictEqual(loggedMessage.includes('errorKey: "errorValue"'), true);
      });

      it('should not include error context for non error-level logs.', () => {
        const consoleMock = mock.method(console, 'log', () => {}).mock;

        const logger = new Logger();
        logger.initLogContext(() => {
          logger.addErrorContext({ errorKey: 'errorValue', foo: 'errorBar' });
          logger.log('info', 'Hello world', {});
        });

        strictEqual(consoleMock.callCount(), 1);

        const loggedMessage = consoleMock.calls[0].arguments[0];

        strictEqual(loggedMessage.includes('[INFO]'), true);
        notStrictEqual(loggedMessage.includes('foo: "errorBar"'), true);
        notStrictEqual(loggedMessage.includes('errorKey: "errorValue"'), true);
      });

      it('should let error context override the context for the same keys.', () => {
        const consoleMock = mock.method(console, 'log', () => {}).mock;

        const logger = new Logger();
        logger.initLogContext(() => {
          logger.addLogContext({ foo: 'bar', commonKey: 'contextValue' });
          logger.addErrorContext({ errorKey: 'errorValue', commonKey: 'errorValue2' });
          logger.log('error', 'Hello world', {});
        });

        strictEqual(consoleMock.callCount(), 1);

        const loggedMessage = consoleMock.calls[0].arguments[0];

        strictEqual(loggedMessage.includes('[ERROR]'), true);
        strictEqual(loggedMessage.includes('foo: "bar"'), true);
        strictEqual(loggedMessage.includes('errorKey: "errorValue"'), true);
        strictEqual(loggedMessage.includes('commonKey: "errorValue2"'), true);
      });

      it('should let given params override the error context.', () => {
        const consoleMock = mock.method(console, 'log', () => {}).mock;

        const logger = new Logger();
        logger.initLogContext(() => {
          logger.addErrorContext({ errorKey: 'errorValue', commonKey: 'errorValue' });
          logger.log('error', 'Hello world', { foo: 'baz', commonKey: 'newValue' });
        });

        strictEqual(consoleMock.callCount(), 1);

        const loggedMessage = consoleMock.calls[0].arguments[0];

        strictEqual(loggedMessage.includes('[ERROR]'), true);
        strictEqual(loggedMessage.includes('foo: "baz"'), true);
        strictEqual(loggedMessage.includes('errorKey: "errorValue"'), true);
        strictEqual(loggedMessage.includes('commonKey: "newValue"'), true);
      });
    });

    context('given the log context has NOT been initialized', () => {
      it('should log a warning message when adding log context.', () => {
        const consoleMock = mock.method(console, 'log', () => {}).mock;

        const logger = new Logger();
        logger.addLogContext({ foo: 'bar' });

        strictEqual(consoleMock.callCount(), 1);

        const loggedMessage = consoleMock.calls[0].arguments[0];

        strictEqual(loggedMessage.includes('[WARN]'), true);
        strictEqual(
          loggedMessage.includes('Impossible to add log context information. The logger context has not been initialized.'),
          true
        );
      });

      it('should log a warning message when adding error context.', () => {
        const consoleMock = mock.method(console, 'log', () => {}).mock;

        const logger = new Logger();
        logger.addErrorContext({ foo: 'bar' });

        strictEqual(consoleMock.callCount(), 1);

        const loggedMessage = consoleMock.calls[0].arguments[0];

        strictEqual(loggedMessage.includes('[WARN]'), true);
        strictEqual(
          loggedMessage.includes('Impossible to add error context information. The logger context has not been initialized.'),
          true
        );
      });
    });

    context('given the configuration "settings.logger.format" is NOT defined', () => {
      it('should log the message to a raw text.', () => {
        const consoleMock = mock.method(console, 'log', () => {}).mock;

        const logger = new Logger();
        logger.log('error', 'Hello world', { foobar: 'bar' });

        strictEqual(consoleMock.callCount(), 1);

        const loggedMessage = consoleMock.calls[0].arguments[0];

        strictEqual(loggedMessage.includes('[ERROR]'), true);
        strictEqual(loggedMessage.includes('foobar: "bar"'), true);
      })
    });

    context('given the configuration "settings.logger.format" is "json"', () => {
      it('should log the message to a JSON.', () => {
        Config.set('settings.logger.format', 'json');

        const consoleMock = mock.method(console, 'log', () => {}).mock;

        const logger = new Logger();
        logger.log('error', 'Hello world', { foobar: 'bar' });

        strictEqual(consoleMock.callCount(), 1);

        const loggedMessage = consoleMock.calls[0].arguments[0];
        const json = JSON.parse(loggedMessage);

        strictEqual(json.level, 'error');
        strictEqual(json.foobar, 'bar');
      });
    });

    context('given the configuration "settings.logger.format" is "none"', () => {
      it('should log nothing.', () => {
        Config.set('settings.logger.format', 'none');

        const consoleMock = mock.method(console, 'log', () => {}).mock;

        const logger = new Logger();
        logger.log('error', 'Hello world', {});

        strictEqual(consoleMock.callCount(), 0);
      });
    });

    context('given the configuration "settings.logger.logLevel" is NOT defined', () => {
      it('should log messages based on an "INFO" log level', () => {
        const consoleMock = mock.method(console, 'log', () => {}).mock;

        const logger = new Logger();
        logger.log('info', 'Hello world', {});
        strictEqual(consoleMock.callCount(), 1);

        consoleMock.resetCalls();

        logger.log('debug', 'Hello world', {});
        strictEqual(consoleMock.callCount(), 0);
      });
    });

    context('given the configuration "settings.logger.logLevel" is "warn"', () => {
      it('should log messages based on a "WARN" log level', () => {
        Config.set('settings.logger.logLevel', 'warn');

        const consoleMock = mock.method(console, 'log', () => {}).mock;

        const logger = new Logger();
        logger.log('warn', 'Hello world', {});
        strictEqual(consoleMock.callCount(), 1);

        consoleMock.resetCalls();

        logger.log('info', 'Hello world', {});
        strictEqual(consoleMock.callCount(), 0);
      });
    });

    context('given transports have been registered', () => {
      it('should send them the logs and their levels.', () => {
        const transport1 = mock.fn((level, log) => {});
        const transport2 = mock.fn((level, log) => {});

        const logger = new Logger();
        logger.addTransport(transport1);
        logger.addTransport(transport2);
        logger.log('error', 'Hello world', {});

        strictEqual(transport1.mock.callCount(), 1);
        strictEqual(transport1.mock.calls[0].arguments[0], 'error');
        strictEqual(transport1.mock.calls[0].arguments[1].includes('Hello world'), true);

        strictEqual(transport2.mock.callCount(), 1);
        strictEqual(transport2.mock.calls[0].arguments[0], 'error');
        strictEqual(transport2.mock.calls[0].arguments[1].includes('Hello world'), true);
      });
    })
  });

  it('has a debug(...args) method which is an alias for log("debug", ...args)', () => {
    Config.set('settings.logger.logLevel', 'debug');

    const logger = new Logger();

    const consoleMock = mock.method(console, 'log', () => {}).mock;

    logger.debug('Hello world', {});

    strictEqual(consoleMock.callCount(), 1);
    strictEqual(
      consoleMock.calls[0].arguments[0].includes('[DEBUG]'),
      true,
    );
  });

  it('has an info(...args) method which is an alias for log("info", ...args)', () => {
    const logger = new Logger();

    const consoleMock = mock.method(console, 'log', () => {}).mock;

    logger.info('Hello world', {});

    strictEqual(consoleMock.callCount(), 1);
    strictEqual(
      consoleMock.calls[0].arguments[0].includes('[INFO]'),
      true,
    );
  });

  it('has a warn(...args) method which is an alias for log("warn", ...args)', () => {
    const logger = new Logger();

    const consoleMock = mock.method(console, 'log', () => {}).mock;

    logger.warn('Hello world', {});

    strictEqual(consoleMock.callCount(), 1);
    strictEqual(
      consoleMock.calls[0].arguments[0].includes('[WARN]'),
      true,
    );
  });

  it('has an error(...args) method which is an alias for log("error", ...args)', () => {
    const logger = new Logger();

    const consoleMock = mock.method(console, 'log', () => {}).mock;

    logger.error('Hello world', {});

    strictEqual(consoleMock.callCount(), 1);
    strictEqual(
      consoleMock.calls[0].arguments[0].includes('[ERROR]'),
      true,
    );
  });
});
