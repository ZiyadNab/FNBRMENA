const moment = require('moment')
require('moment-timezone')

module.exports = {
    commands: 'unremind',
    type: 'Fortnite',
    minArgs: 0,
    maxArgs: 0,
    cooldown: -1,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (FNBRMENA, message, args, text, Discord, client, admin, userData, alias, emojisObject) => {

        const generating = new Discord.EmbedBuilder()
        generating.setColor(FNBRMENA.Colors("embed"))
        if(userData.lang === "en") generating.setTitle(`Getting all of the reminders under your account ${emojisObject.loadingEmoji}`)
        else if(userData.lang === "ar") generating.setTitle(`جاري جلب جميع التنبيهات لحسابك ${emojisObject.loadingEmoji}`)
        message.reply({embeds: [generating]})
        .then(async msg => {
        
            //seeting up the db firestore
            var db = admin.firestore()

            //define the collection
            const docRef = await db.collection("Users").doc(`${message.author.id}`).collection("Reminders")

            //get the collection data
            const snapshot = await docRef.get()

            //batch
            const batch = await db.batch()

            //if the user has no reminders
            if(snapshot.size > 0){

                //creeate embed
                const listAllRemindersEmbed = new Discord.EmbedBuilder()
                listAllRemindersEmbed.setColor(FNBRMENA.Colors("embed"))
                if(userData.lang === "en"){
                    listAllRemindersEmbed.setTitle(`Reminders Remove`)
                    listAllRemindersEmbed.setDescription('Please click on the Drop-Down menu and select an item to remove.\n`You have only 30 seconds until this operation ends, Make it quick`!')
                }else if(userData.lang === "ar"){
                    listAllRemindersEmbed.setTitle(`حذف التذكيرات`)
                    listAllRemindersEmbed.setDescription('الرجاء الضغط على السهم لاختيار العنصر المراد حذفه.\n`لديك فقط 30 ثانية حتى تنتهي العملية, استعجل`!')
                }

                //create a row for cancel button
                const buttonDataRow = new Discord.ActionRowBuilder()
                
                //add EN cancel button
                if(userData.lang === "en"){
                    buttonDataRow.addComponents(
                        new Discord.ButtonBuilder()
                        .setCustomId('All')
                        .setStyle(Discord.ButtonStyle.Primary)
                        .setLabel("Delete All")
                    )

                    buttonDataRow.addComponents(
                        new Discord.ButtonBuilder()
                        .setCustomId('Cancel')
                        .setStyle(Discord.ButtonStyle.Danger)
                        .setLabel("Cancel")
                    )
                }

                else if(userData.lang === "ar"){
                    buttonDataRow.addComponents(
                        new Discord.ButtonBuilder()
                        .setCustomId('All')
                        .setStyle(Discord.ButtonStyle.Primary)
                        .setLabel("حذف الكل")
                    )

                    buttonDataRow.addComponents(
                        new Discord.ButtonBuilder()
                        .setCustomId('Cancel')
                        .setStyle(Discord.ButtonStyle.Danger)
                        .setLabel("اغلاق")
                    )
                }

                //create a row for drop down menu for categories
                const listAllRemindersRow = new Discord.ActionRowBuilder()

                //loop throw every patch
                var reminders = []
                for(let i = 0; i < snapshot.size; i++){

                    //get the item name
                    await FNBRMENA.Search(userData.lang, "id", snapshot.docs[i].id)
                    .then(async res => {

                        //long client has been waiting for
                        moment.locale(userData.lang)
                        const lastModified = moment.duration(moment.tz(moment(), userData.timezone).diff(moment.tz(moment(snapshot.docs[i].data().date), userData.timezone)))
                        const days = lastModified.asDays().toString().substring(0, lastModified.asDays().toString().indexOf("."))
                        
                        //add every reminder to the options array
                        if(userData.lang === "en") reminders.push({
                            label: `${res.data.items[0].name}`,
                            description: `You have been waiting for ${days} days.`,
                            value: `${res.data.items[0].id}-${res.data.items[0].name}`,
                        })
                        else if(userData.lang === "ar") reminders.push({
                            label: `${res.data.items[0].name}`,
                            description: `لقد كنت تنتظر ${days} يوم.`,
                            value: `${res.data.items[0].id}-${res.data.items[0].name}`,
                        })

                    }).catch(async err => {
                        FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject.emojisObject)
    
                    })
                }
                
                //create a drop menu
                const listAllRemindersDropMenu = new Discord.SelectMenuBuilder()
                listAllRemindersDropMenu.setCustomId('Unremind')
                listAllRemindersDropMenu.setMaxValues(1)
                listAllRemindersDropMenu.setMaxValues(snapshot.size)
                if(userData.lang === "en") listAllRemindersDropMenu.setPlaceholder('Select an item!')
                else if(userData.lang === "ar") listAllRemindersDropMenu.setPlaceholder('اختر عنصر!')
                listAllRemindersDropMenu.addOptions(reminders)

                //add the drop menu to the categoryDropMenu
                listAllRemindersRow.addComponents(listAllRemindersDropMenu)

                //send the message
                const dropMenuMessage = await message.reply({embeds: [listAllRemindersEmbed], components: [listAllRemindersRow, buttonDataRow]})

                //filtering the user clicker
                const filter = i => i.user.id === message.author.id

                //await for the user
                await message.channel.awaitMessageComponent({filter, time: 30000})
                .then(async collected => {
                    collected.deferUpdate();

                    //if cancel button has been clicked
                    if(collected.customId === "Cancel"){
                        msg.delete()
                        dropMenuMessage.delete()
                    }

                    //if all button is clicked
                    if(collected.customId === "All"){
                        await dropMenuMessage.delete()

                        //delete the right item
                        await snapshot.forEach(async doc => {
                            batch.delete(doc.ref)
                        })

                        //commit all changes
                        await batch.commit();

                        //create embed
                        const itemsHasBeenDeletedSuccessfully = new Discord.EmbedBuilder()
                        itemsHasBeenDeletedSuccessfully.setColor(FNBRMENA.Colors("embedSuccess"))
                        if(userData.lang === "en") itemsHasBeenDeletedSuccessfully.setTitle(`All items registered has been deleted successfully ${emojisObject.checkEmoji}.`)
                        else if(userData.lang === "ar") itemsHasBeenDeletedSuccessfully.setTitle(`تم حذف جميع العناصر المحفوظة ${emojisObject.checkEmoji}.`)
                        await msg.edit({embeds: [itemsHasBeenDeletedSuccessfully]})
                    }

                    //if the user chose a type
                    if(collected.customId === "Unremind"){
                        dropMenuMessage.delete()

                        //loop through all values
                        for(const val of collected.values){

                            //get the name and id
                            const itemID = val.substring(0, val.indexOf("-"))
                            const itemName = val.substring(val.indexOf("-") + 1, val.length)

                            //delete the right item
                            for(let i = 0; i < snapshot.size; i++){

                                //insure that the data is valid and its from the same author
                                if(itemID === snapshot.docs[i].id){

                                    //delete the item
                                    await docRef.doc(`${snapshot.docs[i].id}`).delete()
                                
                                }
                            }
                        }

                        //create embed
                        const itemHasBeenDeletedSuccessfully = new Discord.EmbedBuilder()
                        itemHasBeenDeletedSuccessfully.setColor(FNBRMENA.Colors("embedSuccess"))
                        if(userData.lang === "en") itemHasBeenDeletedSuccessfully.setTitle(`${collected.values.length} items has been removed successfully ${emojisObject.checkEmoji}.`)
                        else if(userData.lang === "ar") itemHasBeenDeletedSuccessfully.setTitle(`تم حذف ${collected.values.length} عنصر بنجاح ${emojisObject.checkEmoji}.`)
                        await msg.edit({embeds: [itemHasBeenDeletedSuccessfully]})
                    }
                }).catch(async err => {
                    dropMenuMessage.delete()
                    FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject)
                })

            }else{

                //create embed
                const noRemindersHasBeenFoundError = new Discord.EmbedBuilder()
                noRemindersHasBeenFoundError.setColor(FNBRMENA.Colors("embedError"))
                if(userData.lang === "en") noRemindersHasBeenFoundError.setTitle(`You dont have any reminders ${emojisObject.errorEmoji}.`)
                else if(userData.lang === "ar") noRemindersHasBeenFoundError.setTitle(`ليس لديك اي عنصر للتذكير ${emojisObject.errorEmoji}.`)
                msg.edit({embeds: [noRemindersHasBeenFoundError]})

            }
        }).catch(async err => {
            FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject.errorEmoji)

        })
    }
}