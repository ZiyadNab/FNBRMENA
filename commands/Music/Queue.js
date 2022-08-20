module.exports = {
    commands: 'queue',
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
        const queue = await client.disTube.getQueue(message);

        //check if the queue is empty
        if (!queue){
            const noMusicPlayingErr = new Discord.EmbedBuilder()
            noMusicPlayingErr.setColor(FNBRMENA.Colors("embedError"))
            noMusicPlayingErr.setTitle(`There is no music is playing at the moment ${emojisObject.errorEmoji}`)
            return message.reply({embeds: [noMusicPlayingErr]})
        }

        //send the current playing music info
        const nowPlaying = new Discord.EmbedBuilder()

        //add the song to the queue
        if(queue.songs.length < 24){
            nowPlaying.setColor(FNBRMENA.Colors("embed"))
            nowPlaying.setDescription(`Here is all the songs currently in the queue, use play to add a song.`)
            queue.songs.map((song, id) =>{
                nowPlaying.addFields({name: `Added By ${song.user.username}`, value: `• ${song.name}\n• Duration: \`${song.formattedDuration}\`\n• Queue Position: \`${id + 1}\`\n\n`})
            })
        }else{
            nowPlaying.setColor(FNBRMENA.Colors("embedError"))
            nowPlaying.setDescription(`Cant view queue at the moment, becuase is has too many songs ${emojisObject.errorEmoji}`)
        }

        nowPlaying.setTitle(`Current Queue, ${queue.songs.length} Songs`)
        message.reply({embeds: [nowPlaying]})
    }
}