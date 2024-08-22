// std
import { randomUUID } from 'crypto';

// 3p
import { Class, Config, dependency, Logger, ServiceManager } from '@foal/core';
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
  logger: Logger;

  @dependency
  services: ServiceManager;

  @dependency
  wsServer: WsServer;

  // There are often type issues with socket.io adapters coming from other packages (depending on their version).
  // This is why the type "any" is used here.
  adapter: any;

  options: Partial<ServerOptions> = {};

  private log(message: string, params?: {
    error?: Error;
    [name: string]: any;
  }): void {
    if (!Config.get('settings.logger.logSocketioMessages', 'boolean', true)) {
      return;
    }
    this.logger.info(message, params);
  }

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
      this.log('Socket.io connection', {
        socketId: socket.id,
      });

      for (const route of routes) {
        socket.on(route.eventName, async (payload, cb) => {
          this.logger.initLogContext(async () => {
            const messageId = randomUUID();

            this.logger.addLogContext({
              socketId: socket.id,
              messageId,
            });

            if (typeof payload === 'function') {
              cb = payload;
              payload = undefined;
            }

            const ctx = new WebsocketContext(route.eventName, payload, socket, route.controller.constructor.name, route.propertyKey);
            ctx.messageId = messageId;
            const response = await getWebsocketResponse(route, ctx, this.services, this);

            const status = response instanceof WebsocketErrorResponse ? 'error' : 'ok';

            this.log(`Socket.io message received - ${route.eventName}`, {
              eventName: route.eventName,
              status,
            });

            if (typeof cb !== 'function') {
              return;
            }

            if (status === 'error') {
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
        });
      }

      socket.on('disconnect', reason => {
        this.log('Socket.io disconnection', {
          socketId: socket.id,
          reason
        });
      });
    });

    await this.services.boot();
  }

  onConnection(ctx: WebsocketContext): void|Promise<void> {}

}
