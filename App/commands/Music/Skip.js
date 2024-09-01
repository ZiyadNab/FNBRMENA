module.exports = {
    commands: 'skip',
    type: 'Fun',
    minArgs: 0,
    maxArgs: 0,
    cooldown: -1,
    callback: async (FNBRMENA, message, args, text, Discord, client, admin, userData, alias, emojisObject) => {

        // If the user isnt in a voice chat
        if (!message.member.voice.channel){
            const notInAVoiceChannelErr = new Discord.EmbedBuilder()
            notInAVoiceChannelErr.setColor(FNBRMENA.Colors("embedError"))
            notInAVoiceChannelErr.setTitle(`Please join a voice channel first ${emojisObject.errorEmoji}.`)
            return message.reply({embeds: [notInAVoiceChannelErr], components: [], files: []})
            .catch(err => {
                FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, dropMenuMessage)
            })
            
        }

        // Get the queue
        const queue = client.player.nodes.get(message.guild.id)

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

        // Check if there is up next song
        if(queue.tracks.data.length < 1){
            const noUpNextSongError = new Discord.EmbedBuilder()
            noUpNextSongError.setColor(FNBRMENA.Colors("embedError"))
            noUpNextSongError.setTitle(`There isn't any up next song to skip ${emojisObject.errorEmoji}.`)
            return message.reply({embeds: [noUpNextSongError], components: [], files: []})
            .catch(err => {
                FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, dropMenuMessage)
            })
        }
        
        // Skip current track
        await queue.node.skip()

    }
}