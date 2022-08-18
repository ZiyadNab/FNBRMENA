const config = require('../../Configs/config.json')

module.exports = {
    commands: 'announce',
    type: 'Administrators Only',
    minArgs: 1,
    maxArgs: null,
    cooldown: -1,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (FNBRMENA, message, args, text, Discord, client, admin, userData, alias, emojisObject) => {
        
        //get rules channel id
        const announceMessage = await client.channels.cache.find(channel => channel.id === config.channels.announce)

        //inislizing embed
        const announceEmbed = new Discord.EmbedBuilder()
        announceEmbed.setColor(FNBRMENA.Colors("embed"))
        announceEmbed.setDescription(text)

        //send the message
        await announceMessage.send({embeds: [announceEmbed]})
        .then(() => {

            //inislizing embed
            const successfullySent = new Discord.EmbedBuilder()
            successfullySent.setColor(FNBRMENA.Colors("embedSuccess"))
            if(userData.lang === "en") successfullySent.setTitle(`Announcment has been successfully sent ${emojisObject.checkEmoji}`)
            else if(userData.lang === "ar") successfullySent.setTitle(`تم نشر الخبر بنجاح ${emojisObject.checkEmoji}`)
            message.reply({embeds: [successfullySent]})
        }).catch(() => {

            //inislizing embed
            const errSent = new Discord.EmbedBuilder()
            errSent.setColor(FNBRMENA.Colors("embedSuccess"))
            if(userData.lang === "en") errSent.setTitle(`There was an error while sending the message please ask the Owner for help ${emojisObject.checkEmoji}`)
            else if(userData.lang === "ar") errSent.setTitle(`يوجد مشكلة اثناء نشر الأخبار الرجاء التواصل مع الـ Owner لحل المشكلة ${emojisObject.checkEmoji}`)
            message.reply({embeds: [errSent]})
        })
    }
}