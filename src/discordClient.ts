import { Client, EmbedBuilder, TextChannel, GuildMember, Permissions, PermissionsBitField, Partials } from 'discord.js';
import logger from './utils/logger';


const BOT_DEFAULT_PERMISSIONS = [
  PermissionsBitField.Flags.SendMessages,
  PermissionsBitField.Flags.SendTTSMessages,
  PermissionsBitField.Flags.EmbedLinks,
  PermissionsBitField.Flags.AddReactions,
  PermissionsBitField.Flags.UseApplicationCommands,
  PermissionsBitField.Flags.ManageChannels,
];

export type DiscordOptions = {
  token: string;
}

export class DiscordClient {
  client: Client
  eventChannels: Array<TextChannel>

  constructor(options?: DiscordOptions) {
    this.client = new Client({
      intents: [
        "Guilds",
        "GuildMessages",
        "GuildMessageReactions",
        "DirectMessages",
        "DirectMessageReactions"
      ],
      partials: [
        Partials.Channel
      ]
    });
    this.eventChannels = [];

    this.client.on('ready', async () => {
      // @ts-expect-error sessionStartLimit is a private property but also the recomended way to access value
      const ssl = this.client.ws.shards.get(0).ratelimit;
      logger.info(`Logged in as ${this.client.user.tag}! [${ssl.remaining}/${ssl.total}]}`);
      for (const [id, guild] of this.client.guilds.cache) {
        const owner = await guild.members.fetch(guild.ownerId);
        
        //not working due to perms change
        //logger.info(`${guild.name}:${owner.user.username}:${permissions.has(BOT_DEFAULT_PERMISSIONS)}`);
      }
      //not working due to perms change
      //logger.info(`Generated Invite Link is: ${this.client.generateInvite({ permissions: BOT_DEFAULT_PERMISSIONS })}`)
    });

    this.client.on('message', async msg => {
      if (msg.channel.type === 'text') {
        console.log(msg.content);
        switch (msg.content.split(' ')[0]) {
          case 'Events': {
            let channel = msg.channel;
            if (!isNaN(parseInt(msg.content.split(' ')[1]))) {
              channel = await this.client.channels.fetch(msg.content.split(' ')[1] as `${bigint}`) as TextChannel;
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
        content = new EmbedBuilder();
        content.setColor(0xf7bd00);
        content.setTitle('Carrier Jump >>>');
        content.addFields(
			{ name: 'Carrier', value: data.Name },
			{ name: 'Destination', value: data.StarSystem },
        );
        content.addField('Carrier', data.Name);
        content.addField('Destination', data.StarSystem);
        break;
      }
      case "CarrierJumpRequest": {
        content = new EmbedBuilder();
        content.setColor(0xf7bd00);
        content.setTitle('Carrier Jump Request');
        content.addField('Carrier', data.Name);
        content.addField('Destination', data.SystemName);
        break;
      }
      case "CarrierJumpCancelled": {
        content = new EmbedBuilder();
        content.setColor(0xf7bd00);
        content.setTitle('Carrier Jump Canceled');
        content.addField('Carrier', data.Name);
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
