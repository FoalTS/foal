const escapeMap = {
  '"': '&quot;',
  '&': '&amp;',
  '\'': '&#x27;',
  '/': '&#x2F;',
  '<': '&lt;',
  '>': '&gt;',
};

export function escape(str: string): string {
  return str.replace(/[&<>"'\/]/g, match => escapeMap[match]);
}
