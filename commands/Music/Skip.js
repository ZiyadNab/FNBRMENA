module.exports = {
    commands: 'skip',
    type: 'Fun',
    minArgs: 0,
    maxArgs: 0,
    cooldown: -1,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (FNBRMENA, message, args, text, Discord, client, admin, alias, errorEmoji, checkEmoji, loadingEmoji, greenStatus, redStatus, disTube) => {

        //get the user language from the database
        const lang = await FNBRMENA.Admin(admin, message, "", "Lang")

        if (!message.member.voice.channel){
            const err = new Discord.MessageEmbed()
            err.setColor(FNBRMENA.Colors("embed"))
            if(lang === "en"){
                err.setTitle(`Ay u r not in a voice channel ${errorEmoji}`)
            }else if(lang === "ar"){
                err.setTitle(`يا ذكي ادخل محادثه صوتيه ${errorEmoji}`)
            }
            return message.channel.send(err)
        }
        await disTube.skip(message)
        const skipped = new Discord.MessageEmbed()
        skipped.setColor(FNBRMENA.Colors("embed"))
        if(lang === "en"){
                skipped.setTitle(`Away we goooooooo to the next track baby ${checkEmoji}`)
        }else if(lang === "ar"){
            skipped.setTitle(`طيب لا تنافخ بوديك للتراك الي بعده ${errorEmoji}`)
        }
        return message.channel.send(skipped)

    }
}