# Controllers

Controllers are a sub-category of services. Usually they implement a particular interface such as `RestController` or `BasicController`. They aim to be connected to the outside to handle requests. For that you need to call the appropriate controller binder in the module.

Examples:
```ts
// RestController
import * as bodyParser from 'body-parser';
import * as express from 'express';
import { Foal, Service, rest, RestController, RestParams } from '@foal/core';

@Service()
class User implements RestController {
  constructor () {}

  async create(data: any, params: RestParams): Promise<any> {
    data.createdAt = Date.now();
    return data;
  }
}

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const foal = new Foal({
  services: [ User ],
  controllerBindings: [ rest.bindController('/users', User) ]
});
app.use(foal.expressRouter());
app.listen(3000, () => console.log('Listening...'));
// POST /users with { "name": "toto" } should return { "name": "toto", "createdAt": "..." };
```

```ts
// BasicController
import * as express from 'express';
import { Request, Response } from 'express';
import { Foal, Service, basic, BasicController } from '@foal/core';

@Service()
class User implements BasicController {
  constructor () {}

  post(req: Request, res: Response) {
    res.send('Hello world!');
  }
}

const app = express();
const foal = new Foal({
  services: [ User ],
  controllerBindings: [ basic.bindController('/users', User) ]
});
app.use(foal.expressRouter());
app.listen(3000, () => console.log('Listening...'));
// POST /users with { "name": "toto" } should return 'Hello world!';
```

Some services from foal packages already implement the `RestController` interface to wire it to the outside. However you may still use them internally.

As the path of the controller is specified by the binder, controllers may be re-used in other places or with other url.