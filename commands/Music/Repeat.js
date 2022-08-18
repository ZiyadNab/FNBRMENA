module.exports = {
    commands: 'repeat',
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

        //create random landing embed message
        const musicRepeatEmbed = new Discord.EmbedBuilder()
        musicRepeatEmbed.setColor(FNBRMENA.Colors("embed"))
        musicRepeatEmbed.setAuthor({name: `MUSIC REPEATING`, iconURL: `https://static.wikia.nocookie.net/fortnite_gamepedia/images/2/28/T_Ui_Music_256.png`})
        musicRepeatEmbed.setDescription('Please choose the repeat stat.\n`You have only 30 seconds until this operation ends, Make it quick`!')

        //create a row for buttons
        const buttonsDataRow = new Discord.ActionRowBuilder()

        //repest song button
        const repeatSongButton = new Discord.ButtonBuilder()
        repeatSongButton.setCustomId('song')
        repeatSongButton.setStyle(Discord.ButtonStyle.Success)
        repeatSongButton.setLabel(`Repeat ${queue.songs[0].name}`)

        //repest queue button
        const repeatQueueButton = new Discord.ButtonBuilder()
        repeatQueueButton.setCustomId('queue')
        repeatQueueButton.setStyle(Discord.ButtonStyle.Primary)
        repeatQueueButton.setLabel(`Repeat Queue`)

        //stop repeatings button
        const stopRepeatButton = new Discord.ButtonBuilder()
        stopRepeatButton.setCustomId('stop')
        stopRepeatButton.setStyle(Discord.ButtonStyle.Danger)
        stopRepeatButton.setLabel("Stop Repeating")
        
        //add the buttons to the buttonsDataRow
        buttonsDataRow.addComponents(repeatSongButton, repeatQueueButton, stopRepeatButton)

        //send the button
        const musicRepeatMessage = await message.reply({embeds: [musicRepeatEmbed], components: [buttonsDataRow]})

        //filtering the user clicker
        const filter = i => i.user.id === message.author.id

        //await the user click
        const collector = await message.channel.createMessageComponentCollector({filter, time: 30000, errors: ['time'] })
        collector.on('collect', async collected => {
            collected.deferUpdate()

            //if the user wants to repeat the current song
            if(collected.customId === "song"){
                collector.stop()
                
                //song repeat
                await queue.setRepeatMode(1)
                const songRepeating = new Discord.EmbedBuilder()
                songRepeating.setColor(FNBRMENA.Colors("embedSuccess"))
                songRepeating.setTitle(`The ${queue.songs[0].name} will be repeated until repeating is disabled. ${emojisObject.checkEmoji}`)
                return message.reply({embeds: [songRepeating]})
            }

            //if the user wants to repeat the queue
            if(collected.customId === "queue"){
                collector.stop()
                
                //queue repeat
                await queue.setRepeatMode(2)
                const queueRepeating = new Discord.EmbedBuilder()
                queueRepeating.setColor(FNBRMENA.Colors("embedSuccess"))
                queueRepeating.setTitle(`The whole queue will be repeated until repeating is disabled. ${emojisObject.checkEmoji}`)
                return message.reply({embeds: [queueRepeating]})
            }

            //if the user wants to stop repeating
            if(collected.customId === "stop"){
                collector.stop()

                //stop repeat
                await queue.setRepeatMode(0)
                const stopRepeating = new Discord.EmbedBuilder()
                stopRepeating.setColor(FNBRMENA.Colors("embedSuccess"))
                stopRepeating.setTitle(`Repeating has been disabled. ${emojisObject.checkEmoji}`)
                return message.reply({embeds: [stopRepeating]})
            }
        })

        //when time has ended
        collector.on('end', async () => {
            try {
                await musicRepeatMessage.delete()
            } catch {
                
            }
        })
    }
}