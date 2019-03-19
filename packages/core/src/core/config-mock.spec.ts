import { strictEqual } from 'assert';
import { ConfigMock } from './config-mock';

describe('ConfigMock', () => {

  describe('when "get" is called', () => {

    it('should return the value given previously with the "set" method.', () => {
      const expected = 'barfoo';

      const config = new ConfigMock();
      config.set('settings.foo.bar', expected);

      const actual = config.get('settings.foo.bar');
      strictEqual(actual, expected);
    });

    it('should return the default value if no value was previously provided.', () => {
      const expected = 'barfoo';

      const config = new ConfigMock();

      const actual = config.get('settings.foo.bar', expected);
      strictEqual(actual, expected);
    });

  });

  describe('when "reset" is called', () => {

    it('should clear every config value previously given with the "set" method.', () => {
      const config = new ConfigMock();
      config.set('a', 'A');
      config.set('b', 'B');

      strictEqual(config.get('a'), 'A');
      strictEqual(config.get('b'), 'B');

      config.reset();

      strictEqual(config.get('a'), undefined);
      strictEqual(config.get('b'), undefined);
    });

  });

});
