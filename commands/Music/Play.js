module.exports = {
    commands: 'play',
    type: 'Fun',
    minArgs: 1,
    maxArgs: null,
    cooldown: -1,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (FNBRMENA, message, args, text, Discord, client, admin, alias, errorEmoji, checkEmoji, loadingEmoji, greenStatus, redStatus, disTube) => {

        //get the user language from the database
        const lang = await FNBRMENA.Admin(admin, message, "", "Lang")

        //if the user isnt in a voice chat
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

        //play the music
        await disTube.play(message, text)

    }
}