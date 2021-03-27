const config = require('../../Coinfigs/config.json')

module.exports = {
    commands: 'rules',
    expectedArgs: '[ Announce Statment ]',
    minArgs: 1,
    maxArgs: null,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: (message, args, text, Discord, client, admin) => {
        const messageAnnounce = new Discord.MessageEmbed()
        messageAnnounce.setColor('#BB00EE')
        messageAnnounce.setTitle(text)
        const accounce = client.channels.cache.find(channel => channel.id === config.channels.rules)
        accounce.send(messageAnnounce)
        if(accounce.send(messageAnnounce)){
            const messageAnnounceDone = new Discord.MessageEmbed()
            messageAnnounceDone.setColor('#BB00EE')
            messageAnnounceDone.setTitle("✅ The rule has been published")
            message.channel.send(messageAnnounceDone)
        }else{
            const messageAnnounceNotDone = new Discord.MessageEmbed()
            messageAnnounceNotDone.setColor('#BB00EE')
            messageAnnounceNotDone.setTitle(":x: There is an error publishing this rule")
            message.channel.send(messageAnnounceNotDone)
        }
    },
    requiredRoles: []
}