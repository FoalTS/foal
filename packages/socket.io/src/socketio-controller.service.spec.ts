// std
import { deepStrictEqual, notDeepStrictEqual, notStrictEqual, strictEqual } from 'assert';
import { createServer, Server } from 'http';
import { AddressInfo } from 'net';
// tslint:disable-next-line: no-duplicate-imports
import * as http from 'http';

// 3p
import { io, ManagerOptions, Socket, SocketOptions } from 'socket.io-client';
import {
  Class,
  Config,
  createApp,
  createController,
  dependency,
  IAppController,
  ServiceManager
} from '@foal/core';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';

// FoalTS
import { EventName, WebsocketHook, WebsocketContext, WebsocketErrorResponse, WebsocketResponse, wsController } from './architecture';
import { SocketIOController } from './socketio-controller.service';

describe('SocketIOController', () => {

  describe('has an "attachHttpServer" method that', () => {

    let controller: SocketIOController;
    let httpServer: Server;
    let httpServer2: Server;
    let clientSocket: Socket;

    let pubClient: any;
    let subClient: any;

    afterEach(async () => {
      if (controller) {
        controller.wsServer.close();
      }
      if (clientSocket) {
        clientSocket.close();
      }
      if (httpServer) {
        httpServer.close();
      }
      if (httpServer2) {
        httpServer2.close();
      }
      if (pubClient) {
        await pubClient.quit();
      }
      if (subClient) {
        await subClient.quit();
      }
    });

    afterEach(() => Config.remove('settings.logErrors'));

    function createConnection(cls: Class<SocketIOController>, clientOptions?: Partial<ManagerOptions & SocketOptions>): Promise<void> {
      return new Promise(resolve => {
        httpServer = createServer();

        controller = createController(cls);
        controller.attachHttpServer(httpServer);

        httpServer.listen(() => {
          const port = (httpServer.address() as AddressInfo).port;
          clientSocket = io(`http://localhost:${port}`, clientOptions);
          clientSocket.on('connect', resolve);
        });
      });
    }

    describe('should create a socket.io server', () => {

      it('with the given HTTP server.', () => {
        class WebsocketController extends SocketIOController {}

        return createConnection(WebsocketController);
      });

      it('with the optional SocketIOController.options.', () => {
        const path = '/my-custom-path/';
        class WebsocketController extends SocketIOController {
          options = { path };
        }

        return createConnection(WebsocketController, { path });
      });

      it('and should call SocketIOController.onConnection when a client establishes a connection.', async () => {
        let actualContext: WebsocketContext|undefined;
        class WebsocketController extends SocketIOController {
          onConnection(ctx: WebsocketContext) {
            actualContext = ctx;
          }
        }

        await createConnection(WebsocketController);

        strictEqual(actualContext?.eventName, '');
        strictEqual(actualContext?.payload, undefined);
        strictEqual(actualContext?.session, null);
        notStrictEqual(actualContext?.socket, undefined);
        notDeepStrictEqual(actualContext?.socket, {});
        deepStrictEqual(actualContext?.state, {});
        strictEqual(actualContext?.user, null);
      });

      it('and should emit a connection error if SocketIOController.onConnection throws or rejects an error.', async () => {
        class ExtendedError extends Error {
          data?: any;
        }
        class WebsocketController extends SocketIOController {
          async onConnection(ctx: WebsocketContext) {
            const err = new ExtendedError('hello')
            err.data = { foo: 'bar' };
            throw err;
          }
        }

        httpServer = createServer();

        controller = createController(WebsocketController);
        controller.attachHttpServer(httpServer);

        const error = await new Promise<ExtendedError>((resolve, reject) => {
          httpServer.listen(() => {
            const port = (httpServer.address() as AddressInfo).port;
            clientSocket = io(`http://localhost:${port}`);
            clientSocket.on('connect', reject);
            clientSocket.on('connect_error', resolve);
          });
        });

        strictEqual(error.message, 'hello');
        deepStrictEqual(error.data, { foo: 'bar' });
      });

      it('and should bind the routes to their respective handlers.', async () => {
        let actualContext: WebsocketContext|undefined;
        let actualPayload: any;

        class WebsocketController extends SocketIOController {
          @EventName('create user')
          createUser(ctx: WebsocketContext, payload: any) {
            actualContext = ctx;
            actualPayload = payload;
            return new WebsocketResponse();
          }
        }

        await createConnection(WebsocketController);

        const payload = { foo: 'bar' };
        await new Promise(resolve => clientSocket.emit('create user', payload, resolve));

        strictEqual(actualContext?.eventName, 'create user');
        deepStrictEqual(actualContext?.payload, payload);
        deepStrictEqual(actualPayload, payload);

        strictEqual(actualContext?.session, null);
        notStrictEqual(actualContext?.socket, undefined);
        notDeepStrictEqual(actualContext?.socket, {});
        deepStrictEqual(actualContext?.state, {});
        strictEqual(actualContext?.user, null);

        strictEqual(actualContext?.controllerName, 'WebsocketController');
        strictEqual(actualContext?.controllerMethodName, 'createUser');
      });

      it('and should return an ok response if the controller method returns a WebsocketResponse (with no payload).', async () => {
        class WebsocketController extends SocketIOController {
          @EventName('create user')
          createUser() {
            return new WebsocketResponse();
          }
        }

        await createConnection(WebsocketController);
        const payload = await new Promise(resolve => clientSocket.emit('create user', {}, resolve));

        deepStrictEqual(payload, { status: 'ok' });
      });

      it('and should return an ok response if the controller method returns a WebsocketResponse (with a payload).', async () => {
        const data = { foo: 'bar' };
        class WebsocketController extends SocketIOController {
          @EventName('create user')
          createUser() {
            return new WebsocketResponse(data);
          }
        }

        await createConnection(WebsocketController);
        const payload = await new Promise(resolve => clientSocket.emit('create user', {}, resolve));

        deepStrictEqual(payload, { status: 'ok', data });
      });

      it('and should return an error response if the controller method returns a WebsocketErrorResponse (with no payload).', async () => {
        class WebsocketController extends SocketIOController {
          @EventName('create user')
          createUser() {
            return new WebsocketErrorResponse();
          }
        }

        await createConnection(WebsocketController);
        const payload = await new Promise(resolve => clientSocket.emit('create user', {}, resolve));

        deepStrictEqual(payload, { status: 'error' });
      });

      it('and should return an error response if the controller method returns a WebsocketErrorResponse (with a payload).', async () => {
        const error = { foo: 'bar' };
        class WebsocketController extends SocketIOController {
          @EventName('create user')
          createUser() {
            return new WebsocketErrorResponse(error);
          }
        }

        await createConnection(WebsocketController);
        const payload = await new Promise(resolve => clientSocket.emit('create user', {}, resolve));

        deepStrictEqual(payload, { status: 'error', error });
      });

      it('and should not throw an error if no callback is given in the client "emit" method', async () => {
        // This line is required because Mocha silently hides unhandled rejected promises.
        process.removeAllListeners('unhandledRejection');

        class WebsocketController extends SocketIOController {
          @EventName('create user')
          createUser() {
            return new WebsocketResponse();
          }
        }

        await createConnection(WebsocketController);

        clientSocket.emit('create user', {});
      });

      it('and should not throw an error if no payload is given in the client "emit" method', async () => {
        // This line is required because Mocha silently hide unrejected promises.
        process.removeAllListeners('unhandledRejection');

        let actualPayload: any;

        class WebsocketController extends SocketIOController {
          @EventName('create user')
          createUser(ctx: WebsocketContext) {
            actualPayload = ctx.payload;
            return new WebsocketResponse();
          }
        }

        await createConnection(WebsocketController);

        await new Promise(resolve => clientSocket.emit('create user', resolve));

        strictEqual(actualPayload, undefined);
      });

      it('and should not throw an error if no callback and no payload is given in the client "emit" method', async () => {
        // This line is required because Mocha silently hides unhandled rejected promises.
        process.removeAllListeners('unhandledRejection');

        class WebsocketController extends SocketIOController {
          @EventName('create user')
          createUser() {
            return new WebsocketResponse();
          }
        }

        await createConnection(WebsocketController);

        clientSocket.emit('create user');
      });

      it('and should use SocketIOController.handleError if it exists.', async () => {
        Config.set('settings.logErrors', false);

        class WebsocketController extends SocketIOController {
          @EventName('create user')
          createUser() {
            throw new Error();
          }

          handleError() {
            return new WebsocketResponse();
          }
        }

        await createConnection(WebsocketController);
        const payload = await new Promise(resolve => clientSocket.emit('create user', {}, resolve));

        deepStrictEqual(payload, { status: 'ok' });
      })

      it('and should use the right service manager when executing hooks.', async () => {
        class AppController {}

        class Service {
          foo() {}
        }

        let called = false;
        class ServiceMock {
          foo() {
            called = true;
          }
        }

        class WebsocketController extends SocketIOController {
          @EventName('call service')
          @WebsocketHook((ctx, services) => {
            services.get(Service).foo();
          })
          createUser() {
            return new WebsocketResponse();
          }
        }

        const serviceManager = new ServiceManager();
        serviceManager.set(Service, new ServiceMock());
        const app = await createApp(AppController, { serviceManager });

        httpServer = http.createServer(app);
        await serviceManager.get(WebsocketController).attachHttpServer(httpServer);

        strictEqual(called, false);

        await new Promise(resolve => {
          httpServer.listen(() => {
            const port = (httpServer.address() as AddressInfo).port;
            clientSocket = io(`http://localhost:${port}`);
            clientSocket.on('connect', () => {
              clientSocket.emit('call service', {}, resolve)
            });
          });
        });

        strictEqual(called, true);
      })

      it('with the optional SocketIOController.adapter.', done => {
        pubClient = createClient({ url: 'redis://localhost:6380' });
        subClient = pubClient.duplicate();

        class WebsocketController extends SocketIOController {
          adapter = createAdapter(pubClient, subClient);

          @EventName('create user')
          createUser(ctx: WebsocketContext) {
            ctx.socket.broadcast.emit('refresh users');
            return new WebsocketResponse();
          }
        }

        function createHttpServerAndSockets(): Promise<{ clientSocket: Socket, httpServer: Server }> {
          return new Promise<{ clientSocket: Socket, httpServer: Server }>(resolve => {
            const httpServer = createServer();

            const controller = createController(WebsocketController);
            controller.attachHttpServer(httpServer);

            httpServer.listen(() => {
              const port = (httpServer.address() as AddressInfo).port;
              const clientSocket = io(`http://localhost:${port}`);
              clientSocket.on('connect', () => resolve({ clientSocket, httpServer }));
            });
          });
        }

        Promise
          .all([pubClient.connect(), subClient.connect()])
          .then(() => Promise
            .all([
              createHttpServerAndSockets(),
              createHttpServerAndSockets(),
            ])
            .then(serverAndSockets => {
              httpServer = serverAndSockets[0].httpServer;
              httpServer2 = serverAndSockets[1].httpServer;
              return [
                serverAndSockets[0].clientSocket,
                serverAndSockets[1].clientSocket,
              ]
            })
            .then(clientSockets => {
              clientSockets[0].on('refresh users', () => {
                clientSockets[0].close();
                clientSockets[1].close();
                done();
              });
              clientSockets[1].emit('create user')
            })
            .catch(done));
      })

    });

    it('should boot the services injected in the controller and its sub-controllers.', async () => {
      let serviceABootCount = 0;
      class ServiceA {
        boot() {
          serviceABootCount += 1;
        }
      }

      let serviceBBootCount = 0;
      class ServiceB {
        boot() {
          serviceBBootCount += 1;
        }
      }

      class AppController implements IAppController {
        @dependency
        serviceA: ServiceA;
      }

      class SubWebsocketController {
        @dependency
        serviceB: ServiceB;
      }

      class WebsocketController extends SocketIOController {
        subControllers = [
          wsController('sub', SubWebsocketController)
        ]
      }

      const serviceManager = new ServiceManager();
      const app = await createApp(AppController, { serviceManager });

      strictEqual(serviceABootCount, 1);
      strictEqual(serviceBBootCount, 0);

      const httpServer = http.createServer(app);
      await serviceManager.get(WebsocketController).attachHttpServer(httpServer);

      strictEqual(serviceABootCount, 1);
      strictEqual(serviceBBootCount, 1);
    })

  });

});