// std
import { strictEqual } from 'assert';
import { join } from 'path';
import { callbackify } from 'util';

// 3p
import * as grpc from '@grpc/grpc-js';
import * as protoLoader  from '@grpc/proto-loader';

// FoalTS
import { createApp, dependency } from '@foal/core';

describe('Feature: Using gRPC framework', () => {

  let client: any;
  let server: grpc.Server;

  afterEach(() => {
    if (client) {
      client.close();
    }
    if (server) {
      server.forceShutdown();
    }
  })

  async function getMessageFromServer(): Promise<string> {
    const packageDefinition = protoLoader.loadSync(
      join(process.cwd(), './assets/common/gRPC/spec.proto'),
      {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
      }
    );
    const helloProto = grpc.loadPackageDefinition(packageDefinition).helloworld;
    client = new (helloProto as any).Greeter('localhost:50051', grpc.credentials.createInsecure());

    const response = await new Promise<any>((resolve, reject) => {
      client.sayHello({name: 'world'}, (err: any, response: any) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(response)
      });
    });

    return response.message;
  }

  it('Example: with callbacks.', async () => {

    /* ======================= DOCUMENTATION BEGIN ======================= */

    class Greeter {

      sayHello(call: any, callback: any) {
        callback(null, {message: 'Hello ' + call.request.name});
      }

    }

    class Grpc {
      @dependency
      greeter: Greeter;

      boot(): Promise<void> {
        const PROTO_PATH = join(process.cwd(), './assets/common/gRPC/spec.proto');
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
        server = new grpc.Server();
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

    class AppController {
      @dependency
      grpc: Grpc;

      // ...
    }

    /* ======================= DOCUMENTATION END ========================= */

    await createApp(AppController);

    strictEqual(await getMessageFromServer(), 'Hello world');
  });

  it('Example: with promises.', async () => {

    /* ======================= DOCUMENTATION BEGIN ======================= */

    function async (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
      descriptor.value = callbackify(descriptor.value);
    };

    class Greeter {

      @async
      async sayHello(call: any) {
        return { message: 'Hello ' + call.request.name };
      }

    }

    class Grpc {
      @dependency
      greeter: Greeter;

      boot(): Promise<void> {
        const PROTO_PATH = join(process.cwd(), './assets/common/gRPC/spec.proto');
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
        server = new grpc.Server();
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

    class AppController {
      @dependency
      grpc: Grpc;

      // ...
    }

    /* ======================= DOCUMENTATION END ========================= */

    await createApp(AppController);

    strictEqual(await getMessageFromServer(), 'Hello world');
  });

});
