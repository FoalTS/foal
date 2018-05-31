import { expect } from 'chai';

import { toNumber } from './to-number';

describe('toNumber', () => {

  it('when it is called with undefined should throw an Error.', () => {
    expect(() => toNumber(undefined))
      .to.throw('undefined cannot be converted to a number.');
  });

  it('when it is called with a string that cannot be converted should throw an Error.', () => {
    expect(() => toNumber('a'))
      .to.throw('a cannot be converted to a number.');
  });

  it('when it is called with a correct string should return the suitable number.', () => {
    expect(toNumber('1234')).to.equal(1234);
  });

});
