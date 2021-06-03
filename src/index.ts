import { SocketServerOptions, SocketServer } from './socketServer';
import { DiscordClient } from './discordClient';
import { DataStore } from './dataStore';

// TODO: Make discord optional
const discord = new DiscordClient({
  token: process.env.DISCORD_BOT_TOKEN
});

const socketOptions: SocketServerOptions = {
  port: parseInt(process.env.PORT)
}

const server = new SocketServer(socketOptions);
const dataStore = new DataStore();

server.on('event', (data) => {
  // TODO: Update this to send to multiple registered
  // services (Discord, IRC, ETC).
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

