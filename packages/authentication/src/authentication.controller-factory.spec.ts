import {
  createEmptyContext,
  HttpResponseOK,
  HttpResponseUnauthorized,
  ObjectType,
  Service,
  ServiceManager,
} from '@foal/core';
import * as chai from 'chai';
import * as spies from 'chai-spies';

import { authentication, AuthenticationFactory } from './authentication.controller-factory';
import { AuthenticatorService } from './authenticator-service.interface';

chai.use(spies);
const expect = chai.expect;

describe('authentication', () => {

  @Service()
  class MockAuthenticatorService implements AuthenticatorService<any> {
    constructor() {}

    public authenticate(credentials: ObjectType) {
      if (credentials.username === 'John') {
        return {
          id: 1,
          username: 'John',
        };
      }
      return null;
    }
  }

  it('should be an instance of AuthenticationFactory', () => {
    expect(authentication).to.an.instanceOf(AuthenticationFactory);
  });

  describe('when attachService is called', () => {

    it('should return a controller with a proper `main` route when there is no option.', async () => {
      const controller = authentication.attachService('/', MockAuthenticatorService);
      const actual = controller.getRoute('main');

      expect(actual.httpMethod).to.equal('POST');
      expect(actual.path).to.equal('/');

      const ctx = createEmptyContext();
      ctx.session = {};
      ctx.body = { username: 'John' };
      const services = new ServiceManager();
      const mock = services.get(MockAuthenticatorService);
      chai.spy.on(mock, 'authenticate');
      const result = await actual.middleHook(ctx, services);

      expect(mock.authenticate).to.have.been.called.with(ctx.body);
      expect(result).to.be.an.instanceOf(HttpResponseOK);
      expect((result as HttpResponseOK).content).to.deep.equal({
        id: 1,
        username: 'John',
      });
      expect(ctx.session.authentication).to.deep.equal({
        userId: 1
      });

      const ctx2 = createEmptyContext();
      ctx2.session = {};
      ctx2.body = { username: 'Jack' };
      const result2 =  await actual.middleHook(ctx2, services);
      expect(result2).to.be.instanceOf(HttpResponseUnauthorized);
      expect(result2).to.have.deep.property('content', {
        message: 'Bad credentials.'
      });
    });

    xit('should return a controller with a proper `main` route when there are options.', async () => {
      // const options: Options = {
      //   failureRedirect: '/failure',
      //   successRedirect: '/success',
      // };
      // const actual = authentication.getRoutes(mock, options);
      // chai.spy.on(mock, 'authenticate');

      // expect(actual).to.be.an('array').and.to.have.lengthOf(1);
      // expect(actual[0].httpMethod).to.equal('POST');
      // expect(actual[0].path).to.equal('/');
      // expect(actual[0].serviceMethodName).to.equal('authenticate');
      // expect(actual[0].successStatus).to.equal(200);

      // const ctx = createEmptyContext();
      // ctx.session = {};
      // ctx.body = { username: 'John' };
      // const result = await actual[0].middleware(ctx);
      // expect(mock.authenticate).to.have.been.called.with(ctx.body);
      // expect(result).to.be.an.instanceOf(HttpResponseRedirect).with.property('path', '/success');
      // expect(ctx.session.authentication).to.deep.equal({
      //   userId: 1
      // });

      // const ctx2 = createEmptyContext();
      // ctx2.session = {};
      // ctx2.body = { username: 'Jack' };
      // const result2 = await actual[0].middleware(ctx2);
      // expect(result2).to.be.an.instanceOf(HttpResponseRedirect).with.property('path', '/failure');
    });

  });

});
