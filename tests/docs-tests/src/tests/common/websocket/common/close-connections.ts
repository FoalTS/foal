// std
import { createServer } from 'http';

// 3p
import { io } from 'socket.io-client';

// FoalTS
import { SocketIOController } from '@foal/socket.io';

export function closeConnections({ httpServer, socket, controller }: { httpServer?: ReturnType<typeof createServer>, socket?: ReturnType<typeof io>, controller?: SocketIOController }): Promise<void> {
  return new Promise(resolve => {
    if (controller) {
      controller.wsServer.close();
    }
    if (socket) {
      socket.close();
    }
    if (httpServer) {
      httpServer.close(() => resolve());
    } else {
      resolve();
    }
  })
}