// std
import { deepStrictEqual, strictEqual } from 'assert';

// FoalTS
import { ApiSecurityRequirement } from '../decorators';
import { IApiSecurityRequirement } from '../interfaces';
import { getApiSecurity } from './get-api-security';

describe('getApiSecurity', () => {
  const securityRequirement: IApiSecurityRequirement = {};

  describe('when security requirements are defined, should return them', () => {

    it('from a class.', () => {
      @ApiSecurityRequirement(securityRequirement)
      class Controller {}

      const actual = getApiSecurity(Controller);

      deepStrictEqual(actual, [ securityRequirement ]);
    });

    it('from a class method.', () => {
      class Controller {
        @ApiSecurityRequirement(securityRequirement)
        foo() {}
      }

      const actual = getApiSecurity(Controller, 'foo');

      deepStrictEqual(actual, [ securityRequirement ]);
    });

  });

  describe('when no security requirement is defined, should return undefined', () => {

    it('from a class.', () => {
      class Controller {}

      const actual = getApiSecurity(Controller);

      strictEqual(actual, undefined);
    });

    it('from a class method.', () => {
      class Controller {
        foo() {}
      }

      const actual = getApiSecurity(Controller, 'foo');

      strictEqual(actual, undefined);
    });

  });

});
