const { REST, Routes } = require('discord.js');
const fs = require('node:fs');

module.exports = {
    commands: 'deploy',
    type: 'Administrators Only',
    minArgs: 0,
    maxArgs: 0,
    cooldown: -1,
    callback: async (FNBRMENA, message, args, text, Discord, client, admin, userData, alias, emojisObject) => {

        const commands = [];
        // Grab all the command files from the commands directory you created earlier
        const commandFiles = fs.readdirSync('./commands/SlashCommands').filter(file => file.endsWith('.js'));

        // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
        for (const file of commandFiles) {
            const command = require(`../SlashCommands/${file}`);
            commands.push(command.data.toJSON());
        }

        // Construct and prepare an instance of the REST module
        const rest = new REST({ version: '10' }).setToken(FNBRMENA.APIKeys("DiscordBotToken"));

        // and deploy your commands!
        (async () => {
            try {
                const msg = await message.reply({content: `Started refreshing ${commands.length} application (/) commands. ${emojisObject.loadingEmoji}`});

                // The put method is used to fully refresh all commands in the guild with the current set
                const data = await rest.put(
                    Routes.applicationGuildCommands(FNBRMENA.APIKeys("clientId"), FNBRMENA.APIKeys("guildId")),
                    { body: commands },
                );

                msg.edit({content: `Successfully reloaded ${data.length} application (/) commands. ${emojisObject.checkEmoji}`});
            } catch (error) {
                // And of course, make sure you catch and log any errors!
                console.error(error);
            }
        })();
    }
}