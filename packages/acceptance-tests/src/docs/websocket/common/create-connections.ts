// std
import { createServer } from 'http';
import { AddressInfo } from 'net';

// 3p
import { io } from 'socket.io-client';

// FoalTS
import { Class, createController } from '@foal/core';
import { SocketIOController } from '@foal/socket.io';

export function createConnections(cls: Class<SocketIOController>): Promise<{ httpServer: ReturnType<typeof createServer>, socket: ReturnType<typeof io>, controller: SocketIOController }> {
  return new Promise(resolve => {
    const httpServer = createServer();

    const controller = createController(cls);
    controller.attachHttpServer(httpServer);

    httpServer.listen(() => {
      const port = (httpServer.address() as AddressInfo).port;
      const socket = io(`http://localhost:${port}`);
      socket.on('connect', () => resolve({ httpServer, socket, controller }));
    });
  });
}