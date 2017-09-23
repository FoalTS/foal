import { expect } from 'chai';

import { NotFoundError } from '../errors';
import { catchErrors } from './catch-errors';

// TODO: This hack should be removed.
console.error = (err: any) => {};

describe('catchError(middleware: ExpressMiddleware): ExpressMiddleware', () => {

  it('should send a 500 status if an error (not HttpError) is thrown by the given middleware.', () => {
    function middleware(req, res, next): void {
      throw new Error();
    }

    let status: number|undefined;
    const res = { sendStatus: (num: number): void => { status = num; } };

    // TODO: having an `any` here looks like a hack.
    catchErrors(middleware)({} as any, res as any, () => {});

    expect(status).to.equal(500);
  });

  it('should send a 500 status if the middleware returns a rejected promise with an error (not HttpError).', done => {
    function middleware(req, res, next): Promise<any> {
      return Promise.reject(new Error());
    }

    const res = {
      sendStatus: (status: number): void => {
        expect(status).to.equal(500);
        done();
      }
    };

    // TODO: having an `any` here looks like a hack.
    catchErrors(middleware)({} as any, res as any, () => {});
  });

  it('should send an error status if an HttpError is thrown by the given middleware.', () => {
    function middleware(req, res, next): void {
      throw new NotFoundError();
    }

    let status: number|undefined;
    const res = { sendStatus: (num: number): void => { status = num; } };

    // TODO: having an `any` here looks like a hack.
    catchErrors(middleware)({} as any, res as any, () => {});

    expect(status).to.equal(404);
  });

  it('should send an error status if the middleware returns a rejected promise with an HttpError.', done => {
    function middleware(req, res, next): Promise<any> {
      return Promise.reject(new NotFoundError());
    }

    const res = {
      sendStatus: (status: number): void => {
        expect(status).to.equal(404);
        done();
      }
    };

    // TODO: having an `any` here looks like a hack.
    catchErrors(middleware)({} as any, res as any, () => {});
  });

});
