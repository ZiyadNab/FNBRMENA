module.exports = {
    commands: 'lang',
    type: 'User Data',
    minArgs: 0,
    maxArgs: 0,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (FNBRMENA, message, args, text, Discord, client, admin, userData, alias, emojisObject) => {

        //seeting up the db firestore
        var db = await admin.firestore()

        const langProvider = new Discord.EmbedBuilder()
        langProvider.setColor(FNBRMENA.Colors("embed"))
        langProvider.setTitle('Choose a language please')
        langProvider.addFields(
            {name: 'Arabic', value: 'React to the Saudi Arabia flag :flag_sa:'},
            {name: 'English', value: 'React to the US flag :flag_us:'}
        )

        //send the message and add reactions to it
        const msgReact = await message.reply({embeds: [langProvider]})
        await msgReact.react('🇸🇦')
        await msgReact.react('🇺🇸')

        const filter = (reaction, user) => {
            return ['🇸🇦', '🇺🇸'].includes(reaction.emoji.name) && user.id === message.author.id;
        }

        //await reactions
        await msgReact.awaitReactions({filter, max: 1, time: 10000, errors: ['time']})
        .then( async collected => {
            msgReact.delete()
            
            if(collected.first().emoji.name === '🇺🇸'){

                //Update the user's language
                await db.collection("Users").doc(message.member.user.id).update({
                    lang: "en"
                })

                const lnagHasBeenChangedSuccessfully = new Discord.EmbedBuilder()
                lnagHasBeenChangedSuccessfully.setColor(FNBRMENA.Colors("embedSuccess"))
                lnagHasBeenChangedSuccessfully.setTitle(`Your language has been changed to English ${emojisObject.checkEmoji}`)
                message.reply({embeds: [lnagHasBeenChangedSuccessfully]})
            }
            if(collected.first().emoji.name === '🇸🇦'){

                //Update the user's language
                await db.collection("Users").doc(message.member.user.id).update({
                    lang: "ar"
                })

                const lnagHasBeenChangedSuccessfully = new Discord.EmbedBuilder()
                lnagHasBeenChangedSuccessfully.setColor(FNBRMENA.Colors("embedSuccess"))
                lnagHasBeenChangedSuccessfully.setTitle(`تم تغير اللغة الى العربية ${emojisObject.checkEmoji}`)
                message.reply({embeds: [lnagHasBeenChangedSuccessfully]})
            }

        }).catch(err => {

            //time has passed
            if(err instanceof Error) FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject)
            else{
                const timeError = new Discord.EmbedBuilder()
                timeError.setColor(FNBRMENA.Colors("embedError"))
                timeError.setTitle(`${FNBRMENA.Errors("Time", userData.lang)} ${emojisObject.errorEmoji}`)
                message.reply({embeds: [timeError]})
            }

        })
    }
}