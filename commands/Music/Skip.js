module.exports = {
    commands: 'skip',
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

        // Check if there is up next song
        if(queue.tracks.length < 1){
            const noUpNextSongError = new Discord.EmbedBuilder()
            noUpNextSongError.setColor(FNBRMENA.Colors("embedError"))
            noUpNextSongError.setTitle(`There isn't any up next song to skip ${emojisObject.errorEmoji}.`)
            return message.reply({embeds: [noUpNextSongError]})
        }
        
        // Skip current track
        await queue.skip()

    }
}