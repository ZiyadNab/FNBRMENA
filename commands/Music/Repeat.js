module.exports = {
    commands: 'repeat',
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
            
        }
        
        // Get the queue
        const queue = client.player.getQueue(message.guild.id)

        // Check if the queue is empty
        if (!queue){
            const noMusicPlayingErr = new Discord.EmbedBuilder()
            noMusicPlayingErr.setColor(FNBRMENA.Colors("embedError"))
            noMusicPlayingErr.setTitle(`There is no music is playing at the moment ${emojisObject.errorEmoji}`)
            return message.reply({embeds: [noMusicPlayingErr], components: [], files: []})
        }

        // Create random landing embed message
        const musicRepeatEmbed = new Discord.EmbedBuilder()
        musicRepeatEmbed.setColor(FNBRMENA.Colors("embed"))
        musicRepeatEmbed.setAuthor({name: `MUSIC REPEATING`, iconURL: `https://static.wikia.nocookie.net/fortnite_gamepedia/images/2/28/T_Ui_Music_256.png`})
        musicRepeatEmbed.setDescription('Please choose the repeat stat.\n`You have only 30 seconds until this operation ends, Make it quick`!')

        // Create a row for buttons
        const buttonsDataRow = new Discord.ActionRowBuilder()

        // Repeat song button
        const repeatSongButton = new Discord.ButtonBuilder()
        repeatSongButton.setCustomId('song')
        repeatSongButton.setStyle(Discord.ButtonStyle.Success)
        repeatSongButton.setLabel(`Repeat ${queue.nowPlaying().title}`)

        // Repeat queue button
        const repeatQueueButton = new Discord.ButtonBuilder()
        repeatQueueButton.setCustomId('queue')
        repeatQueueButton.setStyle(Discord.ButtonStyle.Primary)
        repeatQueueButton.setLabel(`Repeat Queue`)

        // Stop repeatings button
        const stopRepeatButton = new Discord.ButtonBuilder()
        stopRepeatButton.setCustomId('stop')
        stopRepeatButton.setStyle(Discord.ButtonStyle.Danger)
        stopRepeatButton.setLabel("Stop Repeating")
        
        // Add the buttons to the buttonsDataRow
        buttonsDataRow.addComponents(repeatSongButton, repeatQueueButton, stopRepeatButton)

        // Send the button
        const musicRepeatMessage = await message.reply({embeds: [musicRepeatEmbed], components: [buttonsDataRow], files: []})

        // Filtering the user clicker
        const filter = (i => {
            return (i.user.id === message.author.id && i.message.id === musicRepeatMessage.id && i.guild.id === message.guild.id)
        })

        // Await for the user
        await message.channel.awaitMessageComponent({filter, time: 30000})
        .then(async collected => {
            collected.deferUpdate();

            // If the user wants to repeat the current song
            if(collected.customId === "song"){
                musicRepeatMessage.delete()
                
                // Track repeat
                await queue.setRepeatMode(1)
                const songRepeating = new Discord.EmbedBuilder()
                songRepeating.setColor(FNBRMENA.Colors("embedSuccess"))
                songRepeating.setTitle(`The ${queue.nowPlaying().title} will be repeated until repeating is disabled ${emojisObject.checkEmoji}.`)
                return message.reply({embeds: [songRepeating], components: [], files: []})
            }

            // If the user wants to repeat the queue
            if(collected.customId === "queue"){
                musicRepeatMessage.delete()
                
                // Queue repeat
                await queue.setRepeatMode(2)
                const queueRepeating = new Discord.EmbedBuilder()
                queueRepeating.setColor(FNBRMENA.Colors("embedSuccess"))
                queueRepeating.setTitle(`The whole queue will be repeated until repeating is disabled ${emojisObject.checkEmoji}.`)
                return message.reply({embeds: [queueRepeating], components: [], files: []})
            }

            // If the user wants to stop repeating
            if(collected.customId === "stop"){
                musicRepeatMessage.delete()

                // Stop repeat
                await queue.setRepeatMode(0)
                const stopRepeating = new Discord.EmbedBuilder()
                stopRepeating.setColor(FNBRMENA.Colors("embedSuccess"))
                stopRepeating.setTitle(`Repeating has been disabled ${emojisObject.checkEmoji}.`)
                return message.reply({embeds: [stopRepeating], components: [], files: []})
            }
        })
    }
}