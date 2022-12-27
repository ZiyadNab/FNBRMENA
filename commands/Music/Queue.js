module.exports = {
    commands: 'queue',
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
        const queue = await client.player.getQueue(message.guild)

        // Check if the queue is empty
        if (queue.tracks.length === 0 || !queue.playing){
            const noMusicPlayingErr = new Discord.EmbedBuilder()
            noMusicPlayingErr.setColor(FNBRMENA.Colors("embedError"))
            noMusicPlayingErr.setTitle(`There is no music currently playing ${emojisObject.errorEmoji}.`)
            return message.reply({embeds: [noMusicPlayingErr], components: [], files: []})
            .catch(err => {
                FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, dropMenuMessage)
            })
        }

        // Send the current playing music info
        const nowPlaying = new Discord.EmbedBuilder()

        // Add the song to the queue
        if(queue.tracks.length > 0 && queue.tracks.length < 24){
            nowPlaying.setColor(FNBRMENA.Colors("embed"))
            nowPlaying.setTitle(`Current Queue, ${queue.tracks.length} Songs`)
            nowPlaying.setDescription(`Here is all the songs currently in the queue, use play to add a song.`)
            queue.tracks.map((song, i) =>{
                nowPlaying.addFields({name: `Added By ${song.requestedBy.username}`, value: `• ${song.title}\n• Duration: \`${song.duration}\`\n• Queue Position: \`${i + 1}\`\n\n`})
            })
        }else{
            nowPlaying.setColor(FNBRMENA.Colors("embedError"))
            nowPlaying.setTitle(`Cant view queue at the moment, becuase is has too many songs ${emojisObject.errorEmoji}.`)
        }
        message.reply({embeds: [nowPlaying], components: [], files: []})
        .catch(err => {
            FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, dropMenuMessage)
        })
    }
}