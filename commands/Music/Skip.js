module.exports = {
    commands: 'skip',
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

        await queue.skip()

    }
}