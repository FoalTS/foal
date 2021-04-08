// 3p
import { Class, dependency, ServiceManager } from '@foal/core';
import { Server, ServerOptions } from 'socket.io';
import { Adapter } from 'socket.io-adapter';

// FoalTS
import { getWebsocketResponse } from './routes/get-websocket-response';
import { makeWebsocketControllerRoutes } from './routes/make-websocket-controller-routes';
import { ISocketIOController } from './routes/socketio-controller.interface';
import { WebsocketContext } from './websocket-context';
import { WebsocketErrorResponse, WebsocketResponse } from './websocket-responses';

export abstract class SocketIOController implements ISocketIOController {
  @dependency
  services: ServiceManager;

  adapter: typeof Adapter|undefined;

  options: Partial<ServerOptions> = {};

  private wsServer: Server|undefined;

  async attachHttpServer(httpServer: any): Promise<void> {
    this.wsServer = new Server(httpServer, this.options);
    if (this.adapter) {
      this.wsServer.adapter(this.adapter);
    }
    const routes = Array.from(makeWebsocketControllerRoutes(this.constructor as Class<SocketIOController>, this.services));

    this.wsServer.use(async (socket, next) => {
      const connectionCtx = new WebsocketContext('', undefined, socket);

      try {
        await this.onConnection(connectionCtx);
      } catch (error) {
        return next(error);
      }

      next();
    })

    this.wsServer.on('connection', socket => {
      for (const route of routes) {
        socket.on(route.eventName, async (payload, cb) => {
          const ctx = new WebsocketContext(route.eventName, payload, socket);
          const response = await getWebsocketResponse(route, ctx, this.services, this);
          if (response instanceof WebsocketResponse) {
            return cb({
              status: 'ok',
              data: response.payload,
            });
          }
          if (response instanceof WebsocketErrorResponse) {
            return cb({
              status: 'error',
              error: response.payload
            });
          }
          return cb();
        });
      }
    });

    await this.services.boot();
  }

  onConnection(ctx: WebsocketContext): void|Promise<void> {}

  close(): void {
    if (this.wsServer) {
      this.wsServer.close();
    }
  }

}
