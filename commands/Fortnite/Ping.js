module.exports = {
    commands: 'ping',
    type: 'Bot Status',
    descriptionEN: 'Responds with bot latency.',
    descriptionAR: 'يستجيب مع زمن تأخر الروبوت.',
    minArgs: 0,
    maxArgs: 0,
    cooldown: -1,
    callback: async (FNBRMENA, message, args, text, Discord, client, admin, userData, alias, emojisObject) => {

        message.reply({content: `Hey <@${message.author.id}>,\n**Bot latency:** ${Date.now() - message.createdTimestamp}ms, **API latency:** ${client.ws.ping}ms`})
        .catch(err => {
            FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, null)
        })
    }
}