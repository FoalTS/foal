---
title: API Testing with Swagger
id: tuto-6-swagger-interface
slug: 6-swagger-interface
---

Now that the first API endpoint has been implemented, the next step is to test it.

To do this, you will generate a complete documentation page of your API from which you can send requests. This page will be generated using [Swagger UI](https://swagger.io/tools/swagger-ui/) and the [OpenAPI specification](https://github.com/OAI/OpenAPI-Specification/).

```bash
npm install @foal/swagger
```

First, provide some information to describe your API globally.

```typescript
import { ApiInfo, ApiServer, controller } from '@foal/core';
import { StoriesController } from './api';

@ApiInfo({
  title: 'Application API',
  version: '1.0.0'
})
@ApiServer({
  url: '/api'
})
export class ApiController {

  subControllers = [
    controller('/stories', StoriesController),
  ];

}

```

Then generate a new controller. This one will be in charge of rendering the new page.

```bash
foal generate controller openapi --register
```

Make the generated class extend the abstract class `SwaggerController`. And then provide the root controller of your API as an option to the controller.

```typescript
import { SwaggerController } from '@foal/swagger';
import { ApiController } from './api.controller';

export class OpenapiController extends SwaggerController  {

  options = {
    controllerClass: ApiController
  }

}
```

Finally, update your `app.controller.ts` file so that the Swagger UI page is available at [/swagger](http://localhost:3001/swagger).

```typescript
import { controller, IAppController } from '@foal/core';

import { ApiController, OpenapiController } from './controllers';

export class AppController implements IAppController {
  subControllers = [
    controller('/api', ApiController),
    controller('/swagger', OpenapiController)
  ];
}

```

If you navigate to [http://localhost:3001/swagger](http://localhost:3001/swagger), you will see the documentation page generated from your code.

![Swagger page](./images/swagger1.png)

Now click on the *Try it out* button. The fields become editable and you can send requests to test your API.

![Swagger page](./images/swagger2.png)