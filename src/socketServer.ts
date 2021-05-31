import { EventEmitter } from 'events';
import { Server } from 'ws';
import { ExtendedWebSocket, SocketClient } from './socketClientModel';
import logger from './utils/logger';

export type EventServerOptions = {
  host?: string;
  port?: number;
}

export class SocketServer extends EventEmitter{
  clients: Array<SocketClient> = [];
  server: Server;
  authenticated: boolean;

  constructor(options?: EventServerOptions) {
    super();
    this.server = new Server({
      port: options?.port || 31337
    });

    this.server.on('connection', (connection: ExtendedWebSocket) => {
      logger.info('New Connection');
      const client = new SocketClient(this, connection);
      client.alive = true;
      this.clients.push(client);
      connection.on('close', () => {
        this.clients.splice(this.clients.indexOf(client), 1);
      });
      connection.on('error', (err: any) => {
        if (err.code === "ECONNRESET") {
          client.terminate();
        }
        console.log(`Error: ${err}`);
      });
      connection.on('pong', () => {
        client.alive = true;
      });
    });

    this.server.on('close', () => {
      clearInterval(this.heartbeat);
    })
  }
  
  heartbeat = setInterval(() => {
    this.clients.forEach((client, index) => {
      if (!client.alive) {
        this.clients.splice(index, 1);
        return client.terminate();
      } 
      client.alive = false;
      client.socket.ping();
    });
  }, 30000)
}