import { SocketServer } from './socketServer';
import { DiscordClient } from './discordClient';

const discord = new DiscordClient({
  token: process.env.DISCORD_KEY
});

const server = new SocketServer();
server.on('event', (data) => {
  console.log(data);

  switch(data.event) {
    case "CarrierJump":
    case "CarrierJumpRequest":
    case "CarrierJumpCancelled": {
      discord.emitEvent(data);
    }
  }
});

