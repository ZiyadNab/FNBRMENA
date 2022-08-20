module.exports = {
    commands: 'prev',
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

        //check if there is previous song
        if(queue.previousSongs.length < 1){
            const noPreviousSongsError = new Discord.EmbedBuilder()
            noPreviousSongsError.setColor(FNBRMENA.Colors("embedError"))
            noPreviousSongsError.setTitle(`There isn't any previous songs ${emojisObject.errorEmoji}`)
            return message.reply({embeds: [noPreviousSongsError]})
        }

        //get prev
        const song = await queue.previous()
        const previousSong = new Discord.EmbedBuilder()
        previousSong.setColor(FNBRMENA.Colors("embedSuccess"))
        previousSong.setTitle(`Now playing the previous song \`${song.name}\`. ${emojisObject.checkEmoji}`)
        return message.reply({embeds: [previousSong]})

    }
}