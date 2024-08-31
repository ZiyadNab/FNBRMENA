module.exports = {
    commands: 'volume',
    type: 'Fun',
    minArgs: 0,
    maxArgs: 1,
    cooldown: -1,
    callback: async (FNBRMENA, message, args, text, Discord, client, admin, userData, alias, emojisObject) => {

        //if the user isnt in a voice chat
        if (!message.member.voice.channel){
            const notInAVoiceChannelErr = new Discord.EmbedBuilder()
            notInAVoiceChannelErr.setColor(FNBRMENA.Colors("embedError"))
            notInAVoiceChannelErr.setTitle(`Please join a voice channel first. ${emojisObject.errorEmoji}`)
            return message.reply({embeds: [notInAVoiceChannelErr], components: [], files: []})
            .catch(err => {
                FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, dropMenuMessage)
            })
            
        }
        
        // Get the queue
        const queue = client.player.getQueue(message.guild.id)

        // Check if the queue is empty
        if (!queue){
            const noMusicPlayingErr = new Discord.EmbedBuilder()
            noMusicPlayingErr.setColor(FNBRMENA.Colors("embedError"))
            noMusicPlayingErr.setTitle(`There is no music currently playing ${emojisObject.errorEmoji}.`)
            return message.reply({embeds: [noMusicPlayingErr], components: [], files: []})
            .catch(err => {
                FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, dropMenuMessage)
            })

        }

        // Check if the given value is negative
        if (Number(text) < 0){
            const negativeNumberError = new Discord.EmbedBuilder()
            negativeNumberError.setColor(FNBRMENA.Colors("embedError"))
            negativeNumberError.setTitle(`Volume must be non negative, Provide a such ${emojisObject.errorEmoji}.`)
            return message.reply({embeds: [negativeNumberError], components: [], files: []})
            .catch(err => {
                FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, dropMenuMessage)
            })

        }

        if(Number(text) > 100){
            const tooMuchVolNumberError = new Discord.EmbedBuilder()
            tooMuchVolNumberError.setColor(FNBRMENA.Colors("embedError"))
            tooMuchVolNumberError.setTitle(`Volume must be less than 100 ${emojisObject.errorEmoji}.`)
            return message.reply({embeds: [tooMuchVolNumberError], components: [], files: []})
            .catch(err => {
                FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, dropMenuMessage)
            })

        }

        // Chech if the user added a volume or not
        if(args.length === 0){
            const currentVolume = new Discord.EmbedBuilder()
            currentVolume.setColor(FNBRMENA.Colors("embedSuccess"))
            currentVolume.setTitle(`The current volume is set to \`${queue.setVolume()}\``)
            return message.reply({embeds: [currentVolume], components: [], files: []})
            .catch(err => {
                FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, dropMenuMessage)
            })

        }else{
            await queue.setVolume(parseInt(text))
            const volumeHasBeenChanged = new Discord.EmbedBuilder()
            volumeHasBeenChanged.setColor(FNBRMENA.Colors("embedSuccess"))
            volumeHasBeenChanged.setTitle(`The volume has changed to \`${text}\` ${emojisObject.checkEmoji}`)
            return message.reply({embeds: [volumeHasBeenChanged], components: [], files: []})
            .catch(err => {
                FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, dropMenuMessage)
            })

        }
    }
}