// std
import { deepStrictEqual, strictEqual } from 'assert';

// FoalTS
import { createOpenApiDocument } from './create-open-api-document';
import { ApiInfo } from './decorators';

describe('createOpenApiDocument', () => {

  it('should throw an Error if no api:info is found.', done => {
    class Controller {}

    try {
      const document = createOpenApiDocument(Controller);
      done(new Error('The function should have thrown an Error.'));
    } catch (error) {
      strictEqual(error.message, 'Your root controller should be decorated with @ApiInfo.');
      done();
    }
  });

  it('should return the document info.', () => {
    const metadata = {
      title: 'foo',
      version: '0.0.0'
    };
    @ApiInfo(metadata)
    class Controller {}

    const document = createOpenApiDocument(Controller);
    deepStrictEqual(document.info, metadata);
  });

});
