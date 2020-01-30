const escapeMap = {
  '"': '&quot;',
  '&': '&amp;',
  '\'': '&#x27;',
  '/': '&#x2F;',
  '<': '&lt;',
  '>': '&gt;',
};

/**
 * Escape a string following OWASP recommandations to prevent XSS attacks.
 *
 * Source: https://github.com/OWASP/CheatSheetSeries/blob/master/
 * cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.md
 *
 * @export
 * @param {string} str - The string to escape.
 * @returns {string} The escaped string.
 */
export function escape(str: string): string {
  return str.replace(/[&<>"'\/]/g, match => escapeMap[match as '&'|'<'|'>'|'"'|'\''|'/']);
}
