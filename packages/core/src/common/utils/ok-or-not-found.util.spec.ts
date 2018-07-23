// 3p
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';

// FoalTS
import { HttpResponseNotFound, HttpResponseOK } from '../../core';
import { ObjectDoesNotExist } from '../errors';
import { okOrNotFound } from './ok-or-not-found.util';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('okOrNotFound', () => {

  it('should return an HttpResponseOK with the given content if the promise is resolved.', async () => {
    const promise = Promise.resolve('foo');

    const actual = await okOrNotFound(promise);

    expect(actual).to.be.an.instanceOf(HttpResponseOK)
      .with.property('content', 'foo');
  });

  it('should return an HttpResponseNotFound if the promise rejects an ObjectDoesNotExist.', async () => {
    const promise = Promise.reject(new ObjectDoesNotExist());

    const actual = await okOrNotFound(promise);

    expect(actual).to.be.an.instanceOf(HttpResponseNotFound);
  });

  it('should rejects an error if the promises rejects one which is not an ObjectDoesNotExist.', () => {
    const error = new Error();
    const promise = Promise.reject(error);

    const actual = okOrNotFound(promise);

    return expect(actual).to.be.rejectedWith(error);
  });

});
