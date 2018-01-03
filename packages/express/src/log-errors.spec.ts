import { expect } from 'chai';

import { logErrors } from './log-errors';

describe('logErrors(enabled = true, logFn = console.error)', () => {

  describe('should return an error-handling middleware which', () => {
    const req = {};
    const res = {};
    const error = new Error();

    it('should forward the error to the next error-handling middleware.', () => {
      const middleware = logErrors(false);
      let forwardedError: Error|null = null;
      const next = err => forwardedError = err;

      middleware(error, req, res, next);

      expect(forwardedError).to.equal(error);
    });

    it('should log the error with the given log function if enabled is true.', () => {
      let called = false;
      const logFn = () => called = true;
      const middleware = logErrors(true, logFn);
      const next = () => {};

      middleware(error, req, res, next);

      expect(called).to.equal(true);
    });

    it('should not log the error with the given log function if enabled is false.', () => {
      let called = false;
      const logFn = () => called = true;
      const middleware = logErrors(false, logFn);
      const next = () => {};

      middleware(error, req, res, next);

      expect(called).to.equal(false);
    });

  });

});
