// 3p
import * as request from 'supertest';

// FoalTS
import { createApp, dependency, Get, HttpResponseOK } from '@foal/core';
import { strictEqual } from 'assert';

describe('Feature: Creating a service', () => {

  it('Example: Returning "Hello world!" with a date', async () => {

    /* ======================= DOCUMENTATION BEGIN ======================= */

    class FormatService {
      withDate(message: string): string {
        return `${new Date()} - ${message}`;
      }
    }

    class AppController {
      @dependency
      format: FormatService;

      @Get('/')
      index() {
        const message = this.format.withDate('Hello world!');
        return new HttpResponseOK(message);
      }

    }

    /* ======================= DOCUMENTATION END ========================= */

    const app = await createApp(AppController);

    await request(app)
      .get('/')
      .expect(200)
      .expect(response => {
        strictEqual(response.text.endsWith(' - Hello world!'), true);
      });
  });

});
