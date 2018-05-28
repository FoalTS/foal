import { expect } from 'chai';
import { isValidationError, ValidationError } from './validation-error';

describe('isValidationError', () => {

  it('should return true if the given object is an instance of ValidationError.', () => {
    const err = new ValidationError();
    expect(isValidationError(err)).to.equal(true);
  });

  it('should return true if the given object has an isValidationError property equal to true.', () => {
    const err = { isValidationError: true };
    expect(isValidationError(err)).to.equal(true);
  });

  it('should return false if the given object is not an instance of ValidationError and if it '
      + 'has no property isValidationError.', () => {
    const err = {};
    expect(isValidationError(err)).to.equal(false);
  });

});
