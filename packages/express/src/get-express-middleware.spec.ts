// import {
//   Context,
//   HttpMethod,
//   HttpResponseMethodNotAllowed,
//   HttpResponseRedirect,
//   Route
// } from '@foal/core';
// import * as bodyParser from 'body-parser';
// import { expect } from 'chai';
// import * as express from 'express';
// import * as request from 'supertest';

// import { getExpressMiddleware } from './get-express-middleware';

// HACK
console.error = () => {};

describe(`getExpressMiddleware`, () => {

  // let route: Route;
  // let app: any;

  // function getHttpMethodTest(httpMethod: HttpMethod) {
  //   return () => {

  //     before(() => {
  //       app = express();
  //       route = { httpMethod, paths: [], hooks: [], successStatus: 200 };
  //       app.use(getExpressMiddleware(route));
  //     });

  //     it(`should return a middleware which responds on ${httpMethod} / .`, () => {
  //       switch (httpMethod) {
  //         case 'GET':
  //           return request(app).get('/').then(res => expect(res.status).not.to.equal(404));
  //         case 'PATCH':
  //           return request(app).patch('/').then(res => expect(res.status).not.to.equal(404));
  //         case 'PUT':
  //           return request(app).put('/').then(res => expect(res.status).not.to.equal(404));
  //         case 'POST':
  //           return request(app).post('/').then(res => expect(res.status).not.to.equal(404));
  //         case 'DELETE':
  //           return request(app).delete('/').then(res => expect(res.status).not.to.equal(404));
  //       }
  //     });

  //     it(`should return a middleware which does not respond on ${httpMethod} /foobar .`, () => {
  //       switch (httpMethod) {
  //         case 'GET':
  //           return request(app).get('/foobar').expect(404);
  //         case 'PATCH':
  //           return request(app).patch('/foobar').expect(404);
  //         case 'PUT':
  //           return request(app).put('/foobar').expect(404);
  //         case 'POST':
  //           return request(app).post('/foobar').expect(404);
  //         case 'DELETE':
  //           return request(app).delete('/foobar').expect(404);
  //       }
  //     });

  //     it(`should return a middleware which does not respond on [Method !== "${httpMethod}"] / .`, () => {
  //       const promises: any = [];
  //       if (httpMethod !== 'GET') { promises.push(request(app).get('/').expect(404)); }
  //       if (httpMethod !== 'PATCH') { promises.push(request(app).patch('/').expect(404)); }
  //       if (httpMethod !== 'PUT') { promises.push(request(app).put('/').expect(404)); }
  //       if (httpMethod !== 'POST') { promises.push(request(app).post('/').expect(404)); }
  //       if (httpMethod !== 'DELETE') { promises.push(request(app).delete('/').expect(404)); }
  //       return Promise.all(promises);
  //     });

  //   };
  // }

  // describe('when it is called with { httpMethod: "GET", paths: [] }', getHttpMethodTest('GET'));
  // describe('when it is called with { httpMethod: "PATCH", paths: [] }', getHttpMethodTest('PATCH'));
  // describe('when it is called with { httpMethod: "POST", paths: [] }', getHttpMethodTest('POST'));
  // describe('when it is called with { httpMethod: "PUT", paths: [] }', getHttpMethodTest('PUT'));
  // describe('when it is called with { httpMethod: "DELETE", paths: [] }', getHttpMethodTest('DELETE'));

  // describe('when it is called with { httpMethod: "GET", paths: [ "/", "/foo", "/", "/", "/bar", "foo" ] }', () => {

  //   before(() => {
  //     app = express();
  //     route = {
  //       hooks: [],
  //       httpMethod: 'GET',
  //       paths: [ '/', '/foo', '/', '/', '/bar', 'foo' ],
  //       successStatus: 200
  //     };
  //     app.use(getExpressMiddleware(route));
  //   });

  //   it('should return a middleware which responds on GET /foo/bar/foo .', () => {
  //     return request(app)
  //       .get('/foo/bar/foo')
  //       .then(res => {
  //         expect(res.status).not.to.equal(404);
  //       });
  //   });

  //   it('should return a middleware which responds on GET /foo/bar/foo/ .', () => {
  //     return request(app)
  //       .get('/foo/bar/foo/')
  //       .then(res => {
  //         expect(res.status).not.to.equal(404);
  //       });
  //   });

  //   it('should return a middleware which does not respond on GET /foo/bar/foo/1 .', () => {
  //     return request(app)
  //       .get('/foo/bar/foo/1')
  //       .then(res => {
  //         expect(res.status).to.equal(404);
  //       });
  //   });

  // });

  // describe('when it is called with { httpMethod: "GET", paths: [ "/foo/:id/bar/:id2" ] }', () => {

  //   before(() => {
  //     app = express();
  //     route = {
  //       hooks: [],
  //       httpMethod: 'GET',
  //       paths: [ '/foo/:id/bar/:id2' ],
  //       successStatus: 200
  //     };
  //     app.use(getExpressMiddleware(route));
  //   });

  //   it('should return a middleware which responds on GET /foo/12/bar/13 .', () => {
  //     return request(app)
  //       .get('/foo/12/bar/13')
  //       .then(res => {
  //         expect(res.status).not.to.equal(404);
  //       });
  //   });

  //   it('should return a middleware which does not respond on GET /foo/12/bar/ .', () => {
  //     return request(app)
  //       .get('/foo/12/bar/')
  //       .then(res => {
  //         expect(res.status).to.equal(404);
  //       });
  //   });

  // });

  // describe('when it is called with { httpMethod: "GET", paths: [], successStatus: 201 }', () => {

  //   before(() => {
  //     app = express();
  //     route = { httpMethod: 'GET', paths: [], hooks: [], successStatus: 201 };
  //     app.use(getExpressMiddleware(route));
  //   });

  //   it('should return a middleware which responds with 201 on GET / .', () => {
  //     return request(app)
  //       .get('/')
  //       .expect(201);
  //   });

  // });

  // describe('when it is called with { hooks: [ ... ] }', () => {

  //   let middleware1: ReducedHook;
  //   let middleware2: ReducedHook;

  //   it('should return a middleware which inits properly the context.', () => {
  //     // This test depends on the test 'should return a middleware which responds on GET /foo/12/bar/13'.
  //     let actual: Context;
  //     const user = { name: 'foobar' };
  //     const session = { foo: 'bar' };
  //     middleware1 = ctx => actual = ctx;
  //     app = express();
  //     app.use(bodyParser.urlencoded({ extended: false }));
  //     app.use(bodyParser.json());
  //     app.use((req, res, next) => {
  //       req.session = session;
  //       req.user = user;
  //       req.csrf = 'foobar';
  //       next();
  //     });
  //     route = { httpMethod: 'POST', paths: ['/:id'], hooks: [ middleware1 ], successStatus: 200 };
  //     app.use(getExpressMiddleware(route, [
  //       {
  //         ctx: 'csrfToken',
  //         req: 'csrf'
  //       }
  //     ]));

  //     const expected = {
  //       body: { text: 'Hello world' },
  //       params: { id: '1' },
  //       query: { a: 'b' },
  //       session,
  //       state: {
  //         csrfToken: 'foobar'
  //       },
  //       user,
  //     };
  //     return request(app)
  //       .post(`/${expected.params.id}`)
  //       .query(expected.query)
  //       .send(expected.body)
  //       .then(res => {
  //         expect(actual.body).to.deep.equal(expected.body);
  //         expect(actual.getHeader('Content-Class')).to.equal('application/json');
  //         expect(actual.params).to.deep.equal(expected.params);
  //         expect(actual.query).to.deep.equal(expected.query);
  //         expect(actual.session).to.equal(expected.session);
  //         expect(actual.state).to.deep.equal(expected.state);
  //         expect(actual.user).to.deep.equal(expected.user);
  //       });
  //   });

  //   it('should return a middleware which executes each foal middleware in the right order.', () => {
  //     let str = '';
  //     middleware1 = async ctx => str += 'a';
  //     middleware2 = ctx => str += 'b';
  //     app = express();
  //     route = {
  //       hooks: [
  //         middleware1,
  //         middleware2
  //       ],
  //       httpMethod: 'GET',
  //       paths: [],
  //       successStatus: 200
  //     };
  //     app.use(getExpressMiddleware(route));

  //     return request(app)
  //       .get('/')
  //       .then(res => expect(str).to.equal('ab'));
  //   });

  //   function getCtxResultTest(result, expected, parsed: boolean) {
  //     return () => {
  //       middleware1 = ctx => { ctx.result = result; };
  //       app = express();
  //       route = { httpMethod: 'GET', paths: [], hooks: [ middleware1 ], successStatus: 200 };
  //       app.use(getExpressMiddleware(route));

  //       if (parsed) {
  //         return request(app)
  //           .get('/')
  //           .then(res => expect(res.body).to.deep.equal(expected));
  //       }
  //       return request(app)
  //         .get('/')
  //         .then(res => expect(res.text).to.equal(expected));
  //     };
  //   }

  //   it('should return a middleware which responds on success with ctx.result (boolean).',
  //      getCtxResultTest(true, 'true', false));

  //   it('should return a middleware which responds on success with ctx.result (null).',
  //      getCtxResultTest(null, '', false));

  //   it('should return a middleware which responds on success with ctx.result (undefined).',
  //      getCtxResultTest(undefined, '', false));

  //   it('should return a middleware which responds on success with ctx.result (number).',
  //      getCtxResultTest(12, '12', false));

  //   it('should return a middleware which responds on success with ctx.result (string).',
  //      getCtxResultTest('success', 'success', false));

  //   it('should return a middleware which responds on success with ctx.result (object).',
  //      getCtxResultTest({ success: 'ok' }, { success: 'ok' }, true));

  //   it(`should return a middleware which redirects on success if ctx.result is an instance
  //       of HttpResponseRedirect.`, () => {
  //     middleware1 = ctx => { ctx.result = new HttpResponseRedirect('/foo'); };
  //     app = express();
  //     route = { httpMethod: 'GET', paths: [], hooks: [ middleware1 ], successStatus: 200 };
  //     app.use(getExpressMiddleware(route));

  //     return request(app)
  //       .get('/')
  //       .expect('location', '/foo')
  //       .expect(302);
  //   });

  //   it('should return a middleware which responds with 500 if a foal middleware throws some Error.', () => {
  //     middleware1 = ctx => { throw new Error(); };
  //     app = express();
  //     route = { httpMethod: 'GET', paths: [], hooks: [ middleware1 ], successStatus: 200 };
  //     app.use(getExpressMiddleware(route));

  //     return request(app)
  //       .get('/')
  //       .expect(500);
  //   });

  //   it('should return a middleware which responds with 500 if a foal middleware rejects some Error.', () => {
  //     middleware1 = ctx => Promise.reject(new Error());
  //     app = express();
  //     route = { httpMethod: 'GET', paths: [], hooks: [ middleware1 ], successStatus: 200 };
  //     app.use(getExpressMiddleware(route));

  //     return request(app)
  //       .get('/')
  //       .expect(500);
  //   });

  //   it('should return a middleware which responds with the error status code if a foal middleware rejects '
  //       + 'an HttpError.', () => {
  //     middleware1 = ctx => Promise.reject(new HttpResponseMethodNotAllowed());
  //     app = express();
  //     route = { httpMethod: 'GET', paths: [], hooks: [ middleware1 ], successStatus: 200 };
  //     app.use(getExpressMiddleware(route));

  //     return request(app)
  //       .get('/')
  //       .expect(new HttpResponseMethodNotAllowed().statusCode);
  //   });

  // });

});
