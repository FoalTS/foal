// import { expect } from 'chai';

// import { getAppRouter } from './get-app-router';

describe('getAppRouter', () => {

  // The below items are more end-to-end tests than unit ones.

});

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
  //       .expect(404);
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
  //       .expect(404);
  //   });

  //   it('should return a middleware which does not respond on GET /foo/12/bar/ .', () => {
  //     return request(app)
  //       .get('/foo/12/bar/')
  //       .expect(404);
  //   });

  // });
