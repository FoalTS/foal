// std
import { deepStrictEqual, doesNotThrow, strictEqual } from 'assert';

// FoalTS
import { ServiceManager, Logger } from '../../core';
import { AsyncService } from './async.service';

describe('AsyncService', () => {
  describe('has a "run" method that', () => {
    let asyncService: AsyncService;

    let actualLoggedMessage: string | undefined;
    let actualLoggedParams: { error?: Error; [name: string]: any; } | undefined;

    class LoggerMock {
      error(message: string, params?: {
        error?: Error;
        [name: string]: any;
      }): void {
        actualLoggedMessage = message;
        actualLoggedParams = params;
      }
    }

    beforeEach(() => {
      const serviceManager = new ServiceManager()
        .set(Logger, new LoggerMock());
      asyncService = serviceManager.get(AsyncService);

      actualLoggedMessage = undefined;
      actualLoggedParams = undefined;
    });

    it('should call the function passed as argument.', () => {
      let hasBeenCalled = false;
      const fn = async () => { hasBeenCalled = true; };

      asyncService.run(fn);

      strictEqual(hasBeenCalled, true);
    });

    context('given the function passed as argument throws an error', () => {
      it('should catch it.', () => {
        const fn = () => { throw new Error('This is an error.'); };

        doesNotThrow(() => asyncService.run(fn));
      });

      it('should log the error.', () => {
        const error = new Error('This is an error.');
        const fn = () => { throw error; };

        asyncService.run(fn);

        strictEqual(actualLoggedMessage, error.message);
        deepStrictEqual(actualLoggedParams, { error });
      });
    });

    context('given the function passed as argument returns a rejected promise', () => {
      it('should catch and log the error.', async () => {
        const error = new Error('This is an error.');
        const fn = async () => { throw error; };

        asyncService.run(fn);

        await new Promise(resolve => setTimeout(resolve, 0));

        strictEqual(actualLoggedMessage, error.message);
        deepStrictEqual(actualLoggedParams, { error });
      });
    });
  });
});