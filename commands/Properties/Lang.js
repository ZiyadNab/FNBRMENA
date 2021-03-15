module.exports = {
    commands: 'lang',
    expectedArgs: '',
    minArgs: 0,
    maxArgs: 0,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (message, arguments, text, Discord, client, admin) => {

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
                                    .setTitle("Your language has been changed to English")
                                    message.channel.send(change)
                                }
                                if(reaction.emoji.name === '🇸🇦'){

                                    admin.database().ref("ERA's").child("Users").child(message.member.user.id).update({
                                        lang: "ar"
                                    })

                                const change = new Discord.MessageEmbed()
                                    .setColor('#BB00EE')
                                    .setTitle("تم تغير اللغة الى العربية")
                                    message.channel.send(change)
                            }

                            msgReact.delete()

                            }).catch(err => {
                            msgReact.delete()
                            const error = new Discord.MessageEmbed()
                            .setColor('#BB00EE')
                            .setTitle(":regional_indicator_x: Sorry we canceled your process becuase no language has been selected")
                            message.reply(error)
                        })
    }
}