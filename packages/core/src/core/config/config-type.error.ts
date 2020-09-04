import { makeBox } from './utils';

export class ConfigTypeError extends Error {
  readonly name = 'ConfigTypeError';

  constructor(readonly key: string, readonly expected: string, readonly actual: string) {
    super();
    const keywords = key.split('.');

    const lines: string[] = [];

    lines.push('  {');

    keywords.forEach((keyword, index) => {
      const spaces = '  '.repeat(index + 1);
      if (index === keywords.length - 1) {
        lines.push('->' + spaces + keyword + ': *************');
      } else {
        lines.push('  ' + spaces + keyword + ': {');
      }
    });

    keywords.forEach((_, index) => {
      if (index === keywords.length - 1) {
        return;
      }
      const spaces = '  '.repeat(keywords.length - index);
      lines.push(spaces + '}');
    });

    lines.push('  }');

    this.message = '\n\n'
    + makeBox(
      'Configuration file',
      lines
    )
    + '\n'
    + `The value of the configuration key "${key}" has an invalid type.\n`
    + '\n'
    + `Expected a "${expected}", but got a "${actual}".\n`;
  }
}
