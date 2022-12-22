// 3p
import { Class, dependency, ServiceManager } from '@foal/core';
import { Server, ServerOptions } from 'socket.io';

// FoalTS
import { makeWebsocketControllerRoutes, getWebsocketResponse } from './routes';
import { WebsocketContext, ISocketIOController, WebsocketErrorResponse } from './architecture';
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

  adapter: ServerOptions['adapter'] | undefined;

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
      } catch (error: any) {
        return next(error);
      }

      next();
    })

    this.wsServer.io.on('connection', socket => {
      for (const route of routes) {
        socket.on(route.eventName, async (payload, cb) => {
          if (typeof payload === 'function') {
            cb = payload;
            payload = undefined;
          }

          const ctx = new WebsocketContext(route.eventName, payload, socket, route.controller.constructor.name, route.propertyKey);
          const response = await getWebsocketResponse(route, ctx, this.services, this);

          if (typeof cb !== 'function') {
            return;
          }

          if (response instanceof WebsocketErrorResponse) {
            return cb({
              status: 'error',
              error: response.payload
            });
          }

          return cb({
            status: 'ok',
            data: response.payload,
          });
        });
      }
    });

    await this.services.boot();
  }

  onConnection(ctx: WebsocketContext): void|Promise<void> {}

}
