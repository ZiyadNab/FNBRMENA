const config = require('../../Coinfigs/config.json')

module.exports = {
    commands: 'command',
    expectedArgs: '',
    minArgs: 2,
    maxArgs: null,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (message, args, text, Discord, client, admin, alias, errorEmoji, checkEmoji) => {

        // const errorEmoji = client.emojis.cache.get(config.emoji.error)
        // const checkEmoji = client.emojis.cache.get(config.emoji.check)

        admin.database().ref("ERA's").child("Commands").child(args[0]).once('value', async data => {
            
            if(data.exists()){
                if(args[1] === "true" || args[1] === "false"){
                    await admin.database().ref("ERA's").child("Commands").child(args[0]).child("Active").update({
                        Status: args[1]
                    })
                    const done = new Discord.MessageEmbed()
                    done.setColor('#BB00EE')
                    admin.database().ref("ERA's").child("Commands").child(args[0]).child("Active").once('value', function (data) {
                        var access = data.val().Status;
                        if(access === "true"){
                            done.setTitle(`The ${args[0]} command is Enable ${checkEmoji}`)
                        } else if(access === "false"){
                            done.setTitle(`The ${args[0]} command is Disable ${checkEmoji}`)
                        }
                        message.channel.send(done)
                    })
                }else{
                    const err = new Discord.MessageEmbed()
                    .setColor('#BB00EE')
                    .setTitle(`Make sure that you enter TRUE to enable the command or FALSE to disable it etherwise it will throw an error ${errorEmoji}`)
                    message.channel.send(err)
                }
            }else{
                const error = new Discord.MessageEmbed()
                    .setColor('#BB00EE')
                    .setTitle(`Make sure that you have entered a valid command ${errorEmoji}`)
                    message.channel.send(error)
            }
        })
    },
    
    requiredRoles: []
}