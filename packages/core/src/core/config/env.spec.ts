// std
import { strictEqual } from 'assert';
import { existsSync, unlinkSync, writeFileSync } from 'fs';

// FoalTS
import { Env } from './env';

function removeFile(path: string) {
  if (existsSync(path)) {
    unlinkSync(path);
  }
}

const dotEnvContent = `HELLO=world
FOO_BAR=hello
FOO_BAR_WITH_EQUAL=hello=world
FOO_BAR_WITH_WINDOWS_NEW_LINE=hello new line\r
# FOO_BAR_COMMENTED=hello commented

FOO_BAR_WITH_DOUBLE_QUOTES="hello with double quotes"
FOO_BAR_WITH_SINGLE_QUOTES='hello with single quotes'
FOO_BAR_WITH_WHITESPACES=  with whitespaces
FOO_BAR_WITH_QUOTES_AND_WHITESPACES="  with whitespaces  "

`;

describe('Env', () => {

  describe('has a static "get" method that', () => {

    beforeEach(() => Env.clearCache());

    afterEach(() => Env.clearCache());

    context('given an environment variable exists with the given name', () => {

      beforeEach(() => process.env.FOO_BAR = 'hello');

      afterEach(() => delete process.env.FOO_BAR);

      it('should return its value.', () => {
        strictEqual(Env.get('FOO_BAR'), 'hello');
      });

    });

    context('given a .env file exists', () => {

      beforeEach(() => writeFileSync('.env', dotEnvContent, 'utf8'));

      afterEach(() => removeFile('.env'));

      context('and given a variable exists with the given name', () => {

        it('should return its value.', () => {
          strictEqual(Env.get('FOO_BAR'), 'hello');
        });

        it('should return its value (value with an equal).', () => {
          strictEqual(Env.get('FOO_BAR_WITH_EQUAL'), 'hello=world');
        });

        it('should return its value (value with a CRLF new line).', () => {
          strictEqual(Env.get('FOO_BAR_WITH_WINDOWS_NEW_LINE'), 'hello new line');
        });

        it('should not return its value if it is a comment.', () => {
          strictEqual(Env.get('# FOO_BAR_COMMENTED'), undefined);
        });

        it('should return its value (outer double quotes).', () => {
          strictEqual(Env.get('FOO_BAR_WITH_DOUBLE_QUOTES'), 'hello with double quotes');
        });

        it('should return its value (outer single quotes).', () => {
          strictEqual(Env.get('FOO_BAR_WITH_SINGLE_QUOTES'), 'hello with single quotes');
        });

        it('should return its value without the whitespaces at the beginning and the end.', () => {
          strictEqual(Env.get('FOO_BAR_WITH_WHITESPACES'), 'with whitespaces');
        });

        it('should return its value with the whitespaces at the beginning and the end if there are quotes.', () => {
          strictEqual(Env.get('FOO_BAR_WITH_QUOTES_AND_WHITESPACES'), '  with whitespaces  ');
        });

      });

    });

    context('given no environment variable or .env variable exists with the given name.', () => {

      it('should return undefined.', () => {
        strictEqual(Env.get('UNKWOWN_VARIABLE'), undefined);
      });

    });

  });

});
