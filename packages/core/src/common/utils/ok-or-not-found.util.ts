import { HttpResponseNotFound, HttpResponseOK } from '../../core';
import { isObjectDoesNotExist } from '../errors';

export async function okOrNotFound(promise: Promise<any>): Promise<HttpResponseOK|HttpResponseNotFound> {
  try {
    return new HttpResponseOK(await promise);
  } catch (err) {
    if (!isObjectDoesNotExist(err)) {
      throw err;
    }
    return new HttpResponseNotFound();
  }
}
