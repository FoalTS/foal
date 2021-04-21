// std
import { strictEqual } from 'assert';

// FoalTS
import { convertBase64ToBase64url } from './convert-base64-to-base64-url';

describe('convertBase64ToBase64url', () => {

  it('should convert base64-encoded strings to base64url-encoded strings (no padding character).', () => {
    const expected = 'hello-hi-_how_arfAbc';
    const actual = convertBase64ToBase64url('hello+hi+/how/arfAbc');

    strictEqual(actual, expected);
  });

  it('should convert base64-encoded strings to base64url-encoded strings (one padding character).', () => {
    const expected = 'hello-hi-_how_arfAb';
    const actual = convertBase64ToBase64url('hello+hi+/how/arfAb=');

    strictEqual(actual, expected);
  });

  it('should convert base64-encoded strings to base64url-encoded strings (two padding characters).', () => {
    const expected = 'hello-hi-_how_arfA';
    const actual = convertBase64ToBase64url('hello+hi+/how/arfA==');

    strictEqual(actual, expected);
  });

});
