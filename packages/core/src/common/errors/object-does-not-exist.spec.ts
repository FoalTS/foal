import { expect } from 'chai';
import { isObjectDoesNotExist, ObjectDoesNotExist } from './object-does-not-exist';

describe('isObjectDoesNotExist', () => {

  it('should return true if the given object is an instance of ObjectDoesNotExist.', () => {
    const err = new ObjectDoesNotExist();
    expect(isObjectDoesNotExist(err)).to.equal(true);
  });

  it('should return true if the given object has an isObjectDoesNotExist property equal to true.', () => {
    const err = { isObjectDoesNotExist: true };
    expect(isObjectDoesNotExist(err)).to.equal(true);
  });

  it('should return false if the given object is not an instance of ObjectDoesNotExist and if it '
      + 'has no property isObjectDoesNotExist.', () => {
    const err = {};
    expect(isObjectDoesNotExist(err)).to.equal(false);
  });

});
