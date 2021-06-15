const Data = require('../../FNBRMENA')
const FNBRMENA = new Data()

module.exports = {
    commands: 'stop',
    expectedArgs: '',
    minArgs: 0,
    maxArgs: 0,
    cooldown: -1,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (message, args, text, Discord, client, admin, alias, errorEmoji, checkEmoji, disTube) => {

        //get the user language from the database
        const lang = await FNBRMENA.Admin(admin, message, "", "Lang")

        if (!message.member.voice.channel){
            const err = new Discord.MessageEmbed()
            err.setColor('#BB00EE')
            if(lang === "en"){
                err.setTitle(`Ay u r not in a voice channel ${errorEmoji}`)
            }else if(lang === "ar"){
                err.setTitle(`يا ذكي ادخل محادثه صوتيه ${errorEmoji}`)
            }
            return message.channel.send(err)
        }
        await disTube.stop(message)
        const stopped = new Discord.MessageEmbed()
        stopped.setColor('#BB00EE')
        if(lang === "en"){
            stopped.setTitle(`Okay ill stop ${checkEmoji}`)
        }else if(lang === "ar"){
            stopped.setTitle(`ازعجتك ؟ طيب يلا بطفي ${errorEmoji}`)
        }
        return message.channel.send(stopped)

    }
}