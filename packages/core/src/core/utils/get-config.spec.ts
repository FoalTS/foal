import { expect } from 'chai';

import { getConfig } from './get-config';

describe('getConfig', () => {

  it('should load config from the given filename.', () => {
    const config = getConfig('base.test');
    expect(config).not.to.equal(undefined);
    expect(config.foo).to.equal('bar');
  });

  it('should load config from the given "filename.production" if no process env is given.', () => {
    const config = getConfig('base2.test');
    expect(config).not.to.equal(undefined);
    expect(config.foo).to.equal('foobar');
  });

  // TODO: test with different node environments.

  it('should load and recursively merge the regarder config files.', () => {
    const config = getConfig('base3.test');
    expect(config).not.to.equal(undefined);
    expect(config).to.deep.equal({
      foo: {
        bar: 1,
        barfoo: 3,
        foobar: {
          bar: 4,
          foo: 2,
        },
        name: 'foo'
      }
    });
  });

  it('should return an empty object if the config file does not exist.', () => {
    const config = getConfig('does.not.exist');
    expect(config).to.deep.equal({});
  });

});
