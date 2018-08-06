// std
import { strictEqual } from 'assert';

// FoalTS
import { isValidationError, ValidationError } from './validation-error';

describe('ValidationError', () => {

  it('should accept an optional content.', () => {
    let err = new ValidationError();
    strictEqual(err.content, undefined);

    const content = { foo: 'bar' };
    err = new ValidationError(content);
    strictEqual(err.content, content);
  });

});

describe('isValidationError', () => {

  it('should return true if the given object is an instance of ValidationError.', () => {
    const err = new ValidationError();
    strictEqual(isValidationError(err), true);
  });

  it('should return true if the given object has an isValidationError property equal to true.', () => {
    const err = { isValidationError: true };
    strictEqual(isValidationError(err), true);
  });

  it('should return false if the given object is not an instance of ValidationError and if it '
      + 'has no property isValidationError.', () => {
    const err = {};
    strictEqual(isValidationError(err), false);
  });

});
