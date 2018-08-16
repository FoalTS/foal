// std
import { strictEqual } from 'assert';

// FoalTS
import { isPermissionDenied, PermissionDenied } from './permission-denied';

describe('PermissionDenied', () => {

  it('should accept an optional content.', () => {
    let err = new PermissionDenied();
    strictEqual(err.content, undefined);

    const content = { foo: 'bar' };
    err = new PermissionDenied(content);
    strictEqual(err.content, content);
  });

});

describe('isPermissionDenied', () => {

  it('should return true if the given object is an instance of PermissionDenied.', () => {
    const err = new PermissionDenied();
    strictEqual(isPermissionDenied(err), true);
  });

  it('should return true if the given object has an isPermissionDenied property equal to true.', () => {
    const err = { isPermissionDenied: true };
    strictEqual(isPermissionDenied(err), true);
  });

  it('should return false if the given object is not an instance of PermissionDenied and if it '
      + 'has no property isPermissionDenied.', () => {
    const err = {};
    strictEqual(isPermissionDenied(err), false);
  });

});
