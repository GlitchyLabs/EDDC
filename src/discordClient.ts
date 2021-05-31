import { Client, MessageEmbed, TextChannel } from 'discord.js';

export type DiscordOptions = {
  token: string;
}

export class DiscordClient {
  client: Client
  eventChannels: Array<TextChannel>

  constructor (options?: DiscordOptions) {
    this.client = new Client();
    this.eventChannels = [];

    this.client.on('ready', () => {
      console.log(`Logged in as ${this.client.user.tag}!`);
    });
    
    this.client.on('message', async msg => {
      if (msg.channel.type === 'text') {
        console.log(msg.content);
        switch (msg.content.split(' ')[0]) {
          case 'Events' : {
            let channel = msg.channel;
            if (!isNaN(parseInt(msg.content.split(' ')[1]))) {
              channel = await this.client.channels.fetch(msg.content.split(' ')[1]) as TextChannel;
            }
            this.eventChannels.push(channel);
          }
        }
      }
      if (msg.channel.type === 'dm') {
        if (msg.content === 'ping') {
          msg.reply('pong');
        }
      }
    });
    
    this.client.login(options.token);
  }

  emitEvent(data) {
    let content: any = '';
    switch (data.event) {
      case "CarrierJump": {
        content = new MessageEmbed();
        content.setColor(0xf7bd00);
        content.setTitle('Carrier Jump >>>');
        content.addField('Destination', data.StarSystem);
        break;
      }
      case "CarrierJumpRequest": {
        content = new MessageEmbed();
        content.setColor(0xf7bd00);
        content.setTitle('Carrier Jump Request');
        content.addField('Destination', data.SystemName);
        break;
      }
      case "CarrierJumpCancelled": {
        content = new MessageEmbed();
        content.setColor(0xf7bd00);
        content.setTitle('Carrier Jump Canceled');
        break;
      }
      default: {
        content = JSON.stringify(data)
      }
    }

    this.eventChannels.forEach((channel) => {
      channel.send(content);
    })
  }
}