// std
import { readFile } from 'fs';
import { join } from 'path';
import { promisify } from 'util';

// 3p
import { createApp, Get, HttpResponseOK } from '@foal/core';
import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import * as request from 'supertest';

it('Foal should support JSX Server-Side Rendering with React.', async () => {

  class ViewController {

    @Get('/')
    async index() {
      const content = ReactDOMServer.renderToString(<div>Hello world!</div>);
      const page = await this.renderFullPage(content);

      const response = new HttpResponseOK(page);
      response.setHeader('Content-Type', 'text/html; charset=utf-8');
      return response;
    }

    private async renderFullPage(content: string): Promise<string> {
      const template = await promisify(readFile)(join(__dirname, 'template.html'), 'utf8');
      return template.replace('{{ content }}', content);
    }

  }

  const app = createApp(ViewController);

  const expectedBody = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Home</title>
</head>
<body>
  <div data-reactroot="">Hello world!</div>
</body>
</html>`;

  await request(app)
    .get('/')
    .expect(200)
    .expect('Content-Type', 'text/html; charset=utf-8')
    .expect(expectedBody);

});
