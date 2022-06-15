// 3p
import { createApp, Get, render } from '@foal/core';
import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import * as request from 'supertest';

it('Foal should support JSX Server-Side Rendering with React.', async () => {

  class ViewController {

    @Get('/')
    async index() {
      const content = ReactDOMServer.renderToString(<div>Hello world!</div>);

      return render('./templates/index.jsx.html', {
        content,
      });
    }

  }

  const app = await createApp(ViewController);

  const expectedBody = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Home</title>
</head>
<body>
  <div>Hello world!</div>
</body>
</html>`;

  await request(app)
    .get('/')
    .expect(200)
    .expect('Content-Type', 'text/html; charset=utf-8')
    .expect(expectedBody);

});
