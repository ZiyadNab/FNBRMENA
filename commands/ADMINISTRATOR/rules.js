const config = require('../../Coinfigs/config.json')

module.exports = {
    commands: 'rules',
    expectedArgs: '[ Rule statment ]',
    minArgs: 1,
    maxArgs: null,
    cooldown: -1,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: (message, args, text, Discord, client, admin, alias, errorEmoji, checkEmoji) => {
        admin.database().ref("ERA's").child("Users").child(message.author.id).once('value', async function (data) {
            var lang = data.val().lang;
            const messageAnnounce = new Discord.MessageEmbed()
            messageAnnounce.setColor('#BB00EE')
            messageAnnounce.setTitle(text)
            const accounce = client.channels.cache.find(channel => channel.id === config.channels.rules)
            if(accounce.send(messageAnnounce)){
                const messageAnnounceDone = new Discord.MessageEmbed()
                messageAnnounceDone.setColor('#BB00EE')
                if(lang === "en"){
                    messageAnnounceDone.setTitle(`The rule has been published ${checkEmoji}`)
                }else if(lang === "ar"){
                    messageAnnounceDone.setTitle(`تم نشر القانون ${checkEmoji}`)
                }
                message.channel.send(messageAnnounceDone)
            }else{
                const messageAnnounceNotDone = new Discord.MessageEmbed()
                messageAnnounceNotDone.setColor('#BB00EE')
                if(lang === "en"){
                    messageAnnounceNotDone.setTitle(`There was an error publishing this قعمث ${errorEmoji}`)
                }else if(lang === "ar"){
                    messageAnnounceNotDone.setTitle(`يوجد مشكلة في عملية نشر القانون ${errorEmoji}`)
                }
                message.channel.send(messageAnnounceNotDone)
            }
        })
    },
}