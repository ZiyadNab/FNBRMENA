module.exports = {
    commands: 'lang',
    type: 'User Data',
    minArgs: 0,
    maxArgs: 0,
    callback: async (FNBRMENA, message, args, text, Discord, client, admin, userData, alias, emojisObject) => {

        // Seeting up the db firestore
        var db = await admin.firestore()

        //create an embed
        const languageEmbed = new Discord.EmbedBuilder()
        languageEmbed.setColor(FNBRMENA.Colors("embed"))
        if(userData.lang === "en"){
            languageEmbed.setTitle(`Language`)
            languageEmbed.setDescription('Please click on the Drop-Down menu and choose a language.\n`You have only 30 seconds until this operation ends, Make it quick`!')
        }else if(userData.lang === "ar"){
            languageEmbed.setTitle(`تعديل اللغة`)
            languageEmbed.setDescription('الرجاء الضغط على السهم لاختيار لغة.\n`لديك فقط 30 ثانية حتى تنتهي العملية, استعجل`!')
        }

        //create a row for cancel button
        const buttonDataRow = new Discord.ActionRowBuilder()
        
        //add EN cancel button
        if(userData.lang === "en") buttonDataRow.addComponents(
            new Discord.ButtonBuilder()
            .setCustomId('Cancel')
            .setStyle(Discord.ButtonStyle.Danger)
            .setLabel("Cancel")
        )
        
        //add AR cancel button
        else if(userData.lang === "ar") buttonDataRow.addComponents(
            new Discord.ButtonBuilder()
            .setCustomId('Cancel')
            .setStyle(Discord.ButtonStyle.Danger)
            .setLabel("اغلاق")
        )
        
        //create a row for drop down menu for categories
        const languageRow = new Discord.ActionRowBuilder()

        // Create a select menu
        const languageDropMenu = new Discord.SelectMenuBuilder()
        languageDropMenu.setCustomId('language')
        if(userData.lang === "en") languageDropMenu.setPlaceholder('Select a language!')
        else if(userData.lang === "ar") languageDropMenu.setPlaceholder('اختر لغة!')

        // Set English options
        if(userData.lang === "en") languageDropMenu.addOptions(
            {
                label: `Arabic`,
                emoji: `🇸🇦`,
                value: `ar`
            },
            {
                label: `English`,
                emoji: `🇺🇸`,
                value: `en`
            }
        )

        // Set Arabic options
        else if(userData.lang === "ar") languageDropMenu.addOptions(
            {
                label: `العربية`,
                emoji: `🇸🇦`,
                value: `ar`
            },
            {
                label: `الانجليزية`,
                emoji: `🇺🇸`,
                value: `en`
            }
        )

        // Add the drop menu to the categoryDropMenu
        languageRow.addComponents(languageDropMenu)

        // Send the message
        const dropMenuMessage = await message.reply({embeds: [languageEmbed], components: [languageRow, buttonDataRow], files: []})
        .catch(err => {
            FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, dropMenuMessage)
        })

        // Filtering the user clicker
        const filter = (i => {
            return (i.user.id === message.author.id && i.message.id === dropMenuMessage.id && i.guild.id === message.guild.id)
        })

        // Await for the user
        await message.channel.awaitMessageComponent({filter, time: 30000})
        .then(async collected => {
            collected.deferUpdate();

            // Cancel has been selected
            if(collected.customId === "Cancel"){
                dropMenuMessage.delete()
            }

            // Language has been selected
            if(collected.customId === "language"){

                // Update the user's language
                await db.collection("Users").doc(message.member.user.id).update({
                    lang: collected.values[0]
                })

                // Create sucess embed
                const successfullyUpatedEmbed = new Discord.EmbedBuilder()
                successfullyUpatedEmbed.setColor(FNBRMENA.Colors("embedSuccess"))
                if(userData.lang === "en") successfullyUpatedEmbed.setTitle(`You have successfully changed your language ${emojisObject.checkEmoji}.`)
                else if(userData.lang === "ar") successfullyUpatedEmbed.setTitle(`تم تغير اللغة الخاصه بك بنجاح ${emojisObject.checkEmoji}.`)
                dropMenuMessage.edit({embeds: [successfullyUpatedEmbed], components: [], files: []})
                .catch(err => {
                    FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, dropMenuMessage)
                })
            }
        }).catch(async err => {
            FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, dropMenuMessage)
        })
    }
}