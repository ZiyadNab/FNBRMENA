const config = require('../../Coinfigs/config.json')
const Data = require('../../FNBRMENA')
const FNBRMENA = new Data()

module.exports = {
    commands: 'announce',
    expectedArgs: '[ Announce statment ]',
    minArgs: 1,
    maxArgs: null,
    cooldown: -1,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: (message, args, text, Discord, client, admin, alias, errorEmoji, checkEmoji, loadingEmoji) => {
        admin.database().ref("ERA's").child("Users").child(message.author.id).once('value', async function (data) {
            var lang = data.val().lang;

            const messageAnnounce = new Discord.MessageEmbed()
            messageAnnounce.setColor(FNBRMENA.Colors("embed"))
            messageAnnounce.setTitle(args.join(' '))
            const accounce = client.channels.cache.find(channel => channel.id === config.channels.announce)
            if (accounce.send(messageAnnounce)) {
                const messageAnnounceDone = new Discord.MessageEmbed()
                messageAnnounceDone.setColor(FNBRMENA.Colors("embed"))
                if (lang === "en") {
                    messageAnnounceDone.setTitle(`The announcement has been published ${checkEmoji}`)
                } else if (lang === "ar") {
                    messageAnnounceDone.setTitle(`تم نشر الخبر ${checkEmoji}`)
                }
                message.channel.send(messageAnnounceDone)
            } else {
                const messageAnnounceNotDone = new Discord.MessageEmbed()
                messageAnnounceNotDone.setColor(FNBRMENA.Colors("embed"))
                if (lang === "en") {
                    messageAnnounceNotDone.setTitle(`There was an error publishing this announcement ${errorEmoji}`)
                } else if (lang === "ar") {
                    messageAnnounceNotDone.setTitle(`يوجد مشكلة في عملية نشر الخبر ${errorEmoji}`)
                }
                message.channel.send(messageAnnounceNotDone)
            }
        })
    },
}