// std
import { ok, strictEqual } from 'assert';

// FoalTS
import { InvalidTokenError, isInvalidTokenError } from './invalid-token.error';

describe('InvalidTokenError', () => {
  it('should extend Error.', () => {
    const err = new InvalidTokenError();
    ok(err instanceof Error);
  });
});

describe('isInvalidTokenError', () => {

  it('should return true if the given object is an instance of InvalidTokenError.', () => {
    const err = new InvalidTokenError();
    strictEqual(isInvalidTokenError(err), true);
  });

  it('should return true if the given object has an isInvalidTokenError property equal to true.', () => {
    const err = { isInvalidTokenError: true };
    strictEqual(isInvalidTokenError(err), true);
  });

  it('should return false if the given object is not an instance of InvalidTokenError and if it '
      + 'has no property isInvalidTokenError.', () => {
    const err = {};
    strictEqual(isInvalidTokenError(err), false);
    strictEqual(isInvalidTokenError(undefined), false);
    strictEqual(isInvalidTokenError(null), false);
  });

});
