// std
import { strictEqual } from 'assert';

// FoalTS
import { convertBase64ToBase64url } from './convert-base64-to-base64-url.util';

describe('convertBase64ToBase64url', () => {
  it('should convert base64-encoded strings to base64url-encoded ones.', () => {
    const expected = 'hello-hi-_how_arfA';
    const actual = convertBase64ToBase64url('hello+hi+/how/arfA==');
    strictEqual(actual, expected);
  });
});
