// std
import { strictEqual } from 'assert';

// FoalTS
import { formatError } from './format-error';

describe('formatError', () => {

  describe('should return a function that', () => {

    it('call the resolver with the given arguments and return its value as a resolved promise.', async () => {
      function resolver(arg1: string): string {
        return `${arg1}!!!`;
      }

      const result = formatError(resolver, () => {})('hello');
      if (!(result instanceof Promise)) {
        throw new Error('The result should be a promise');
      }

      strictEqual(await result, 'hello!!!');
    });

    it('format and reject errors rejected in the resolver.', done => {
      function resolver() {
        return Promise.reject(new Error('hello'));
      }
      function formatFunction(err: Error) {
        return new Error(err.message + '!!!');
      }

      formatError(resolver, formatFunction)()
        .then(() => done('The function should have thrown an Error'))
        .catch(err => {
          try {
            strictEqual(err.message, 'hello!!!');
          } catch (error: any) {
            return done(error);
          }
          return done();
        });
    });

    it('format and reject errors thrown in the resolver.', done => {
      function resolver() {
        throw new Error('hello');
      }
      function formatFunction(err: Error) {
        return new Error(err.message + '!!!');
      }

      formatError(resolver, formatFunction)()
        .then(() => done('The function should have thrown an Error'))
        .catch(err => {
          try {
            strictEqual(err.message, 'hello!!!');
          } catch (error: any) {
            return done(error);
          }
          return done();
        });
    });

    it('format errors with an asynchronous formatFunction', done => {
      function resolver() {
        return Promise.reject(new Error('hello'));
      }
      function formatFunction(err: Error) {
        return Promise.resolve(new Error(err.message + '!!!'));
      }

      formatError(resolver, formatFunction)()
        .then(() => done('The function should have thrown an Error'))
        .catch(err => {
          try {
            strictEqual(err.message, 'hello!!!');
          } catch (error: any) {
            return done(error);
          }
          return done();
        });
    });

  });

});
