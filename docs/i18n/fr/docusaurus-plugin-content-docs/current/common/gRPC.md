---
title: gRPC
---

gRPC is a Remote Procedure Call (RPC) framework that can run in any environment. It can connect services in and across data centers with pluggable support for load balancing, tracing, health checking and authentication. It is also applicable in last mile of distributed computing to connect devices, mobile applications and browsers to backend services.

This page shows how to use gRPC in Foal. It is based on the [official gRPC tutorial](https://grpc.io/docs/languages/node/basics/).

## Installation & Configuration

First you need to install some additional dependencies.

```bash
npm install @grpc/grpc-js @grpc/proto-loader
npm install cpx2 --save-dev
```

Then update your `package.json` so that your build scripts will correctly copy your `.proto` files into the `build/` directory.

```json
{
  "build": "foal rmdir build && cpx \"src/**/*.proto\" build && tsc -p tsconfig.app.json",
  "dev": "npm run build && concurrently \"cpx \\\"src/**/*.proto\\\" build -w\" \"tsc -p tsconfig.app.json -w\" \"supervisor -w ./build,./config -e js,json,yml,proto --no-restart-on error ./build/index.js\"",
  "build:test": "foal rmdir build && cpx \"src/**/*.proto\" build && tsc -p tsconfig.test.json",
  "test": "npm run build:test && concurrently \"cpx \\\"src/**/*.proto\\\" build -w\" \"tsc -p tsconfig.test.json -w\" \"mocha --file ./build/test.js -w --watch-files build \\\"./build/**/*.spec.js\\\"\"",
  "build:e2e": "foal rmdir build && cpx \"src/**/*.proto\" build && tsc -p tsconfig.e2e.json",
  "e2e": "npm run build:e2e && concurrently \"cpx \\\"src/**/*.proto\\\" build -w\" \"tsc -p tsconfig.e2e.json -w\" \"mocha --file ./build/e2e.js -w --watch-files build \\\"./build/e2e/**/*.js\\\"\"",
    ...
}
```

## The `gRPC` Service

Create your `spec.proto` file and save it to `src/app`.

```proto
syntax = "proto3";

package helloworld;

// The greeting service definition.
service Greeter {
  // Sends a greeting
  rpc SayHello (HelloRequest) returns (HelloReply) {}
}

// The request message containing the user's name.
message HelloRequest {
  string name = 1;
}

// The response message containing the greetings
message HelloReply {
  string message = 1;
}
```

Add the `Greeter` service.

*services/greeter.service.ts*
```typescript
export class Greeter {

  sayHello(call, callback) {
    callback(null, {message: 'Hello ' + call.request.name});
  }

}

```

The next step is to create a service that will instantiate the gRPC server.

*services/grpc.service.ts*
```typescript
// std
import { join } from 'path';

// 3p
import { dependency } from '@foal/core';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader  from '@grpc/proto-loader';

// App
import { Greeter } from './greeter.service';

export class Grpc {
  @dependency
  greeter: Greeter;

  boot(): Promise<void> {
    const PROTO_PATH = join(__dirname, '../spec.proto');
    const packageDefinition = protoLoader.loadSync(
      PROTO_PATH,
      {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
      }
    );

    const helloProto: any = grpc.loadPackageDefinition(packageDefinition).helloworld;
    const server = new grpc.Server();
    server.addService(helloProto.Greeter.service, this.greeter as any);
    // OR
    // server.addService(helloProto.Greeter.service, {
    //   sayHello: this.greeter.sayHello.bind(this.greeter)
    // } as any);

    return new Promise((resolve, reject) => {
      server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), error => {
        if (error) {
          return reject(error);
        }
        server.start();
        return resolve();
      });
    })
  }

}

```

Finally, inject the service in the application.

```typescript
export class AppController {
  @dependency
  grpc: Grpc;

  // ...
}

```

## Using Promises

Using callbacks in the grpc services can be quite tedious. To convert methods into functions that use promises, you can use the decorator below.

```typescript
import { callbackify } from 'util';

function async (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  descriptor.value = callbackify(descriptor.value);
};

export class Greeter {

  @async
  async sayHello(call) {
    return { message: 'Hello ' + call.request.name };
  }

}

```

## Limitations

The implementation above do not use Foal regular controllers. This has two consequences:
- hooks cannot be used,
- and error-handling is entirely managed by the gRPC server. The `AppController.handleError` cannot be used.
