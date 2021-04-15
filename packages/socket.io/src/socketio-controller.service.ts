// 3p
import { Class, dependency, ServiceManager } from '@foal/core';
import { Server, ServerOptions } from 'socket.io';
import { Adapter } from 'socket.io-adapter';

// FoalTS
import { makeWebsocketControllerRoutes, getWebsocketResponse } from './routes';
import { WebsocketContext, ISocketIOController, WebsocketErrorResponse, WebsocketResponse } from './architecture';
import { WsServer } from './ws-server.service';

/**
 * Service to establish a Websocket connection.
 *
 * @export
 * @abstract
 * @class SocketIOController
 * @implements {ISocketIOController}
 */
export abstract class SocketIOController implements ISocketIOController {
  @dependency
  services: ServiceManager;

  @dependency
  wsServer: WsServer;

  adapter: typeof Adapter|undefined;

  options: Partial<ServerOptions> = {};

  async attachHttpServer(httpServer: any): Promise<void> {
    this.wsServer.io = new Server(httpServer, this.options);
    if (this.adapter) {
      this.wsServer.io.adapter(this.adapter);
    }
    const routes = Array.from(makeWebsocketControllerRoutes(this.constructor as Class<SocketIOController>, this.services));

    this.wsServer.io.use(async (socket, next) => {
      const connectionCtx = new WebsocketContext('', undefined, socket);

      try {
        await this.onConnection(connectionCtx);
      } catch (error) {
        return next(error);
      }

      next();
    })

    this.wsServer.io.on('connection', socket => {
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

}
