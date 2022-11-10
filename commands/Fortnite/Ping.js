module.exports = {
    commands: 'ping',
    type: 'Bot Status',
    minArgs: 0,
    maxArgs: 0,
    cooldown: -1,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (FNBRMENA, message, args, text, Discord, client, admin, userData, alias, emojisObject) => {

        message.reply({content: `Hey <@${message.author.id}>,\n**Bot latency:** ${Date.now() - message.createdTimestamp}ms, **API latency:** ${client.ws.ping}ms`})
    }
}