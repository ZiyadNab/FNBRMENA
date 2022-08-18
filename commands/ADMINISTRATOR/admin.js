const moment = require('moment')

module.exports = {
    commands: 'admin',
    type: 'Administrators Only',
    minArgs: 0,
    maxArgs: 0,
    cooldown: -1,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (FNBRMENA, message, args, text, Discord, client, admin, userData, alias, emojisObject) => {
        
        //seeting up the db firestore
        var db = await admin.firestore()

        //create an embed
        const adminCommandsEmbed = new Discord.EmbedBuilder()
        adminCommandsEmbed.setColor(FNBRMENA.Colors("embed"))
        if(userData.lang === "en"){
            adminCommandsEmbed.setTitle(`Admin Panel`)
            adminCommandsEmbed.setDescription('This command is for staff only, gives you direct access and full controll to the bot servers. Such enable and disable commands and more.\n\nClick on the drop-down menu to specifiy a task.\n\`You have only 30 seconds until this operation ends, Make it quick\`')
        }else if(userData.lang === "ar"){
            adminCommandsEmbed.setTitle(`لوحة التحكم`)
            adminCommandsEmbed.setDescription('هذا الأمر مخصص لطاقم العمل فقط ، ويمنحك وصولاً مباشرًا وتحكمًا كاملاً في خوادم البوت. مثل أمر تفعيل وتعطيل الأوامر والمزيد.\n\n الرجاء الضغط على السهم لاختيار نوع العملية.\n\n \`لديك 30 ثانية فقط حتى تنتهي هذه العملية ، اجعلها سريعة \`')
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
        
        else if(userData.lang === "ar") buttonDataRow.addComponents(
            new Discord.ButtonBuilder()
            .setCustomId('Cancel')
            .setStyle(Discord.ButtonStyle.Danger)
            .setLabel("اغلاق")
        )
        
        //create a row for drop down menu for categories
        const adminCommandsRow = new Discord.ActionRowBuilder()

        //create a select menu
        const adminCommandsDropMenu = new Discord.SelectMenuBuilder()
        adminCommandsDropMenu.setCustomId('tasks')
        if(userData.lang === "en") adminCommandsDropMenu.setPlaceholder('Select a task!')
        else if(userData.lang === "ar") adminCommandsDropMenu.setPlaceholder('اختر عملية!')
        adminCommandsDropMenu.addOptions(
            {
                label: `Enable/Disable Commands`,
                value: `commandStatus`
            },
            {
                label: `Bot Status`,
                value: `botStatus`
            },
            {
                label: `Events Status`,
                value: `eventsStatus`
            },
            {
                label: `List Commands`,
                value: `showInCommands`
            },
        )

        //add the drop menu to the categoryDropMenu
        adminCommandsRow.addComponents(adminCommandsDropMenu)

        //send the message
        const dropMenuMessage = await message.reply({embeds: [adminCommandsEmbed], components: [adminCommandsRow, buttonDataRow]})

        //filtering the user clicker
        const filter = i => i.user.id === message.author.id

        //await for the user
        await message.channel.awaitMessageComponent({filter, time: 30000})
        .then(async collected => {
            collected.deferUpdate();

            //if cancel button has been clicked
            if(collected.customId === "Cancel") dropMenuMessage.delete()

            //if the user has selected a task
            if(collected.customId === "tasks"){

                //if a user selected commandStatus
                if(collected.values[0] === `commandStatus`){

                    
                }

                //if a user selected showInCommands
                if(collected.values[0] === `showInCommands`){

                    //commands collection
                    const commandsData = await db.collection("Commands").get()

                    //create an embed
                    const chooseCommandEmbed = new Discord.EmbedBuilder()
                    chooseCommandEmbed.setColor(FNBRMENA.Colors("embed"))
                    if(userData.lang === "en"){
                        chooseCommandEmbed.setTitle(`List Commands`)
                        chooseCommandEmbed.setDescription('Click on the drop-down menu to specifiy a command.\n\`You have only 30 seconds until this operation ends, Make it quick\`')
                    }else if(userData.lang === "ar"){
                        chooseCommandEmbed.setTitle(`حالة الأوامر`)
                        chooseCommandEmbed.setDescription('الرجاء الضغط على السهم لاختيار الأمر.\n\n \`لديك 30 ثانية فقط حتى تنتهي هذه العملية ، اجعلها سريعة \`')
                    }

                    const size = commandsData.size / 25, components = []
                    var limit = 0
                    for(let i = 1; i <= size; i++){
                        var commands = [], stored = []

                        for(let x = limit; x < 25 * i; x++){
                            if(commandsData.docs[x].id != undefined) if(!stored.includes(commandsData.docs[x].id)){
                                stored.push(commandsData.docs[x].id)
                                commands.push({
                                    label: `${commandsData.docs[x].id}`,
                                    value: `${commandsData.docs[x].id}`
                                })
                            }
                        }

                        //create a select menu
                        var commandActivationDropMenu = new Discord.SelectMenuBuilder()
                        commandActivationDropMenu.setCustomId(`${i}`)
                        if(userData.lang === "en") commandActivationDropMenu.setPlaceholder('Select a command!')
                        else if(userData.lang === "ar") commandActivationDropMenu.setPlaceholder('اختر امر!')
                        commandActivationDropMenu.addOptions(commands)

                        //add the drop menu to the categoryDropMenu
                        components.push(new Discord.ActionRowBuilder().addComponents(commandActivationDropMenu))
                        limit = 25 * i

                    } components.push(buttonDataRow)

                    //send the message
                    dropMenuMessage.edit({embeds: [chooseCommandEmbed], components: components})

                    //filtering the user clicker
                    const filter = i => i.user.id === message.author.id

                    //await for the user
                    await message.channel.awaitMessageComponent({filter, time: 30000})
                    .then(async collected => {
                        collected.deferUpdate();

                        //if cancel button has been clicked
                        if(collected.customId === "Cancel") dropMenuMessage.delete()
                        else{
                            const commandChosen = collected.values[0]
                            
                            //create an embed
                            const commandStatusEmbed = new Discord.EmbedBuilder()
                            commandStatusEmbed.setColor(FNBRMENA.Colors("embed"))
                            if(userData.lang === "en"){
                                commandStatusEmbed.setTitle(`Commands Status`)
                                commandStatusEmbed.setDescription('Click on enable or disable to change the command status.\n\`You have only 30 seconds until this operation ends, Make it quick\`')
                            }else if(userData.lang === "ar"){
                                commandStatusEmbed.setTitle(`حالة الأوامر`)
                                commandStatusEmbed.setDescription('من فضلك اضغط على تفعيل او تعطيل لتحديث حالة الأمر\n\n \`لديك 30 ثانية فقط حتى تنتهي هذه العملية ، اجعلها سريعة \`')
                            }

                            //add a button row
                            const commandStatusButtonDataRow = new Discord.ActionRowBuilder()
                            
                            //add enable and disable buttons
                            if(userData.lang === "en"){
                                commandStatusButtonDataRow.addComponents(
                                    new Discord.ButtonBuilder()
                                    .setCustomId('Enable')
                                    .setStyle(Discord.ButtonStyle.Success)
                                    .setLabel("Enable")
                                )

                                commandStatusButtonDataRow.addComponents(
                                    new Discord.ButtonBuilder()
                                    .setCustomId('Disable')
                                    .setStyle(Discord.ButtonStyle.Danger)
                                    .setLabel("Disable")
                                )

                                commandStatusButtonDataRow.addComponents(
                                    new Discord.ButtonBuilder()
                                    .setCustomId('Cancel')
                                    .setStyle(Discord.ButtonStyle.Danger)
                                    .setLabel("Cancel")
                                )
                            }
                            
                            else if(userData.lang === "ar"){
                                commandStatusButtonDataRow.addComponents(
                                    new Discord.ButtonBuilder()
                                    .setCustomId('Enable')
                                    .setStyle(Discord.ButtonStyle.Success)
                                    .setLabel("تفعيل")
                                )

                                commandStatusButtonDataRow.addComponents(
                                    new Discord.ButtonBuilder()
                                    .setCustomId('Disable')
                                    .setStyle(Discord.ButtonStyle.Danger)
                                    .setLabel("تعطيل")
                                )

                                commandStatusButtonDataRow.addComponents(
                                    new Discord.ButtonBuilder()
                                    .setCustomId('Cancel')
                                    .setStyle(Discord.ButtonStyle.Danger)
                                    .setLabel("اغلاق")
                                )
                            }

                            // Create the modal and add text fields
                            const commandStatusModal = new Discord.ModalBuilder()
                            commandStatusModal.setCustomId('commandStatus')
                            if(userData.lang === "en"){
                                commandStatusModal.setTitle('Status Reason') //set modal title
                                commandStatusModal.addComponents( // add fields
                                    new Discord.ActionRowBuilder().addComponents(
                                        new Discord.TextInputBuilder()
                                        .setCustomId('reasonEN')
                                        .setLabel("Please type the reason in English.")
                                        .setStyle(Discord.TextInputStyle.Paragraph)
                                    ),
                                    new Discord.ActionRowBuilder().addComponents(
                                        new Discord.TextInputBuilder()
                                        .setCustomId('reasonAR')
                                        .setLabel("Please type the reason in Arabic.")
                                        .setStyle(Discord.TextInputStyle.Paragraph)
                                    )
                                )
                            }else if(userData.lang === "ar"){
                                commandStatusModal.setTitle('سبب تحديث الحالة') //set modal title
                                commandStatusModal.addComponents( // add fields
                                    new Discord.ActionRowBuilder().addComponents(
                                        new Discord.TextInputBuilder()
                                        .setCustomId('reasonEN')
                                        .setLabel("من فضلك اكتب السبب بالانجليزي.")
                                        .setStyle(Discord.TextInputStyle.Short)
                                    ),
                                    new Discord.ActionRowBuilder().addComponents(
                                        new Discord.TextInputBuilder()
                                        .setCustomId('reasonAR')
                                        .setLabel("من فضلك اكتب السبب بالعربي.")
                                        .setStyle(Discord.TextInputStyle.Short)
                                    )
                                )
                            }

                            //edit the message
                            await dropMenuMessage.edit({embeds: [commandStatusEmbed], components: [commandStatusButtonDataRow]})

                            //await for the user
                            await message.channel.awaitMessageComponent({filter, time: 30000})
                            .then(async collected => {

                                //if the user wants to cancel
                                if(collected.customId === "Cancel") dropMenuMessage.delete()
                            })
                        }
                    })
                }

                //if a user selected botStatus
                if(collected.values[0] === `botStatus`){

                    //create an embed
                    const botStatusEmbed = new Discord.EmbedBuilder()
                    botStatusEmbed.setColor(FNBRMENA.Colors("embed"))
                    if(userData.lang === "en"){
                        botStatusEmbed.setTitle(`Bot Status`)
                        botStatusEmbed.setDescription('Click on enable or disable to change the bot status.\n\`You have only 30 seconds until this operation ends, Make it quick\`')
                    }else if(userData.lang === "ar"){
                        botStatusEmbed.setTitle(`حالة البوت`)
                        botStatusEmbed.setDescription('من فضلك اضغط على تفعيل او تعطيل لتحديث حالة البوت\n\n \`لديك 30 ثانية فقط حتى تنتهي هذه العملية ، اجعلها سريعة \`')
                    }

                    //add a button row
                    const botStatusButtonDataRow = new Discord.ActionRowBuilder()
                    
                    //add enable and disable buttons
                    if(userData.lang === "en"){
                        botStatusButtonDataRow.addComponents(
                            new Discord.ButtonBuilder()
                            .setCustomId('Enable')
                            .setStyle(Discord.ButtonStyle.Success)
                            .setLabel("Enable")
                        )

                        botStatusButtonDataRow.addComponents(
                            new Discord.ButtonBuilder()
                            .setCustomId('Disable')
                            .setStyle(Discord.ButtonStyle.Danger)
                            .setLabel("Disable")
                        )

                        botStatusButtonDataRow.addComponents(
                            new Discord.ButtonBuilder()
                            .setCustomId('Cancel')
                            .setStyle(Discord.ButtonStyle.Danger)
                            .setLabel("Cancel")
                        )
                    }
                    
                    else if(userData.lang === "ar"){
                        botStatusButtonDataRow.addComponents(
                            new Discord.ButtonBuilder()
                            .setCustomId('Enable')
                            .setStyle(Discord.ButtonStyle.Success)
                            .setLabel("تفعيل")
                        )

                        botStatusButtonDataRow.addComponents(
                            new Discord.ButtonBuilder()
                            .setCustomId('Disable')
                            .setStyle(Discord.ButtonStyle.Danger)
                            .setLabel("تعطيل")
                        )

                        botStatusButtonDataRow.addComponents(
                            new Discord.ButtonBuilder()
                            .setCustomId('Cancel')
                            .setStyle(Discord.ButtonStyle.Danger)
                            .setLabel("اغلاق")
                        )
                    }

                    //edit the message
                    await dropMenuMessage.edit({embeds: [botStatusEmbed], components: [botStatusButtonDataRow]})

                    //await for the user
                    await message.channel.awaitMessageComponent({filter, time: 30000})
                    .then(async collected => {
                        collected.deferUpdate()

                        //if the user wants to cancel
                        if(collected.customId === "Cancel") dropMenuMessage.delete()

                        //if the user wants to enable the bot
                        if(collected.customId === "Enable"){

                            //turn on the bot
                            await admin.database().ref("ERA's").child("Server").child("Status").set({
                                Bot: true,
                
                            })

                            //successfully updated
                            const statusUpdatedEmbed = new Discord.EmbedBuilder()
                            statusUpdatedEmbed.setColor(FNBRMENA.Colors("embedSuccess"))
                            if(userData.lang === "en") statusUpdatedEmbed.setTitle(`The bot has been turned on ${emojisObject.checkEmoji}`)
                            else if(userData.lang === "ar") statusUpdatedEmbed.setTitle(`تم تفعيل البوت ${emojisObject.checkEmoji}`)
                            dropMenuMessage.edit({embeds: [statusUpdatedEmbed], components: []})
                        }

                        //if the user wants to disable the bot
                        if(collected.customId === "Disable"){

                            //turn off the bot
                            await admin.database().ref("ERA's").child("Server").child("Status").set({
                                Bot: false,
                
                            })

                            //successfully updated
                            const statusUpdatedEmbed = new Discord.EmbedBuilder()
                            statusUpdatedEmbed.setColor(FNBRMENA.Colors("embedSuccess"))
                            if(userData.lang === "en") statusUpdatedEmbed.setTitle(`The bot has been turned off ${emojisObject.checkEmoji}`)
                            else if(userData.lang === "ar") statusUpdatedEmbed.setTitle(`تم ايقاف البوت ${emojisObject.checkEmoji}`)
                            dropMenuMessage.edit({embeds: [statusUpdatedEmbed], components: []})
                        }
                    })
                }

                //if a user selected eventsStatus
                if(collected.values[0] === `eventsStatus`){

                    //create an embed
                    const eventsStatusEmbed = new Discord.EmbedBuilder()
                    eventsStatusEmbed.setColor(FNBRMENA.Colors("embed"))
                    if(userData.lang === "en"){
                        eventsStatusEmbed.setTitle(`Events Status`)
                        eventsStatusEmbed.setDescription('Click on enable or disable to change the bot status.\n\`You have only 30 seconds until this operation ends, Make it quick\`')
                    }else if(userData.lang === "ar"){
                        eventsStatusEmbed.setTitle(`حالة البوت`)
                        eventsStatusEmbed.setDescription('من فضلك اضغط على تفعيل او تعطيل لتحديث حالة البوت\n\n \`لديك 30 ثانية فقط حتى تنتهي هذه العملية ، اجعلها سريعة \`')
                    }

                    //add a button row
                    const botStatusButtonDataRow = new Discord.ActionRowBuilder()
                    
                    //add enable and disable buttons
                    if(userData.lang === "en"){
                        botStatusButtonDataRow.addComponents(
                            new Discord.ButtonBuilder()
                            .setCustomId('Enable')
                            .setStyle(Discord.ButtonStyle.Success)
                            .setLabel("Enable")
                        )

                        botStatusButtonDataRow.addComponents(
                            new Discord.ButtonBuilder()
                            .setCustomId('Disable')
                            .setStyle(Discord.ButtonStyle.Danger)
                            .setLabel("Disable")
                        )

                        botStatusButtonDataRow.addComponents(
                            new Discord.ButtonBuilder()
                            .setCustomId('Cancel')
                            .setStyle(Discord.ButtonStyle.Danger)
                            .setLabel("Cancel")
                        )
                    }
                    
                    else if(userData.lang === "ar"){
                        botStatusButtonDataRow.addComponents(
                            new Discord.ButtonBuilder()
                            .setCustomId('Enable')
                            .setStyle(Discord.ButtonStyle.Success)
                            .setLabel("تفعيل")
                        )

                        botStatusButtonDataRow.addComponents(
                            new Discord.ButtonBuilder()
                            .setCustomId('Disable')
                            .setStyle(Discord.ButtonStyle.Danger)
                            .setLabel("تعطيل")
                        )

                        botStatusButtonDataRow.addComponents(
                            new Discord.ButtonBuilder()
                            .setCustomId('Cancel')
                            .setStyle(Discord.ButtonStyle.Danger)
                            .setLabel("اغلاق")
                        )
                    }

                    //edit the message
                    await dropMenuMessage.edit({embeds: [eventsStatusEmbed], components: [botStatusButtonDataRow]})

                    //await for the user
                    await message.channel.awaitMessageComponent({filter, time: 30000})
                    .then(async collected => {
                        collected.deferUpdate()

                        //if the user wants to cancel
                        if(collected.customId === "Cancel") dropMenuMessage.delete()

                        //if the user wants to enable the bot
                        if(collected.customId === "Enable"){

                            //turn on the bot
                            await admin.database().ref("ERA's").child("Server").child("Status").set({
                                Bot: true,
                
                            })

                            //successfully updated
                            const statusUpdatedEmbed = new Discord.EmbedBuilder()
                            statusUpdatedEmbed.setColor(FNBRMENA.Colors("embedSuccess"))
                            if(userData.lang === "en") statusUpdatedEmbed.setTitle(`The bot has been turned on ${emojisObject.checkEmoji}`)
                            else if(userData.lang === "ar") statusUpdatedEmbed.setTitle(`تم تفعيل البوت ${emojisObject.checkEmoji}`)
                            dropMenuMessage.edit({embeds: [statusUpdatedEmbed], components: []})
                        }

                        //if the user wants to disable the bot
                        if(collected.customId === "Disable"){

                            //turn off the bot
                            await admin.database().ref("ERA's").child("Server").child("Status").set({
                                Bot: false,
                
                            })

                            //successfully updated
                            const statusUpdatedEmbed = new Discord.EmbedBuilder()
                            statusUpdatedEmbed.setColor(FNBRMENA.Colors("embedSuccess"))
                            if(userData.lang === "en") statusUpdatedEmbed.setTitle(`The bot has been turned off ${emojisObject.checkEmoji}`)
                            else if(userData.lang === "ar") statusUpdatedEmbed.setTitle(`تم ايقاف البوت ${emojisObject.checkEmoji}`)
                            dropMenuMessage.edit({embeds: [statusUpdatedEmbed], components: []})
                        }
                    })
                }
            }
        })
    }
}