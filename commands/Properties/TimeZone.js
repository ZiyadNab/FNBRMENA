const moment = require('moment')
require('moment-timezone')

module.exports = {
    commands: 'timezone',
    type: 'User Data',
    minArgs: 1,
    maxArgs: 1,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (FNBRMENA, message, args, text, Discord, client, admin, userData, alias, emojisObject) => {

        //seeting up the db firestore
        var db = await admin.firestore()

        //filter
        const timezone = moment.tz.names().filter(city => {
            if(city.toLowerCase().includes(text)) return city.toLowerCase()
        })

        //check if its found or not
        if(timezone.length !== 0){

            //if there is more than one timezone found
            if(timezone.length < 25){

                //create an embed
                const allTimezonesEmbed = new Discord.EmbedBuilder()
                allTimezonesEmbed.setColor(FNBRMENA.Colors("embed"))
                if(userData.lang === "en"){
                    allTimezonesEmbed.setTitle(`Cosmetics Type`)
                    allTimezonesEmbed.setDescription('Please click on the Drop-Down menu and choose a cosmetic type.\n`You have only 30 seconds until this operation ends, Make it quick`!')
                }else if(userData.lang === "ar"){
                    allTimezonesEmbed.setTitle(`نوع العناصر`)
                    allTimezonesEmbed.setDescription('الرجاء الضغط على السهم لاختيار نوع العناصر.\n`لديك فقط 30 ثانية حتى تنتهي العملية, استعجل`!')
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
                const allTimezonesRow = new Discord.ActionRowBuilder()

                //loop throw every patch
                var timezones = []
                for(let i = 0; i < timezone.length; i++) timezones.push({
                    label: `${timezone[i]}`,
                    value: `${i}`
                })

                //create a select menu
                const allTimezonesDropMenu = new Discord.SelectMenuBuilder()
                allTimezonesDropMenu.setCustomId('timezone')
                if(userData.lang === "en") allTimezonesDropMenu.setPlaceholder('Select a time zone!')
                else if(userData.lang === "ar") allTimezonesDropMenu.setPlaceholder('اختر وحدة زمنية!')
                allTimezonesDropMenu.addOptions(timezones)

                //add the drop menu to the categoryDropMenu
                allTimezonesRow.addComponents(allTimezonesDropMenu)

                //send the message
                const dropMenuMessage = await message.reply({embeds: [allTimezonesEmbed], components: [allTimezonesRow, buttonDataRow]})

                //filtering the user clicker
                const filter = i => i.user.id === message.author.id

                //await for the user
                await message.channel.awaitMessageComponent({filter, time: 30000})
                .then(async collected => {
                    collected.deferUpdate();

                    //if cancel button has been clicked
                    if(collected.customId === "Cancel"){
                        cancelled = true
                        dropMenuMessage.delete()
                    }

                    //if a user chose a timezone
                    if(collected.customId === "timezone"){
                        dropMenuMessage.delete()

                        //Update the user's timezone
                        await db.collection("Users").doc(message.member.user.id).update({
                            timezone: timezone[collected.values[0]]
                        })

                        //Create sucess embed
                        const successfullyChangedUserTimezoneEmbed = new Discord.EmbedBuilder()
                        successfullyChangedUserTimezoneEmbed.setColor(FNBRMENA.Colors("embedSuccess"))
                        if(userData.lang === "en") successfullyChangedUserTimezoneEmbed.setTitle(`You have successfully changed your timezone to ${timezone[collected.values[0]]} ${emojisObject.checkEmoji}.`)
                        else if(userData.lang === "ar") successfullyChangedUserTimezoneEmbed.setTitle(`تم تغير وحدة الزمن الخاص بك بنجاح الي ${timezone[collected.values[0]]} ${emojisObject.checkEmoji}.`)
                        message.reply({embeds: [successfullyChangedUserTimezoneEmbed]})
                    }
                }).catch(async err => {
                    dropMenuMessage.delete()
                    FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject)
                })

            }else{

                //Create an error embed
                const outOfRangeError = new Discord.EmbedBuilder()
                outOfRangeError.setColor(FNBRMENA.Colors("embedError"))
                if(userData.lang === "en") outOfRangeError.setTitle(`Too many timezones were found, please be specific ${emojisObject.errorEmoji}.`)
                else if(userData.lang === "ar") outOfRangeError.setTitle(`تم العثور على الكثير من الوحدات الزمنية, من فضلك كن محددا ${emojisObject.errorEmoji}.`)
                message.reply({embeds: [outOfRangeError]})
            }
        }else{

            //Create an error embed
            const noTimezonesHasBeenFoundErr = new Discord.EmbedBuilder()
            noTimezonesHasBeenFoundErr.setColor(FNBRMENA.Colors("embedError"))
            if(userData.lang === "en") noTimezonesHasBeenFoundErr.setTitle(`Can't find the requested timezone ${emojisObject.errorEmoji}.`)
            else if(userData.lang === "ar") noTimezonesHasBeenFoundErr.setTitle(`لا يمكنني العثور على اسم الوحدة الزمنية المطلوبة ${emojisObject.errorEmoji}.`)
            message.reply({embeds: [noTimezonesHasBeenFoundErr]})
        }
    }
}