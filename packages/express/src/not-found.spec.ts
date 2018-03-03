import * as express from 'express';
import * as request from 'supertest';

import { notFound } from './not-found';

describe('notFound', () => {

  it('should send a 404 response with a suitable body.', () => {
    const app = express();
    app.use(notFound());
    return request(app)
      .get('/foobar')
      .expect(404)
      .expect('<html><head><title>PAGE NOT FOUND</title></head><body><h1>404 - PAGE NOT FOUND</h1></body></html>');
  });

});
