import { expect } from 'chai';

import { HttpRequest } from './http-request';

describe('HttpRequest', () => {

  it('should instantiate with suitable default properties if no express request '
      + 'is given.', () => {
    const actual = new HttpRequest();
    expect(actual.body).to.equal(undefined);
    expect(actual.getHeader('foo')).to.equal('foo');
    expect(actual.method).to.equal('GET');
    expect(actual.params).to.deep.equal({});
    expect(actual.path).to.equal('');
    expect(actual.query).to.deep.equal({});
  });

  it('should instantiate with suitable properties from the express request.', () => {
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
      get(str: string): string {
        return this.foo;
      }
    };
    const actual = new HttpRequest(req);
    expect(actual.body).to.deep.equal({ msg: 'foo' });
    expect(actual.getHeader('foo')).to.equal('bar');
    expect(actual.method).to.equal('POST');
    expect(actual.params).to.deep.equal({ id: 1 });
    expect(actual.path).to.equal('/users');
    expect(actual.query).to.deep.equal({ id: 2 });
  });

});
