module.exports = {
    commands: 'role',
    type: 'Administrators Only',
    minArgs: 1,
    maxArgs: 1,
    cooldown: -1,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (FNBRMENA, message, args, text, Discord, client, admin, alias, errorEmoji, checkEmoji, loadingEmoji, greenStatus, redStatus) => {

        //get the user language from the database
        const lang = await FNBRMENA.Admin(admin, message, "", "Lang")

        //handel user
        const Types = ["add", "delete"]

        //seeting up the db firestore
        const db = await admin.firestore()

        //command data
        const commandData = await db.collection("Commands").doc(text)
        const snapshot = await commandData.get()

        //check if the command is a valid one
        if(snapshot.exists){

            //get all the roles from the database
            const listCommandRoles = []
            for(let i = 0; i < snapshot.data()['roles'].length; i++)
            listCommandRoles.push(snapshot.data()['roles'][i])

            //inislizing embed
            const chooseType = new Discord.MessageEmbed()
            chooseType.setColor(FNBRMENA.Colors("embed"))
            if(lang === "en") chooseType.setDescription(`• 0: Add roles\n• 1: Remove roles`)
            else if(lang === "ar") chooseType.setDescription(`• 0: اضافة رولات\n• 1: حذف رولات`)

            //send the choices
            await message.channel.send({embeds: [chooseType]})
            .then( async list => {

                //filtering
                const filter = m => m.author.id === message.author.id

                //send the reply to the user
                if(lang === "en") reply = "please choose the type from the list above, will stop listen in 20 sec"
                else if(lang === "ar") reply = "الرجاء اختيار النوع من القائمة بالاعلى، سوف ينتهي الامر خلال ٢٠ ثانية"

                //send the reply
                await message.reply({content: reply})
                .then( async notify => {

                    //await messages
                    await message.channel.awaitMessages({filter, max: 1, time: 20000, errors: ['time']})
                    .then( async collected => {

                        //delete messages
                        list.delete()
                        notify.delete()

                        //if the user selected an out of range number
                        if(collected.first().content >= 0 && collected.first().content < Types.length){

                            //add the role to the command
                            if(Types[collected.first().content] === "add"){

                                //list all of the server roles
                                const listRoles = []
                                message.guild.roles.cache.forEach(async role => {
                                    if(role.name.includes("ERA")) listRoles.push(role.name)
                                })

                                //inislizing embed
                                const rolesEmbed = new Discord.MessageEmbed()
                                rolesEmbed.setColor(FNBRMENA.Colors("embed"))

                                //loop throw every role
                                var str = ``
                                for(let i = 0; i < listRoles.length; i++){
                                    if(lang === "en"){
                                        if(listCommandRoles.includes(listRoles[i])) str += `• ${i}: ${listRoles[i]} (Added)\n`
                                        else str += `• ${i}: ${listRoles[i]} (Not added yet)\n`

                                    }else if(lang === "ar"){
                                        if(listCommandRoles.includes(listRoles[i])) str += `• ${i}: ${listRoles[i]} (مضاف مسبقا)\n`
                                        else str += `• ${i}: ${listRoles[i]} (لم يتم اضافته حتى الأن)\n`

                                    }

                                } rolesEmbed.setDescription(str)

                                //send the choices
                                await message.channel.send({embeds: [rolesEmbed]})
                                .then( async list => {

                                    //filtering
                                    const filter = m => m.author.id === message.author.id

                                    //send the reply to the user
                                    if(lang === "en") reply = "please choose the role from the list above, will stop listen in 20 sec"
                                    else if(lang === "ar") reply = "الرجاء اختيار الرول من القائمة بالاعلى، سوف ينتهي الامر خلال ٢٠ ثانية"

                                    //send the reply
                                    await message.reply({content: reply})
                                    .then( async notify => {

                                        //await messages
                                        await message.channel.awaitMessages({filter, max: 1, time: 20000, errors: ['time']})
                                        .then( async collected => {

                                            //deleting messages
                                            list.delete()
                                            notify.delete()

                                            //if the user input in range
                                            if(collected.first().content >= 0 && collected.first().content < listRoles.length){

                                                if(!listCommandRoles.includes(listRoles[collected.first().content])){

                                                    //add the role to listCommandRoles array
                                                    listCommandRoles.push(listRoles[collected.first().content])

                                                    //update the data in the database
                                                    await commandData.update({
                                                        'roles': listCommandRoles,
                                                    })

                                                    //create role has been added embed
                                                    const roleHasBeenAdded = new Discord.MessageEmbed()
                                                    roleHasBeenAdded.setColor(FNBRMENA.Colors("embed"))
                                                    if(lang === "en") roleHasBeenAdded.setTitle(`the ${listRoles[collected.first().content]} role has been added to the ${text} command successfully ${checkEmoji}`)
                                                    else if(lang === "ar") roleHasBeenAdded.setTitle(`تم اضافة رول ${listRoles[collected.first().content]} الى امر ${text} بنجاح ${checkEmoji}`)
                                                    message.reply({embeds: [roleHasBeenAdded]})

                                                }else{

                                                    //create role already added embed
                                                    const roleAlreadyAdded = new Discord.MessageEmbed()
                                                    roleAlreadyAdded.setColor(FNBRMENA.Colors("embed"))
                                                    if(lang === "en") roleAlreadyAdded.setTitle(`the ${listRoles[collected.first().content]} role is already added to the ${text} command ${errorEmoji}`)
                                                    else if(lang === "ar") roleAlreadyAdded.setTitle(`تم بالفعل اضافة رول ${listRoles[collected.first().content]} الى امر ${text} من قبل ${errorEmoji}`)
                                                    message.reply({embeds: [roleAlreadyAdded]})
                                                }

                                            }else{

                                                //create out of range embed
                                                const outOfRangeError = new Discord.MessageEmbed()
                                                outOfRangeError.setColor(FNBRMENA.Colors("embed"))
                                                if(lang === "en") outOfRangeError.setTitle(`Sorry we canceled your process becuase u selected a number out of range ${errorEmoji}`)
                                                else if(lang === "ar") outOfRangeError.setTitle(`تم ايقاف الامر بسبب اختيارك لرقم خارج النطاق ${errorEmoji}`)
                                                message.reply({embeds: [outOfRangeError]})
                                                
                                            }
                                        }).catch(err => {

                                            //deleting messages
                                            list.delete()
                                            notify.delete()

                                            //time has passed
                                            const timeError = new Discord.MessageEmbed()
                                            timeError.setColor(FNBRMENA.Colors("embed"))
                                            timeError.setTitle(`${FNBRMENA.Errors("Time", lang)} ${errorEmoji}`)
                                            message.reply({embeds: [timeError]})
                                        })
                                    })
                                })
                            }

                            //remove a role from the command
                            if(Types[collected.first().content] === "delete"){

                                //inislizing embed
                                const removeRolesEmbed = new Discord.MessageEmbed()
                                removeRolesEmbed.setColor(FNBRMENA.Colors("embed"))

                                //loop throw every role
                                var str = ``
                                for(let i = 0; i < listCommandRoles.length; i++) str += `• ${i}: ${listCommandRoles[i]}\n`
                                removeRolesEmbed.setDescription(str)

                                //send the choices
                                await message.channel.send({embeds: [removeRolesEmbed]})
                                .then( async list => {

                                    //filtering
                                    const filter = m => m.author.id === message.author.id

                                    //send the reply to the user
                                    if(lang === "en") reply = "please choose the role from the list above, will stop listen in 20 sec"
                                    else if(lang === "ar") reply = "الرجاء اختيار الرول من القائمة بالاعلى، سوف ينتهي الامر خلال ٢٠ ثانية"

                                    //send the reply
                                    await message.reply({content: reply})
                                    .then( async notify => {

                                        //await messages
                                        await message.channel.awaitMessages({filter, max: 1, time: 20000, errors: ['time']})
                                        .then( async collected => {

                                            //deleting messages
                                            list.delete()
                                            notify.delete()

                                            //if the user input in range
                                            if(collected.first().content >= 0 && collected.first().content < listCommandRoles.length){

                                                //create role has been removed embed
                                                const roleHasBeenRemoved = new Discord.MessageEmbed()
                                                roleHasBeenRemoved.setColor(FNBRMENA.Colors("embed"))
                                                if(lang === "en") roleHasBeenRemoved.setTitle(`the ${listCommandRoles[collected.first().content]} role has been removed from the ${text} command successfully ${checkEmoji}`)
                                                else if(lang === "ar") roleHasBeenRemoved.setTitle(`تم حذف رول ${listCommandRoles[collected.first().content]} من امر ${text} بنجاح ${checkEmoji}`)
                                                message.reply({embeds: [roleHasBeenRemoved]})

                                                //remove the role from the listCommandRoles array and update the data
                                                await commandData.update({
                                                    'roles': listCommandRoles.splice(collected.first().content, 1),
                                                })

                                            }else{

                                                //create out of range embed
                                                const outOfRangeError = new Discord.MessageEmbed()
                                                outOfRangeError.setColor(FNBRMENA.Colors("embed"))
                                                if(lang === "en") outOfRangeError.setTitle(`Sorry we canceled your process becuase u selected a number out of range ${errorEmoji}`)
                                                else if(lang === "ar") outOfRangeError.setTitle(`تم ايقاف الامر بسبب اختيارك لرقم خارج النطاق ${errorEmoji}`)
                                                message.reply({embeds: [outOfRangeError]})
                                            }
                                        }).catch(err => {

                                            //deleting messages
                                            list.delete()
                                            notify.delete()
                    
                                            //time has passed
                                            const timeError = new Discord.MessageEmbed()
                                            timeError.setColor(FNBRMENA.Colors("embed"))
                                            timeError.setTitle(`${FNBRMENA.Errors("Time", lang)} ${errorEmoji}`)
                                            message.reply({embeds: [timeError]})
                                        })
                                    })
                                })
                            }
                        }else{

                            //create out of range embed
                            const outOfRangeError = new Discord.MessageEmbed()
                            outOfRangeError.setColor(FNBRMENA.Colors("embed"))
                            if(lang === "en") outOfRangeError.setTitle(`Sorry we canceled your process becuase u selected a number out of range ${errorEmoji}`)
                            else if(lang === "ar") outOfRangeError.setTitle(`تم ايقاف الامر بسبب اختيارك لرقم خارج النطاق ${errorEmoji}`)
                            message.reply({embeds: [outOfRangeError]})
                        }

                    }).catch(err => {

                        //deleting messages
                        list.delete()
                        notify.delete()

                        //time has passed
                        const timeError = new Discord.MessageEmbed()
                        timeError.setColor(FNBRMENA.Colors("embed"))
                        timeError.setTitle(`${FNBRMENA.Errors("Time", lang)} ${errorEmoji}`)
                        message.reply({embeds: [timeError]})
                    })
                })
            })
        }else{

            //create command not found embed
            const commandNotFoundError = new Discord.MessageEmbed()
            commandNotFoundError.setColor(FNBRMENA.Colors("embed"))
            if(lang === "en") commandNotFoundError.setTitle(`i couldn't find the ${text} command please specifiy a valid command ${errorEmoji}`)
            else if(lang === "ar") commandNotFoundError.setTitle(`لم اتمكن من العثور على الأمر ${text} الرجاء ادخل اسم امر صحيح ${errorEmoji}`)
            message.reply({embeds: [commandNotFoundError]})
        }
    }
}