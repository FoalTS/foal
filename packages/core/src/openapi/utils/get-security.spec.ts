// std
import { deepStrictEqual, strictEqual } from 'assert';

// FoalTS
import { ApiSecurityRequirement } from '../decorators';
import { IApiSecurityRequirement } from '../interfaces';
import { getSecurity } from './get-security';

describe('getSecurity', () => {
  const securityRequirement: IApiSecurityRequirement = {};

  describe('when security requirements are defined, should return them', () => {

    it('from a class.', () => {
      @ApiSecurityRequirement(securityRequirement)
      class Controller {}

      const actual = getSecurity(Controller);

      deepStrictEqual(actual, [ securityRequirement ]);
    });

    it('from a class method.', () => {
      class Controller {
        @ApiSecurityRequirement(securityRequirement)
        foo() {}
      }

      const actual = getSecurity(Controller, 'foo');

      deepStrictEqual(actual, [ securityRequirement ]);
    });

  });

  describe('when no security requirement is defined, should return undefined', () => {

    it('from a class.', () => {
      class Controller {}

      const actual = getSecurity(Controller);

      strictEqual(actual, undefined);
    });

    it('from a class method.', () => {
      class Controller {
        foo() {}
      }

      const actual = getSecurity(Controller, 'foo');

      strictEqual(actual, undefined);
    });

  });

});
