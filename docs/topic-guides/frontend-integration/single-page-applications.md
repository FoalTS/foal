# Single Page Applications

Single-Page Applications are Web Applications that are loaded once upon the first request\(s\) to the backend. After retreiving all the necessary code from the server, the current page is rendered and updated directly in the browser without asking the server to render new pages. During its lifecycle, the application usually communicates with the server by making API calls to fetch, create, update or delete data. This is a common pattern used when creating a new application with Angular, React or Vue.

Building a SPA, however, introduces a certain complexity. This document presents some techniques and tools for solving common scenarios.

## Building the App & Proxifying Requests

See the [Angular, React & Vue](angular-react-vue.md) section to learn on how to configure your frontend CLI to interact with a Foal application.

## Using Frontend Routers

Most single-page applications simulate routing on the frontend side. This is usually done by libraries such as [react-router](https://reacttraining.com/react-router) or [@angular/router](https://angular.io/guide/router). The application does not actually make any requests to the server but simply modifies the URL in the address bar.

This works fine until the user presses the refresh button, shares the link or saves the page in their bookmarks. In that case, the browser makes a request to the server to retreive the desired page and thus gets a 404 error.

_Example_

| Request | Response |
| :--- | :--- |
| `/` | 200 - Returns the `index.html` file in the `public/` directory. |
| `/users?city=Paris` | 404 - The server has no route that handles `/users`. |

One technique to solve this problem is to add a handler responsible for processing uncaught requests. It returns the `index.html` page in all cases. This way, the browser loads the application which then looks at the address bar and displays the appropriate page.

```typescript
import { readFile } from 'fs';
import { promisify } from 'util';

import { controller, Get, HttpResponseOK } from '@foal/core';

import { ApiController, AuthController } from './controllers';

export class AppController {
  subControllers = [
    controller('/api', ApiController),
    controller('/auth', AuthController)
  ];

  @Get('*')
  async notFound() {
    const index = await promisify(readFile)('./public/index.html', 'utf8');
    return new HttpResponseOK(index);
  }
}
```

> _Note:_ With this approach, the frontend is responsible for catching incorrect URLs and displaying a 404 page.
>
> _Note 2:_ This issue usually does not show up in development as frontend CLIs are sufficiently clever to handle these requests.

