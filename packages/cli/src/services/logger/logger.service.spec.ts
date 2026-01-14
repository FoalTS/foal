// std
import { strictEqual } from 'node:assert';

// 3p
import { bgCyan, white, bgGreen, bgRed } from 'colors/safe';

// FoalTS
import { LoggerService } from './logger.service';

describe('LoggerService', () => {
  let loggerService: LoggerService;
  let originalConsoleLog: typeof console.log;
  let originalConsoleError: typeof console.error;
  let loggedMessages: string[];
  let loggedErrors: string[];

  beforeEach(() => {
    loggerService = new LoggerService();
    loggedMessages = [];
    loggedErrors = [];

    originalConsoleLog = console.log;
    originalConsoleError = console.error;
    console.log = (msg: string) => {
      loggedMessages.push(msg);
    };
    console.error = (msg: string) => {
      loggedErrors.push(msg);
    };
  });

  afterEach(() => {
    console.log = originalConsoleLog;
    console.error = originalConsoleError;
  });

  describe('has a "log" method that', () => {

    context('given log level is "info"', () => {
      it('should call console.log with the given message.', () => {
        const message = 'Hello, World!';
        loggerService.log('info', message);

        strictEqual(loggedMessages.length, 1);
        strictEqual(loggedMessages[0], message);

        strictEqual(loggedErrors.length, 0);
      });

      it('should NOT add a prefix to the message when no type is provided.', () => {
        const message = 'Just a log.';
        loggerService.log('info', message);

        strictEqual(loggedMessages.length, 1);
        strictEqual(loggedMessages[0], message);
      });

      it('should NOT add a prefix to the message when type is "default".', () => {
        const message = 'Just a default log.';
        loggerService.log('info', message, 'default');

        strictEqual(loggedMessages.length, 1);
        strictEqual(loggedMessages[0], message);
      });

      it('should add a prefix to the message when type is "build".', () => {
        const message = 'Building...';
        loggerService.log('info', message, 'build');

        strictEqual(loggedMessages.length, 1);
        strictEqual(loggedMessages[0], `${bgCyan(white(' BUILD '))} ${message}`);
      });

      it('should add a prefix to the message when type is "server".', () => {
        const message = 'Server started.';
        loggerService.log('info', message, 'server');

        strictEqual(loggedMessages.length, 1);
        strictEqual(loggedMessages[0], `${bgGreen(white(' SERVER '))} ${message}`);
      });

      it('should add a prefix to the message when type is "create".', () => {
        const message = 'File created.';
        loggerService.log('info', message, 'create');

        strictEqual(loggedMessages.length, 1);
        strictEqual(loggedMessages[0], `${bgGreen(white(' CREATE '))} ${message}`);
      });

      it('should add a prefix to the message when type is "update".', () => {
        const message = 'File updated.';
        loggerService.log('info', message, 'update');

        strictEqual(loggedMessages.length, 1);
        strictEqual(loggedMessages[0], `${bgCyan(white(' UPDATE '))} ${message}`);
      });
    });

    context('given log level is "error"', () => {
      it('should call console.error with the given message.', () => {
        const message = 'An error occurred.';
        loggerService.log('error', message);

        strictEqual(loggedMessages.length, 0);

        strictEqual(loggedErrors.length, 1);
        strictEqual(loggedErrors[0], message);
      });

      it('should NOT add a prefix to the message when no type is provided.', () => {
        const message = 'Just an error.';
        loggerService.log('error', message);

        strictEqual(loggedErrors.length, 1);
        strictEqual(loggedErrors[0], message);
      });

      it('should NOT add a prefix to the message when type is "default".', () => {
        const message = 'Just a default error.';
        loggerService.log('error', message, 'default');

        strictEqual(loggedErrors.length, 1);
        strictEqual(loggedErrors[0], message);
      });

      it('should add a prefix to the message when type is "build".', () => {
        const message = 'Build error.';
        loggerService.log('error', message, 'build');

        strictEqual(loggedErrors.length, 1);
        strictEqual(loggedErrors[0], `${bgRed(white(' BUILD '))} ${message}`);
      });

      it('should add a prefix to the message when type is "server".', () => {
        const message = 'Server error.';
        loggerService.log('error', message, 'server');

        strictEqual(loggedErrors.length, 1);
        strictEqual(loggedErrors[0], `${bgRed(white(' SERVER '))} ${message}`);
      });

      it('should add a prefix to the message when type is "create".', () => {
        const message = 'Create error.';
        loggerService.log('error', message, 'create');

        strictEqual(loggedErrors.length, 1);
        strictEqual(loggedErrors[0], `${bgRed(white(' CREATE '))} ${message}`);
      });

      it('should add a prefix to the message when type is "update".', () => {
        const message = 'Update error.';
        loggerService.log('error', message, 'update');

        strictEqual(loggedErrors.length, 1);
        strictEqual(loggedErrors[0], `${bgRed(white(' UPDATE '))} ${message}`);
      });
    });

    it('should add a line break between two different block types.', () => {
      loggerService.log('info', 'Building...', 'build');
      loggerService.log('info', 'Still building...', 'build');
      loggerService.log('info', 'Server started.', 'server');
      loggerService.log('info', 'Another server log.', 'server');
      loggerService.log('info', 'A default log.');
      loggerService.log('info', 'Another default log.');

      strictEqual(loggedMessages.length, 8);
      strictEqual(loggedMessages[0].endsWith('Building...'), true);
      strictEqual(loggedMessages[1].endsWith('Still building...'), true);
      strictEqual(loggedMessages[2], '');
      strictEqual(loggedMessages[3].endsWith('Server started.'), true);
      strictEqual(loggedMessages[4].endsWith('Another server log.'), true);
      strictEqual(loggedMessages[5], '');
      strictEqual(loggedMessages[6], 'A default log.');
      strictEqual(loggedMessages[7], 'Another default log.');
    });
  });
});