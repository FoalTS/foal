import { Context, HttpResponseBadRequest, ServiceManager } from '@foal/core';
import { expect } from 'chai';

import { validateEmailAndPasswordCredentialsFormat } from './validate-email-and-password-credentials-format.pre-hook';

describe('validateEmailAndPasswordCredentialsFormat', () => {

  it('should return an HttpResponseBadRequest if the email property is missing.', () => {
    const preHook = validateEmailAndPasswordCredentialsFormat();
    const ctx = new Context();
    ctx.request.body = {
      password: 'myPassword',
    };

    const response = preHook(ctx, new ServiceManager());
    expect(response).to.be.instanceOf(HttpResponseBadRequest);
    expect((response as HttpResponseBadRequest).content).to.be.an('array').and.to.have.lengthOf(1);
    expect((response as HttpResponseBadRequest).content[0]).to.deep.equal({
      dataPath: '',
      keyword: 'required',
      message: 'should have required property \'email\'',
      params: {
        missingProperty: 'email',
      },
      schemaPath: '#/required',
    });
  });

  it('should return an HttpResponseBadRequest if the password property is missing.', () => {
    const preHook = validateEmailAndPasswordCredentialsFormat();
    const ctx = new Context();
    ctx.request.body = {
      email: 'john@jack.com',
    };

    const response = preHook(ctx, new ServiceManager());
    expect(response).to.be.instanceOf(HttpResponseBadRequest);
    expect((response as HttpResponseBadRequest).content).to.be.an('array').and.to.have.lengthOf(1);
    expect((response as HttpResponseBadRequest).content[0]).to.deep.equal({
      dataPath: '',
      keyword: 'required',
      message: 'should have required property \'password\'',
      params: {
        missingProperty: 'password',
      },
      schemaPath: '#/required',
    });
  });

  it('should return an HttpResponseBadRequest if the email property is not a string.', () => {
    const preHook = validateEmailAndPasswordCredentialsFormat();
    const ctx = new Context();
    ctx.request.body = {
      email: 1,
      password: 'myPassword',
    };

    const response = preHook(ctx, new ServiceManager());
    expect(response).to.be.instanceOf(HttpResponseBadRequest);
    expect((response as HttpResponseBadRequest).content).to.be.an('array').and.to.have.lengthOf(1);
    expect((response as HttpResponseBadRequest).content[0]).to.deep.equal({
      dataPath: '.email',
      keyword: 'type',
      message: 'should be string',
      params: {
        type: 'string',
      },
      schemaPath: '#/properties/email/type',
    });
  });

  it('should return an HttpResponseBadRequest if the password property is not a string.', () => {
    const preHook = validateEmailAndPasswordCredentialsFormat();
    const ctx = new Context();
    ctx.request.body = {
      email: 'john@jack.com',
      password: 1,
    };

    const response = preHook(ctx, new ServiceManager());
    expect(response).to.be.instanceOf(HttpResponseBadRequest);
    expect((response as HttpResponseBadRequest).content).to.be.an('array').and.to.have.lengthOf(1);
    expect((response as HttpResponseBadRequest).content[0]).to.deep.equal({
      dataPath: '.password',
      keyword: 'type',
      message: 'should be string',
      params: {
        type: 'string',
      },
      schemaPath: '#/properties/password/type',
    });
  });

  it('should return an HttpResponseBadRequest if the email property does not contain a valid email.', () => {
    const preHook = validateEmailAndPasswordCredentialsFormat();
    const ctx = new Context();
    ctx.request.body = {
      email: 'johnjack.com',
      password: 'myPassword',
    };

    const response = preHook(ctx, new ServiceManager());
    expect(response).to.be.instanceOf(HttpResponseBadRequest);
    expect((response as HttpResponseBadRequest).content).to.be.an('array').and.to.have.lengthOf(1);
    expect((response as HttpResponseBadRequest).content[0]).to.deep.equal({
      dataPath: '.email',
      keyword: 'format',
      message: 'should match format "email"',
      params: {
        format: 'email',
      },
      schemaPath: '#/properties/email/format',
    });
  });

  it('should return an HttpResponseBadRequest if there are additional properties.', () => {
    const preHook = validateEmailAndPasswordCredentialsFormat();
    const ctx = new Context();
    ctx.request.body = {
      email: 'john@jack.com',
      foo: 'bar',
      password: 'myPassword',
    };

    const response = preHook(ctx, new ServiceManager());
    expect(response).to.be.instanceOf(HttpResponseBadRequest);
    expect((response as HttpResponseBadRequest).content).to.be.an('array').and.to.have.lengthOf(1);
    expect((response as HttpResponseBadRequest).content[0]).to.deep.equal({
      dataPath: '',
      keyword: 'additionalProperties',
      message: 'should NOT have additional properties',
      params: {
        additionalProperty: 'foo',
      },
      schemaPath: '#/additionalProperties',
    });
  });

  it('should not return anything if the input is correct.', () => {
    const preHook = validateEmailAndPasswordCredentialsFormat();
    const ctx = new Context();
    ctx.request.body = {
      email: 'john@jack.com',
      password: 'myPassword',
    };

    const response = preHook(ctx, new ServiceManager());
    expect(response).to.equal(undefined);
  });

});
