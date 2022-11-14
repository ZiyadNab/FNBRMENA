module.exports = {
    commands: 'pause',
    type: 'Fun',
    minArgs: 0,
    maxArgs: 0,
    cooldown: -1,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (FNBRMENA, message, args, text, Discord, client, admin, userData, alias, emojisObject) => {

        // If the user isnt in a voice chat
        if (!message.member.voice.channel){
            const notInAVoiceChannelErr = new Discord.EmbedBuilder()
            notInAVoiceChannelErr.setColor(FNBRMENA.Colors("embedError"))
            notInAVoiceChannelErr.setTitle(`Please join a voice channel first ${emojisObject.errorEmoji}.`)
            return message.reply({embeds: [notInAVoiceChannelErr]})
            
        }
        
        // Get the queue
        const queue = client.player.getQueue(message.guild.id)

        // Check if the queue is empty
        if (!queue){
            const noMusicPlayingErr = new Discord.EmbedBuilder()
            noMusicPlayingErr.setColor(FNBRMENA.Colors("embedError"))
            noMusicPlayingErr.setTitle(`There is no music currently playing ${emojisObject.errorEmoji}.`)
            return message.reply({embeds: [noMusicPlayingErr]})
        }

        // If the music already puased
        if(queue.setPaused()){

            // Queue resume
            await queue.setPaused(false)
            const queueResume = new Discord.EmbedBuilder()
            queueResume.setColor(FNBRMENA.Colors("embedSuccess"))
            queueResume.setTitle(`Queue already paused, Resuming now ${emojisObject.checkEmoji}.`)
            return message.reply({embeds: [queueResume]})
        }

        // Queue pause
        await queue.setPaused(true)
        const queuePause = new Discord.EmbedBuilder()
        queuePause.setColor(FNBRMENA.Colors("embedSuccess"))
        queuePause.setTitle(`The queue has been paused ${emojisObject.checkEmoji}.`)
        return message.reply({embeds: [queuePause]})

    }
}