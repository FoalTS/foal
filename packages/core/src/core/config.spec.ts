import { join } from 'path';

import { expect } from 'chai';

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
    console.log(process.env.NODE_ENV, typeof process.env.NODE_ENV);
  });

  describe('when get is called', () => {

    describe('if there is a matching environment variable', () => {

      afterEach(() => {
        delete process.env.FOO_BAR_BARFOO;
      });

      it('should return it (string).', () => {
        process.env.FOO_BAR_BARFOO = 'foo';
        expect(Config.get('Foo', 'barBarfoo')).to.equal('foo');
      });

      it('should return it (boolean).', () => {
        process.env.FOO_BAR_BARFOO = 'true';
        expect(Config.get('Foo', 'barBarfoo')).to.equal(true);
        process.env.FOO_BAR_BARFOO = 'false';
        expect(Config.get('Foo', 'barBarfoo')).to.equal(false);
      });

      it('should return it (number).', () => {
        process.env.FOO_BAR_BARFOO = '15';
        expect(Config.get('Foo', 'barBarfoo')).to.equal(15);
      });

    });

    describe('if there is a matching property in a json file (env)', () => {

      it('should return it.', () => {
        delete process.env.NODE_ENV;
        expect(Config.get('a', 'foo')).to.equal(1);
        process.env.NODE_ENV = 'production';
        expect(Config.get('a', 'foo')).to.equal(2);
      });

      it('should throw an Error it if its type is neither a number, a string nor a boolean.', () => {
        process.env.NODE_ENV = 'development';
        expect(() => Config.get('a', 'bar')).to.throw(
          'Config: only string, number and boolean values are supported. bar type is "object" in a.development.json.'
        );
      });

    });

    describe('if there is a matching property in a json file', () => {

      it('should return it.', () => {
        expect(Config.get('b', 'bar')).to.equal(true);
      });

      it('should not return it if its type is neither a number, a string nor a boolean.', () => {
        expect(() => Config.get('b', 'barfoo')).to.throw(
          'Config: only string, number and boolean values are supported. barfoo type is "object" in b.json.'
        );
      });

    });

    it('should return undefined is there is no matching property or environment variable.' , () => {
      expect(Config.get('b', 'foo')).to.equal(undefined);
      expect(Config.get('c', 'foo')).to.equal(undefined);
    });

    it('should handle properly overriding in case there are several matching properties and/or '
        + 'environment variable.', () => {
      process.env.D_FOO = '1';
      expect(Config.get('d', 'foo')).to.equal(1);
      expect(Config.get('d', 'bar')).to.equal(2);
      delete process.env.D_FOO;
    });

  });

});
