---
title: Production Build
id: tuto-14-production-build
slug: 14-production-build
---

So far, the front-end and back-end applications are compiled and served by two different development servers. The next step is to build them into a single one ready for production.

## Building the React app

In your frontend directory, run the following command:

```bash
npm run build
```

This command builds the React application for production and saves the files in the `build` directory.

Open it and copy all its contents to the `public` directory of your Foal application.

> When you use `foal connect` with Angular or Vue, the frontend build will automatically save the files in `public`.

Now, if you navigate to [http://localhost:3001](http://localhost:3001), you will see the frontend application served by the backend server.

## Preventing 404 errors

Open the link [http://localhost:3001/login](http://localhost:3001/login) in a new tab. The server returns a 404 error.

This is perfectly normal. At the moment, the server does not have a handler for the `/login` route and therefore returns this error. Previously, this problem was handled by the React development server, which is why there was no such error.

To solve this problem, you will add a controller method that will process unhandled requests.

Open `app.controller.ts` and update its contents.

```typescript
import { Context, controller, Get, HttpResponseNotFound, IAppController, render } from '@foal/core';

import { ApiController, OpenapiController } from './controllers';

export class AppController implements IAppController {
  subControllers = [
    controller('/api', ApiController),
    controller('/swagger', OpenapiController)
  ];

  @Get('*')
  renderApp(ctx: Context) {
    if (!ctx.request.accepts('html')) {
      return new HttpResponseNotFound();
    }

    return render('./public/index.html');
  }
}

```

This method returns the React application for any GET request that accepts HTML content and has not been handled by the other methods of the controller and its subcontrollers.

If you return to [http://localhost:3001/login](http://localhost:3001/login) and refresh the page, the login page should display.

## Building the Foal app

Now, if you want to build the backend application so that you don't use the `npm run dev` option, you can run this command:

```bash
npm run build
```

Then, to launch the application, simply execute the following:

```bash
npm run start
```