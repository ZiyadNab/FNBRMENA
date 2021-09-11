const config = require('../../Coinfigs/config.json')

module.exports = {
    commands: 'rules',
    type: 'Administrators Only',
    minArgs: 1,
    maxArgs: null,
    cooldown: -1,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (FNBRMENA, message, args, text, Discord, client, admin, alias, errorEmoji, checkEmoji, loadingEmoji, greenStatus, redStatus) => {

        //get the user language from the database
        const lang = await FNBRMENA.Admin(admin, message, "", "Lang")

        //get rules channel id
        const rulesMessage = await client.channels.cache.find(channel => channel.id === config.channels.rules)

        //inislizing embed
        const rulesEmbed = new Discord.MessageEmbed()
        rulesEmbed.setColor(FNBRMENA.Colors("embed"))
        rulesEmbed.setDescription(text)

        //send the message
        rulesMessage.send(rulesEmbed)
        .then(() => {

            //inislizing embed
            const successfullySent = new Discord.MessageEmbed()
            successfullySent.setColor(FNBRMENA.Colors("embed"))
            if(lang === "en") successfullySent.setTitle(`Rules has been successfully sent ${checkEmoji}`)
            else if(lang === "ar") successfullySent.setTitle(`تم نشر القوانين بنجاح ${checkEmoji}`)
            message.channel.send(successfullySent)
        }).catch(() => {

            //inislizing embed
            const errSent = new Discord.MessageEmbed()
            errSent.setColor(FNBRMENA.Colors("embed"))
            if(lang === "en") errSent.setTitle(`There was an error while sending the message please ask the Owner for help ${checkEmoji}`)
            else if(lang === "ar") errSent.setTitle(`يوجد مشكلة اثناء نشر الأوامر الرجاء التواصل مع الـ Owner لحل المشكلة ${checkEmoji}`)
            message.channel.send(errSent)
        })
    }
}