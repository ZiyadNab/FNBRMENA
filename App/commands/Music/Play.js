const { QueryType } = require("discord-player");

module.exports = {
    commands: 'play',
    type: 'Fun',
    minArgs: 1,
    maxArgs: null,
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

        // Search the music
        const searchResult = await client.player.search(text, {
            requestedBy: message.author,
            searchEngine: QueryType.AUTO
        })

        // Check for results
        if(!searchResult.hasTracks()){
            const noResultsErr = new Discord.EmbedBuilder()
            noResultsErr.setColor(FNBRMENA.Colors("embedError"))
            noResultsErr.setTitle(`Couldn't find what you are looking for. ${emojisObject.errorEmoji}`)
            return message.reply({embeds: [noResultsErr], components: [], files: []})
            .catch(err => {
                FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, dropMenuMessage)
            })
        }

        await client.player.play(message.member.voice.channel, searchResult, {
            nodeOptions: {
                metadata: {
                    channel: message.channel,
                    client: message.guild?.members.me,
                    requestedBy: message.author.username
                },
                volume: 30
            }
        });

        // Song variable
        const song = searchResult.tracks[0]

        // Play the requested song
        const musicPlaying = new Discord.EmbedBuilder()
        musicPlaying.setColor(FNBRMENA.Colors("embed"))
        musicPlaying.setTitle(`Added \`${song.title}\``)
        musicPlaying.setDescription(`Duration: \`${song.duration}\` Views: ${song.views}`)
        musicPlaying.setImage(song.thumbnail)
        musicPlaying.setAuthor({name: `Added By ${song.requestedBy.username}`, iconURL: `https://cdn.discordapp.com/avatars/${song.requestedBy.id}/${song.requestedBy.avatar}.jpeg`})
        message.reply({embeds: [musicPlaying], components: [
          new Discord.ActionRowBuilder()
          .addComponents(
            new Discord.ButtonBuilder()
             .setStyle(Discord.ButtonStyle.Link)
             .setLabel("Music Link")
             .setURL(song.url)
          )
        ], files: []})
        .catch(err => {
            FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, dropMenuMessage)
        })

    }
}