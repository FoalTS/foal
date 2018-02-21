import { createEmptyContext, ObjectType, UnauthorizedError } from '@foal/core';
import * as chai from 'chai';
import * as spies from 'chai-spies';

import { authentication, AuthenticationFactory } from './authentication.controller-factory';
import { AuthenticatorService } from './authenticator-service.interface';

chai.use(spies);
const expect = chai.expect;

describe('authentication', () => {

  let mock: AuthenticatorService<any>;

  before(() => {
    mock = {
      authenticate(credentials: ObjectType) {
        if (credentials.username === 'John') {
          return {
            id: 1,
            username: 'John',
          };
        }
        return null;
      }
    };
  });

  it('should be an instance of AuthenticationFactory', () => {
    expect(authentication).to.an.instanceOf(AuthenticationFactory);
  });

  describe('when getRoutes(service: AuthenticatorService): Route[] is called with the mock service', () => {

    it('should return the proper Route array.', async () => {
      const actual = authentication.getRoutes(mock);
      chai.spy.on(mock, 'authenticate');

      expect(actual).to.be.an('array').and.to.have.lengthOf(1);
      expect(actual[0].httpMethod).to.equal('POST');
      expect(actual[0].path).to.equal('/');
      expect(actual[0].serviceMethodName).to.equal('authenticate');
      expect(actual[0].successStatus).to.equal(200);

      const ctx = createEmptyContext();
      ctx.session = {};
      ctx.body = { username: 'John' };
      const result = await actual[0].middleware(ctx);
      expect(mock.authenticate).to.have.been.called.with(ctx.body);
      expect(result).to.deep.equal({
        id: 1,
        username: 'John',
      });
      expect(ctx.session.authentication).to.deep.equal({
        userId: 1
      });

      const ctx2 = createEmptyContext();
      ctx2.session = {};
      ctx2.body = { username: 'Jack' };
      try {
        await actual[0].middleware(ctx2);
        throw  new Error('No error was thrown in the middleware.');
      } catch (err) {
        expect(err).to.be.instanceOf(UnauthorizedError);
        expect(err).to.have.deep.property('details', {
          message: 'Bad credentials.'
        });
      }
    });

  });

});
