// std
import { deepStrictEqual, notStrictEqual, strictEqual } from 'assert';
import { createReadStream, mkdirSync, readdirSync, readFileSync, rmdirSync, unlinkSync } from 'fs';
import { join } from 'path';

// 3p
import {
  Class, Context, createApp, createService, ExpressApplication, getApiRequestBody, HttpResponseOK, IApiRequestBody, Post
} from '@foal/core';
import * as request from 'supertest';

// FoalTS
import { Disk } from './disk.service';
import { MultipartFormDataSchema, ValidateMultipartFormDataBody } from './validate-multipart-form-data-body.hook';

describe('ValidateMultipartFormDataBody', () => {

  beforeEach(() => process.env.SETTINGS_LOGGER_FORMAT = 'none');

  afterEach(() => delete process.env.SETTINGS_LOGGER_FORMAT);

  // Note: Unfortunatly, in order to have a multipart request object,
  // we need to create an Express server to test the hook.
  function createAppWithHook(schema: MultipartFormDataSchema, actual: { body: any }): ExpressApplication {
    @ValidateMultipartFormDataBody(schema)
    class AppController {
      @Post('/')
      index(ctx: Context) {
        actual.body = ctx.request.body;
        return new HttpResponseOK();
      }
    }
    return createApp(AppController);
  }

  it('should return an HttpResponseBadRequest if the request is not of type multipart/form-data.', async () => {
    const app = createAppWithHook({
      files: {}
    }, { body: null });

    await request(app)
      .post('/')
      .send({})
      .expect(400)
      .expect({
        headers: {
          error: 'INVALID_MULTIPART_FORM_DATA_REQUEST',
          message: 'Unsupported content type: application/json'
        }
      });
  });

  describe('should set ctx.request.body.fields with the fields', () => {

    it('when the fields are validated against the given schema.', async () => {
      const actual: { body: any } = { body: null };
      const app = createAppWithHook({
        fields: {
          properties: {
            name: { type: 'string' }
          },
          type: 'object',
        },
        files: {}
      }, actual);

      await request(app)
        .post('/')
        .field('name', 'hello')
        .expect(200);

      deepStrictEqual(actual.body.fields, {
        name: 'hello'
      });
    });

    it('when no schema is given in the hook.', async () => {
      const actual: { body: any } = { body: null };
      const app = createAppWithHook({
        files: {}
      }, actual);

      await request(app)
        .post('/')
        .field('name', 'hello')
        .expect(200);

      deepStrictEqual(actual.body.fields, {
        name: 'hello'
      });
    });

  });

  describe('when the fields are not validated against the given schema', () => {

    beforeEach(() => {
      process.env.SETTINGS_DISK_DRIVER = 'local';
      process.env.SETTINGS_DISK_LOCAL_DIRECTORY = 'uploaded';

      mkdirSync('uploaded');
      mkdirSync('uploaded/images');
    });

    afterEach(() => {
      delete process.env.SETTINGS_DISK_DRIVER;
      delete process.env.SETTINGS_DISK_LOCAL_DIRECTORY;

      const contents = readdirSync('uploaded/images');
      for (const content of contents) {
        unlinkSync(join('uploaded/images', content));
      }
      rmdirSync('uploaded/images');
      rmdirSync('uploaded');
    });

    it('should return an HttpResponseBadRequest.', async () => {
      const app = createAppWithHook({
        fields: {
          properties: {
            name: { type: 'boolean' }
          },
          type: 'object',
        },
        files: {}
      }, { body: null });

      await request(app)
        .post('/')
        .field('name', 'hello')
        .expect(400)
        .expect({
          body: [
            {
              dataPath: '.name',
              keyword: 'type',
              message: 'should be boolean',
              params: {
                type: 'boolean'
              },
              schemaPath: '#/properties/name/type',
            }
          ]
        });
    });

    it('should not have uploaded the files.', async () => {
      const app = createAppWithHook({
        fields: {
          properties: {
            name: { type: 'boolean' }
          },
          type: 'object',
        },
        files: {
          foobar: { required: false, multiple: true, saveTo: 'images' },
          foobar2: { required: false, multiple: false, saveTo: 'images' },
          foobar3: { required: false, multiple: false, saveTo: 'images' },
          foobar4: { required: false, multiple: false },
        }
      }, { body: null });

      await request(app)
        .post('/')
        .attach('foobar', createReadStream('src/image.test.png'))
        .attach('foobar', createReadStream('src/image.test2.png'))
        .attach('foobar2', createReadStream('src/image.test2.png'))
        .attach('foobar4', createReadStream('src/image.test2.png'))
        .field('name', 'hello')
        .expect(400); // Test that no error is rejected in the hook (error 500).

      strictEqual(readdirSync('uploaded/images').length, 0);
    });

  });

  it('should ignore the upload of unexpected files.', async () => {
    const actual: { body: any } = { body: null };
    const app = createAppWithHook({
      files: {}
    }, actual);

    await request(app)
      .post('/')
      .attach('foobar', createReadStream('src/image.test.png'))
      .expect(200);

    deepStrictEqual(actual.body.files.foobar, undefined);
  });

  describe('when a file is not uploaded and it is not required', () => {

    it('should set ctx.request.body.files with a "null" value if the option "multiple" is not defined.', async () => {
      const actual: { body: any } = { body: null };
      const app = createAppWithHook({
        files: {
          foobar: { required: false }
        }
      }, actual);

      await request(app)
        .post('/')
        .field('name', 'hello')
        .expect(200);

      deepStrictEqual(actual.body.files, {
        foobar: null
      });
    });

    it('should set ctx.request.body.files with a "null" value if the option "multiple" is "false".', async () => {
      const actual: { body: any } = { body: null };
      const app = createAppWithHook({
        files: {
          foobar: { required: false, multiple: false }
        }
      }, actual);

      await request(app)
        .post('/')
        .field('name', 'hello')
        .expect(200);

      deepStrictEqual(actual.body.files, {
        foobar: null
      });
    });

    it('should set ctx.request.body.files with an empty array if the option "multiple" is "true".', async () => {
      const actual: { body: any } = { body: null };
      const app = createAppWithHook({
        files: {
          foobar: { required: false, multiple: true }
        }
      }, actual);

      await request(app)
        .post('/')
        .field('name', 'hello')
        .expect(200);

      deepStrictEqual(actual.body.files, {
        foobar: []
      });
    });

  });

  describe('when a file is not uploaded but it is required', () => {

    beforeEach(() => {
      process.env.SETTINGS_DISK_DRIVER = 'local';
      process.env.SETTINGS_DISK_LOCAL_DIRECTORY = 'uploaded';

      mkdirSync('uploaded');
      mkdirSync('uploaded/images');
    });

    afterEach(() => {
      delete process.env.SETTINGS_DISK_DRIVER;
      delete process.env.SETTINGS_DISK_LOCAL_DIRECTORY;

      const contents = readdirSync('uploaded/images');
      for (const content of contents) {
        unlinkSync(join('uploaded/images', content));
      }
      rmdirSync('uploaded/images');
      rmdirSync('uploaded');
    });

    it('should return an HttpResponseBadRequest (multiple === undefined).', () => {
      const actual: { body: any } = { body: null };
      const app = createAppWithHook({
        files: {
          foobar: { required: true }
        }
      }, actual);

      return request(app)
        .post('/')
        .field('name', 'hello')
        .expect(400)
        .expect({
          body: {
            error: 'MISSING_FILE',
            message: 'The file "foobar" is required.'
          }
        });
    });

    it('should return an HttpResponseBadRequest (multiple === false).', () => {
      const actual: { body: any } = { body: null };
      const app = createAppWithHook({
        files: {
          foobar: { required: true, multiple: false }
        }
      }, actual);

      return request(app)
        .post('/')
        .field('name', 'hello')
        .expect(400)
        .expect({
          body: {
            error: 'MISSING_FILE',
            message: 'The file "foobar" is required.'
          }
        });
    });

    it('should return an HttpResponseBadRequest (multiple === true).', () => {
      const actual: { body: any } = { body: null };
      const app = createAppWithHook({
        files: {
          foobar: { required: true, multiple: true }
        }
      }, actual);

      return request(app)
        .post('/')
        .field('name', 'hello')
        .expect(400)
        .expect({
          body: {
            error: 'MISSING_FILE',
            message: 'The file "foobar" is required.'
          }
        });
    });

    it('should not have uploaded the other files.', async () => {
      const app = createAppWithHook({
        files: {
          foobar: { required: false, multiple: true, saveTo: 'images' },
          foobar2: { required: false, multiple: false, saveTo: 'images' },
          foobar3: { required: false, multiple: false, saveTo: 'images' },
          foobar4: { required: false, multiple: false },
          requiredFoobar: { required: true },
        }
      }, { body: null });

      await request(app)
        .post('/')
        .attach('foobar', createReadStream('src/image.test.png'))
        .attach('foobar', createReadStream('src/image.test2.png'))
        .attach('foobar2', createReadStream('src/image.test2.png'))
        .attach('foobar4', createReadStream('src/image.test2.png'))
        .field('name', 'hello')
        .expect(400); // Test that no error is rejected in the hook (error 500).

      strictEqual(readdirSync('uploaded/images').length, 0);
    });

  });

  describe('when a file is uploaded and saveTo is undefined', () => {

    it('should set ctx.request.files with the buffered file if the option "multiple" is not defined.', async () => {
      const actual: { body: any } = { body: null };
      const app = createAppWithHook({
        files: {
          foobar: { required: true }
        }
      }, actual);

      await request(app)
        .post('/')
        .attach('foobar', createReadStream('src/image.test.png'))
        .expect(200);

      deepStrictEqual(actual.body.files.foobar, readFileSync('src/image.test.png'));
    });

    it('should set ctx.request.files with the buffered file if the option "multiple" is "false".', async () => {
      const actual: { body: any } = { body: null };
      const app = createAppWithHook({
        files: {
          foobar: { required: true, multiple: false }
        }
      }, actual);

      await request(app)
        .post('/')
        .attach('foobar', createReadStream('src/image.test.png'))
        .expect(200);

      deepStrictEqual(actual.body.files.foobar, readFileSync('src/image.test.png'));
    });

    it('should set ctx.request.files with an array of the buffered fileS if the option "multiple" is "true".',
      async () => {
        const actual: { body: any } = { body: null };
        const app = createAppWithHook({
          files: {
            foobar: { required: true, multiple: true }
          }
        }, actual);

        await request(app)
          .post('/')
          .attach('foobar', createReadStream('src/image.test.png'))
          .attach('foobar', createReadStream('src/image.test2.png'))
          .expect(200);

        deepStrictEqual(actual.body.files.foobar, [
          readFileSync('src/image.test.png'),
          readFileSync('src/image.test2.png'),
        ]);
      });

  });

  describe('when a file is uploaded and saveTo is defined', () => {

    let disk: Disk;

    beforeEach(() => {
      process.env.SETTINGS_DISK_DRIVER = 'local';
      process.env.SETTINGS_DISK_LOCAL_DIRECTORY = 'uploaded';

      mkdirSync('uploaded');
      mkdirSync('uploaded/images');

      disk = createService(Disk);
    });

    afterEach(() => {
      delete process.env.SETTINGS_DISK_DRIVER;
      delete process.env.SETTINGS_DISK_LOCAL_DIRECTORY;

      const contents = readdirSync('uploaded/images');
      for (const content of contents) {
        unlinkSync(join('uploaded/images', content));
      }
      rmdirSync('uploaded/images');
      rmdirSync('uploaded');
    });

    it('should save the file to the disk and set ctx.request.files with its path'
      + ' if the option "multiple" is not defined.', async () => {
        const actual: { body: any } = { body: null };
        const app = createAppWithHook({
          files: {
            foobar: { required: false, saveTo: 'images' }
          }
        }, actual);

        await request(app)
          .post('/')
          .attach('foobar', createReadStream('src/image.test.png'))
          .expect(200);

        strictEqual(typeof actual.body.files.foobar, 'object');
        notStrictEqual(actual.body.files.foobar, null);

        const path = actual.body.files.foobar.path;
        strictEqual(typeof path, 'string');

        deepStrictEqual(
          readFileSync('src/image.test.png'),
          (await disk.read(path, 'buffer')).file
        );
      }
    );

    it('should save the file to the disk and set ctx.request.files with its path'
      + ' if the option "multiple" is "false".', async () => {
        const actual: { body: any } = { body: null };
        const app = createAppWithHook({
          files: {
            foobar: { required: false, multiple: false, saveTo: 'images' }
          }
        }, actual);

        await request(app)
          .post('/')
          .attach('foobar', createReadStream('src/image.test.png'))
          .expect(200);

        strictEqual(typeof actual.body.files.foobar, 'object');
        notStrictEqual(actual.body.files.foobar, null);

        const path = actual.body.files.foobar.path;
        strictEqual(typeof path, 'string');

        deepStrictEqual(
          readFileSync('src/image.test.png'),
          (await disk.read(path, 'buffer')).file
        );
      }
    );

    it('should save the file to the disk and set ctx.request.files with an array'
      + ' of the pathS  if the option "multiple" is "true".', async () => {
        const actual: { body: any } = { body: null };
        const app = createAppWithHook({
          files: {
            foobar: { required: false, multiple: true, saveTo: 'images' }
          }
        }, actual);

        await request(app)
          .post('/')
          .attach('foobar', createReadStream('src/image.test.png'))
          .attach('foobar', createReadStream('src/image.test2.png'))
          .expect(200);

        strictEqual(typeof actual.body.files.foobar, 'object');
        notStrictEqual(actual.body.files.foobar, null);

        if (!Array.isArray(actual.body.files.foobar)) {
          throw new Error('"files.foobar" should an array.');
        }

        const path = actual.body.files.foobar[0].path;
        strictEqual(typeof path, 'string');

        deepStrictEqual(
          readFileSync('src/image.test.png'),
          (await disk.read(path, 'buffer')).file
        );

        const path2 = actual.body.files.foobar[1].path;
        strictEqual(typeof path2, 'string');

        deepStrictEqual(
          readFileSync('src/image.test2.png'),
          (await disk.read(path2, 'buffer')).file
        );
      }
    );

    it('should keep the extension of the file if it has one.', async () => {
      const actual: { body: any } = { body: null };
      const app = createAppWithHook({
        files: {
          foobar: { required: false, saveTo: 'images' }
        }
      }, actual);

      await request(app)
        .post('/')
        .attach('foobar', createReadStream('src/image.test.png'))
        .expect(200);

      strictEqual(typeof actual.body.files.foobar, 'object');
      notStrictEqual(actual.body.files.foobar, null);

      const path: string = actual.body.files.foobar.path;
      strictEqual(typeof path, 'string');

      const fragments = path.split('.');
      strictEqual(fragments.length, 2);
      strictEqual(fragments[1], 'png');
    });

    it('should not keep the extension of the file if it has none.', async () => {
      const actual: { body: any } = { body: null };
      const app = createAppWithHook({
        files: {
          foobar: { required: false, saveTo: 'images' }
        }
      }, actual);

      await request(app)
        .post('/')
        .attach('foobar', createReadStream('src/image.test.png'), { filename: 'my_image' })
        .expect(200);

      strictEqual(typeof actual.body.files.foobar, 'object');
      notStrictEqual(actual.body.files.foobar, null);

      const path: string = actual.body.files.foobar.path;
      strictEqual(typeof path, 'string');

      const fragments = path.split('.');
      strictEqual(fragments.length, 1);
    });

  });

  describe('should define an API specification', () => {

    const schema: MultipartFormDataSchema = {
      fields: {
        bar: { type: 'integer' },
        foo: { type: 'integer' },
      },
      files: {
        album: { required: false, multiple: true },
        profile: { required: true }
      }
    };
    const expectedRequestBody: IApiRequestBody = {
      content: {
        'multipart/form-data': {
          schema: {
            properties: {
              album: {
                items: {
                  format: 'binary',
                  type: 'string',
                },
                type: 'array',
              },
              bar: {
                type: 'integer'
              },
              foo: {
                type: 'integer'
              },
              profile: {
                format: 'binary',
                type: 'string',
              },
            },
            required: [ 'bar', 'foo', 'profile' ],
            type: 'object',
          }
        }
      }
    };

    afterEach(() => delete process.env.SETTINGS_OPENAPI_USE_HOOKS);

    it('unless options.openapi is undefined and settings.openapi.useHooks is undefined.', () => {
      @ValidateMultipartFormDataBody(schema)
      class Foobar {}

      deepStrictEqual(getApiRequestBody(Foobar), undefined);
    });

    it('unless options.openapi is undefined and settings.openapi.useHooks is false.', () => {
      process.env.SETTINGS_OPENAPI_USE_HOOKS = 'false';
      @ValidateMultipartFormDataBody(schema)
      class Foobar {}

      deepStrictEqual(getApiRequestBody(Foobar), undefined);
    });

    it('unless options.openapi is false.', () => {
      @ValidateMultipartFormDataBody(schema)
      class Foobar {}

      deepStrictEqual(getApiRequestBody(Foobar), undefined);
    });

    function testClass(Foobar: Class) {
      const actualRequestBody = getApiRequestBody(Foobar);
      deepStrictEqual(actualRequestBody, expectedRequestBody);
    }

    it('if options.openapi is true (class decorator).', () => {
      @ValidateMultipartFormDataBody(schema, { openapi: true })
      class Foobar {}

      testClass(Foobar);
    });

    it('if options.openapi is undefined and settings.openapi.useHooks is true (class decorator).', () => {
      process.env.SETTINGS_OPENAPI_USE_HOOKS = 'true';
      @ValidateMultipartFormDataBody(schema)
      class Foobar {}

      testClass(Foobar);
    });

    function testMethod(Foobar: Class) {
      const actualRequestBody = getApiRequestBody(Foobar, 'foo');
      deepStrictEqual(actualRequestBody, expectedRequestBody);
    }

    it('if options.openapi is true (method decorator).', () => {
      class Foobar {
        @ValidateMultipartFormDataBody(schema, { openapi: true })
        foo() {}
      }

      testMethod(Foobar);
    });

    it('if options.openapi is undefined and settings.openapi.useHooks is true (method decorator).', () => {
      process.env.SETTINGS_OPENAPI_USE_HOOKS = 'true';
      class Foobar {
        @ValidateMultipartFormDataBody(schema)
        foo() {}
      }

      testMethod(Foobar);
    });

  });

});
