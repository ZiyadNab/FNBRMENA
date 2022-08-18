module.exports = {
    commands: 'pause',
    type: 'Fun',
    minArgs: 0,
    maxArgs: 0,
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
        
        //get the queue
        const queue = client.disTube.getQueue(message)

        //check if the queue is empty
        if (!queue){
            const noMusicPlayingErr = new Discord.EmbedBuilder()
            noMusicPlayingErr.setColor(FNBRMENA.Colors("embedError"))
            noMusicPlayingErr.setTitle(`There is no music is playing at the moment ${emojisObject.errorEmoji}`)
            return message.reply({embeds: [noMusicPlayingErr]})
        }

        //if the music already puased
        if(queue.paused){

            //queue resume
            await queue.resume()
            const queueResume = new Discord.EmbedBuilder()
            queueResume.setColor(FNBRMENA.Colors("embedSuccess"))
            queueResume.setTitle(`Music already paused, Resuming now. ${emojisObject.checkEmoji}`)
            return message.reply({embeds: [queueResume]})
        }

        //queue resume
        await queue.pause()
        const queuePause = new Discord.EmbedBuilder()
        queuePause.setColor(FNBRMENA.Colors("embedSuccess"))
        queuePause.setTitle(`The music has been paused. ${emojisObject.checkEmoji}`)
        return message.reply({embeds: [queuePause]})

    }
}