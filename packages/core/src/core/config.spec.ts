import { expect } from 'chai';

import { Config } from './config';

describe('Config', () => {

  describe('when get is called', () => {

    describe('if there is a matching environment variable', () => {

      after(() => {
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

    // Change config root.

    describe('if there is a matching property in a json file (env)', () => {

      it('should return it.', () => {
        // test with NODE_ENV = undefined and production
      });

      it('should not return it if its type is neither a number, a string nor a boolean.', () => {

      });

    });

    describe('if there is a matching property in a json file', () => {

      it('should return it.', () => {

      });

      it('should not return it if its type is neither a number, a string nor a boolean.', () => {

      });

    });

    it('should throw an error if there is an invalid json file.', () => {
      // test null, undefined
    });

    it('should return undefined is there is no matching property or environment variable.' , () => {

    });

    it('should handle properly overriding in case there are several matching properties and/or '
       + 'environment variable.', () => {

    });

  });

});
