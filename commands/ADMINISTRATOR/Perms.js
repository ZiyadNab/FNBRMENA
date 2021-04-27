module.exports = {
    commands: 'perms',
    expectedArgs: '[ Name Of the Command ] [ The Permission ]',
    minArgs: 2,
    maxArgs: null,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (message, args, text, Discord, client, admin, alias, errorEmoji, checkEmoji) => {

        admin.database().ref("ERA's").child("Users").child(message.author.id).once('value', async function (data) {
            var lang = data.val().lang;

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

                const method = new Discord.MessageEmbed()
                method.setColor('#BB00EE')
                        if(lang === "en"){
                            method.setTitle('Choose a method')
                            method.addFields(
                                {name: 'Add Perm', value: 'React to :white_check_mark:'},
                                {name: 'Delete Perm', value: 'React to :negative_squared_cross_mark:'}
                            )
                        }else if(lang === "ar"){
                            method.setTitle('اختر طريقة')
                            method.addFields(
                                {name: 'اضافة صلاحية', value: 'اختر العلامة :white_check_mark:'},
                                {name: 'Delete Perm', value: 'اختر العلامة :negative_squared_cross_mark:'}
                            )
                        }
                        const msgReact = await message.channel.send(method)
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
                                                    if(lang === "en"){
                                                        const done = new Discord.MessageEmbed()
                                                        done.setColor('#BB00EE')
                                                        done.setTitle(`The ${shifted} permission(s) has been addedd ${checkEmoji}`)
                                                        message.channel.send(done)
                                                    }else if(lang === "ar"){
                                                        const done = new Discord.MessageEmbed()
                                                        done.setColor('#BB00EE')
                                                        done.setTitle(`تم اضافة الصلاحيات لأمر ${shifted} ${checkEmoji}`)
                                                        message.channel.send(done)
                                                    }
                                                }else{
                                                    if(lang === "en"){
                                                        const errCommand = new Discord.MessageEmbed()
                                                        errCommand.setColor('#BB00EE')
                                                        errCommand.setTitle(`The ${shifted} is not a valid command ${errorEmoji}`)
                                                        message.channel.send(errCommand)
                                                    }else if(lang === "ar"){
                                                        const errCommand = new Discord.MessageEmbed()
                                                        errCommand.setColor('#BB00EE')
                                                        errCommand.setTitle(`لا يوجد امر بهذا الاسم ${shifted} ${errorEmoji}`)
                                                        message.channel.send(errCommand)
                                                    }
                                                }
                                            })

                                        }
                                        if(reaction.emoji.name === '❎'){
                                            admin.database().ref("ERA's").child("Commands").child(args[0]).child("Perms").once('value', async data => {
                                                if(data.exists()){
                                                    admin.database().ref("ERA's").child("Commands").child(args[0]).child("Perms").remove()
                                                    if(lang === "en"){
                                                        const secCommand = new Discord.MessageEmbed()
                                                        secCommand.setColor('#BB00EE')
                                                        secCommand.setTitle(`All the ${args[0]} perms has been removed ${errorEmoji}`)
                                                        message.channel.send(secCommand)
                                                    }else if(lang === "ar"){
                                                        const secCommand = new Discord.MessageEmbed()
                                                        secCommand.setColor('#BB00EE')
                                                        secCommand.setTitle(`تم حذف جميع صلاحيات امر ${args[0]} ${checkEmoji}`)
                                                        message.channel.send(secCommand)
                                                    }
                                                }else{
                                                    if(lang === "en"){
                                                        const errCommand = new Discord.MessageEmbed()
                                                        errCommand.setColor('#BB00EE')
                                                        errCommand.setTitle(`The ${args[0]} doesn't have perms ${errorEmoji}`)
                                                        message.channel.send(errCommand)
                                                    }else if(lang === "ar"){
                                                        const errCommand = new Discord.MessageEmbed()
                                                        errCommand.setColor('#BB00EE')
                                                        errCommand.setTitle(`لا يوجد صلاحيات لأمر ${args[0]} ${errorEmoji}`)
                                                        message.channel.send(errCommand)
                                                    }
                                                }
                                            })
                                    }

                                    msgReact.delete()

                                    }).catch(err => {
                                        msgReact.delete()
                                        if(lang === "en"){
                                            const error = new Discord.MessageEmbed()
                                            .setColor('#BB00EE')
                                            .setTitle(`Sorry we canceled your process becuase no action has taken ${errorEmoji}`)
                                            message.reply(error)
                                        }else if(lang === "ar"){
                                            const error = new Discord.MessageEmbed()
                                            .setColor('#BB00EE')
                                            .setTitle(`لقد تم ايقاف الامر لعدم اختيار طريقة ${errorEmoji}`)
                                            message.reply(error)
                                        }
                                })
                            }else{
                                if(lang === "en"){
                                    const err = new Discord.MessageEmbed()
                                    err.setColor('#BB00EE')
                                    err.setTitle(`The ${args} is not valid perm please type a valid one ${errorEmoji}`)
                                    message.channel.send(err)
                                }else if(lang === "ar"){
                                    const err = new Discord.MessageEmbed()
                                    err.setColor('#BB00EE')
                                    err.setTitle(`لا يوجد صلاحية بهذا الاسم ${args} ${errorEmoji}`)
                                    message.channel.send(err)
                                }
                            }
                        })
    },
    
    requiredRoles: []
}