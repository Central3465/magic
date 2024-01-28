require("dotenv").config();
const { Client, IntentsBitField, EmbedBuilder, ActivityType} = require("discord.js");

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

let status = [
  {
    name: 'Magic | /help',
    type: ActivityType.Playing,
  },
]

client.on("ready", (c) => {
  console.log(`✅ ${c.user.tag} is online.`);

  setInterval(() => {
    let random = Math.floor(Math.random() * status.length);
    client.user.setActivity(status[random]);
  }, 10000);
});

client.on("interactionCreate", (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "ping") {
    const startTime = Date.now();
    const endTime = Date.now();

    const ping = endTime - startTime;

    interaction.reply(
      `Pong! \nAPI Latency: ${ping}ms\nWebsocket Latency: ${client.ws.ping}ms`
    );
  }

  if (interaction.commandName === "help") {
    const helpEmbed = new EmbedBuilder()
      .setTitle("Magic Commands")
      .setDescription("All available commands are listed here.")
      .setColor("DarkBlue")
      .addFields(
        { name: "About", value: "About the bot." },
        {
          name: "Help",
          value:
            "Displays a list of available commands and their descriptions.",
        },
        { name: "Ping", value: "Displays your connection to Discord." },
        {
          name: "Server Info",
          value: "Displays information about the current guild.",
        },
        { name: 'User Info', value: 'Displays information about a specific user.'}
      );
    interaction.reply({ embeds: [helpEmbed] });
  }

  if (interaction.commandName === "about") {
    const aboutEmbed = new EmbedBuilder()
      .setTitle("About Magic")
      .setDescription(
        "Magic: Your versatile Discord assistant, streamlining commands for server management and user engagement effortlessly."
      )
      .setColor("DarkBlue")
      .addFields(
        { name: "Owner:", value: `<@982230587333029939>`, inline: true },
        { name: "Version:", value: `1.0.0`, inline: true },
        {
          name: "Website:",
          value: `[magic.net](https://magic.net)`,
          inline: true,
        }
      );
    interaction.reply({ embeds: [aboutEmbed] });
  }

  if (interaction.commandName === "serverinfo") {
    const guild = interaction.guild;

    const serverinfoEmbed = new EmbedBuilder()
      .setTitle(guild.name)
      .setColor("DarkBlue")
      .addFields(
        { name: "Server Name:", value: guild.name, inline: true },
        { name: "Server ID:", value: guild.id, inline: true },
        { name: `Owner:`, value: `<@${guild.ownerId}>`, inline: true },
        {
          name: "Member Count:",
          value: String(guild.memberCount),
          inline: true,
        },
        {
          name: "Total Roles:",
          value: String(guild.roles.cache.size),
          inline: true,
        },
        {
          name: "Channels:",
          value: guild.channels.cache.size.toString(),
          inline: true,
        }
      )
      .setFooter({
        text: `Server Created: ${new Date(
          guild.createdTimestamp
        ).toLocaleString()}`,
      });

    interaction.reply({ embeds: [serverinfoEmbed] });
  }

  if (interaction.commandName === "whois") {
    // Get the user from the interaction options
    const user = interaction.options.getUser("username");
    const mentionedUser = interaction.options.getMember("username");
    const userId = user.id;
    const joinDate = user.joinedAt
      ? user.joinedAt.toDateString()
      : "Not available"; // Get the join date as a string or set to 'Not available' if null
    const registeredDate = user.createdAt
      ? user.createdAt.toDateString()
      : "Not available"; // Get the user's registration date as a string or set to 'Not available' if null

    // Check if the user is valid
    if (user) {
      // Create an embed to display user information
      const userInfoEmbed = new EmbedBuilder()
        .setAuthor({
          name: `${user.tag}`,
          iconURL: user.displayAvatarURL({ dynamic: true }),
        })
        .setTitle(`${user.displayName}'s Information`)
        .setColor("DarkBlue")
        .setThumbnail(mentionedUser.user.displayAvatarURL({ dynamic: true }))
        .addFields(
          { name: "User ID", value: user.id, inline: true },
          { name: "Tag", value: user.tag, inline: true },
          { name: "Joined:", value: joinDate, inline: true },
          { name: "Registered:", value: registeredDate, inline: true }
        );
      // Reply with the embed
      interaction.reply({ embeds: [userInfoEmbed] });
    } else {
      // If the user is not found, reply with an error message
      interaction.reply("User not found!");
    }
  }
});

client.login(process.env.TOKEN);
