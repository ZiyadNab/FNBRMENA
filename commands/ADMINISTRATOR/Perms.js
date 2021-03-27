module.exports = {
    commands: 'perms',
    expectedArgs: '[ Name Of the Command ] [ The Permission ]',
    minArgs: 2,
    maxArgs: null,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (message, args, text, Discord, client, admin) => {

        const validPermissions = [
            'CREATE_INSTANT_INVITE',
            'KICK_MEMBERS',
            'BAN_MEMBERS',
            'ADMINISTRATOR',
            'MANAGE_CHANNELS',
            'MANAGE_GUILD',
            'ADD_REACTIONS',
            'VIEW_AUDIT_LOG',
            'PRIORITY_SPEAKER',
            'STREAM',
            'VIEW_CHANNEL',
            'SEND_MESSAGES',
            'SEND_TTS_MESSAGES',
            'MANAGE_MESSAGES',
            'EMBED_LINKS',
            'ATTACH_FILES',
            'READ_MESSAGE_HISTORY',
            'MENTION_EVERYONE',
            'USE_EXTERNAL_EMOJIS',
            'VIEW_GUILD_INSIGHTS',
            'CONNECT',
            'SPEAK',
            'MUTE_MEMBERS',
            'DEAFEN_MEMBERS',
            'MOVE_MEMBERS',
            'USE_VAD',
            'CHANGE_NICKNAME',
            'MANAGE_NICKNAMES',
            'MANAGE_ROLES',
            'MANAGE_WEBHOOKS',
            'MANAGE_EMOJIS',
          ]

            var shifted = args.shift();
            var valid = true
            for(const Perm of args){
                if(!validPermissions.includes(Perm)){
                    valid = false
                }
            }

            if(valid === true){

            const lang = new Discord.MessageEmbed()
                    .setColor('#BB00EE')
                    .setTitle('Choose a method')
                    .addFields(
                        {name: 'Add Perm', value: 'React to :white_check_mark:'},
                        {name: 'Delete Perm', value: 'React to :negative_squared_cross_mark:'}
                    )
                    const msgReact = await message.channel.send(lang)
                    await msgReact.react('✅')
                    msgReact.react('❎')
                    const filter = (reaction, user) => {
                        return ['✅', '❎'].includes(reaction.emoji.name) && user.id === message.author.id;
                    };
                    await msgReact.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
                                .then( async collected => {
                                    const reaction = collected.first();
                                    if(reaction.emoji.name === '✅'){

                                        admin.database().ref("ERA's").child("Commands").child(shifted).once('value', async data => {
                                            if(data.exists()){
                                                await admin.database().ref("ERA's").child("Commands").child(shifted).child("Perms").set([
                                                    args
                                                ])
                                            const done = new Discord.MessageEmbed()
                                            done.setColor('#BB00EE')
                                            done.setTitle("✅ The " + shifted + " permission(s) has been addedd")
                                            message.channel.send(done)
                                            }else{
                                                const errCommand = new Discord.MessageEmbed()
                                                errCommand.setColor('#BB00EE')
                                                errCommand.setTitle("❎ The " + shifted + " is not a valid command")
                                                message.channel.send(errCommand)
                                            }
                                        })

                                    }
                                    if(reaction.emoji.name === '❎'){
                                        admin.database().ref("ERA's").child("Commands").child(args[0]).child("Perms").once('value', async data => {
                                            if(data.exists()){
                                                admin.database().ref("ERA's").child("Commands").child(args[0]).child("Perms").remove()
                                                const secCommand = new Discord.MessageEmbed()
                                                secCommand.setColor('#BB00EE')
                                                secCommand.setTitle("✅ The " + args[0] + " has been removed")
                                                message.channel.send(secCommand)
                                            }else{
                                                const errCommand = new Discord.MessageEmbed()
                                                errCommand.setColor('#BB00EE')
                                                errCommand.setTitle("❎ The " + args[0] + " doesn't have perms")
                                                message.channel.send(errCommand)
                                            }
                                        })
                                }

                                msgReact.delete()

                                }).catch(err => {
                                    msgReact.delete()
                                    const error = new Discord.MessageEmbed()
                                    .setColor('#BB00EE')
                                    .setTitle(":regional_indicator_x: Sorry we canceled your process becuase no language has been selected")
                                    message.reply(error)
                            })
                        }else{
                            const err = new Discord.MessageEmbed()
                            err.setColor('#BB00EE')
                            err.setTitle("❎ The " + args + " is not valid perm please type a valid one")
                            message.channel.send(err)
                            }

    },
    
    requiredRoles: []
}