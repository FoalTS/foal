import { escape } from './escape';

/**
 * Escape a string property of an object following OWASP recommandations to prevent XSS attacks.
 *
 * Source: https://github.com/OWASP/CheatSheetSeries/blob/master/
 * cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.md
 *
 * @export
 * @param {object} object - The object which contains the property to escape.
 * @param {string} propName - The property name.
 */
export function escapeProp(object: object, propName: string): void {
  const type = typeof object[propName];
  if (type !== 'string') {
    throw new TypeError(`${propName} should be a string (got ${type}).`);
  }
  object[propName] = escape(object[propName]);
}
