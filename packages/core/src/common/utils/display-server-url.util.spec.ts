// std
import { strictEqual } from 'assert';

// FoalTS
import { displayServerURL } from './display-server-url.util';

describe('displayServerURL', () => {

  it('should display the proper output.', () => {
    let expectedOutput = `
\x1b[32m -------------------------------------- \x1b[0m
\x1b[32m|                                      |\x1b[0m
\x1b[32m|                                      |\x1b[0m
\x1b[32m|            Server started!           |\x1b[0m
\x1b[32m|                                      |\x1b[0m
\x1b[32m|\x1b[0m     Local: http://localhost:8080     \x1b[32m|\x1b[0m
\x1b[32m|                                      |\x1b[0m
\x1b[32m|                                      |\x1b[0m
\x1b[32m -------------------------------------- \x1b[0m
`;

    let actualOutput = '';

    function log(str: string = '') {
      actualOutput += str + `\n`;
    }

    expectedOutput += '\n';

    displayServerURL(8080, log);

    strictEqual(actualOutput, expectedOutput);
  });

});
