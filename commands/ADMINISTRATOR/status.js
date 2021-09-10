module.exports = {
    commands: 'status',
    type: 'Administrators Only',
    minArgs: 1,
    maxArgs: 1,
    cooldown: -1,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (FNBRMENA, message, args, text, Discord, client, admin, alias, errorEmoji, checkEmoji, loadingEmoji, greenStatus, redStatus) => {
        
        //get the user language from the database
        const lang = await FNBRMENA.Admin(admin, message, "", "Lang")

        if(text === "on" || text === "off"){
            admin.database().ref("ERA's").child("Server").child("Status").set({
                Bot: text,
            })
            if(lang === "en"){
                const status = new Discord.MessageEmbed()
                status.setColor(FNBRMENA.Colors("embed"))
                status.setTitle(`The bot has been turned ${text} ${checkEmoji}`)
                message.channel.send(status)
            }else if(lang === "ar"){
                const status = new Discord.MessageEmbed()
                status.setColor(FNBRMENA.Colors("embed"))
                status.setTitle(`تم تغير حالة البوت الى ${text} ${checkEmoji}`)
                message.channel.send(status)
            }
        }else{
            if(lang === "en"){
                const err = new Discord.MessageEmbed()
                err.setColor(FNBRMENA.Colors("embed"))
                err.setTitle(`You have typed ${text} please type ON or OFF correctly ${errorEmoji}`)
                message.channel.send(err)
            }else if(lang === "ar"){
                const err = new Discord.MessageEmbed()
                err.setColor(FNBRMENA.Colors("embed"))
                err.setTitle(`لقت كتبت ${text} الرجاء كتابة ON ام OFF يشكل صحيح ${errorEmoji}`)
                message.channel.send(err)
            }
        }
    },
}