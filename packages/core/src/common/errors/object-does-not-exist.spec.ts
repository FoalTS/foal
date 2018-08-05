// std
import { strictEqual } from 'assert';

// FoalTS
import { isObjectDoesNotExist, ObjectDoesNotExist } from './object-does-not-exist';

describe('isObjectDoesNotExist', () => {

  it('should return true if the given object is an instance of ObjectDoesNotExist.', () => {
    const err = new ObjectDoesNotExist();
    strictEqual(isObjectDoesNotExist(err), true);
  });

  it('should return true if the given object has an isObjectDoesNotExist property equal to true.', () => {
    const err = { isObjectDoesNotExist: true };
    strictEqual(isObjectDoesNotExist(err), true);
  });

  it('should return false if the given object is not an instance of ObjectDoesNotExist and if it '
      + 'has no property isObjectDoesNotExist.', () => {
    const err = {};
    strictEqual(isObjectDoesNotExist(err), false);
  });

});
