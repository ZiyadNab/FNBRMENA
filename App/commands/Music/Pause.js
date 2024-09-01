module.exports = {
    commands: 'pause',
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

        // If the music already puased
        if(queue.node.isPaused()){

            // Queue resume
            await queue.node.setPaused(false)
            const queueResume = new Discord.EmbedBuilder()
            queueResume.setColor(FNBRMENA.Colors("embedSuccess"))
            queueResume.setTitle(`Queue already paused, Resuming now ${emojisObject.checkEmoji}.`)
            return message.reply({embeds: [queueResume], components: [], files: []})
            .catch(err => {
                FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, dropMenuMessage)
            })
        }

        // Queue pause
        await queue.node.setPaused(true)
        const queuePause = new Discord.EmbedBuilder()
        queuePause.setColor(FNBRMENA.Colors("embedSuccess"))
        queuePause.setTitle(`The queue has been paused ${emojisObject.checkEmoji}.`)
        return message.reply({embeds: [queuePause], components: [], files: []})
        .catch(err => {
            FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, dropMenuMessage)
        })

    }
}