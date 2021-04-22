// std
import { strictEqual, throws } from 'assert';

// FoalTS
import { convertBase64urlToBase64 } from './convert-base64-url-to-base64';

describe('convertBase64urlToBase64', () => {

  it('should convert base64url-encoded strings to base64-encoded strings (no padding character).', () => {
    const expected = 'hello+hi+/how/arfAbc';
    const actual = convertBase64urlToBase64('hello-hi-_how_arfAbc');

    strictEqual(actual, expected);
  });

  it('should convert base64url-encoded strings to base64-encoded strings (one padding character).', () => {
    const expected = 'hello+hi+/how/arfAb=';
    const actual = convertBase64urlToBase64('hello-hi-_how_arfAb');

    strictEqual(actual, expected);
  });

  it('should convert base64url-encoded strings to base64-encoded strings (two padding characters).', () => {
    const expected = 'hello+hi+/how/arfA==';
    const actual = convertBase64urlToBase64('hello-hi-_how_arfA');

    strictEqual(actual, expected);
  });

  it('should throw an error if the provided base64url-encoded string has an incorrect length.', () => {
    throws(
      () => convertBase64urlToBase64('hello-hi-_how_arf'),
      new TypeError('The provided base64url-encoded string has an incorrect length.')
    )
  })

});