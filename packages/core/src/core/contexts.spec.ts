import { expect } from 'chai';

import { Context, PostContext } from './contexts';
import { HttpRequest } from './http';

describe('Context', () => {

  it('should instantiate with suitable default properties if no express request '
      + 'is given.', () => {
    const actual = new Context();
    expect(actual.request).to.be.an.instanceOf(HttpRequest);
    expect(actual.session).to.equal(undefined);
    expect(actual.state).to.deep.equal({});
    expect(actual.user).to.equal(undefined);
  });

  it('should instantiate with suitable properties from the given express request.', () => {
    const req = {
      body: {
        msg: 'foo'
      },
      foo: 'bar',
      method: 'POST',
      params: {
        id: 1
      },
      path: '/users',
      query: {
        id: 2
      },
      session: {
        userId: 4
      },
      get(str: string): string {
        return this.foo;
      }
    };
    const actual = new Context(req, []);

    expect(actual.request.body).to.deep.equal({ msg: 'foo' });
    expect(actual.session).to.deep.equal({ userId: 4 });
    expect(actual.state).to.deep.equal({});
    expect(actual.user).to.equal(undefined);
  });

  it('should instantiate from the given state definition.', () => {
    const req = {
      crsfToken: 'xxx',
      key1: 'yyy',
      get(str: string): string {
        return this.foo;
      }
    };
    const actual = new Context(req, [
      {
        req: 'crsfToken',
        state: 'token'
      },
      {
        req: 'key1',
        state: 'key2'
      }
    ]);

    expect(actual.state).to.deep.equal({
      key2: 'yyy',
      token: 'xxx'
    });
  });

});

describe('PostContext', () => {

  it('should inherit from Context.', () => {
    const ctx = new PostContext();
    expect(ctx).to.be.an.instanceOf(Context);
  });

  it('should has a response property whose value is undefined.', () => {
    const ctx = new PostContext();
    expect(ctx.hasOwnProperty('response')).to.equal(true);
    expect(ctx.response).to.equal(undefined);
  });

});
