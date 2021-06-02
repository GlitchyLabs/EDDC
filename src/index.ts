import { SocketServerOptions, SocketServer } from './socketServer';
import { DiscordClient } from './discordClient';
import { DataStore } from './dataStore';

const discord = new DiscordClient({
  token: process.env.DISCORD_KEY
});

const socketOptions: SocketServerOptions = {
  port: parseInt(process.env.PORT)
}

const server = new SocketServer(socketOptions);
const dataStore = new DataStore();
server.on('event', (data) => {
  switch(data.event) {
    case "CarrierStats": {
      dataStore.set(data.CarrierID, data.Name);
      console.log(dataStore.get(data.CarrierID));
      break;
    }
    case "CarrierJump": {
      data.Name = dataStore.get(data.MarketID);
      console.log(data);
      discord.emitEvent(data);
      break;
    }
    case "CarrierJumpRequest":
    case "CarrierJumpCancelled": {
      data.Name = dataStore.get(data.CarrierID);
      console.log(data);
      discord.emitEvent(data);
      break;
    }
  }
});

