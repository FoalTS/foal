function addPaddingToBase64url(str: string): string {
  if (str.length % 4 === 1) {
    throw new TypeError('The provided base64url-encoded string has an incorrect length.');
  }

  if (str.length % 4 === 2) {
    return str + '==';
  }
  if (str.length % 4 === 3) {
    return str + '=';
  }
  return str;
}

/**
 * Converts a base64url-encoded string into a base64-encoded string.
 *
 * @export
 * @param {string} str The base64url-encoded string.
 * @returns {string} The base64-encoded string.
 */
export function convertBase64urlToBase64(str: string): string {
  return addPaddingToBase64url(str)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');
}
