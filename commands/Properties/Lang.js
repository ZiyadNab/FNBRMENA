module.exports = {
    commands: 'lang',
    expectedArgs: '',
    minArgs: 0,
    maxArgs: 0,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (message, args, text, Discord, client, admin, alias, errorEmoji, checkEmoji) => {

        const lang = new Discord.MessageEmbed()
                .setColor('#BB00EE')
                .setTitle('Choose a language please')
                .addFields(
                    {name: 'Arabic', value: 'React to the Saudi Arabia flag :flag_sa:'},
                    {name: 'English', value: 'React to the US flag :flag_us:'}
                )
                const msgReact = await message.channel.send(lang)
                await msgReact.react('🇸🇦')
                msgReact.react('🇺🇸')
                const filter = (reaction, user) => {
                    return ['🇸🇦', '🇺🇸'].includes(reaction.emoji.name) && user.id === message.author.id;
                };
                await msgReact.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
                            .then( async collected => {
                                const reaction = collected.first();
                                if(reaction.emoji.name === '🇺🇸'){

                                    admin.database().ref("ERA's").child("Users").child(message.member.user.id).update({
                                        lang: "en"
                                    })
                    
                                    const change = new Discord.MessageEmbed()
                                    .setColor('#BB00EE')
                                    .setTitle(`Your language has been changed to English ${checkEmoji}`)
                                    message.channel.send(change)
                                }
                                if(reaction.emoji.name === '🇸🇦'){

                                    admin.database().ref("ERA's").child("Users").child(message.member.user.id).update({
                                        lang: "ar"
                                    })

                                const change = new Discord.MessageEmbed()
                                    .setColor('#BB00EE')
                                    .setTitle(`تم تغير اللغة الى العربية ${checkEmoji}`)
                                    message.channel.send(change)
                            }

                            msgReact.delete()

                            }).catch(err => {
                                if(lang === "en"){
                                    msgReact.delete()
                                    const error = new Discord.MessageEmbed()
                                    .setColor('#BB00EE')
                                    .setTitle(`Sorry we canceled your process becuase no method has been selected ${errorEmoji}`)
                                    message.reply(error)
                                }else if(lang === "ar"){
                                    msgReact.delete()
                                    const error = new Discord.MessageEmbed()
                                    .setColor('#BB00EE')
                                    .setTitle(`تم ايقاف الامر بسبب عدم اختيارك لطريقة ${errorEmoji}`)
                                    message.reply(error)
                                }
                        })
    }
}