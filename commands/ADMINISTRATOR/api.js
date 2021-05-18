module.exports = {
    commands: 'api',
    expectedArgs: '[ Name Of the command ]',
    minArgs: 1,
    maxArgs: 1,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (message, args, text, Discord, client, admin, alias, errorEmoji, checkEmoji) => {

        admin.database().ref("ERA's").child("Users").child(message.author.id).once('value', async function (data) {
            var lang = data.val().lang;

            const method = new Discord.MessageEmbed()
            method.setColor('#BB00EE')
            if(lang === "en"){
                method.setTitle('Choose a method')
                method.addFields(
                    {name: 'Fortnite-API', value: 'React to :zero:'},
                    {name: 'BenBot', value: 'React to :one:'}
                )
            }else if(lang === "ar"){
                method.setTitle('اختر طريقة')
                method.addFields(
                    {name: 'Fortnite-API', value: 'اختر العلامة :zero:'},
                    {name: 'BenBot', value: 'اختر العلامة :one:'}
                )
            }
            const msgReact = await message.channel.send(method)
            await msgReact.react('0️⃣')
            msgReact.react('1️⃣')
            const filter = (reaction, user) => {
                return ['0️⃣', '1️⃣'].includes(reaction.emoji.name) && user.id === message.author.id;
            };
            await msgReact.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
                        .then( async collected => {
                            const reaction = collected.first();
                            if(reaction.emoji.name === '0️⃣'){
                                admin.database().ref("ERA's").child("Commands").child(args[0]).update({
                                    API: "Fortnite-API"
                                })

                                const Fortnite = new Discord.MessageEmbed()
                                if(lang === "en"){
                                    Fortnite.setColor('#BB00EE')
                                    Fortnite.setTitle(`Fortnite-API API has been set ${checkEmoji}`)
                                    message.channel.send(Fortnite)
                                }else if(lang === "ar"){
                                    Fortnite.setColor('#BB00EE')
                                    Fortnite.setTitle(`تم تغير الـ API الى ${checkEmoji} Fortnite-API`)
                                    message.channel.send(Fortnite)
                                }
                            }
                            if(reaction.emoji.name === '1️⃣'){
                                admin.database().ref("ERA's").child("Commands").child(args[0]).update({
                                    API: "BenBot"
                                })

                                const BenBotDone = new Discord.MessageEmbed()
                                if(lang === "en"){
                                    BenBotDone.setColor('#BB00EE')
                                    BenBotDone.setTitle(`BenBot API has been set ${checkEmoji}`)
                                    message.channel.send(BenBotDone)
                                }else if(lang === "ar"){
                                    BenBotDone.setColor('#BB00EE')
                                    BenBotDone.setTitle(`تم تغير الـ API الى ${checkEmoji} BenBot`)
                                    message.channel.send(BenBotDone)
                                }
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
                })

    },
}