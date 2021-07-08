const Data = require('../../FNBRMENA')
const FNBRMENA = new Data()

module.exports = {
    commands: 'queue',
    expectedArgs: '',
    minArgs: 0,
    maxArgs: 0,
    cooldown: -1,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (message, args, text, Discord, client, admin, alias, errorEmoji, checkEmoji, loadingEmoji, disTube) => {

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
        let queue = await disTube.getQueue(message);
        queue.songs.map((song, id) =>{
            const tracks = new Discord.MessageEmbed()
            .setColor(FNBRMENA.Colors("embed"))
            .setAuthor("Added By " + song.user.username)
            .setTitle(`${song.name}`)
            .setDescription(`Duration: \`${song.formattedDuration}\``)
            .setImage(song.thumbnail)
            .setFooter(`${id+1}`)
            message.channel.send(tracks)
        });
    }
}