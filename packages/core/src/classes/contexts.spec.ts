// import { expect } from 'chai';

// import { getContext } from './get-context';

// describe('getContext', () => {

//   it('should properly return a context from the given express request.', () => {
//     const req = {
//       body: {
//         msg: 'foo'
//       },
//       foo: 'bar',
//       params: {
//         id: 1
//       },
//       query: {
//         id: 2
//       },
//       session: {
//         userId: 4
//       },
//       get(str: string): string {
//         return this.foo;
//       }
//     };
//     const actual = getContext(req, []);

//     expect(actual.body).to.deep.equal({ msg: 'foo' });
//     expect(actual.getHeader('')).to.equal('bar');
//     expect(actual.params).to.deep.equal({ id: 1 });
//     expect(actual.query).to.deep.equal({ id: 2 });
//     expect(actual.response).to.equal(undefined);
//     expect(actual.session).to.deep.equal({ userId: 4 });
//     expect(actual.state).to.deep.equal({});
//     expect(actual.user).to.equal(null);
//   });

//   it('should properly return a context from the given state definition.', () => {
//     const req = {
//       crsfToken: 'xxx',
//       key1: 'yyy',
//       get(str: string): string {
//         return this.foo;
//       }
//     };
//     const actual = getContext(req, [
//       {
//         req: 'crsfToken',
//         state: 'token'
//       },
//       {
//         req: 'key1',
//         state: 'key2'
//       }
//     ]);

//     expect(actual.state).to.deep.equal({
//       key2: 'yyy',
//       token: 'xxx'
//     });
//   });

// });
