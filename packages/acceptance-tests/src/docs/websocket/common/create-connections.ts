// std
import { createServer } from 'http';
import { AddressInfo } from 'net';

// 3p
import { io } from 'socket.io-client';

// FoalTS
import { Class, createApp, ServiceManager } from '@foal/core';
import { SocketIOController } from '@foal/socket.io';

export function createConnections(wsCtrlClass: Class<SocketIOController>, appCtrlClass?: Class): Promise<{ httpServer: ReturnType<typeof createServer>, socket: ReturnType<typeof io>, controller: SocketIOController }> {
  return new Promise(async resolve => {
    const serviceManager = new ServiceManager();

    const app = await createApp(appCtrlClass ?? class {}, { serviceManager });
    const httpServer = createServer(app);

    // Instanciate, init and connect websocket controllers.
    await serviceManager.get(wsCtrlClass).attachHttpServer(httpServer);

    httpServer.listen(() => {
      const port = (httpServer.address() as AddressInfo).port;
      const socket = io(`http://localhost:${port}`);
      socket.on('connect', () => resolve({ httpServer, socket, controller: serviceManager.get(wsCtrlClass) }));
    });
  });
}