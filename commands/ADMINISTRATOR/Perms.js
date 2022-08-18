module.exports = {
    commands: 'perms',
    type: 'Administrators Only',
    minArgs: 1,
    maxArgs: 1,
    cooldown: -1,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (FNBRMENA, message, args, text, Discord, client, admin, userData, alias, emojisObject) => {

        //all the discord permissions
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

        //handel user
        const Types = ["add", "delete"]

        //seeting up the db firestore
        const db = await admin.firestore()

        //command data
        const commandData = await db.collection("Commands").doc(text)
        const snapshot = await commandData.get()

        //check if the command is a valid one
        if(snapshot.exists){

            //get all the permissions from the database
            const listCommandPermissions = []
            for(let i = 0; i < snapshot.data()['permissions'].length; i++)
            listCommandPermissions.push(snapshot.data()['permissions'][i])

            //inislizing embed
            const chooseType = new Discord.EmbedBuilder()
            chooseType.setColor(FNBRMENA.Colors("embed"))
            if(userData.lang === "en") chooseType.setDescription(`• 0: Add permissions\n• 1: Remove permissions`)
            else if(userData.lang === "ar") chooseType.setDescription(`• 0: اضافة اذونات\n• 1: حذف اذونات`)

            //filtering
            const filter = m => m.author.id === message.author.id

            //send the reply to the user
            if(userData.lang === "en") reply = "please choose the type from the list above, will stop listen in 20 sec"
            else if(userData.lang === "ar") reply = "الرجاء اختيار النوع من القائمة بالاعلى، سوف ينتهي الامر خلال ٢٠ ثانية"

            //send the reply
            await message.reply({content: reply, embeds: [chooseType]})
            .then( async notify => {

                //await messages
                await message.channel.awaitMessages({filter, max: 1, time: 20000, errors: ['time']})
                .then( async collected => {

                    //delete messages
                    notify.delete()

                    //if the user selected an out of range number
                    if(collected.first().content >= 0 && collected.first().content < Types.length){

                        //add the permission to the command
                        if(Types[collected.first().content] === "add"){

                            //inislizing embed
                            const permissionsEmbed = new Discord.EmbedBuilder()
                            permissionsEmbed.setColor(FNBRMENA.Colors("embed"))

                            //loop throw every valid permission
                            var str = ``
                            for(let i = 0; i < validPermissions.length; i++){
                                if(userData.lang === "en"){
                                    if(listCommandPermissions.includes(validPermissions[i])) str += `• ${i}: ${validPermissions[i]} (Added)\n`
                                    else str += `• ${i}: ${validPermissions[i]} (Not added yet)\n`

                                }else if(userData.lang === "ar"){
                                    if(listCommandPermissions.includes(validPermissions[i])) str += `• ${i}: ${validPermissions[i]} (مضاف مسبقا)\n`
                                    else str += `• ${i}: ${validPermissions[i]} (لم يتم اضافته حتى الأن)\n`

                                }

                            } permissionsEmbed.setDescription(str)

                            //filtering
                            const filter = m => m.author.id === message.author.id

                            //send the reply to the user
                            if(userData.lang === "en") reply = "please choose the permission from the list above, will stop listen in 20 sec"
                            else if(userData.lang === "ar") reply = "الرجاء اختيار الأذن من القائمة بالاعلى، سوف ينتهي الامر خلال ٢٠ ثانية"

                            //send the reply
                            await message.reply({content: reply, embeds: [permissionsEmbed]})
                            .then( async notify => {

                                //await messages
                                await message.channel.awaitMessages({filter, max: 1, time: 20000, errors: ['time']})
                                .then( async collected => {

                                    //deleting messages
                                    notify.delete()

                                    //if the user input in range
                                    if(collected.first().content >= 0 && collected.first().content < validPermissions.length){

                                        if(!listCommandPermissions.includes(validPermissions[collected.first().content])){

                                            //add the permission to listCommandPermissions array
                                            listCommandPermissions.push(validPermissions[collected.first().content])

                                            //update the data in the database
                                            await commandData.update({
                                                'permissions': listCommandPermissions,
                                            })

                                            //create permission has been added embed
                                            const permissionHasBeenAdded = new Discord.EmbedBuilder()
                                            permissionHasBeenAdded.setColor(FNBRMENA.Colors("embedSuccess"))
                                            if(userData.lang === "en") permissionHasBeenAdded.setTitle(`the ${validPermissions[collected.first().content]} permission has been added to the ${text} command successfully ${emojisObject.checkEmoji}`)
                                            else if(userData.lang === "ar") permissionHasBeenAdded.setTitle(`تم اضافة أذن ${validPermissions[collected.first().content]} الى امر ${text} بنجاح ${emojisObject.checkEmoji}`)
                                            message.reply({embeds: [permissionHasBeenAdded]})

                                        }else{

                                            //create permission already added embed
                                            const permissionAlreadyAdded = new Discord.EmbedBuilder()
                                            permissionAlreadyAdded.setColor(FNBRMENA.Colors("embedError"))
                                            if(userData.lang === "en") permissionAlreadyAdded.setTitle(`the ${validPermissions[collected.first().content]} permission is already added to the ${text} command ${emojisObject.errorEmoji}`)
                                            else if(userData.lang === "ar") permissionAlreadyAdded.setTitle(`تم بالفعل اضافة أذن ${validPermissions[collected.first().content]} الى امر ${text} من قبل ${emojisObject.errorEmoji}`)
                                            message.reply({embeds: [permissionAlreadyAdded]})
                                        }

                                    }else{

                                        //create out of range embed
                                        const outOfRangeError = new Discord.EmbedBuilder()
                                        outOfRangeError.setColor(FNBRMENA.Colors("embedError"))
                                        outOfRangeError.setTitle(`${FNBRMENA.Errors("outOfRange", userData.lang)} ${emojisObject.errorEmoji}`)
                                        message.reply({embeds: [outOfRangeError]})
                                        
                                    }
                                }).catch(err => {

                                    //deleting messages
                                    notify.delete()

                                    //time has passed
                                    const timeError = new Discord.EmbedBuilder()
                                    timeError.setColor(FNBRMENA.Colors("embedError"))
                                    timeError.setTitle(`${FNBRMENA.Errors("Time", userData.lang)} ${emojisObject.errorEmoji}`)
                                    message.reply({embeds: [timeError]})
                                })
                            })
                        }

                        //remove a permission from the command
                        if(Types[collected.first().content] === "delete"){

                            //inislizing embed
                            const removePermissionsEmbed = new Discord.EmbedBuilder()
                            removePermissionsEmbed.setColor(FNBRMENA.Colors("embed"))

                            //loop throw every permission
                            var str = ``
                            for(let i = 0; i < listCommandPermissions.length; i++) str += `• ${i}: ${listCommandPermissions[i]}\n`
                            removePermissionsEmbed.setDescription(str)

                            //filtering
                            const filter = m => m.author.id === message.author.id

                            //send the reply to the user
                            if(userData.lang === "en") reply = "please choose the permission from the list above, will stop listen in 20 sec"
                            else if(userData.lang === "ar") reply = "الرجاء اختيار الأذن من القائمة بالاعلى، سوف ينتهي الامر خلال ٢٠ ثانية"

                            //send the reply
                            await message.reply({content: reply, embeds: [removePermissionsEmbed]})
                            .then( async notify => {

                                //await messages
                                await message.channel.awaitMessages({filter, max: 1, time: 20000, errors: ['time']})
                                .then( async collected => {

                                    //deleting messages
                                    notify.delete()

                                    //if the user input in range
                                    if(collected.first().content >= 0 && collected.first().content < listCommandPermissions.length){

                                        //create permission has been removed embed
                                        const permissionHasBeenRemoved = new Discord.EmbedBuilder()
                                        permissionHasBeenRemoved.setColor(FNBRMENA.Colors("embedSuccess"))
                                        if(userData.lang === "en") permissionHasBeenRemoved.setTitle(`the ${listCommandPermissions[collected.first().content]} permission has been removed from the ${text} command successfully ${emojisObject.checkEmoji}`)
                                        else if(userData.lang === "ar") permissionHasBeenRemoved.setTitle(`تم حذف أذن ${listCommandPermissions[collected.first().content]} من امر ${text} بنجاح ${emojisObject.checkEmoji}`)
                                        message.reply({embeds: [permissionHasBeenRemoved]})

                                        //remove the permission from the listCommandPermissions array and update the data
                                        await commandData.update({
                                            'permissions': listCommandPermissions.splice(collected.first().content, 1),
                                        })

                                    }else{

                                        //create out of range embed
                                        const outOfRangeError = new Discord.EmbedBuilder()
                                        outOfRangeError.setColor(FNBRMENA.Colors("embedError"))
                                        outOfRangeError.setTitle(`${FNBRMENA.Errors("outOfRange", userData.lang)} ${emojisObject.errorEmoji}`)
                                        message.reply({embeds: [outOfRangeError]})
                                    }
                                }).catch(err => {

                                    //deleting messages
                                    notify.delete()
            
                                    //time has passed
                                    const timeError = new Discord.EmbedBuilder()
                                    timeError.setColor(FNBRMENA.Colors("embedError"))
                                    timeError.setTitle(`${FNBRMENA.Errors("Time", userData.lang)} ${emojisObject.errorEmoji}`)
                                    message.reply({embeds: [timeError]})
                                })
                            })
                        }
                    }else{

                        //create out of range embed
                        const outOfRangeError = new Discord.EmbedBuilder()
                        outOfRangeError.setColor(FNBRMENA.Colors("embedError"))
                        outOfRangeError.setTitle(`${FNBRMENA.Errors("outOfRange", userData.lang)} ${emojisObject.errorEmoji}`)
                        message.reply({embeds: [outOfRangeError]})
                    }
                }).catch(err => {

                    //deleting messages
                    notify.delete()

                    //time has passed
                    const timeError = new Discord.EmbedBuilder()
                    timeError.setColor(FNBRMENA.Colors("embedError"))
                    timeError.setTitle(`${FNBRMENA.Errors("Time", userData.lang)} ${emojisObject.errorEmoji}`)
                    message.reply({embeds: [timeError]})
                })
            })

        }else{
            
            //create command not found embed
            const commandNotFoundError = new Discord.EmbedBuilder()
            commandNotFoundError.setColor(FNBRMENA.Colors("embedError"))
            if(userData.lang === "en") commandNotFoundError.setTitle(`i couldn't find the ${text} command please specifiy a valid command ${emojisObject.errorEmoji}`)
            else if(userData.lang === "ar") commandNotFoundError.setTitle(`لم اتمكن من العثور على الأمر ${text} الرجاء ادخل اسم امر صحيح ${emojisObject.errorEmoji}`)
            message.reply({embeds: [commandNotFoundError]})
        }
    }
}