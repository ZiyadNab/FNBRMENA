const moment = require('moment')
const Discord = require('discord.js')

module.exports = {
    commands: 'admin',
    type: 'Administrators Only',
    minArgs: 0,
    maxArgs: 0,
    cooldown: -1,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (FNBRMENA, message, args, text, S, client, admin, userData, alias, emojisObject) => {
        
        // Seeting up the db firestore
        var db = await admin.firestore()

        // Create an embed
        const adminCommandEmbed = new Discord.EmbedBuilder()
        adminCommandEmbed.setColor(FNBRMENA.Colors("embed"))
        adminCommandEmbed.setTitle(`Admin Panel`)
        adminCommandEmbed.setDescription('This command is for staff only, gives you direct access and full controll to the bot servers. Such enable and disable commands and more.\n\nClick on the drop-down menu to specifiy a task.\n\`You have only 30 seconds until this operation ends, Make it quick\`')

        // Create a row for cancel button
        const buttonDataRow = new Discord.ActionRowBuilder()
        
        // Add a cancel button
        buttonDataRow.addComponents(
            new Discord.ButtonBuilder()
            .setCustomId('Cancel')
            .setStyle(Discord.ButtonStyle.Danger)
            .setLabel("Cancel")
        )
        
        // Create a row for drop down menu for categories
        const adminCommandsRow = new Discord.ActionRowBuilder()

        // Create a select menu
        const adminCommandsDropMenu = new Discord.SelectMenuBuilder()
        adminCommandsDropMenu.setCustomId('tasks')
        adminCommandsDropMenu.setPlaceholder('Select a task!')
        adminCommandsDropMenu.addOptions(
            {
                label: `Bot Status`,
                value: `botStatus`
            },
            {
                label: `Commands`,
                value: `commands`
            },
            {
                label: `Events Status`,
                value: `eventsStatus`
            },
        )

        // Add the drop menu to the categoryDropMenu
        adminCommandsRow.addComponents(adminCommandsDropMenu)

        // Send the message
        const dropMenuMessage = await message.reply({embeds: [adminCommandEmbed], components: [adminCommandsRow, buttonDataRow]})

        // Filtering the admin clicker
        const filter = (i => {
            return (i.user.id === message.author.id && i.message.id === dropMenuMessage.id && i.guild.id === message.guild.id)
        })

        // Await for the admin
        await message.channel.awaitMessageComponent({filter, time: 30000})
        .then(async collected => {

            // Cancel has been selected
            if(collected.customId === "Cancel") dropMenuMessage.delete()
            else{

                // Bot status has been selected
                if(collected.values[0] === `botStatus`){
                    collected.deferUpdate();

                    // Bot document
                    const serverData = await db.collection("Server").doc(`Data`).get()

                    // Create an embed
                    const botStatusEmbed = new Discord.EmbedBuilder()
                    botStatusEmbed.setColor(FNBRMENA.Colors("embed"))
                    botStatusEmbed.setTitle(`Bot Operations`)
                    botStatusEmbed.setDescription('Please choose what to change bot prefix or status.\n\`You have only 30 seconds until this operation ends, Make it quick\`')

                    // Add a button row
                    const botStatusButtonDataRow = new Discord.ActionRowBuilder()
                                        
                    // Add buttons to the row
                    botStatusButtonDataRow.addComponents(
                        new Discord.ButtonBuilder()
                        .setCustomId('On')
                        .setStyle(Discord.ButtonStyle.Success)
                        .setLabel("Turn On")
                        .setDisabled(serverData.data().bot.status)
                    )

                    botStatusButtonDataRow.addComponents(
                        new Discord.ButtonBuilder()
                        .setCustomId('Off')
                        .setStyle(Discord.ButtonStyle.Primary)
                        .setLabel("Turn Off")
                        .setDisabled(!serverData.data().bot.status)
                    )

                    botStatusButtonDataRow.addComponents(
                        new Discord.ButtonBuilder()
                        .setCustomId('Prefix')
                        .setStyle(Discord.ButtonStyle.Secondary)
                        .setLabel("Prefix")
                    )

                    botStatusButtonDataRow.addComponents(
                        new Discord.ButtonBuilder()
                        .setCustomId('Cancel')
                        .setStyle(Discord.ButtonStyle.Danger)
                        .setLabel("Cancel")
                    )

                    // Edit the message
                    dropMenuMessage.edit({embeds: [botStatusEmbed], components: [botStatusButtonDataRow]})

                    // Await for the admin
                    await message.channel.awaitMessageComponent({filter, time: 30000})
                    .then(async collected => {

                        // Cancel has been selected
                        if(collected.customId === "Cancel") dropMenuMessage.delete()

                        // Turn On has been selected
                        if(collected.customId === "On"){

                            // Update the data
                            await db.collection("Server").doc(`Data`).update({
                                'bot': {
                                    by: message.author.id,
                                    date: moment().toISOString(),
                                    status: true
                                }
                            })

                            // Successfully updated status
                            const statusUpdatedEmbed = new Discord.EmbedBuilder()
                            statusUpdatedEmbed.setColor(FNBRMENA.Colors("embedSuccess"))
                            statusUpdatedEmbed.setTitle(`The bot is now online ${emojisObject.checkEmoji}.`)
                            dropMenuMessage.edit({embeds: [statusUpdatedEmbed], components: []})
                        }

                        // Turn Off has been selected
                        if(collected.customId === "Off"){

                            // Update the data
                            await db.collection("Server").doc(`Data`).update({
                                'bot': {
                                    by: message.author.id,
                                    date: moment().toISOString(),
                                    status: false
                                }
                            })

                            // Successfully updated status
                            const statusUpdatedEmbed = new Discord.EmbedBuilder()
                            statusUpdatedEmbed.setColor(FNBRMENA.Colors("embedSuccess"))
                            statusUpdatedEmbed.setTitle(`The bot is now offline ${emojisObject.checkEmoji}.`)
                            dropMenuMessage.edit({embeds: [statusUpdatedEmbed], components: []})

                        }

                        // Prefix has been selected
                        if(collected.customId === "Prefix"){

                            // Create the modal and add text fields
                            const botPrefixModal = new Discord.ModalBuilder()
                            botPrefixModal.setCustomId(`botPrefix-${message.id}`)
                            botPrefixModal.setTitle('Bot Prefix') // Set modal title
                            botPrefixModal.addComponents( // Add fields
                                new Discord.ActionRowBuilder().addComponents(
                                    new Discord.TextInputBuilder()
                                    .setCustomId('prefix')
                                    .setLabel("Please type the new prefix.")
                                    .setStyle(Discord.TextInputStyle.Short)
                                    .setRequired(true)
                                    .setValue(serverData.data().prefix)
                                )
                            )

                            // showModal
                            collected.showModal(botPrefixModal)

                            // Listen for modal submission
                            const filter = (i => {
                                return i.customId === `botPrefix-${message.id}` && i.user.id === message.author.id && i.guild.id === message.guild.id
                            })
                            await collected.awaitModalSubmit({filter, time: 2 * 60000})
                            .then(async modalCollect => {
                                modalCollect.deferUpdate()

                                // Get admin inputs
                                const newPrefix = modalCollect.fields.getTextInputValue('prefix')

                                // Update the data
                                await db.collection("Server").doc(`Data`).update({
                                    'prefix': newPrefix
                                })

                                // Successfully updated prefix
                                const prefixUpdatedEmbed = new Discord.EmbedBuilder()
                                prefixUpdatedEmbed.setColor(FNBRMENA.Colors("embedSuccess"))
                                prefixUpdatedEmbed.setTitle(`The bot prefix has been changed from ${serverData.data().prefix} to ${newPrefix} ${emojisObject.checkEmoji}.`)
                                dropMenuMessage.edit({embeds: [prefixUpdatedEmbed], components: []})

                            }).catch(err => {
                                FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, dropMenuMessage)
                            })
                        }

                    }).catch(err => {
                        FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, dropMenuMessage)
                    })
                }

                // Events status has been selected
                if(collected.values[0] === `commands`){

                    // Create the modal and add text fields
                    const commandNameModal = new Discord.ModalBuilder()
                    commandNameModal.setCustomId(`commandName-${message.id}`)
                    commandNameModal.setTitle('Command Name') // Set modal title
                    commandNameModal.addComponents( // Add fields
                        new Discord.ActionRowBuilder().addComponents(
                            new Discord.TextInputBuilder()
                            .setCustomId('name')
                            .setLabel("Please type the command name.")
                            .setStyle(Discord.TextInputStyle.Short)
                        )
                    )

                    // showModal
                    collected.showModal(commandNameModal)

                    // Listen for modal submission
                    const filter = (i => {
                        return i.customId === `commandName-${message.id}` && i.user.id === message.author.id && i.guild.id === message.guild.id
                    })
                    await collected.awaitModalSubmit({filter, time: 2 * 60000})
                    .then(async modalCollect => {
                        modalCollect.deferUpdate();

                        // Command document
                        const commandData = await db.collection("Commands").doc(`${modalCollect.fields.getTextInputValue('name').toLowerCase()}`).get()

                        // Check if the command given is already exists 
                        if(commandData.exists){

                            // Command name
                            const commandName = commandData.data().aliases[0].charAt(0).toUpperCase() + commandData.data().aliases[0].slice(1);

                            // Create an embed
                            const chooseOperationEmbed = new Discord.EmbedBuilder()
                            chooseOperationEmbed.setColor(FNBRMENA.Colors("embed"))
                            chooseOperationEmbed.setTitle(`Command Operations, ${commandName}`)
                            chooseOperationEmbed.setDescription('Click on the drop-down menu to specifiy an operation.\n\`You have only 30 seconds until this operation ends, Make it quick\`')

                            // Create a row for drop down menu for categories
                            const chooseOperationRow = new Discord.ActionRowBuilder()

                            // Create a select menu
                            const chooseOperationDropMenu = new Discord.SelectMenuBuilder()
                            chooseOperationDropMenu.setCustomId('Operations')
                            chooseOperationDropMenu.setPlaceholder('Select an operation!')
                            chooseOperationDropMenu.addOptions(
                                {
                                    label: `Command Overview`,
                                    value: `overview`
                                },
                                {
                                    label: `Command Status`,
                                    value: `status`
                                },
                                {
                                    label: `Show In Commands`,
                                    value: `appearance`
                                },
                                {
                                    label: `Ban/Unban a User`,
                                    value: `banUnban`
                                },
                                {
                                    label: `Cooldown`,
                                    value: `cooldown`
                                },
                                {
                                    label: `Premium`,
                                    value: `premium`
                                },
                                {
                                    label: `Roles`,
                                    value: `roles`
                                },
                            )

                            // Add the drop menu to the row
                            chooseOperationRow.addComponents(chooseOperationDropMenu)

                            // Edit the message
                            dropMenuMessage.edit({embeds: [chooseOperationEmbed], components: [chooseOperationRow, buttonDataRow]})

                            // Filtering the admin clicker
                            const filter = (i => {
                                return (i.user.id === message.author.id && i.message.id === dropMenuMessage.id && i.guild.id === message.guild.id)
                            })

                            // Await for the admin
                            await message.channel.awaitMessageComponent({filter, time: 30000})
                            .then(async collected => {
                                collected.deferUpdate();

                                // Cancel has been selected
                                if(collected.customId === "Cancel") dropMenuMessage.delete()
                                else{

                                    // Overview has been selected
                                    if(collected.values[0] === "overview"){

                                        // showInCommands
                                        if(commandData.data().commandData.showInCommands) var showInCommands = `Yes, it is`
                                        else var showInCommands = `No, it is hidden`

                                        // Premium
                                        if(commandData.data().commandData.premium) var premium = `Yes, it is`
                                        else var premium = `No, it is not`

                                        // Cooldown
                                        var cooldown = `Servers Cooldown: ${(commandData.data().commandData.cooldown.serversCooldown !== -1) ? `${commandData.data().commandData.cooldown.serversCooldown}s` : `0s`}\nFiles Cooldown: ${(commandData.data().commandData.cooldown.filesCooldown !== -1) ? `${commandData.data().commandData.cooldown.filesCooldown}s` : `0s`}\nCooldown Source: ${commandData.data().commandData.cooldown.filesSource ? "Files" : "Servers"}`

                                        // Command Status
                                        if(commandData.data().commandData.commandStatus.status) var commandStatus = `\`ACTIVE\` ${emojisObject.uncommon}`
                                        else var commandStatus = `Status: \`Diabled\` ${emojisObject.marvel}\nBy: \`${commandData.data().commandData.commandStatus.by}\`\nDate: \`${moment(commandData.data().commandData.commandStatus.date).format("dddd, MMMM Do of YYYY")}\`\nEnglish Reason: \`${(commandData.data().commandData.commandStatus.reasonEN !== null) ? `${commandData.data().commandData.commandStatus.reasonEN}` : `No reason has been specified`}\`\Arabic Reason: \`${(commandData.data().commandData.commandStatus.reasonAR !== null) ? `${commandData.data().commandData.commandStatus.reasonAR}` : `No reason has been specified`}\``

                                        // Create an embed
                                        const commandOverviewEmbed = new Discord.EmbedBuilder()
                                        commandOverviewEmbed.setColor(FNBRMENA.Colors("embed"))
                                        commandOverviewEmbed.setTitle(`${commandName} Command Overview`)
                                        commandOverviewEmbed.addFields(
                                            {name: "Aliases", value: `\`${commandData.data().aliases}\``, inline: true},
                                            {name: "Type", value: `\`${commandData.data().commandData.type}\``, inline: true},
                                            {name: "Show In Commands", value: `\`${showInCommands}\``, inline: true},
                                            {name: "Premium", value: `\`${premium}\``, inline: true},
                                            {name: "Cooldown", value: `\`${cooldown}\``, inline: true},
                                            {name: "Command Status", value: commandStatus, inline: true},
                                        )
                                        commandOverviewEmbed.setFooter({text: `Command Added ${moment().diff(moment(commandData.data().added), 'days')} Days Ago`})

                                        // Edit the message
                                        dropMenuMessage.edit({embeds: [commandOverviewEmbed], components: []})
                                    }
                                    
                                    // Status has been selected
                                    if(collected.values[0] === "status"){

                                        // Create an embed
                                        const commandStatusEmbed = new Discord.EmbedBuilder()
                                        commandStatusEmbed.setColor(FNBRMENA.Colors("embed"))
                                        commandStatusEmbed.setTitle(`Commands Status, ${commandName}`)
                                        commandStatusEmbed.setDescription('Click on enable or disable to change the command status.\n\`You have only 30 seconds until this operation ends, Make it quick\`')

                                        // Add a button row
                                        const commandStatusButtonDataRow = new Discord.ActionRowBuilder()
                                        
                                        // Add enable and disable buttons
                                        commandStatusButtonDataRow.addComponents(
                                            new Discord.ButtonBuilder()
                                            .setCustomId('Enable')
                                            .setStyle(Discord.ButtonStyle.Success)
                                            .setLabel("Enable")
                                        )

                                        commandStatusButtonDataRow.addComponents(
                                            new Discord.ButtonBuilder()
                                            .setCustomId('Disable')
                                            .setStyle(Discord.ButtonStyle.Primary)
                                            .setLabel("Disable")
                                        )

                                        commandStatusButtonDataRow.addComponents(
                                            new Discord.ButtonBuilder()
                                            .setCustomId('Cancel')
                                            .setStyle(Discord.ButtonStyle.Danger)
                                            .setLabel("Cancel")
                                        )

                                        // Create the modal and add text fields
                                        const commandStatusModal = new Discord.ModalBuilder()
                                        commandStatusModal.setCustomId(`commandStatus-${message.id}`)
                                        commandStatusModal.setTitle('Status Reason') // Set modal title
                                        commandStatusModal.addComponents( // add fields
                                            new Discord.ActionRowBuilder().addComponents(
                                                new Discord.TextInputBuilder()
                                                .setCustomId('reasonEN')
                                                .setLabel("Please type the reason in English.")
                                                .setStyle(Discord.TextInputStyle.Paragraph)
                                                .setRequired(false)
                                                .setValue(commandData.data().commandData.commandStatus.reasonEN ? commandData.data().commandData.commandStatus.reasonEN : "")
                                            ),
                                            new Discord.ActionRowBuilder().addComponents(
                                                new Discord.TextInputBuilder()
                                                .setCustomId('reasonAR')
                                                .setLabel("Please type the reason in Arabic.")
                                                .setStyle(Discord.TextInputStyle.Paragraph)
                                                .setRequired(false)
                                                .setValue(commandData.data().commandData.commandStatus.reasonAR ? commandData.data().commandData.commandStatus.reasonAR : "")
                                            )
                                        )

                                        // Edit the message
                                        dropMenuMessage.edit({embeds: [commandStatusEmbed], components: [commandStatusButtonDataRow]})

                                        // Await for the admin
                                        await message.channel.awaitMessageComponent({filter, time: 5 * 60000})
                                        .then(async collected => {

                                            // If the admin wants to cancel
                                            if(collected.customId === "Cancel") dropMenuMessage.delete()

                                            // If the admin wants to enable a command
                                            if(collected.customId === "Enable"){
                                                collected.deferUpdate();
                                                        
                                                // Update the data
                                                await db.collection("Commands").doc(`${commandName.toLowerCase()}`).update({
                                                    'commandData.commandStatus': {
                                                        status: true,
                                                        by: message.author.id,
                                                        date: moment().toISOString(),
                                                        reasonEN: commandData.data().commandData.commandStatus.reasonEN,
                                                        reasonAR: commandData.data().commandData.commandStatus.reasonAR,
                                                    }
                                                })

                                                // Successfully updated
                                                const statusUpdatedEmbed = new Discord.EmbedBuilder()
                                                statusUpdatedEmbed.setColor(FNBRMENA.Colors("embedSuccess"))
                                                statusUpdatedEmbed.setTitle(`The ${commandName} command has been enabled successfully ${emojisObject.checkEmoji}`)
                                                dropMenuMessage.edit({embeds: [statusUpdatedEmbed], components: []})
                                            }

                                            // If the admin wants to disable a command
                                            if(collected.customId === "Disable"){

                                                // Show modal
                                                collected.showModal(commandStatusModal)

                                                // Listen for modal submission
                                                const filter = (i => {
                                                    return i.customId === `commandStatus-${message.id}` && i.user.id === message.author.id && i.guild.id === message.guild.id
                                                })
                                                await collected.awaitModalSubmit({filter, time: 2 * 60000})
                                                .then(async modalCollect => {
                                                    modalCollect.deferUpdate();

                                                    // Get admin inputs
                                                    var reasonEN = await modalCollect.fields.getTextInputValue('reasonEN')
                                                    var reasonAR = await modalCollect.fields.getTextInputValue('reasonAR')

                                                    if(reasonEN == "") reasonEN = null
                                                    if(reasonAR == "") reasonAR = null

                                                    // Change moment language
                                                    moment.locale("en")

                                                    // Update the data
                                                    await db.collection("Commands").doc(`${commandName.toLowerCase()}`).update({
                                                        'commandData.commandStatus': {
                                                            status: false,
                                                            by: message.author.id,
                                                            date: moment().toISOString(),
                                                            reasonEN: reasonEN,
                                                            reasonAR: reasonAR,
                                                        }
                                                    })

                                                    // Successfully updated
                                                    const statusUpdatedEmbed = new Discord.EmbedBuilder()
                                                    statusUpdatedEmbed.setColor(FNBRMENA.Colors("embedSuccess"))
                                                    statusUpdatedEmbed.setTitle(`The ${commandName} command has been disabled successfully ${emojisObject.checkEmoji}`)
                                                    dropMenuMessage.edit({embeds: [statusUpdatedEmbed], components: []})
                                                    
                                                }).catch(err => {
                                                    FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, dropMenuMessage)
                                                })
                                            }
                                        }).catch(err => {
                                            FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, dropMenuMessage)
                                        })
                                    }
 
                                    // Appearance has been selected
                                    if(collected.values[0] === "appearance"){

                                        // Create an embed
                                        const commandStatusEmbed = new Discord.EmbedBuilder()
                                        commandStatusEmbed.setColor(FNBRMENA.Colors("embed"))
                                        commandStatusEmbed.setTitle(`Show in Commands, ${commandName}`)
                                        commandStatusEmbed.setDescription('Click on show or hide to change appearance in commands.\n\`You have only 30 seconds until this operation ends, Make it quick\`')

                                        // Add a button row
                                        const appearanceButtonDataRow = new Discord.ActionRowBuilder()
                                        
                                        // Add enable and disable buttons
                                        appearanceButtonDataRow.addComponents(
                                            new Discord.ButtonBuilder()
                                            .setCustomId('Show')
                                            .setStyle(Discord.ButtonStyle.Success)
                                            .setLabel("Show")
                                        )

                                        appearanceButtonDataRow.addComponents(
                                            new Discord.ButtonBuilder()
                                            .setCustomId('Hide')
                                            .setStyle(Discord.ButtonStyle.Primary)
                                            .setLabel("Hide")
                                        )

                                        appearanceButtonDataRow.addComponents(
                                            new Discord.ButtonBuilder()
                                            .setCustomId('Cancel')
                                            .setStyle(Discord.ButtonStyle.Danger)
                                            .setLabel("Cancel")
                                        )

                                        // Edit the message
                                        dropMenuMessage.edit({embeds: [commandStatusEmbed], components: [appearanceButtonDataRow]})

                                        // Await for the admin
                                        await message.channel.awaitMessageComponent({filter, time: 30000})
                                        .then(async collected => {

                                            // Cancel has been selected
                                            if(collected.customId === "Cancel") dropMenuMessage.delete()

                                            // Show has been selected
                                            if(collected.customId === "Show"){
                            
                                                // Update the data
                                                await db.collection("Commands").doc(`${commandName.toLowerCase()}`).update({
                                                    'commandData.showInCommands': true
                                                })

                                                // Successfully updated
                                                const showInCommandsUpdatedEmbed = new Discord.EmbedBuilder()
                                                showInCommandsUpdatedEmbed.setColor(FNBRMENA.Colors("embedSuccess"))
                                                showInCommandsUpdatedEmbed.setTitle(`The ${commandName} command is now visible in commands list ${emojisObject.checkEmoji}.`)
                                                dropMenuMessage.edit({embeds: [showInCommandsUpdatedEmbed], components: []})
                                            }

                                            // Hide has been selected
                                            if(collected.customId === "Hide"){

                                                // Update the data
                                                await db.collection("Commands").doc(`${commandName.toLowerCase()}`).update({
                                                    'commandData.showInCommands': false
                                                })

                                                // Successfully updated
                                                const showInCommandsUpdatedEmbed = new Discord.EmbedBuilder()
                                                showInCommandsUpdatedEmbed.setColor(FNBRMENA.Colors("embedSuccess"))
                                                showInCommandsUpdatedEmbed.setTitle(`The ${commandName} command is now invisible in commands list ${emojisObject.checkEmoji}.`)
                                                dropMenuMessage.edit({embeds: [showInCommandsUpdatedEmbed], components: []})
                                                
                                            }

                                        }).catch(err => {
                                            FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, null)
                                        })
                                    }

                                    // Ban/Unban a User has been selected
                                    if(collected.values[0] === "banUnban"){

                                        // Create an embed
                                        const banUnbanEmbed = new Discord.EmbedBuilder()
                                        banUnbanEmbed.setColor(FNBRMENA.Colors("embed"))
                                        banUnbanEmbed.setTitle(`Ban Or Unban A User, ${commandName}`)
                                        banUnbanEmbed.setDescription('Click on ban or unban to edit.\n\`You have only 30 seconds until this operation ends, Make it quick\`')

                                        // Add a button row
                                        const banUnbanButtonDataRow = new Discord.ActionRowBuilder()
                                        
                                        // Add ban, unban and cancel buttons
                                        banUnbanButtonDataRow.addComponents(
                                            new Discord.ButtonBuilder()
                                            .setCustomId('Ban')
                                            .setStyle(Discord.ButtonStyle.Success)
                                            .setLabel("Ban A User")
                                        )

                                        banUnbanButtonDataRow.addComponents(
                                            new Discord.ButtonBuilder()
                                            .setCustomId('Unban')
                                            .setStyle(Discord.ButtonStyle.Primary)
                                            .setLabel("Unban A User")
                                        )

                                        banUnbanButtonDataRow.addComponents(
                                            new Discord.ButtonBuilder()
                                            .setCustomId('Cancel')
                                            .setStyle(Discord.ButtonStyle.Danger)
                                            .setLabel("Cancel")
                                        )

                                        // Create the modal and add text fields
                                        const banAUserModal = new Discord.ModalBuilder()
                                        banAUserModal.setCustomId(`banAUser-${message.id}`)
                                        banAUserModal.setTitle('Ban A User') // Set modal title
                                        banAUserModal.addComponents( // add fields
                                            new Discord.ActionRowBuilder().addComponents(
                                                new Discord.TextInputBuilder()
                                                .setCustomId('userId')
                                                .setLabel("Please type the user id.")
                                                .setPlaceholder("User ID...")
                                                .setStyle(Discord.TextInputStyle.Short)
                                                .setRequired(true)
                                            ),
                                            new Discord.ActionRowBuilder().addComponents(
                                                new Discord.TextInputBuilder()
                                                .setCustomId('reasonEN')
                                                .setLabel("Please type the reason in English.")
                                                .setPlaceholder("Leave empty if there is no reason...")
                                                .setStyle(Discord.TextInputStyle.Paragraph)
                                                .setRequired(false)
                                            ),
                                            new Discord.ActionRowBuilder().addComponents(
                                                new Discord.TextInputBuilder()
                                                .setCustomId('reasonAR')
                                                .setLabel("Please type the reason in Arabic.")
                                                .setPlaceholder("Leave empty if there is no reason...")
                                                .setStyle(Discord.TextInputStyle.Paragraph)
                                                .setRequired(false)
                                            )
                                        )

                                        // Create the modal and add text fields
                                        const unbanAUserModal = new Discord.ModalBuilder()
                                        unbanAUserModal.setCustomId(`unbanAUser-${message.id}`)
                                        unbanAUserModal.setTitle('Unban A User') // Set modal title
                                        unbanAUserModal.addComponents( // add fields
                                            new Discord.ActionRowBuilder().addComponents(
                                                new Discord.TextInputBuilder()
                                                .setCustomId('userId')
                                                .setLabel("Please type the user id.")
                                                .setPlaceholder("User ID...")
                                                .setStyle(Discord.TextInputStyle.Short)
                                                .setRequired(true)
                                            )
                                        )

                                        // Edit the message
                                        dropMenuMessage.edit({embeds: [banUnbanEmbed], components: [banUnbanButtonDataRow]})

                                        // Await for the admin
                                        await message.channel.awaitMessageComponent({filter, time: 5 * 60000})
                                        .then(async collected => {

                                            // Cancel has been selected
                                            if(collected.customId === "Cancel") dropMenuMessage.delete()

                                            // Ban has been selected
                                            if(collected.customId === "Ban"){

                                                // Show modal
                                                collected.showModal(banAUserModal)

                                                // Listen for modal submission
                                                const filter = (i => {
                                                    return i.customId === `banAUser-${message.id}` && i.user.id === message.author.id && i.guild.id === message.guild.id
                                                })
                                                await collected.awaitModalSubmit({filter, time: 2 * 60000})
                                                .then(async modalCollect => {
                                                    modalCollect.deferUpdate();

                                                    // Get admin inputs
                                                    var userId = await modalCollect.fields.getTextInputValue('userId')
                                                    var reasonEN = await modalCollect.fields.getTextInputValue('reasonEN')
                                                    var reasonAR = await modalCollect.fields.getTextInputValue('reasonAR')

                                                    // Check inputs
                                                    if(reasonEN == "") reasonEN = null
                                                    if(reasonAR == "") reasonAR = null

                                                    // Change moment language
                                                    moment.locale("en")

                                                    // Update the data
                                                    await db.collection("Commands").doc(`${commandName.toLowerCase()}`).collection(`usersBanned`).doc(`${userId}`).set({
                                                        by: message.author.id,
                                                        date: moment().toISOString(),
                                                        reasonEN: reasonEN,
                                                        reasonAR: reasonAR
                                                    })

                                                    // Successfully banned the user
                                                    const userBannedSuccessfullyEmbed = new Discord.EmbedBuilder()
                                                    userBannedSuccessfullyEmbed.setColor(FNBRMENA.Colors("embedSuccess"))
                                                    userBannedSuccessfullyEmbed.setTitle(`The user has been banned from using ${commandName} command successfully ${emojisObject.checkEmoji}.`)
                                                    dropMenuMessage.edit({embeds: [userBannedSuccessfullyEmbed], components: []})
                                                    
                                                }).catch(err => {
                                                    FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, dropMenuMessage)
                                                })
                                            }

                                            // Unban has been selected
                                            if(collected.customId === "Unban"){

                                                // Show modal
                                                collected.showModal(unbanAUserModal)

                                                // Listen for modal submission
                                                const filter = (i => {
                                                    return i.customId === `unbanAUser-${message.id}` && i.user.id === message.author.id && i.guild.id === message.guild.id
                                                })
                                                await collected.awaitModalSubmit({filter, time: 2 * 60000})
                                                .then(async modalCollect => {
                                                    modalCollect.deferUpdate();

                                                    // Get admin inputs
                                                    var userId = await modalCollect.fields.getTextInputValue('userId')

                                                    // Change moment language
                                                    moment.locale("en")

                                                    // Update the data
                                                    const user = await db.collection("Commands").doc(`${commandName.toLowerCase()}`).collection(`usersBanned`).doc(`${userId}`).get()
                                                    if(user.exists){

                                                        // Delete the document
                                                        await db.collection("Commands").doc(`${commandName.toLowerCase()}`).collection(`usersBanned`).doc(`${userId}`).delete()

                                                        // Successfully unbanned the user
                                                        const userUnBannedSuccessfullyEmbed = new Discord.EmbedBuilder()
                                                        userUnBannedSuccessfullyEmbed.setColor(FNBRMENA.Colors("embedSuccess"))
                                                        userUnBannedSuccessfullyEmbed.setTitle(`The user has been unbanned from using ${commandName} command successfully ${emojisObject.checkEmoji}.`)
                                                        dropMenuMessage.edit({embeds: [userUnBannedSuccessfullyEmbed], components: []})
                                                    }else{

                                                        // User ID not found in database
                                                        const userIDNotFoundEmbed = new Discord.EmbedBuilder()
                                                        userIDNotFoundEmbed.setColor(FNBRMENA.Colors("embedError"))
                                                        userIDNotFoundEmbed.setTitle(`Cannot find a user in ${commandName} ban list with the given user ID ${emojisObject.errorEmoji}.`)
                                                        dropMenuMessage.edit({embeds: [userIDNotFoundEmbed], components: []})
                                                    }
                                                    
                                                }).catch(err => {
                                                    FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, dropMenuMessage)
                                                })
                                            }

                                        }).catch(err => {
                                            FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, dropMenuMessage)
                                        })
                                    }

                                    // Premium has been selected
                                    if(collected.values[0] === "premium"){

                                        // Create an embed
                                        const banUnbanEmbed = new Discord.EmbedBuilder()
                                        banUnbanEmbed.setColor(FNBRMENA.Colors("embed"))
                                        banUnbanEmbed.setTitle(`Set Or Delete Premium Access, ${commandName}`)
                                        banUnbanEmbed.setDescription('Click on premium or remove to edit the command exclusivity.\n\`You have only 30 seconds until this operation ends, Make it quick\`')

                                        // Add a button row
                                        const banUnbanButtonDataRow = new Discord.ActionRowBuilder()
                                        
                                        // Add ban, unban and cancel buttons
                                        banUnbanButtonDataRow.addComponents(
                                            new Discord.ButtonBuilder()
                                            .setCustomId('Premium')
                                            .setStyle(Discord.ButtonStyle.Success)
                                            .setLabel("Premium")
                                        )

                                        banUnbanButtonDataRow.addComponents(
                                            new Discord.ButtonBuilder()
                                            .setCustomId('Remove')
                                            .setStyle(Discord.ButtonStyle.Primary)
                                            .setLabel("Remove")
                                        )

                                        banUnbanButtonDataRow.addComponents(
                                            new Discord.ButtonBuilder()
                                            .setCustomId('Cancel')
                                            .setStyle(Discord.ButtonStyle.Danger)
                                            .setLabel("Cancel")
                                        )

                                        // Edit the message
                                        dropMenuMessage.edit({embeds: [banUnbanEmbed], components: [banUnbanButtonDataRow]})

                                        // Await for the admin
                                        await message.channel.awaitMessageComponent({filter, time: 5 * 60000})
                                        .then(async collected => {

                                            // Cancel has been selected
                                            if(collected.customId === "Cancel") dropMenuMessage.delete()

                                            // Premium has been selected
                                            if(collected.customId === "Premium"){

                                                // Update the data
                                                await db.collection("Commands").doc(`${commandName.toLowerCase()}`).update({
                                                    'commandData.premium': true
                                                })

                                                // Successfully updated
                                                const premiumUpdatedEmbed = new Discord.EmbedBuilder()
                                                premiumUpdatedEmbed.setColor(FNBRMENA.Colors("embedSuccess"))
                                                premiumUpdatedEmbed.setTitle(`The ${commandName} command is now only for premium users ${emojisObject.checkEmoji}.`)
                                                dropMenuMessage.edit({embeds: [premiumUpdatedEmbed], components: []})
                                            }

                                            // Remove has been selected
                                            if(collected.customId === "Remove"){

                                                // Update the data
                                                await db.collection("Commands").doc(`${commandName.toLowerCase()}`).update({
                                                    'commandData.premium': false
                                                })

                                                // Successfully updated
                                                const premiumUpdatedEmbed = new Discord.EmbedBuilder()
                                                premiumUpdatedEmbed.setColor(FNBRMENA.Colors("embedSuccess"))
                                                premiumUpdatedEmbed.setTitle(`The ${commandName} command is now for everyone to use ${emojisObject.checkEmoji}.`)
                                                dropMenuMessage.edit({embeds: [premiumUpdatedEmbed], components: []})
                                            }

                                        }).catch(err => {
                                            FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, dropMenuMessage)
                                        })
                                    }

                                    // Cooldown has been selected
                                    if(collected.values[0] === "cooldown"){

                                        // Create an embed
                                        const commandCooldownEmbed = new Discord.EmbedBuilder()
                                        commandCooldownEmbed.setColor(FNBRMENA.Colors("embed"))
                                        commandCooldownEmbed.setTitle(`Current Cooldown Settings, ${commandName}`)
                                        commandCooldownEmbed.setDescription('Click on edit to change the cooldown for a command.\n\`You have only 30 seconds until this operation ends, Make it quick\`')
                                        commandCooldownEmbed.addFields(
                                            {
                                                name: `Files Cooldown`,
                                                value: `\`${(commandData.data().commandData.cooldown.filesCooldown !== -1) ? `${commandData.data().commandData.cooldown.filesCooldown}s` : `0s`}\``
                                            },
                                            {
                                                name: `Servers Cooldown`,
                                                value: `\`${(commandData.data().commandData.cooldown.serversCooldown !== -1) ? `${commandData.data().commandData.cooldown.serversCooldown}s` : `0s`}\``
                                            },
                                            {
                                                name: `Cooldown Source`,
                                                value: `\`${commandData.data().commandData.cooldown.filesSource ? `Files` : `Servers`}\``
                                            }
                                        )

                                        // Add a button row
                                        const cooldownButtonDataRow = new Discord.ActionRowBuilder()
                                        
                                        // Add edit and cancel buttons
                                        cooldownButtonDataRow.addComponents(
                                            new Discord.ButtonBuilder()
                                            .setCustomId('Edit')
                                            .setStyle(Discord.ButtonStyle.Success)
                                            .setLabel("Edit")
                                        )

                                        cooldownButtonDataRow.addComponents(
                                            new Discord.ButtonBuilder()
                                            .setCustomId('Cancel')
                                            .setStyle(Discord.ButtonStyle.Danger)
                                            .setLabel("Cancel")
                                        )

                                        // Create the modal and add text fields
                                        const commandCooldownModal = new Discord.ModalBuilder()
                                        commandCooldownModal.setCustomId(`commandCooldown-${message.id}`)
                                        commandCooldownModal.setTitle('Command Cooldown') // Set modal title
                                        commandCooldownModal.addComponents( // add fields
                                            new Discord.ActionRowBuilder().addComponents(
                                                new Discord.TextInputBuilder()
                                                .setCustomId('cooldown')
                                                .setLabel("Please type the cooldown in seconds.")
                                                .setStyle(Discord.TextInputStyle.Short)
                                                .setRequired(true)
                                                .setValue((commandData.data().commandData.cooldown.serversCooldown !== -1) ? `${commandData.data().commandData.cooldown.serversCooldown}` : `0`)
                                            ),
                                            new Discord.ActionRowBuilder().addComponents(
                                                new Discord.TextInputBuilder()
                                                .setCustomId('source')
                                                .setLabel("Please type the cooldown source.")
                                                .setStyle(Discord.TextInputStyle.Short)
                                                .setRequired(true)
                                                .setValue(`Servers`)
                                            )
                                        )

                                        // Edit the message
                                        dropMenuMessage.edit({embeds: [commandCooldownEmbed], components: [cooldownButtonDataRow]})

                                        // Await for the admin
                                        await message.channel.awaitMessageComponent({filter, time: 60000})
                                        .then(async collected => {

                                            // Cancel has been selected
                                            if(collected.customId === "Cancel") dropMenuMessage.delete()

                                            // Show has been selected
                                            if(collected.customId === "Edit"){
                            
                                                // Show modal
                                                collected.showModal(commandCooldownModal)

                                                // Listen for modal submission
                                                const filter = (i => {
                                                    return i.customId === `commandCooldown-${message.id}` && i.user.id === message.author.id && i.guild.id === message.guild.id
                                                })
                                                await collected.awaitModalSubmit({filter, time: 2 * 60000})
                                                .then(async modalCollect => {
                                                    modalCollect.deferUpdate();

                                                    // Get admin inputs
                                                    var cooldown = await modalCollect.fields.getTextInputValue('cooldown')
                                                    var source = await modalCollect.fields.getTextInputValue('source')

                                                    // Input checks
                                                    if(isNaN(cooldown)){

                                                        // Not Valid Cooldown
                                                        const incorrectCooldownEmbed = new Discord.EmbedBuilder()
                                                        incorrectCooldownEmbed.setColor(FNBRMENA.Colors("embedError"))
                                                        incorrectCooldownEmbed.setTitle(`Cooldowns must be a number, provide a such ${emojisObject.errorEmoji}.`)
                                                        dropMenuMessage.edit({embeds: [incorrectCooldownEmbed], components: []})
                                                        return
                                                    }

                                                    // Input checks
                                                    if(source.toLowerCase() !== `servers` && source.toLowerCase() !== `files`){

                                                        // Not Valid Source
                                                        const incorrectSourceEmbed = new Discord.EmbedBuilder()
                                                        incorrectSourceEmbed.setColor(FNBRMENA.Colors("embedError"))
                                                        incorrectSourceEmbed.setTitle(`The valid sorces are files or servers only ${emojisObject.errorEmoji}.`)
                                                        dropMenuMessage.edit({embeds: [incorrectSourceEmbed], components: []})
                                                        return
                                                    }

                                                    // Update the data
                                                    await db.collection("Commands").doc(`${commandName.toLowerCase()}`).update({
                                                        'commandData.cooldown': {
                                                            filesCooldown: commandData.data().commandData.cooldown.filesCooldown,
                                                            filesSource: (source.toLowerCase() === `servers`) ? false : true,
                                                            serversCooldown: cooldown
                                                        }
                                                    })

                                                    // Successfully updated
                                                    const statusUpdatedEmbed = new Discord.EmbedBuilder()
                                                    statusUpdatedEmbed.setColor(FNBRMENA.Colors("embedSuccess"))
                                                    statusUpdatedEmbed.setTitle(`The ${commandName} cooldown has been changed successfully ${emojisObject.checkEmoji}.`)
                                                    dropMenuMessage.edit({embeds: [statusUpdatedEmbed], components: []})
                                                    
                                                }).catch(err => {
                                                    FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, dropMenuMessage)
                                                })
                                                
                                            }

                                        }).catch(err => {
                                            FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, dropMenuMessage)
                                        })
                                    }

                                    // Roles has been selected
                                    if(collected.values[0] === "roles"){

                                        // Create an embed
                                        const addRolesEmbed = new Discord.EmbedBuilder()
                                        addRolesEmbed.setColor(FNBRMENA.Colors("embed"))
                                        addRolesEmbed.setTitle(`Roles, ${commandName}`)
                                        addRolesEmbed.setDescription('Click on add a role or remove to start.\n\`You have only 30 seconds until this operation ends, Make it quick\`')

                                        // Add a button row
                                        const addRolesButtonDataRow = new Discord.ActionRowBuilder()
                                        
                                        // Add buttons to the row
                                        addRolesButtonDataRow.addComponents(
                                            new Discord.ButtonBuilder()
                                            .setCustomId('Add')
                                            .setStyle(Discord.ButtonStyle.Success)
                                            .setLabel("Add a Role")
                                        )

                                        addRolesButtonDataRow.addComponents(
                                            new Discord.ButtonBuilder()
                                            .setCustomId('Remove')
                                            .setStyle(Discord.ButtonStyle.Primary)
                                            .setLabel("Remove a Role")
                                            .setDisabled((commandData.data().commandData.roles.length === 0 ? true : false))
                                        )

                                        addRolesButtonDataRow.addComponents(
                                            new Discord.ButtonBuilder()
                                            .setCustomId('List')
                                            .setStyle(Discord.ButtonStyle.Secondary)
                                            .setLabel("List All Roles")
                                            .setDisabled((commandData.data().commandData.roles.length === 0 ? true : false))
                                        )

                                        addRolesButtonDataRow.addComponents(
                                            new Discord.ButtonBuilder()
                                            .setCustomId('Cancel')
                                            .setStyle(Discord.ButtonStyle.Danger)
                                            .setLabel("Cancel")
                                        )

                                        // Create the modal and add text fields
                                        const addRolesModal = new Discord.ModalBuilder()
                                        addRolesModal.setCustomId('roles')
                                        addRolesModal.setTitle(`Manage A Role For ${commandName}`) // Set modal title
                                        addRolesModal.addComponents( // Add fields
                                            new Discord.ActionRowBuilder().addComponents(
                                                new Discord.TextInputBuilder()
                                                .setCustomId('roleID')
                                                .setLabel("Please enter the role id and submit")
                                                .setStyle(Discord.TextInputStyle.Short)
                                            )
                                        )

                                        // Edit the message
                                        dropMenuMessage.edit({embeds: [addRolesEmbed], components: [addRolesButtonDataRow]})

                                        // Await for the admin
                                        await message.channel.awaitMessageComponent({filter, time: 30000})
                                        .then(async collected => {

                                            // Cancel has been selected
                                            if(collected.customId === "Cancel") dropMenuMessage.delete()

                                            // Add has been selected
                                            if(collected.customId === "Add"){
                                                collected.showModal(addRolesModal) // Show modal

                                                // Listen for modal submission
                                                const modalFilter = (interaction) => interaction.customId === 'roles';
                                                await collected.awaitModalSubmit({modalFilter, time: 2 * 60000})
                                                .then(async modalCollect => {
                                                    modalCollect.deferUpdate();
                                                    
                                                    // Check if the given role id does exist
                                                    if(message.guild.roles.cache.has(modalCollect.fields.getTextInputValue('roleID'))){

                                                        // Get the existing roles from database
                                                        const serversRoles = commandData.data().commandData.roles
                                                        serversRoles.push(modalCollect.fields.getTextInputValue('roleID'))

                                                        // Update the data
                                                        await db.collection("Commands").doc(`${commandName.toLowerCase()}`).update({
                                                            'commandData.roles': serversRoles
                                                        })

                                                        // Successfully updated
                                                        const rolesUpdatedEmbed = new Discord.EmbedBuilder()
                                                        rolesUpdatedEmbed.setColor(FNBRMENA.Colors("embedSuccess"))
                                                        rolesUpdatedEmbed.setTitle(`The ${message.guild.roles.cache.get(modalCollect.fields.getTextInputValue('roleID')).name} has been added successfully ${emojisObject.checkEmoji}.`)
                                                        dropMenuMessage.edit({embeds: [rolesUpdatedEmbed], components: []})

                                                    }else{

                                                        // Wrong role id provided error
                                                        const wrongRoleIdError = new Discord.EmbedBuilder()
                                                        wrongRoleIdError.setColor(FNBRMENA.Colors("embedError"))
                                                        wrongRoleIdError.setTitle(`The ${modalCollect.fields.getTextInputValue('roleID')} role id doesn't exists ${emojisObject.errorEmoji}.`)
                                                        dropMenuMessage.edit({embeds: [wrongRoleIdError], components: []})
                                                    }
                                                    
                                                }).catch(err => {
                                                    FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, dropMenuMessage)
                                                })
                                            }

                                            // Remove has been selected
                                            if(collected.customId === "Remove"){
                                                collected.showModal(addRolesModal) // Show modal

                                                // Listen for modal submission
                                                const modalFilter = (interaction) => interaction.customId === 'roles';
                                                await collected.awaitModalSubmit({modalFilter, time: 2 * 60000})
                                                .then(async modalCollect => {
                                                    modalCollect.deferUpdate()
                                                    
                                                    // Check if the given role id does exist
                                                    if(message.guild.roles.cache.has(modalCollect.fields.getTextInputValue('roleID'))){

                                                        // Get the existing roles from database
                                                        const serversRoles = await commandData.data().commandData.roles
                                                        serversRoles.splice(serversRoles.findIndex(ids => {
                                                            return ids === modalCollect.fields.getTextInputValue('roleID')
                                                        }), 1)

                                                        // Update the data
                                                        await db.collection("Commands").doc(`${commandName.toLowerCase()}`).update({
                                                            'commandData.roles': serversRoles
                                                        })

                                                        // Successfully updated
                                                        const rolesUpdatedEmbed = new Discord.EmbedBuilder()
                                                        rolesUpdatedEmbed.setColor(FNBRMENA.Colors("embedSuccess"))
                                                        rolesUpdatedEmbed.setTitle(`The ${message.guild.roles.cache.get(modalCollect.fields.getTextInputValue('roleID')).name} has been removed successfully ${emojisObject.checkEmoji}.`)
                                                        dropMenuMessage.edit({embeds: [rolesUpdatedEmbed], components: []})

                                                    }else{

                                                        // Wrong role id provided error
                                                        const wrongRoleIdError = new Discord.EmbedBuilder()
                                                        wrongRoleIdError.setColor(FNBRMENA.Colors("embedError"))
                                                        wrongRoleIdError.setTitle(`The ${modalCollect.fields.getTextInputValue('roleID')} role id doesn't exists ${emojisObject.errorEmoji}.`)
                                                        dropMenuMessage.edit({embeds: [wrongRoleIdError], components: []})
                                                    }
                                                })
                                            }

                                            // List has been selected
                                            if(collected.customId === "List"){

                                                // Get the existing roles from database
                                                const serversRoles = await commandData.data().commandData.roles

                                                let string = ``
                                                for(const role of serversRoles){
                                                    if(message.guild.roles.cache.has(role)) string += `${message.guild.roles.cache.get(role).name} --> ${role}\n`
                                                }

                                                // List all roles
                                                const listAllRolesEmbed = new Discord.EmbedBuilder()
                                                listAllRolesEmbed.setColor(FNBRMENA.Colors("embed"))
                                                listAllRolesEmbed.setTitle(`All Roles, ${commandName}`)
                                                listAllRolesEmbed.setDescription(`Here is all the roles that are assigned to ${commandName} command\n\n${string}`)
                                                dropMenuMessage.edit({embeds: [listAllRolesEmbed], components: []})
                                            }

                                        }).catch(err => {
                                            FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, dropMenuMessage)
                                        })
                                    }
                                    
                                }
                            }).catch(err => {
                                FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, dropMenuMessage)
                            })
                        }else{

                            // Command not found
                            const commandNotFoundEmbed = new Discord.EmbedBuilder()
                            commandNotFoundEmbed.setColor(FNBRMENA.Colors("embedError"))
                            commandNotFoundEmbed.setTitle(`Command not found ${emojisObject.errorEmoji}.`)
                            dropMenuMessage.edit({embeds: [commandNotFoundEmbed], components: []})
                        }
                    }).catch(err => {
                        FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, dropMenuMessage)
                    })
                }

                // Bot status has been selected
                if(collected.values[0] === `eventsStatus`){
                    collected.deferUpdate();

                    // Create an embed
                    const eventsStatusEmbed = new Discord.EmbedBuilder()
                    eventsStatusEmbed.setColor(FNBRMENA.Colors("embed"))
                    eventsStatusEmbed.setTitle(`Events Status`)
                    eventsStatusEmbed.setDescription('Please choose an operation.\n\`You have only 30 seconds until this operation ends, Make it quick\`')

                    // Add a button row
                    const eventsStatusButtonDataRow = new Discord.ActionRowBuilder()
                                        
                    // Add buttons to the row
                    eventsStatusButtonDataRow.addComponents(
                        new Discord.ButtonBuilder()
                        .setCustomId('Edit')
                        .setStyle(Discord.ButtonStyle.Success)
                        .setLabel("Edit")
                    )

                    eventsStatusButtonDataRow.addComponents(
                        new Discord.ButtonBuilder()
                        .setCustomId('View')
                        .setStyle(Discord.ButtonStyle.Primary)
                        .setLabel("View")
                    )

                    eventsStatusButtonDataRow.addComponents(
                        new Discord.ButtonBuilder()
                        .setCustomId('Cancel')
                        .setStyle(Discord.ButtonStyle.Danger)
                        .setLabel("Cancel")
                    )

                    // Edit the message
                    dropMenuMessage.edit({embeds: [eventsStatusEmbed], components: [eventsStatusButtonDataRow]})

                    // Await for the admin
                    await message.channel.awaitMessageComponent({filter, time: 30000})
                    .then(async collected => {
                        collected.deferUpdate();

                        // Cancel has been selected
                        if(collected.customId === "Cancel") dropMenuMessage.delete()

                        // Edit has been selected
                        if(collected.customId === "Edit"){

                            // Request data
                            FNBRMENA.Admin(admin, message, "", "Events")
                            .then(async res => {

                                // Create an embed
                                const eventsListEmbed = new Discord.EmbedBuilder()
                                eventsListEmbed.setColor(FNBRMENA.Colors("embed"))
                                eventsListEmbed.setTitle(`Events List`)
                                eventsListEmbed.setDescription('Please choose an event from the Drop-Down menu.\n\`You have only 30 seconds until this operation ends, Make it quick\`')

                                // Add a button row
                                const eventsListButtonDataRow = new Discord.ActionRowBuilder()
                                                    
                                // Add buttons to the row
                                eventsListButtonDataRow.addComponents(
                                    new Discord.ButtonBuilder()
                                    .setCustomId('Cancel')
                                    .setStyle(Discord.ButtonStyle.Danger)
                                    .setLabel("Cancel")
                                )

                                // Loop through every event
                                var size = (Object.keys(res).length / 25), components = [], limit = 0
                                if(size % 2 !== 0 && size != 1){
                                    size += 1;
                                    size = size | 0
                                }
                                for(let i = 1; i <= size; i++){

                                    // Loop through every event
                                    var eventsListOptions = []
                                    for(let x = limit; x < 25 * i; x++){

                                        // Nullptr checker
                                        if(Object.keys(res)[x] != undefined){

                                            // Add the choice option
                                            eventsListOptions.push({
                                                label: res[Object.keys(res)[x]].name,
                                                emoji: (res[Object.keys(res)[x]].Active ? `${emojisObject.uncommon.name}:${emojisObject.uncommon.id}` : `${emojisObject.marvel.name}:${emojisObject.marvel.id}`),
                                                value: `${x}`,
                                            })
                                        }
                                    }

                                    // Create a select menu
                                    var eventsListDropMenu = new Discord.SelectMenuBuilder()
                                    eventsListDropMenu.setCustomId(`${i}`)
                                    eventsListDropMenu.setPlaceholder(`Select an event!`)
                                    eventsListDropMenu.addOptions(eventsListOptions)

                                    // Add the drop menu to the row
                                    components.push(new Discord.ActionRowBuilder().addComponents(eventsListDropMenu))
                                    limit = 25 * i

                                } components.push(eventsListButtonDataRow)

                                // Edit the message
                                dropMenuMessage.edit({embeds: [eventsListEmbed], components: components})

                                // Await for the admin
                                await message.channel.awaitMessageComponent({filter, time: 30000})
                                .then(async collected => {
                                    collected.deferUpdate();

                                    // Cancel has been selected
                                    if(collected.customId === "Cancel") dropMenuMessage.delete()
                                    else{

                                        // Get the event ID
                                        const eventID = Object.keys(res)[collected.values[0]]

                                        // Create an embed
                                        const eventOperationEmbed = new Discord.EmbedBuilder()
                                        eventOperationEmbed.setColor(FNBRMENA.Colors("embed"))
                                        eventOperationEmbed.setTitle(`Event Operations, ${res[Object.keys(res)[collected.values[0]]].name}`)
                                        eventOperationEmbed.setDescription('Please choose an operation to perform.\n\`You have only 30 seconds until this operation ends, Make it quick\`')

                                        // Add a button row
                                        const eventOperationButtonDataRow = new Discord.ActionRowBuilder()
                                                            
                                        // Add buttons to the row
                                        eventOperationButtonDataRow.addComponents(
                                            new Discord.ButtonBuilder()
                                            .setCustomId('Status')
                                            .setStyle(Discord.ButtonStyle.Success)
                                            .setLabel("Status")
                                        )
                                        eventOperationButtonDataRow.addComponents(
                                            new Discord.ButtonBuilder()
                                            .setCustomId('Push')
                                            .setStyle(Discord.ButtonStyle.Primary)
                                            .setLabel("Push")
                                            .setDisabled(res[Object.keys(res)[collected.values[0]]].Push === undefined)
                                        )
                                        eventOperationButtonDataRow.addComponents(
                                            new Discord.ButtonBuilder()
                                            .setCustomId('Language')
                                            .setStyle(Discord.ButtonStyle.Secondary)
                                            .setLabel("Language")
                                            .setDisabled(res[Object.keys(res)[collected.values[0]]].Lang === undefined)
                                        )
                                        eventOperationButtonDataRow.addComponents(
                                            new Discord.ButtonBuilder()
                                            .setCustomId('Role')
                                            .setStyle(Discord.ButtonStyle.Secondary)
                                            .setLabel("Role")
                                            .setDisabled(res[Object.keys(res)[collected.values[0]]].Role === undefined)
                                        )
                                        eventOperationButtonDataRow.addComponents(
                                            new Discord.ButtonBuilder()
                                            .setCustomId('Cancel')
                                            .setStyle(Discord.ButtonStyle.Danger)
                                            .setLabel("Cancel")
                                        )

                                        // Edit the message
                                        dropMenuMessage.edit({embeds: [eventOperationEmbed], components: [eventOperationButtonDataRow]})

                                        // Await for the admin
                                        await message.channel.awaitMessageComponent({filter, time: 30000})
                                        .then(async collected => {
                                            collected.deferUpdate();

                                            // Cancel has been selected
                                            if(collected.customId === "Cancel") dropMenuMessage.delete()

                                            // Status has been selected
                                            if(collected.customId === "Status"){

                                                // Create an embed
                                                const eventStatusEmbed = new Discord.EmbedBuilder()
                                                eventStatusEmbed.setColor(FNBRMENA.Colors("embed"))
                                                eventStatusEmbed.setTitle(`Event Status, ${res[eventID].name}`)
                                                eventStatusEmbed.setDescription('Please choose an operation to perform.\n\`You have only 30 seconds until this operation ends, Make it quick\`')

                                                // Add a button row
                                                const eventStatusButtonDataRow = new Discord.ActionRowBuilder()

                                                // Add buttons to the row
                                                eventStatusButtonDataRow.addComponents(
                                                    new Discord.ButtonBuilder()
                                                    .setCustomId('On')
                                                    .setStyle(Discord.ButtonStyle.Success)
                                                    .setLabel("Turn On")
                                                    .setDisabled(res[eventID].Active)
                                                )
                                                eventStatusButtonDataRow.addComponents(
                                                    new Discord.ButtonBuilder()
                                                    .setCustomId('Off')
                                                    .setStyle(Discord.ButtonStyle.Primary)
                                                    .setLabel("Turn Off")
                                                    .setDisabled(!res[eventID].Active)
                                                )
                                                eventStatusButtonDataRow.addComponents(
                                                    new Discord.ButtonBuilder()
                                                    .setCustomId('Cancel')
                                                    .setStyle(Discord.ButtonStyle.Danger)
                                                    .setLabel("Cancel")
                                                )

                                                // Edit the message
                                                dropMenuMessage.edit({embeds: [eventStatusEmbed], components: [eventStatusButtonDataRow]})

                                                // Await for the admin
                                                await message.channel.awaitMessageComponent({filter, time: 30000})
                                                .then(async collected => {
                                                    collected.deferUpdate();

                                                    // Cancel has been selected
                                                    if(collected.customId === "Cancel") dropMenuMessage.delete()

                                                    // Turn On has been selected
                                                    if(collected.customId === "On"){

                                                        // Change the event status
                                                        admin.database().ref("ERA's").child("Events").child(eventID).update({
                                                            Active: true
                                                        })

                                                        // Successfully updated
                                                        const eventStatusUpdatedEmbed = new Discord.EmbedBuilder()
                                                        eventStatusUpdatedEmbed.setColor(FNBRMENA.Colors("embedSuccess"))
                                                        eventStatusUpdatedEmbed.setTitle(`The ${res[eventID].name} has been added turned on successfully ${emojisObject.checkEmoji}.`)
                                                        dropMenuMessage.edit({embeds: [eventStatusUpdatedEmbed], components: []})
                                                    }

                                                    // Turn Off has been selected
                                                    if(collected.customId === "Off"){

                                                        // Change the event status
                                                        admin.database().ref("ERA's").child("Events").child(eventID).update({
                                                            Active: false
                                                        })

                                                        // Successfully updated
                                                        const eventStatusUpdatedEmbed = new Discord.EmbedBuilder()
                                                        eventStatusUpdatedEmbed.setColor(FNBRMENA.Colors("embedSuccess"))
                                                        eventStatusUpdatedEmbed.setTitle(`The ${res[eventID].name} has been added turned off successfully ${emojisObject.checkEmoji}.`)
                                                        dropMenuMessage.edit({embeds: [eventStatusUpdatedEmbed], components: []})
                                                    }

                                                }).catch(err => {
                                                    FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, null)
                                                })
                                            }

                                            // Push has been selected
                                            if(collected.customId === "Push"){

                                                // Get the type of the push field
                                                if(typeof res[eventID].Push === "boolean"){

                                                    // Change the event push status
                                                    admin.database().ref("ERA's").child("Events").child(eventID).update({
                                                        Push: true
                                                    })
                                                }else{

                                                    // Change the event push status
                                                    admin.database().ref("ERA's").child("Events").child(eventID).child("Push").update({
                                                        Status: true
                                                    })
                                                }

                                                // Successfully updated
                                                const eventStatusUpdatedEmbed = new Discord.EmbedBuilder()
                                                eventStatusUpdatedEmbed.setColor(FNBRMENA.Colors("embedSuccess"))
                                                eventStatusUpdatedEmbed.setTitle(`The ${res[eventID].name} has been pushed successfully, Please wait until next rotaion ${emojisObject.checkEmoji}.`)
                                                dropMenuMessage.edit({embeds: [eventStatusUpdatedEmbed], components: []})
                                            }

                                            // Language has been selected
                                            if(collected.customId === "Language"){

                                                // Create an embed
                                                const eventLanguageEmbed = new Discord.EmbedBuilder()
                                                eventLanguageEmbed.setColor(FNBRMENA.Colors("embed"))
                                                eventLanguageEmbed.setTitle(`Event Language, ${res[eventID].name}`)
                                                eventLanguageEmbed.setDescription('Please choose an operation to perform.\n\`You have only 30 seconds until this operation ends, Make it quick\`')

                                                // Add a button row
                                                const eventLanguageButtonDataRow = new Discord.ActionRowBuilder()

                                                // Add buttons to the row
                                                eventLanguageButtonDataRow.addComponents(
                                                    new Discord.ButtonBuilder()
                                                    .setCustomId('Ar')
                                                    .setStyle(Discord.ButtonStyle.Success)
                                                    .setLabel("Arabic")
                                                    .setEmoji('🇸🇦')
                                                    .setDisabled(res[eventID].Lang === "ar")
                                                )
                                                eventLanguageButtonDataRow.addComponents(
                                                    new Discord.ButtonBuilder()
                                                    .setCustomId('En')
                                                    .setStyle(Discord.ButtonStyle.Primary)
                                                    .setLabel("English")
                                                    .setEmoji('🇺🇸')
                                                    .setDisabled(res[eventID].Lang === "en")
                                                )
                                                eventLanguageButtonDataRow.addComponents(
                                                    new Discord.ButtonBuilder()
                                                    .setCustomId('Cancel')
                                                    .setStyle(Discord.ButtonStyle.Danger)
                                                    .setLabel("Cancel")
                                                )

                                                // Edit the message
                                                dropMenuMessage.edit({embeds: [eventLanguageEmbed], components: [eventLanguageButtonDataRow]})

                                                // Await for the admin
                                                await message.channel.awaitMessageComponent({filter, time: 30000})
                                                .then(async collected => {
                                                    collected.deferUpdate();

                                                    // Cancel has been selected
                                                    if(collected.customId === "Cancel") dropMenuMessage.delete()

                                                    // Arabic has been selected
                                                    if(collected.customId === "Ar"){

                                                        // Change the event language
                                                        admin.database().ref("ERA's").child("Events").child(eventID).update({
                                                            Lang: 'ar'
                                                        })

                                                        // Successfully updated
                                                        const eventLanguageUpdatedEmbed = new Discord.EmbedBuilder()
                                                        eventLanguageUpdatedEmbed.setColor(FNBRMENA.Colors("embedSuccess"))
                                                        eventLanguageUpdatedEmbed.setTitle(`The ${res[eventID].name} language has been changed to Arabic successfully ${emojisObject.checkEmoji}.`)
                                                        dropMenuMessage.edit({embeds: [eventLanguageUpdatedEmbed], components: []})
                                                    }

                                                    // English has been selected
                                                    if(collected.customId === "En"){

                                                        // Change the event language
                                                        admin.database().ref("ERA's").child("Events").child(eventID).update({
                                                            Lang: 'en'
                                                        })

                                                        // Successfully updated
                                                        const eventLanguageUpdatedEmbed = new Discord.EmbedBuilder()
                                                        eventLanguageUpdatedEmbed.setColor(FNBRMENA.Colors("embedSuccess"))
                                                        eventLanguageUpdatedEmbed.setTitle(`The ${res[eventID].name} language has been changed to English successfully ${emojisObject.checkEmoji}.`)
                                                        dropMenuMessage.edit({embeds: [eventLanguageUpdatedEmbed], components: []})
                                                    }

                                                }).catch(err => {
                                                    FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, null)
                                                })
                                            }

                                            // Role has been selected
                                            if(collected.customId === "Role"){

                                                // Create an embed
                                                const eventRoleEmbed = new Discord.EmbedBuilder()
                                                eventRoleEmbed.setColor(FNBRMENA.Colors("embed"))
                                                eventRoleEmbed.setTitle(`Event Role, ${res[eventID].name}`)
                                                eventRoleEmbed.setDescription('Please choose an operation to perform.\n\`You have only 30 seconds until this operation ends, Make it quick\`')

                                                // Add a button row
                                                const eventRoleButtonDataRow = new Discord.ActionRowBuilder()

                                                // Add buttons to the row
                                                eventRoleButtonDataRow.addComponents(
                                                    new Discord.ButtonBuilder()
                                                    .setCustomId('On')
                                                    .setStyle(Discord.ButtonStyle.Success)
                                                    .setLabel("Turn On")
                                                    .setDisabled(res[eventID].Role.Status)
                                                )
                                                eventRoleButtonDataRow.addComponents(
                                                    new Discord.ButtonBuilder()
                                                    .setCustomId('Off')
                                                    .setStyle(Discord.ButtonStyle.Primary)
                                                    .setLabel("Turn Off")
                                                    .setDisabled(!res[eventID].Role.Status)
                                                )
                                                eventRoleButtonDataRow.addComponents(
                                                    new Discord.ButtonBuilder()
                                                    .setCustomId('Id')
                                                    .setStyle(Discord.ButtonStyle.Secondary)
                                                    .setLabel("Edit Role ID")
                                                )
                                                eventRoleButtonDataRow.addComponents(
                                                    new Discord.ButtonBuilder()
                                                    .setCustomId('Cancel')
                                                    .setStyle(Discord.ButtonStyle.Danger)
                                                    .setLabel("Cancel")
                                                )

                                                // Edit the message
                                                dropMenuMessage.edit({embeds: [eventRoleEmbed], components: [eventRoleButtonDataRow]})

                                                // Await for the admin
                                                await message.channel.awaitMessageComponent({filter, time: 30000})
                                                .then(async collected => {

                                                    // Cancel has been selected
                                                    if(collected.customId === "Cancel") dropMenuMessage.delete()

                                                    // Turn On has been selected
                                                    if(collected.customId === "On"){
                                                        collected.deferUpdate();

                                                        // Change the event role status
                                                        admin.database().ref("ERA's").child("Events").child(eventID).child("Role").update({
                                                            Status: true
                                                        })

                                                        // Successfully updated
                                                        const eventRoleUpdatedEmbed = new Discord.EmbedBuilder()
                                                        eventRoleUpdatedEmbed.setColor(FNBRMENA.Colors("embedSuccess"))
                                                        eventRoleUpdatedEmbed.setTitle(`Role ping for ${res[eventID].name} event has been successfully turned on ${emojisObject.checkEmoji}.`)
                                                        dropMenuMessage.edit({embeds: [eventRoleUpdatedEmbed], components: []})
                                                    }

                                                    // Turn Off has been selected
                                                    if(collected.customId === "Off"){
                                                        collected.deferUpdate();

                                                        // Change the event role status
                                                        admin.database().ref("ERA's").child("Events").child(eventID).child("Role").update({
                                                            Status: false
                                                        })

                                                        // Successfully updated
                                                        const eventRoleUpdatedEmbed = new Discord.EmbedBuilder()
                                                        eventRoleUpdatedEmbed.setColor(FNBRMENA.Colors("embedSuccess"))
                                                        eventRoleUpdatedEmbed.setTitle(`Role ping for ${res[eventID].name} event has been successfully turned off ${emojisObject.checkEmoji}.`)
                                                        dropMenuMessage.edit({embeds: [eventRoleUpdatedEmbed], components: []})
                                                    }

                                                    // Role ID Edit has been selected
                                                    if(collected.customId === "Id"){

                                                        // Create the modal and add text fields
                                                        const eventRoleIdModal = new Discord.ModalBuilder()
                                                        eventRoleIdModal.setCustomId(`eventRoleId-${message.id}`)
                                                        eventRoleIdModal.setTitle('Event Role ID') // Set modal title
                                                        eventRoleIdModal.addComponents( // Add fields
                                                            new Discord.ActionRowBuilder().addComponents(
                                                                new Discord.TextInputBuilder()
                                                                .setCustomId('roleID')
                                                                .setLabel("Please type the role ID.")
                                                                .setStyle(Discord.TextInputStyle.Short)
                                                                .setRequired(true)
                                                                .setValue(res[eventID].Role.roleID)
                                                            )
                                                        )

                                                        // showModal
                                                        collected.showModal(eventRoleIdModal)

                                                        // Listen for modal submission
                                                        const filter = (i => {
                                                            return i.customId === `eventRoleId-${message.id}` && i.user.id === message.author.id && i.guild.id === message.guild.id
                                                        })
                                                        await collected.awaitModalSubmit({filter, time: 2 * 60000})
                                                        .then(async modalCollect => {
                                                            modalCollect.deferUpdate();

                                                            // Get admin inputs
                                                            const roleID = modalCollect.fields.getTextInputValue('roleID')

                                                            // Check if the role exsists
                                                            if(message.guild.roles.cache.has(roleID)){

                                                                // Change the event role id
                                                                admin.database().ref("ERA's").child("Events").child(eventID).child("Role").update({
                                                                    roleID: roleID
                                                                })

                                                                // Successfully updated
                                                                const eventRoleIDUpdatedEmbed = new Discord.EmbedBuilder()
                                                                eventRoleIDUpdatedEmbed.setColor(FNBRMENA.Colors("embedSuccess"))
                                                                eventRoleIDUpdatedEmbed.setTitle(`Role id for ${res[eventID].name} event has been updated successfully ${emojisObject.checkEmoji}.`)
                                                                dropMenuMessage.edit({embeds: [eventRoleIDUpdatedEmbed], components: []})
                                                            }else{

                                                                // Not valid role id
                                                                const notValidRoleIDEmbed = new Discord.EmbedBuilder()
                                                                notValidRoleIDEmbed.setColor(FNBRMENA.Colors("embedError"))
                                                                notValidRoleIDEmbed.setTitle(`Not valid role ID ${emojisObject.errorEmoji}.`)
                                                                dropMenuMessage.edit({embeds: [notValidRoleIDEmbed], components: []})
                                                            }

                                                        }).catch(err => {
                                                            FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, null)
                                                        })
                                                    }

                                                }).catch(err => {
                                                    FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, null)
                                                })
                                            }

                                        }).catch(err => {
                                            FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, null)
                                        })
                                    }

                                }).catch(err => {
                                    FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, null)
                                })

                            }).catch(err => {
                                FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, null)
                            })

                        }

                        // View has been selected
                        if(collected.customId === "View"){

                            // Request data from the database
                            FNBRMENA.Admin(admin, message, "", "Events")
                            .then(async res => {

                                // Create an embed
                                const eventsOverviewEmbed = new Discord.EmbedBuilder()
                                eventsOverviewEmbed.setColor(FNBRMENA.Colors("embed"))
                                
                                // Loop through every event
                                for(let i = 0; i < Object.keys(res).length; i++){

                                    // Create a string
                                    var str = ``

                                    // Set the event name
                                    str += `Event: \`${res[Object.keys(res)[i]].name}\`\n`

                                    // Check if the event has role field
                                    if(res[Object.keys(res)[i]].Role){

                                        // Set the event role status
                                        str += `Role Status: \`${res[Object.keys(res)[i]].Role.Status ? `ENABLED` : `DISABLED`}\`\n`
                                        str += `ID: \`${res[Object.keys(res)[i]].Role.roleID}\`\n`

                                    }else str += `Role: \`No data...\`\n`

                                    // Set the event language
                                    if(res[Object.keys(res)[i]].Lang === "en") str += `Language: :flag_us:`
                                    else if(res[Object.keys(res)[i]].Lang === "ar") str += `Language: :flag_sa:`

                                    // Add event field
                                    eventsOverviewEmbed.addFields(
                                        {
                                            name: `Status ${(res[Object.keys(res)[i]].Active ? emojisObject.uncommon : emojisObject.marvel)}`, 
                                            value: str, inline: true
                                        }
                                    )
                                }

                                // Send the result
                                dropMenuMessage.edit({embeds: [eventsOverviewEmbed], components: []})

                            }).catch(err => {
                                FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, null)
                            })
                        }

                    }).catch(err => {
                        FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, dropMenuMessage)
                    })
                }
            }
        }).catch(err => {
            FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, null)
        })
    }
}