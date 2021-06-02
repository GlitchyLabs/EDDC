import { EventEmitter } from 'events';
import WebSocket from 'ws';
import { SocketServer } from './socketServer';
import { Authentication } from './utils/auth';
import logger from './utils/logger';

export interface ExtendedWebSocket extends WebSocket {
  alive: boolean
}

export class SocketClient extends EventEmitter {
  server: SocketServer;
  socket: ExtendedWebSocket;
  authenticated: boolean;
  alive: boolean;

  constructor(server: SocketServer, socket: ExtendedWebSocket) {
    super();
    this.server = server;
    this.socket = socket;
    this.socket.on('message', this.processEvent.bind(this));
    this.authenticated = false;
    Authentication.addAccount('test','test1234');
  }
  processEvent(data: any) {
    try {
      const message = JSON.parse(data);
      console.log(message);
      if (message.command === 'Authenticate') return this.authenticate(message);
      if (!this.authenticated) return this.terminate(new Error('Not Authenticated'));
      switch (message.command) {
        case 'JournalEvent': {
          this.server.emit('event', message.event.entry);
          break;
        }
        case 'DashboardEvent':
        case 'CmdrEvent': {
          break;
        }
        default: {
          return this.terminate(new Error('Unknown Command'));
        }
      }
      try {
        const parsedData = JSON.parse(data.toString());
        this.emit('event', parsedData);
      } catch (error) {
        console.info(data.toString());
        console.error(error);
      }
    } catch (err) {
      if (err instanceof SyntaxError) {
        this.terminate(err);
      } else {
        this.terminate(new Error('Unknown Error'));
      }
    }
  }
  send(data: any) {
    this.socket.send(JSON.stringify(data));
  }
  terminate(err?: Error) {
    if (err) {
      this.send({error: err.name, message: err.message});
    }
    this.socket.terminate();
  }
  async authenticate(data: {command: 'Authenticate', username: string, password: string}) {
    if (await Authentication.validate(data.username, data.password)) {
      this.authenticated = true;
      logger.info('Authenticated');
      return this.send({command: 'Authenticated'});
    } else {
      return this.terminate(new Error('Invalid Authentication'));
    }
  }
}