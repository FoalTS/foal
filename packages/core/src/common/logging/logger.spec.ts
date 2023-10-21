// std
import { strictEqual } from 'assert';
import { mock } from 'node:test';

// FoalTS
import { Logger } from './logger';
import { Config } from '../../core';

describe('Logger', () => {

  afterEach(() => {
    mock.reset();
    Config.remove('settings.logger.format');
    Config.remove('settings.logger.logLevel');
  })

  describe('has a "log" method that', () => {

    context('given the configuration "settings.logger.format" is NOT defined', () => {
      it('should log the message to a raw text.', () => {
        const consoleMock = mock.method(console, 'log', () => {});

        const logger = new Logger();
        logger.log('error', 'Hello world', {});

        strictEqual(consoleMock.mock.callCount(), 1);

        const loggedMessage = consoleMock.mock.calls[0].arguments[0];

        strictEqual(loggedMessage.includes('[ERROR]'), true);
      })
    });

    context('given the configuration "settings.logger.format" is "json"', () => {
      it('should log the message to a JSON.', () => {
        Config.set('settings.logger.format', 'json');

        const consoleMock = mock.method(console, 'log', () => {});

        const logger = new Logger();
        logger.log('error', 'Hello world', {});

        strictEqual(consoleMock.mock.callCount(), 1);

        const loggedMessage = consoleMock.mock.calls[0].arguments[0];
        const json = JSON.parse(loggedMessage);

        strictEqual(json.level, 'error');
      });
    });

    context('given the configuration "settings.logger.format" is "none"', () => {
      it('should log nothing.', () => {
        Config.set('settings.logger.format', 'none');

        const consoleMock = mock.method(console, 'log', () => {});

        const logger = new Logger();
        logger.log('error', 'Hello world', {});

        strictEqual(consoleMock.mock.callCount(), 0);
      });
    });

    context('given the configuration "settings.logger.logLevel" is NOT defined', () => {
      it('should log messages based on an "INFO" log level', () => {
        const consoleMock = mock.method(console, 'log', () => {});

        const logger = new Logger();
        logger.log('info', 'Hello world', {});
        strictEqual(consoleMock.mock.callCount(), 1);

        consoleMock.mock.resetCalls();

        logger.log('debug', 'Hello world', {});
        strictEqual(consoleMock.mock.callCount(), 0);
      });
    });

    context('given the configuration "settings.logger.logLevel" is "warn"', () => {
      it('should log messages based on a "WARN" log level', () => {
        Config.set('settings.logger.logLevel', 'warn');

        const consoleMock = mock.method(console, 'log', () => {});

        const logger = new Logger();
        logger.log('warn', 'Hello world', {});
        strictEqual(consoleMock.mock.callCount(), 1);

        consoleMock.mock.resetCalls();

        logger.log('info', 'Hello world', {});
        strictEqual(consoleMock.mock.callCount(), 0);
      });
    });
  });

  it('has a debug(...args) method which is an alias for log("debug", ...args)', () => {
    Config.set('settings.logger.logLevel', 'debug');

    const logger = new Logger();

    const consoleMock = mock.method(console, 'log', () => {});

    logger.debug('Hello world', {});

    strictEqual(consoleMock.mock.callCount(), 1);
    strictEqual(
      consoleMock.mock.calls[0].arguments[0].includes('[DEBUG]'),
      true,
    );
  });

  it('has an info(...args) method which is an alias for log("info", ...args)', () => {
    const logger = new Logger();

    const consoleMock = mock.method(console, 'log', () => {});

    logger.info('Hello world', {});

    strictEqual(consoleMock.mock.callCount(), 1);
    strictEqual(
      consoleMock.mock.calls[0].arguments[0].includes('[INFO]'),
      true,
    );
  });

  it('has a warn(...args) method which is an alias for log("warn", ...args)', () => {
    const logger = new Logger();

    const consoleMock = mock.method(console, 'log', () => {});

    logger.warn('Hello world', {});

    strictEqual(consoleMock.mock.callCount(), 1);
    strictEqual(
      consoleMock.mock.calls[0].arguments[0].includes('[WARN]'),
      true,
    );
  });

  it('has an error(...args) method which is an alias for log("error", ...args)', () => {
    const logger = new Logger();

    const consoleMock = mock.method(console, 'log', () => {});

    logger.error('Hello world', {});

    strictEqual(consoleMock.mock.callCount(), 1);
    strictEqual(
      consoleMock.mock.calls[0].arguments[0].includes('[ERROR]'),
      true,
    );
  });
});
