module.exports = {
    commands: 'volume',
    type: 'Fun',
    minArgs: 0,
    maxArgs: 1,
    cooldown: -1,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (FNBRMENA, message, args, text, Discord, client, admin, userData, alias, emojisObject) => {

        //if the user isnt in a voice chat
        if (!message.member.voice.channel){
            const notInAVoiceChannelErr = new Discord.EmbedBuilder()
            notInAVoiceChannelErr.setColor(FNBRMENA.Colors("embedError"))
            notInAVoiceChannelErr.setTitle(`Please join a voice channel first. ${emojisObject.errorEmoji}`)
            return message.reply({embeds: [notInAVoiceChannelErr]})
            
        }

        //check if the given value is negative
        if (Number(text) < 0){
            const negativeNumberError = new Discord.EmbedBuilder()
            negativeNumberError.setColor(FNBRMENA.Colors("embedError"))
            negativeNumberError.setTitle(`Volume must be non negative, Provide a such. ${emojisObject.errorEmoji}`)
            return message.reply({embeds: [negativeNumberError]})
            
        }
        
        //get the queue
        const queue = client.disTube.getQueue(message)

        //check if the queue is empty
        if (!queue){
            const noMusicPlayingErr = new Discord.EmbedBuilder()
            noMusicPlayingErr.setColor(FNBRMENA.Colors("embedError"))
            noMusicPlayingErr.setTitle(`There is no music is playing at the moment ${emojisObject.errorEmoji}`)
            return message.reply({embeds: [noMusicPlayingErr]})
        }

        //chech if the user added a volume or not
        if(args.length === 0){
            const currentVolume = new Discord.EmbedBuilder()
            currentVolume.setColor(FNBRMENA.Colors("embedSuccess"))
            currentVolume.setTitle(`The current volume is set to \`${queue.volume}\``)
            return message.reply({embeds: [currentVolume]})

        }else{
            await queue.setVolume(parseInt(text))
            const volumeHasBeenChanged = new Discord.EmbedBuilder()
            volumeHasBeenChanged.setColor(FNBRMENA.Colors("embedSuccess"))
            volumeHasBeenChanged.setTitle(`The volume has changed to \`${queue.volume}\` ${emojisObject.checkEmoji}`)
            return message.reply({embeds: [volumeHasBeenChanged]})
        }

    }
}