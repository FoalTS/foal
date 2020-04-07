// std
import { strictEqual } from 'assert';

// 3p
import * as express from 'express';
import * as request from 'supertest';

// FoalTS
import { Context, HttpResponseOK } from '../core';
import { CreateAppOptions } from './create-app';
import { handleErrors } from './handle-errors';

describe('handleErrors', () => {

  describe('should return an error-handling middleware which', () => {

    afterEach(() => delete process.env.SETTINGS_LOG_ERRORS);

    it('should ignore Express client errors and forward them to the new error-handling middleware.', () => {
      const app = express()
        .use(express.text({ type: 'text/*' }))
        .use(handleErrors({}, {}, () => {}));

      return request(app)
        .post('/foo')
        .set('Content-Type', 'text/html; charset=foo')
        .send('bar')
        .expect(415)
        .then(response => {
          strictEqual(response.text.includes('UnsupportedMediaTypeError: unsupported charset'), true);
        });
    });

    it('should log the error stack with the given log function.', () => {
      let str = '';
      const logFn = (msg: string) => str = msg;
      const err = new Error();

      const middleware = handleErrors({}, {}, logFn);

      const app = express()
        .use((req, res, next) => { throw err; })
        .use(middleware);
      return request(app)
        .get('/')
        .then(res => {
          strictEqual(str, err.stack);
        });
    });

    it('should not log the error if the value of the configuration key settings.logErrors is false.', async () => {
      process.env.SETTINGS_LOG_ERRORS = 'false';
      let str = null;
      const logFn = (msg: string) => str = msg;
      const err = new Error();

      const middleware = handleErrors({}, {}, logFn);

      const app = express()
        .use((req, res, next) => { throw err; })
        .use(middleware);
      await request(app)
        .get('/')
        .expect(500);

      strictEqual(str, null);
    });

    describe('should render the default 500 template', () => {

      function test(options: CreateAppOptions, appController: any) {
        const default500page = '<html><head><title>INTERNAL SERVER ERROR</title></head><body>'
        + '<h1>500 - INTERNAL SERVER ERROR</h1></body></html>';

        const app = express()
          .use((req, res, next) => { throw new Error(); })
          .use(handleErrors(options, appController, () => {}));
        return request(app)
          .get('/')
          .expect(500)
          .expect(default500page);
      }

      it('when options.methods is not defined.', () => test(
        {}, { handleError: () => new HttpResponseOK() }
      ));

      it('when options.methods.handleErrors is not defined.', () => test(
        { methods: {} }, { handleError: () => new HttpResponseOK() }
      ));

      it('when options.methods.handleErrors is false.', () => test(
        { methods: { handleError: false } }, { handleError: () => new HttpResponseOK() }
      ));

      it('when options.methods.handleErrors is true and AppController.handleError is undefined.', () => test(
        { methods: { handleError: true } }, {}
      ));

    });

    describe('if options.methods.handleErrors is true and AppController.handleError is defined', () => {

      const options: CreateAppOptions = {
        methods: {
          handleError: true
        }
      };

      it('should return the response of the method (sync).', () => {
        const appController = {
          handleError() {
            return new HttpResponseOK('hello')
              .setHeader('foo', 'bar');
          }
        };

        const app = express()
          .use((req, res, next) => { throw new Error(); })
          .use(handleErrors(options, appController, () => {}));
        return request(app)
          .get('/')
          .expect(200)
          .expect('foo', 'bar')
          .expect('hello');
      });

      it('should return the response of the method (async).', () => {
        const appController = {
          async handleError() {
            return new HttpResponseOK('hello')
              .setHeader('foo', 'bar');
          }
        };

        const app = express()
          .use((req, res, next) => { throw new Error(); })
          .use(handleErrors(options, appController, () => {}));
        return request(app)
          .get('/')
          .expect(200)
          .expect('foo', 'bar')
          .expect('hello');
      });

      it('should call the method with the error and the context (if error thrown in Foal components).', async () => {
        const expectedError = new Error();
        let expectedContext: any = null;

        let actualError: any = null;
        let actualContext: any = null;

        const appController = {
          async handleError(err: Error, ctx: Context) {
            actualError = err;
            actualContext = ctx;
            return new HttpResponseOK('hello')
              .setHeader('foo', 'bar');
          }
        };

        const app = express()
          .use((req, res, next) => {
            expectedContext = new Context(req);
            (req as any).foal = { ctx: expectedContext };
            throw expectedError;
          })
          .use(handleErrors(options, appController, () => {}));
        await request(app)
          .get('/')
          .expect(200);

        strictEqual(actualError, expectedError);
        strictEqual(actualContext, expectedContext);
      });

      it('should call the method with the error and a context (if error thrown in Express middlewares).', async () => {
        const expectedError = new Error();
        let expectedRequest: any = null;

        let actualError: any = null;
        let actualContext: any = null;

        const appController = {
          async handleError(err: Error, ctx: Context) {
            actualError = err;
            actualContext = ctx;
            return new HttpResponseOK('hello')
              .setHeader('foo', 'bar');
          }
        };

        const app = express()
          .use((req, res, next) => {
            expectedRequest = req;
            throw expectedError;
          })
          .use(handleErrors(options, appController, () => {}));
        await request(app)
          .get('/')
          .expect(200);

        strictEqual(actualError, expectedError);
        if (!(actualContext instanceof Context)) {
          throw new Error('The second argument of handleError should be a Context');
        }
        strictEqual(actualContext.request, expectedRequest);
      });

      it('should return the default 500 template if the method throws an Error.', () => {
        const default500page = '<html><head><title>INTERNAL SERVER ERROR</title></head><body>'
        + '<h1>500 - INTERNAL SERVER ERROR</h1></body></html>';

        // TODO: test the reported error is error 2 and not error 1;

        const appController = {
          handleError() {
            throw new Error('error 2');
          }
        };

        const app = express()
          .use((req, res, next) => { throw new Error('error 1'); })
          .use(handleErrors(options, appController, () => {}));
        return request(app)
          .get('/')
          .expect(500)
          .expect(default500page);
      });

    });

  });

});
