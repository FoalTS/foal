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
 FOO_BAR_WITH_WHITESPACES_AROUND_THE_NAME = hello you
FOO_BAR_WITH_EQUAL=hello=world
FOO_BAR_WITH_WINDOWS_NEW_LINE=hello new line\r
# FOO_BAR_COMMENTED=hello commented

FOO_BAR_WITH_DOUBLE_QUOTES="hello with double quotes"
FOO_BAR_WITH_SINGLE_QUOTES='hello with single quotes'
FOO_BAR_WITH_WHITESPACES=  with whitespaces
FOO_BAR_WITH_QUOTES_AND_WHITESPACES="  with whitespaces  "

`;
const dotEnvContent2 = `FOO_BAR=hello2
FOO_BAR_THREE=two
`;
const dotEnvContent3 = `FOO_BAR_THREE=three
FOO_BAR_FOUR=three
`;
const dotEnvContent4 = `FOO_BAR_FOUR=four`;

describe('Env', () => {

  describe('has a static "getEnvironmentName" that', () => {

    afterEach(() => {
      delete process.env.FOAL_ENV;
      delete process.env.NODE_ENV;
    });

    it('should return the value of process.env.FOAL_ENV if it exists.', () => {
      process.env.FOAL_ENV = 'foobar';
      strictEqual(Env.getEnvironmentName(), 'foobar');
    });

    it('should return the value of process.env.NODE_ENV if it exists.', () => {
      process.env.NODE_ENV = 'barfoo';
      strictEqual(Env.getEnvironmentName(), 'barfoo');
    });

    it('should return the value "development" if process.env.FOAL_ENV and process.env.NODE_ENV are not defined.', () => {
      strictEqual(Env.getEnvironmentName(), 'development');
    });

    it('should return the value of process.env.FOAL_ENV if both FOAL_ENV and NODE_ENV are defined.', () => {
      process.env.FOAL_ENV = 'foobar';
      process.env.NODE_ENV = 'barfoo';
      strictEqual(Env.getEnvironmentName(), 'foobar');
    });
  })

  describe('has a static "get" method that', () => {

    beforeEach(() => Env.clearCache());

    afterEach(() => Env.clearCache());

    context('given an environment variable exists with the given name', () => {

      beforeEach(() => process.env.FOO_BAR = 'hello');

      afterEach(() => delete process.env.FOO_BAR);

      it('should return its value.', () => {
        strictEqual(Env.get('FOO_BAR'), 'hello');
      });

      context('and a variable exists in a .env file with the given name', () => {

        beforeEach(() => process.env.HELLO = 'there');

        afterEach(() => {
          delete process.env.HELLO;
          removeFile('.env');
        });

        it('should return the value of the environment variable.', () => {
          writeFileSync('.env', dotEnvContent);

          strictEqual(Env.get('HELLO'), 'there');
        })
      });

    });

    function testConfigFile(filename: string, nodeEnv?: string, nodeEnvName = 'NODE_ENV'): void {
      beforeEach(() => {
        writeFileSync(filename, dotEnvContent, 'utf8');
        if (nodeEnv) {
          process.env[nodeEnvName] = nodeEnv;
        }
      });

      afterEach(() => {
        removeFile(filename);
        delete process.env[nodeEnvName];
      });

      context('and given a variable exists with the given name', () => {

        it('should return its value.', () => {
          strictEqual(Env.get('FOO_BAR'), 'hello');
        });

        it('should return its value even if there are whitespaces around the variable name.', () => {
          strictEqual(Env.get('FOO_BAR_WITH_WHITESPACES_AROUND_THE_NAME'), 'hello you');
        })

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
    }

    context('given NODE_ENV is defined and .env.${NODE_ENV} exists', () => {
      testConfigFile('.env.test', 'test');
    });

    context('given NODE_ENV is defined and .env.${NODE_ENV}.local exists', () => {
      testConfigFile('.env.test.local', 'test');
    });

    context('given FOAL_ENV is defined and .env.${FOAL_ENV} exists', () => {
      testConfigFile('.env.test', 'test', 'FOAL_ENV');
    });

    context('given FOAL_ENV is defined and .env.${FOAL_ENV}.local exists', () => {
      testConfigFile('.env.test.local', 'test', 'FOAL_ENV');
    });

    context('given NODE_ENV and FOAL_ENV are not defined and .env.development exists', () => {
      testConfigFile('.env.development');
    });

    context('given NODE_ENV and FOAL_ENV are not defined and .env.development.local exists', () => {
      testConfigFile('.env.development.local');
    });

    context('given a .env file exists', () => {
      testConfigFile('.env');
    });

    context('given a .env.local file exists', () => {
      testConfigFile('.env.local');
    });

    context('given multiple config files exist', () => {

      afterEach(() => {
        removeFile('.env');
        removeFile('.env.local');
        removeFile('.env.development');
        removeFile('.env.development.local');
      });

      describe('should return the configuration value', () => {

        it('based on configuration file importance.', () => {
          writeFileSync('.env.development.local', dotEnvContent4);
          writeFileSync('.env.development', dotEnvContent3);
          writeFileSync('.env.local', dotEnvContent2);
          writeFileSync('.env', dotEnvContent);

          strictEqual(Env.get('FOO_BAR_FOUR'), 'four');
          strictEqual(Env.get('FOO_BAR_THREE'), 'three');
          strictEqual(Env.get('FOO_BAR'), 'hello2');
        });

        it('and should not delete other configuration values (deep merge).', () => {
          writeFileSync('.env.development.local', dotEnvContent4);
          writeFileSync('.env.development', dotEnvContent3);
          writeFileSync('.env.local', dotEnvContent2);
          writeFileSync('.env', dotEnvContent);

          strictEqual(Env.get('HELLO'), 'world');
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
