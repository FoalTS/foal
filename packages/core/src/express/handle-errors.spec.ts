// std
import { strictEqual } from 'assert';

// 3p
import * as express from 'express';
import * as request from 'supertest';

// FoalTS
import { handleErrors } from './handle-errors';

describe('handleErrors', () => {

  describe('should return an error-handling middleware which', () => {

    it('should log the error stack with the given log function.', () => {
      let str = '';
      const logFn = (msg: string) => str = msg;
      const err = new Error();

      const middleware = handleErrors(logFn);

      const app = express();
      app.use((req, res, next) => { throw err; });
      app.use(middleware);
      return request(app)
        .get('/')
        .then(res => {
          strictEqual(str, err.stack);
        });
    });

    it('should ignore Express client errors and forward them to the new error-handling middleware.', () => {
      const app = express()
        .use(express.text({ type: 'text/*' }))
        .use(handleErrors(() => {}));

      return request(app)
        .post('/foo')
        .set('Content-Type', 'text/html; charset=foo')
        .send('bar')
        .expect(415)
        .then(response => {
          strictEqual(response.text.includes('UnsupportedMediaTypeError: unsupported charset'), true);
        });
    });

  });

});
