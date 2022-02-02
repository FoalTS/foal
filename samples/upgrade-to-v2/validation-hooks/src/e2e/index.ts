// 3p
import { createApp } from '@foal/core';
import * as request from 'supertest';

// App
import { AppController } from '../app/app.controller';

describe('The server', () => {

  let app;

  before(async () => {
    app = await createApp(AppController);
  });

  it('should validate headers on GET /headers requests.', async () => {
    await request(app)
      .get('/api/headers')
      .expect(400)
      .expect({
        headers: [
          {
            keyword: 'required',
            dataPath: '',
            schemaPath: '#/required',
            params: {
              missingProperty: 'authorization'
            },
            message: 'should have required property \'authorization\''
          }
        ]
      });

    await request(app)
      .get('/api/headers')
      .set('Authorization', 'foo')
      .expect(200)
      .expect('Hello world!');

    await request(app)
      .get('/api/headers')
      .set('Authorization', 'foo')
      .set('a-number', 'foo')
      .expect(400)
      .expect({
        headers: [
          {
            keyword: 'type',
            dataPath: '[\'a-number\']',
            schemaPath: '#/properties/a-number/type',
            params: {
              type: 'integer'
            },
            message: 'should be integer'
          }
        ]
      });
  });

  it('should validate query on GET /query requests.', async () => {
    await request(app)
      .get('/api/query')
      .expect(400)
      .expect({
        query: [
          {
            keyword: 'required',
            dataPath: '',
            schemaPath: '#/required',
            params: {
              missingProperty: 'authorization'
            },
            message: 'should have required property \'authorization\''
          }
        ]
      });

    await request(app)
      .get('/api/query')
      .query('authorization', 'foo')
      .expect(200)
      .expect('Hello world!');

    await request(app)
      .get('/api/query')
      .query('authorization', 'foo')
      .query('a-number', 'foo')
      .expect(400)
      .expect({
        query: [
          {
            keyword: 'type',
            dataPath: '[\'a-number\']',
            schemaPath: '#/properties/a-number/type',
            params: {
              type: 'integer'
            },
            message: 'should be integer'
          }
        ]
      });
  });

  it('should validate path params on GET /params/:productId requests.', async () => {
    await request(app)
      .get('/api/params/1')
      .expect(200)
      .expect('Hello world!');

    await request(app)
      .get('/api/params/foo')
      .expect(400)
      .expect({
        pathParams: [
          {
            keyword: 'type',
            dataPath: '.productId',
            schemaPath: '#/properties/productId/type',
            params: {
              type: 'integer'
            },
            message: 'should be integer'
          }
        ]
      });
  });

  it('should validate cookies on GET /cookies requests.', async () => {
    await request(app)
      .get('/api/cookies')
      .expect(400)
      .expect({
        cookies: [
          {
            keyword: 'required',
            dataPath: '',
            schemaPath: '#/required',
            params: {
              missingProperty: 'Authorization'
            },
            message: 'should have required property \'Authorization\''
          }
        ]
      });

    await request(app)
      .get('/api/cookies')
      .set('Cookie', 'Authorization=foo')
      .expect(200)
      .expect('Hello world!');

    await request(app)
      .get('/api/cookies')
      .set('Cookie', 'Authorization=foo; A-Number=foo;')
      .expect(400)
      .expect({
        cookies: [
          {
            keyword: 'type',
            dataPath: '[\'A-Number\']',
            schemaPath: '#/properties/A-Number/type',
            params: {
              type: 'integer'
            },
            message: 'should be integer'
          }
        ]
      });
  });

});
