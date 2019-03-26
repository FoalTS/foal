// std
import { ok, strictEqual } from 'assert';
import { IncomingMessage } from 'http';

// "3p"
import { Context } from '@foal/core';
import { Fields, Files, IncomingForm } from 'formidable';

// FoalTS
import { parseForm } from './parse-form';

interface FakeIncomingForm {
  parse(req: IncomingMessage, callback?: (err: any, fields: Fields, files: Files) => any): void;
}

describe('parseForm', () => {

  it('should return a promise.', () => {
    const ctx = new Context({});
    const fakeIncomingForm: FakeIncomingForm = {
      parse(req, callback) {}
    };
    const actual = parseForm(fakeIncomingForm as IncomingForm, ctx);

    ok(actual instanceof Promise, `${actual} is not a promise`);
  });

  it('should call form.parse with the request of the context.', () => {
    let request;
    const ctx = new Context({});
    const fakeIncomingForm: FakeIncomingForm = {
      parse(req, callback) {
        request = req;
      }
    };

    parseForm(fakeIncomingForm as IncomingForm, ctx);

    strictEqual(request, ctx.request);
  });

  it('should return a rejected promise if the form callback is called with an error.', done => {
    const err = {};
    const ctx = new Context({});
    const fakeIncomingForm: FakeIncomingForm = {
      parse(req, callback) {
        if (callback) {
          callback(err, {}, {});
        }
      }
    };

    parseForm(fakeIncomingForm as IncomingForm, ctx)
      .then(() => done('The promise was resolved.'))
      .catch(error => {
        if (error !== err) {
          done('The promise was rejected but with an incorrect error: ' + error);
          return;
        }
        done();
      });
  });

  it('should return a resolved promise if the form callback is called with no error.', done => {
    const fields: Fields = {};
    const files: Files = {};
    const ctx = new Context({});
    const fakeIncomingForm: FakeIncomingForm = {
      parse(req, callback) {
        if (callback) {
          callback(null, fields, files);
        }
      }
    };

    parseForm(fakeIncomingForm as IncomingForm, ctx)
      .then(data => {
        if (data.fields !== fields || data.files !== files) {
          done(`The promise was resolved but with incorrect fields (${data.fields}) or files (${data.files}).`);
          return;
        }
        done();
      })
      .catch(error => done('The promise was rejected.'));
  });

});
