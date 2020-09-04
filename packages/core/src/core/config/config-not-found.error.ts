import { makeBox } from './utils';

export class ConfigNotFoundError extends Error {
  readonly name = 'ConfigNotFoundError';

  constructor(readonly key: string, readonly msg?: string) {
    super();
    const keywords = key.split('.');

    function generateContent(type: 'JSON'|'YAML'|'JS'): string[] {
      const lines: string[] = [];

      if (type === 'JS') {
        lines.push('  const { Env } = require(\'@foal/core\');');
        lines.push('');
      }

      if (type !== 'YAML') {
        lines.push('  {');
      }

      keywords.forEach((keyword, index) => {
        if (type === 'JSON') {
          keyword = `"${keyword}"`;
        }

        const spaces = '  '.repeat(index + (type === 'YAML' ? 1 : 2));

        if (index === keywords.length - 1) {
          lines.push(spaces + keyword + ': <your_value>');
          if (type === 'YAML') {
            lines.push(spaces + '# OR with an environment variable: ');
          } else {
            lines.push(spaces + '// OR with an environment variable: ');
          }

          let envValue = '';
          switch (type) {
            case 'JS':
              envValue = 'Env.get(\'<YOUR_ENVIRONMENT_VARIABLE>\')';
              break;
            case 'JSON':
              envValue = '"env(<YOUR_ENVIRONMENT_VARIABLE>)"';
              break;
            case 'YAML':
              envValue = 'env(<YOUR_ENVIRONMENT_VARIABLE>)';
              break;
          }
          lines.push(spaces + keyword + ': ' + envValue);
        } else {
          if (type === 'YAML') {
            lines.push(spaces + keyword + ':');
          } else {
            lines.push(spaces + keyword + ': {');
          }
        }
      });

      if (type !== 'YAML') {
        keywords.forEach((_, index) => {
          if (index === keywords.length - 1) {
            return;
          }
          const spaces = '  '.repeat(keywords.length - index);
          lines.push(spaces + '}');
        });

        lines.push('  }');
      }

      return lines;
    }

    this.message = '\n\n'
    + makeBox(
      'JSON file (config/default.json, config/test.json, ...)',
      generateContent('JSON'),
    )
    + '\n'
    + makeBox(
      'YAML file (config/default.yml, config/test.yml, ...)',
      generateContent('YAML'),
    )
    + '\n'
    + makeBox(
      'JS file (config/default.js, config/test.js, ...)',
      generateContent('JS'),
    )
    + '\n'
    + `No value found for the configuration key "${key}".\n`
    + (msg === undefined ? '' : `\n${msg}\n`)
    + '\n'
    + `To pass a value, use one of the examples above.\n`;
  }

}
