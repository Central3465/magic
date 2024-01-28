require('dotenv').config();
const { REST, Routes, ApplicationCommandOptionType} = require('discord.js');

const commands = [
  {
    name: 'ping',
    description: 'Pong!',
  },
  {
    name: 'about',
    description: 'Displays information about the bot.',
  },
  {
    name: 'help',
    description: 'Displays a list of available commands and their descriptions.',
  },
  {
    name: 'serverinfo',
    description: 'Displays information about the current guild.',
  },
  {
    name: 'whois',
    description: 'Displays information about a specific user.',
    options: [
      {
        name: 'username',
        description: 'Their Username',
        type: ApplicationCommandOptionType.User,
        required: true,
      }
    ]
  }
];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log('Registering global slash commands...');

    // Register global commands
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );

    console.log('Global slash commands were registered successfully!');

    console.log('Registering guild slash commands...');

    // Register guild-specific commands
    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID,
      ),
      { body: commands }
    );

    console.log('Guild slash commands were registered successfully!');
  } catch (error) {
    console.error(`There was an error: ${error.message}`);
  }
})();