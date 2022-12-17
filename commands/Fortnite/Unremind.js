const moment = require('moment')
require('moment-timezone')

module.exports = {
    commands: 'unremind',
    type: 'Fortnite',
    minArgs: 0,
    maxArgs: 0,
    cooldown: -1,
    callback: async (FNBRMENA, message, args, text, Discord, client, admin, userData, alias, emojisObject) => {

        const generating = new Discord.EmbedBuilder()
        generating.setColor(FNBRMENA.Colors("embed"))
        if(userData.lang === "en") generating.setTitle(`Getting all of the reminders under your account ${emojisObject.loadingEmoji}`)
        else if(userData.lang === "ar") generating.setTitle(`جاري جلب جميع التنبيهات لحسابك ${emojisObject.loadingEmoji}`)
        const msg = await message.reply({embeds: [generating], components: [], files: []})
        try {
        
            // Seeting up the db firestore
            var db = admin.firestore()

            // Define the collection
            const docRef = await db.collection("Users").doc(`${message.author.id}`).collection("Reminders")

            // Get the collection data
            const snapshot = await docRef.get()

            // Batch
            const batch = await db.batch()

            // If the user has no reminders
            if(snapshot.size > 0){

                // Creeate embed
                const listAllRemindersEmbed = new Discord.EmbedBuilder()
                listAllRemindersEmbed.setColor(FNBRMENA.Colors("embed"))
                if(userData.lang === "en"){
                    listAllRemindersEmbed.setTitle(`Reminders Remove`)
                    listAllRemindersEmbed.setDescription('Please click on the Drop-Down menu and select an item to remove.\n`You have only 30 seconds until this operation ends, Make it quick`!')
                }else if(userData.lang === "ar"){
                    listAllRemindersEmbed.setTitle(`حذف التذكيرات`)
                    listAllRemindersEmbed.setDescription('الرجاء الضغط على السهم لاختيار العنصر المراد حذفه.\n`لديك فقط 30 ثانية حتى تنتهي العملية, استعجل`!')
                }

                // Create a row for cancel button
                const buttonDataRow = new Discord.ActionRowBuilder()
                
                // Add cancel button
                if(userData.lang === "en"){
                    buttonDataRow.addComponents(
                        new Discord.ButtonBuilder()
                        .setCustomId(`All-${alias}`)
                        .setStyle(Discord.ButtonStyle.Primary)
                        .setLabel("Delete All")
                    )

                    buttonDataRow.addComponents(
                        new Discord.ButtonBuilder()
                        .setCustomId(`Cancel-${alias}`)
                        .setStyle(Discord.ButtonStyle.Danger)
                        .setLabel("Cancel")
                    )
                }

                else if(userData.lang === "ar"){
                    buttonDataRow.addComponents(
                        new Discord.ButtonBuilder()
                        .setCustomId(`All-${alias}`)
                        .setStyle(Discord.ButtonStyle.Primary)
                        .setLabel("حذف الكل")
                    )

                    buttonDataRow.addComponents(
                        new Discord.ButtonBuilder()
                        .setCustomId(`Cancel-${alias}`)
                        .setStyle(Discord.ButtonStyle.Danger)
                        .setLabel("اغلاق")
                    )
                }

                // Create a row for drop down menu for categories
                const listAllRemindersRow = new Discord.ActionRowBuilder()

                // Loop through every patch
                var reminders = []
                for(let i = 0; i < snapshot.size; i++){

                    // Get the item name
                    await FNBRMENA.Search(userData.lang, "id", snapshot.docs[i].id)
                    .then(async res => {

                        // Long client has been waiting for
                        moment.locale(userData.lang)
                        const lastModified = moment.duration(moment.tz(moment(), userData.timezone).diff(moment.tz(moment(snapshot.docs[i].data().date), userData.timezone)))
                        const days = lastModified.asDays().toString().substring(0, lastModified.asDays().toString().indexOf("."))
                        
                        // Add every reminder to the options array
                        if(userData.lang === "en") reminders.push({
                            label: `${res.data.items[0].name}`,
                            description: `You have been waiting for ${days} days.`,
                            value: `${res.data.items[0].id}`,
                        })
                        else if(userData.lang === "ar") reminders.push({
                            label: `${res.data.items[0].name}`,
                            description: `لقد كنت تنتظر ${days} يوم.`,
                            value: `${res.data.items[0].id}`,
                        })

                    }).catch(async err => {
                        FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject.emojisObject)
    
                    })
                }
                
                // Create a drop menu
                const listAllRemindersDropMenu = new Discord.SelectMenuBuilder()
                listAllRemindersDropMenu.setCustomId(`Unremind-${alias}`)
                listAllRemindersDropMenu.setMaxValues(1)
                listAllRemindersDropMenu.setMaxValues(snapshot.size)
                if(userData.lang === "en") listAllRemindersDropMenu.setPlaceholder('Select an item!')
                else if(userData.lang === "ar") listAllRemindersDropMenu.setPlaceholder('اختر عنصر!')
                listAllRemindersDropMenu.addOptions(reminders)

                // Add the drop menu to the categoryDropMenu
                listAllRemindersRow.addComponents(listAllRemindersDropMenu)

                // Edit the message
                msg.edit({embeds: [listAllRemindersEmbed], components: [listAllRemindersRow, buttonDataRow], files: []})
                .catch(err => {
                    FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, msg)
                })

                // Filtering the user clicker
                const filter = (i => {
                    return (i.user.id === message.author.id && i.message.id === msg.id && i.guild.id === message.guild.id)
                })

                // Await for the user
                await message.channel.awaitMessageComponent({filter, time: 30000})
                .then(async collected => {
                    collected.deferUpdate();

                    // If cancel button has been clicked
                    if(collected.customId === `Cancel-${alias}`) msg.delete()

                    // If all button is clicked
                    if(collected.customId === `All-${alias}`){

                        // Delete the right item
                        await snapshot.forEach(async doc => {
                            batch.delete(doc.ref)
                        })

                        // Commit all changes
                        await batch.commit()

                        // Create embed
                        const itemsHasBeenDeletedSuccessfully = new Discord.EmbedBuilder()
                        itemsHasBeenDeletedSuccessfully.setColor(FNBRMENA.Colors("embedSuccess"))
                        if(userData.lang === "en") itemsHasBeenDeletedSuccessfully.setTitle(`All items registered has been deleted successfully ${emojisObject.checkEmoji}.`)
                        else if(userData.lang === "ar") itemsHasBeenDeletedSuccessfully.setTitle(`تم حذف جميع العناصر المحفوظة ${emojisObject.checkEmoji}.`)
                        msg.edit({embeds: [itemsHasBeenDeletedSuccessfully], components: [], files: []})
                        .catch(err => {
                            FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, msg)
                        })
                    }

                    // If the user chose a type
                    if(collected.customId === `Unremind-${alias}`){

                        // Loop through all values
                        for(const val of collected.values){

                            // Delete the item
                            await docRef.doc(`${val}`).delete()
                        }

                        // Create embed
                        const itemHasBeenDeletedSuccessfully = new Discord.EmbedBuilder()
                        itemHasBeenDeletedSuccessfully.setColor(FNBRMENA.Colors("embedSuccess"))
                        if(userData.lang === "en") itemHasBeenDeletedSuccessfully.setTitle(`${collected.values.length} item(s) has been removed successfully ${emojisObject.checkEmoji}.`)
                        else if(userData.lang === "ar") itemHasBeenDeletedSuccessfully.setTitle(`تم حذف ${collected.values.length} عنصر بنجاح ${emojisObject.checkEmoji}.`)
                        msg.edit({embeds: [itemHasBeenDeletedSuccessfully], components: [], files: []})
                        .catch(err => {
                            FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, msg)
                        })
                    }
                }).catch(async err => {
                    FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, msg)
                })

            }else{

                // Create embed
                const noRemindersHasBeenFoundError = new Discord.EmbedBuilder()
                noRemindersHasBeenFoundError.setColor(FNBRMENA.Colors("embedError"))
                if(userData.lang === "en") noRemindersHasBeenFoundError.setTitle(`You dont have any reminders ${emojisObject.errorEmoji}.`)
                else if(userData.lang === "ar") noRemindersHasBeenFoundError.setTitle(`ليس لديك اي عنصر للتذكير ${emojisObject.errorEmoji}.`)
                msg.edit({embeds: [noRemindersHasBeenFoundError], components: [], files: []})
                .catch(err => {
                    FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, msg)
                })

            }
        }catch(err) {
            FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject.errorEmoji, msg)

        }
    }
}