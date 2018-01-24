import { createEmptyContext } from '@foal/core';
import { expect } from 'chai';

import { authentication, AuthenticationFactory } from './authentication.controller-factory';
import { AuthenticatorService } from './authenticator.service';

describe('authentication', () => {

  let mock: AuthenticatorService;

  before(() => {
    mock = {};
  });

  it('should be an instance of AuthenticationFactory', () => {
    expect(authentication).to.an.instanceOf(AuthenticationFactory);
  });

  describe('when getRoutes(service: AuthenticatorService): Route[] is called with the mock service', () => {

    it('should return the proper Route array.', () => {
      const actual = authentication.getRoutes(mock);
    });

  });

});
