module.exports = {
    commands: 'api',
    expectedArgs: '[ Name Of the Command ]',
    minArgs: 1,
    maxArgs: 1,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (message, args, text, Discord, client, admin) => {

        const lang = new Discord.MessageEmbed()
        .setColor('#BB00EE')
        .setTitle('Choose a method')
        .addFields(
            {name: 'Fortnite-API', value: 'React to :zero:'},
            {name: 'BenBot', value: 'React to :one:'}
        )
        const msgReact = await message.channel.send(lang)
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
                            Fortnite.setColor('#BB00EE')
                            Fortnite.setTitle("✅ Fortnite-API has been set")
                            message.channel.send(Fortnite)
                        }
                        if(reaction.emoji.name === '1️⃣'){
                            admin.database().ref("ERA's").child("Commands").child(args[0]).update({
                                API: "BenBot"
                            })

                            const BenBotDone = new Discord.MessageEmbed()
                            BenBotDone.setColor('#BB00EE')
                            BenBotDone.setTitle("✅ BenBot API has been set")
                            message.channel.send(BenBotDone)
                        }


                        msgReact.delete()

                    }).catch(err => {
                        msgReact.delete()
                        const error = new Discord.MessageEmbed()
                        .setColor('#BB00EE')
                        .setTitle(":regional_indicator_x: Sorry we canceled your process becuase no language has been selected")
                        message.reply(error)
                            })

    },
    requiredRoles: []
}