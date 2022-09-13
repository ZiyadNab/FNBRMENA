module.exports = {
    commands: 'play',
    type: 'Fun',
    minArgs: 1,
    maxArgs: null,
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

        //play the music
        await client.disTube.play(message.member.voice.channel, text, {
            member: message.member,
            textChannel: message.channel,
            message
            
        })
    }
}
