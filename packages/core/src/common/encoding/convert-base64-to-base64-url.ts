/**
 * Converts a base64-encoded string into a base64url-encoded string with no equals.
 *
 * @export
 * @param {string} str The base64-encoded string.
 * @returns {string} The base64url-encoded string.
 */
export function convertBase64ToBase64url(str: string): string {
  return str
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}
