const config = require('../../Coinfigs/config.json')

module.exports = {
    commands: 'announce',
    expectedArgs: '[ Announce Statment ]',
    minArgs: 1,
    maxArgs: null,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: (message, args, text, Discord, client, admin) => {
        const messageAnnounce = new Discord.MessageEmbed()
        messageAnnounce.setColor('#BB00EE')
        messageAnnounce.setTitle(text)
        const accounce = client.channels.cache.find(channel => channel.id === config.channels.announce)
        accounce.send(messageAnnounce)
    },
    requiredRoles: []
}