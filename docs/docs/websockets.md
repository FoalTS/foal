---
title: Real-Time Communication
sidebar_label: Real-Time
---

> *This feature is available from version 2.3 onwards.*

Foal allows you to establish two-way interactive communication between your server(s) and your clients. For this, it uses the [socket.io v4](https://socket.io/) library which is primarily based on the **WebSocket** protocol. It supports disconnection detection and automatic reconnection and works with proxies and load balancers.

## Get Started

### Server

```bash
npm install @foal/socket.io
```

*services/websocket.service.ts*
```typescript
import { EventName, SocketIOController, WebsocketContext, WebsocketResponse } from '@foal/socket.io';

export class WebsocketController extends SocketIOController {

  @EventName('create product')
  @ValidatePayload({
    additionalProperties: false,
    properties: { name: { type: 'string' }},
    required: [ 'name' ],
    type: 'object'
  })
  async createProduct(ctx: WebsocketContext, payload: { name: string }) {
    const product = new Product();
    product.name = payload.name;
    await product.save();

    // Send a message to all clients.
    ctx.socket.broadcast.emit('refresh products');
  }

}
```

*src/index.ts*

```typescript
// ...

async function main() {
  const serviceManager = new ServiceManager();

  const app = await createApp(AppController, { serviceManager });
  const httpServer = http.createServer(app);

  // Instanciate, init and connect websocket controllers.
  await serviceManager.get(WebsocketController).attachHttpServer(httpServer);

  // ...
}

```

### Client

> This example uses JavaScript code as client, but socket.io supports also [many other languages](https://socket.io/docs/v4) (python, java, etc).

```bash
npm install socket.io-client
```

```typescript
import { io } from 'socket.io-client';

const socket = io('ws://localhost:3001');

socket.on('connect', () => {

  socket.emit('create product', { name: 'product 1' }, response => {
    if (response.status === 'error') {
      console.log(response.error);
    }
  });

});

socket.on('refresh products', response => {
  if (response.status === 'error') {
    console.log(response.error);
    return;
  }
  console.log(response.data);
});
```

## Architecture

### Controllers and hooks

The WebSocket architecture is very similar to the HTTP architecture. They both have controllers and hooks. While HTTP controllers use paths to handle the various application endpoints, websocket controllers use event names. As with HTTP, event names can be extended with subcontrollers.

*user.controller.ts*
```typescript
import { EventName } from '@foal/socket.io';

export class UserController {

  @EventName('create')
  createUser(ctx: WebsocketContext) {
    // ...
  }

  @EventName('delete')
  deleteUser(ctx: WebsocketContext) {
    // ...
  }

}
```

*websocket.controller.ts*
```typescript
import { SocketIOController, wsController } from '@foal/socket.io';

import { UserController } from './user.controller.ts';

export class WebsocketController extends SocketIOController {
  subControllers = [
    wsController('users ', UserController)
  ];
}
```

> Note that the event names are simply concatenated. So you have to manage the spaces between the words yourself if there are any.

#### Contexts

The `Context` and `WebsocketContext` classes share common properties such as the `state`, the `user` and the `session`.


However, unlike their HTTP version, instances of `WebsocketContext` do not have a `request` property but a `socket` property which is the object provided by socket.io. They also have two other attributes: the `eventName` and the `payload` of the request.

#### Responses

A controller method may or may not return a response.

If a `WebsocketResponse(data)` is returned, the server will return to the client an object of this form:
```typescript
{
  status: 'ok',
  data: data
}
```


If it is a `WebsocketErrorResponse(error)`, the returned object will look like this:
```typescript
{
  status: 'error',
  error: error
}
```

If no response is returned in the controller method, then no object is sent back to the client and the callback of the client function `emit` is not called. 

```typescript
socket.emit('create product', { name: 'product 1' }, response => {
  // This function is executed only if the controller method
  // returns a WebsocketResponse or a WebsocketErrorResponse.
});
```

#### Hooks

In the same way, Foal provides hooks for websockets. They work the same as their HTTP version except that some types are different (`WebsocketContext`, `WebsocketResponse|WebsocketErrorResponse`).

```typescript
import { EventName, WebsocketHook } from '@foal/socket.io';

export class UserController {

  @EventName('create')
  @WebsocketHook((ctx, services) => {
    if (typeof ctx.payload.name !== 'string') {
      return new WebsocketErrorResponse('Invalid name type');
    }
  })
  createUser(ctx: WebsocketContext) {
    // ...
  }
}
```

#### Summary table

| HTTP | Websocket |
| --- | --- |
| `@Get`, `@Post`, etc | `@EventName` |
| `controller` | `wsController` |
| `Context` | `WebsocketContext` |
| `HttpResponse`(s) | `WebsocketResponse`, `WebsocketErrorResponse` |
| `Hook` | `WebsocketHook` |
| `MergeHooks` | `MergeWebsocketHooks` |
| `getHookFunction`, `getHookFunctions` | `getWebsocketHookFunction`, `getWebsocketHookFunctions` |

### Send a message

At any time, the server can send one or more messages to the client using its `socket` object.

*Server code*
```typescript
import { EventName, WebsocketContext } from '@foal/socket.io';

export class UserController {

  @EventName('create')
  createUser(ctx: WebsocketContext) {
    ctx.socket.emit('event 1', 'first message');
    ctx.socket.emit('event 1', 'second message');
  }
}
```

*Client code*
```typescript
socket.on('event 1', response => {
  if (response.status === 'error') {
    console.log(response.error);
    return;
  }
  console.log('Message: ', response.data);
});
```

### Broadcast a message

If a message is to be broadcast to all clients, you can use the `broadcast` property for this.

*Server code*
```typescript
import { EventName, WebsocketContext } from '@foal/socket.io';

export class UserController {

  @EventName('create')
  createUser(ctx: WebsocketContext) {
    ctx.socket.broadcast.emit('event 1', 'first message');
    ctx.socket.broadcast.emit('event 1', 'second message');
  }
}
```

*Client code*
```typescript
socket.on('event 1', response => {
  if (response.status === 'error') {
    console.log(response.error);
    return;
  }
  console.log('Message: ', response.data);
});
```

### Grouping clients in rooms

Socket.io uses the concept of [rooms](https://socket.io/docs/v4/rooms/) to gather clients in groups. This can be useful if you need to send a message to a particular subset of clients.

```typescript
import { EventName, WebsocketContext } from '@foal/socket.io';

export class UserController {

  onConnection(ctx: WebsocketContext) {
    ctx.socket.join('some room');
  }

  @EventName('event 1')
  createUser(ctx: WebsocketContext) {
    ctx.socket.to('some room').emit('event 2');
  }

}
```

### Accessing the socket.io server

You can access the socket.io server anywhere in your code (including your HTTP controllers) by injecting the `WsServer` service.

```typescript
import { dependency, HttpResponseOK, Post } from '@foal/core';
import { WsServer } from '@foal/socket.io';

export class UserController {
  @dependency
  wsServer: WsServer;

  @Post('/users')
  createUser() {
    // ...
    this.wsServer.io.emit('refresh users');

    return new HttpResponseOK();
  }
}
```

### Error-handling

Any error thrown or rejected in a websocket controller, hook or service, if not caught, is converted to a `WebsocketResponseError`. If the `settings.debug` configuration parameter is `true`, then the error is returned as is to the client. Otherwise, the server returns this response:

```typescript
({
  status: 'error',
  error: {
    code: 'INTERNAL_SERVER_ERROR',
    message: 'An internal server error has occurred.'
  }
})
```

#### Customizing the error handler

Just as its HTTP version, the `SocketIOController` class supports an optional `handleError` to override the default error handler.

```typescript
import { EventName, renderWebsocketError, SocketIOController, WebsocketContext, WebsocketErrorResponse } from '@foal/socket.io';

class PermissionDenied extends Error {}

export class WebsocketController extends SocketIOController {
  @EventName('create user')
  createUser() {
    throw new PermissionDenied();
  }

  handleError(error: Error, ctx: WebsocketContext){
    if (error instanceof PermissionDenied) {
      return new WebsocketErrorResponse('Permission is denied');
    }

    return renderWebsocketError(error, ctx);
  }
}
```

## Payload Validation

Foal provides a default hook `@ValidatePayload` to validate the request payload. It is very similar to its HTTP version `@ValidateBody`.

*Server code*
```typescript
import { EventName, SocketIOController, WebsocketContext, WebsocketResponse } from '@foal/socket.io';

export class WebsocketController extends SocketIOController {

  @EventName('create product')
  @ValidatePayload({
    additionalProperties: false,
    properties: { name: { type: 'string' }},
    required: [ 'name' ],
    type: 'object'
  })
  async createProduct(ctx: WebsocketContext, payload: { name: string }) {
    const product = new Product();
    product.name = payload.name;
    await product.save();

    // Send a message to all clients.
    ctx.socket.broadcast.emit('refresh products');
  }

}
```

*Validation error response*
```typescript
({
  status: 'error',
  error: {
    code: 'VALIDATION_PAYLOAD_ERROR',
    payload: [
      // errors
    ]
  }
})
```

## Using HTTP Hooks

```typescript
import { UserRequired } from '@foal/core';
import { EventName, HttpToWebsocketHook, WebsocketUser } from '@foal/socket.io';

export class UserController {

  @EventName('create')
  @HttpToWebsocketHook(UserRequired())
  createUser(ctx: WebsocketUser) {
    // ...
  }
}
```

In order to reuse existing logic, Foal offers in some cases the possibility to convert HTTP hooks to WebSocket hooks using the `@HttpToWebsocketHook` utility. Since the two protocols are completely different, here are the points that need to be considered:

- The `Context.request` value passed to the HTTP hook is built from the original HTTP request that established the Websocket connection. It is therefore identical to each Websocket request. In addition, it is the request object instantiated by Node.js to which a `get` method and a `cookies` property have been added. Some attributes of an ordinary Express request object are therefore missing.
- If an `HttpResponseClientError` (4xx) or `HttpResponseServerError` (5xx) is returned by the hook, then it is converted to a `WebsocketErrorResponse` as follows:

    ```typescript
    new WebsocketErrorResponse({
      statusCode: 401,
      statusMessage: 'UNAUTHORIZED',
      body: 'something'
    })
    ```
- If a post function or an `HttpResponse` of another type is returned, then the hook throws an error.

## Using Sessions

Foal sessions can be used in WebSocket controllers using the `@UseWebsocketSessions` hook which is very similar to its HTTP version `@UseSessions`. The token is not sent in the `Authorization` header or in a cookie but is stored as a property of the `socket` object, so you don't have to deal with it.

```typescript
import { UserRequired } from '@foal/core';
import { EventName, HttpToWebsocketHook, UseWebsocketSessions, WebsocketContext } from '@foal/socket.io';

export class ProductController {

  @EventName('read products')
  @UseWebsocketSessions()
  @HttpToWebsocketHook(UserRequired())
  readProducts(ctx: WebsocketContext) {
    // ...
  }

}
```

TODO: error table.

> When using `@UseWebsocketSessions`, a session is created automatically if none already exists. You can disable this behavior with the `create: false` option.

### Forwarding HTTP sessions

If the user was already logged in before (using cookies or a bearer token), you may want them to continue to be logged in when switching from HTTP to Websocket. This is can be done using the utility `forwardHttpSessionToWebsocket` which includes CSRF protection.

TODO: example with the `Authorization` header on the client.

TODO: check errors

```typescript
import { forwardHttpSessionToWebsocket, SocketIOController, WebsocketContext } from '@foal/socket.io';

export class WebsocketController extends SocketIOController {

  onConnection(ctx: WebsocketContext) {
    await forwardHttpSessionToWebsocket(ctx, { cookie: true });
  }

}
```

## Unit Testing

Testing WebSocket controllers and hooks is very similar to testing their HTTP equivalent. The `WebsocketContext` takes three parameters.

| Name | Type | Description |
| --- | --- | --- |
| `eventName` | `string` | The name of the event. |
| `payload`| `any` |  The request payload. |
| `socket` | `any` |  The socket (optional). Default: `{}`. |

## Advanced

### Multiple node servers

This example shows how to manage multiple node servers using a redis adapter.

```bash
npm install socket.io-redis
```

```typescript
import { EventName, WebsocketContext } from '@foal/core';
import { createAdapter } from 'socket.io-redis';

export class WebsocketController extends SocketIOController {
  adapter = createAdapter('redis://localhost:6379');

  @EventName('create user')
  createUser(ctx: WebsocketContext) {
    // Broadcast an event to all clients of all servers.
    ctx.socket.broadcast.emit('refresh users');
  }
}
```

### Handling connection

If you want to run some code when a Websocket connection is established (for example to join a room or forward the session), you can use the `onConnection` method of the `SocketIOController` for this.

```typescript
import { SocketIOController, WebsocketContext } from '@foal/socket.io';

export class WebsocketController extends SocketIOController {

  onConnection(ctx: WebsocketContext) {
    // ...
  }

}
```

#### Error-handling

Any errors thrown or rejected in the `onConnection` is sent back to the client. So you may need to add a `try {} catch {}` in some cases.

This error can be read on the client using the `connect_error` event listener.

```typescript
socket.on("connect_error", () => {
  // Do some stuff
  socket.connect();
});
```

### Custom server options

Custom options can be passed to the socket.io server as follows. The complete list of options can be found [here](https://socket.io/docs/v4/server-api/#Server).

```typescript
import { SocketIOController } from '@foal/socket.io';

export class WebsocketController extends SocketIOController {

  options = {
    connectTimeout: 60000
  }

}
```
