// std
import { strictEqual, throws } from 'assert';
import { join } from 'path';

// FoalTS
import { Config } from './config';

describe('Config', () => {

  let initialRoot: string;
  let initialEnv: string|undefined;

  before(() => {
    initialEnv = process.env.NODE_ENV;
    initialRoot = Config.root;
    Config.root = join(__dirname, './config.spec');
  });
  after(() => Config.root = initialRoot);

  afterEach(() => {
    if (initialEnv === undefined) {
      // Assigning undefined to process.env.NODE_ENV makes process.env.NODE_ENV equal to "undefined"!
      delete process.env.NODE_ENV;
    } else {
      process.env.NODE_ENV = initialEnv;
    }
  });

  describe('when get is called', () => {

    describe('if there is a matching environment variable', () => {

      afterEach(() => {
        delete process.env.FOO_BAR_BARFOO;
      });

      it('should return it (string).', () => {
        process.env.FOO_BAR_BARFOO = 'foo';
        strictEqual(Config.get('Foo', 'barBarfoo'), 'foo');
      });

      it('should return it (boolean).', () => {
        process.env.FOO_BAR_BARFOO = 'true';
        strictEqual(Config.get('Foo', 'barBarfoo'), true);
        process.env.FOO_BAR_BARFOO = 'false';
        strictEqual(Config.get('Foo', 'barBarfoo'), false);
      });

      it('should return it (number).', () => {
        process.env.FOO_BAR_BARFOO = '15';
        strictEqual(Config.get('Foo', 'barBarfoo'), 15);
      });

    });

    describe('if there is a matching property in a json file (env)', () => {

      it('should return it.', () => {
        delete process.env.NODE_ENV;
        strictEqual(Config.get('a', 'foo'), 1);
        process.env.NODE_ENV = 'production';
        strictEqual(Config.get('a', 'foo'), 2);
      });

      it('should throw an Error it if its type is neither a number, a string nor a boolean.', () => {
        process.env.NODE_ENV = 'development';
        throws(
          () => Config.get('a', 'bar'),
          /Config: only string, number and boolean values are supported\. bar type is "object" in a\.development\.json./
        );
      });

    });

    describe('if there is a matching property in a json file', () => {

      it('should return it.', () => {
        strictEqual(Config.get('b', 'bar'), true);
      });

      it('should not return it if its type is neither a number, a string nor a boolean.', () => {
        throws(
          () => Config.get('b', 'barfoo'),
          /Config: only string, number and boolean values are supported\. barfoo type is "object" in b\.json\./
        );
      });

    });

    it('should return undefined if there is no matching property or environment variable and '
        + 'if no default option is provided.' , () => {
      strictEqual(Config.get('b', 'foo'), undefined);
      strictEqual(Config.get('c', 'foo'), undefined);
    });

    it('should return a default value if one is provided and there is no matching property '
        + 'or environment variable and if no default option is provided.', () => {
      strictEqual(Config.get('b', 'foo', 46), 46);
      strictEqual(Config.get('c', 'foo', 46), 46);
    });

    it('should handle properly overriding in case there are several matching properties and/or '
        + 'environment variable.', () => {
      process.env.D_FOO = '1';
      strictEqual(Config.get('d', 'foo'), 1);
      strictEqual(Config.get('d', 'bar'), 2);
      delete process.env.D_FOO;
    });

  });

});
