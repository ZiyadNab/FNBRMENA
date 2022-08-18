const moment = require('moment')

module.exports = {
    commands: 'command',
    type: 'Administrators Only',
    minArgs: 1,
    maxArgs: null,
    cooldown: -1,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (FNBRMENA, message, args, text, Discord, client, admin, userData, alias, emojisObject) => {
        
        //seeting up the db firestore
        var db = await admin.firestore()

        //command document
        const commandData = await db.collection("Commands").doc(`${text.toLowerCase()}`).get()

        //check if the command given is already exists 
        if(commandData.exists){

            //command name
            const commandName = commandData.data().aliases[0].charAt(0).toUpperCase() + commandData.data().aliases[0].slice(1);

            //create an embed
            const chooseOperationEmbed = new Discord.EmbedBuilder()
            chooseOperationEmbed.setColor(FNBRMENA.Colors("embed"))
            chooseOperationEmbed.setTitle(`Command Operations, ${commandName}`)
            chooseOperationEmbed.setDescription('Click on the drop-down menu to specifiy an operation.\n\`You have only 30 seconds until this operation ends, Make it quick\`')

            //add a button row
            const buttonDataRow = new Discord.ActionRowBuilder()
                    
            //add enable and disable buttons
            buttonDataRow.addComponents(
                new Discord.ButtonBuilder()
                .setCustomId('Cancel')
                .setStyle(Discord.ButtonStyle.Danger)
                .setLabel("Cancel")
            )

            //create a row for drop down menu for categories
            const chooseOperationRow = new Discord.ActionRowBuilder()

            //create a select menu
            const chooseOperationDropMenu = new Discord.SelectMenuBuilder()
            chooseOperationDropMenu.setCustomId('Operations')
            chooseOperationDropMenu.setPlaceholder('Select an operation!')
            chooseOperationDropMenu.addOptions(
                {
                    label: `Command Status`,
                    value: `status`
                },
                {
                    label: `Show In Commands`,
                    value: `appearance`
                },
                {
                    label: `Roles`,
                    value: `roles`
                },
                {
                    label: `Premissions`,
                    value: `prem`
                },
                {
                    label: `Ban/Unban a User`,
                    value: `banUnban`
                },
                {
                    label: `Timeout a User`,
                    value: `timeout`
                },
                {
                    label: `Cooldown`,
                    value: `cooldown`
                },
                {
                    label: `Premium`,
                    value: `Premium`
                }
            )

            //add the drop menu to the row
            chooseOperationRow.addComponents(chooseOperationDropMenu)

            //send the message
            const dropMenuMessage = await message.reply({embeds: [chooseOperationEmbed], components: [chooseOperationRow, buttonDataRow]})

            //filtering the user clicker
            const filter = i => i.user.id === message.author.id

            //await for the user
            await message.channel.awaitMessageComponent({filter, time: 30000})
            .then(async collected => {
                collected.deferUpdate();

                //if cancel button has been clicked
                if(collected.customId === "Cancel") dropMenuMessage.delete()

                //if user chose an operations
                if(collected.customId === "Operations"){
                    
                    //when user selects status
                    if(collected.values[0] === "status"){

                        //create an embed
                        const commandStatusEmbed = new Discord.EmbedBuilder()
                        commandStatusEmbed.setColor(FNBRMENA.Colors("embed"))
                        commandStatusEmbed.setTitle(`Commands Status, ${commandName}`)
                        commandStatusEmbed.setDescription('Click on enable or disable to change the command status.\n\`You have only 30 seconds until this operation ends, Make it quick\`')

                        //add a button row
                        const commandStatusButtonDataRow = new Discord.ActionRowBuilder()
                        
                        //add enable and disable buttons
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
                        commandStatusModal.setCustomId('commandStatus')
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

                        //edit the message
                        await dropMenuMessage.edit({embeds: [commandStatusEmbed], components: [commandStatusButtonDataRow]})

                        //await for the user
                        await message.channel.awaitMessageComponent({filter, time: 30000})
                        .then(async collected => {

                            //if the user wants to cancel
                            if(collected.customId === "Cancel") dropMenuMessage.delete()
                            else{
                                collected.showModal(commandStatusModal) //show modal

                                //listen for modal submission
                                const modalFilter = (interaction) => interaction.customId === 'commandStatus';
                                await collected.awaitModalSubmit({modalFilter, time: 2 * 60000})
                                .then(async modalCollect => {
                                    modalCollect.deferUpdate();
                                    var Status
                                    
                                    //if the user wants to enable the bot
                                    if(collected.customId === "Enable"){
                                        Status = true

                                        //successfully updated
                                        const statusUpdatedEmbed = new Discord.EmbedBuilder()
                                        statusUpdatedEmbed.setColor(FNBRMENA.Colors("embedSuccess"))
                                        statusUpdatedEmbed.setTitle(`The ${commandName} command has been enabled successfully ${emojisObject.checkEmoji}`)
                                        dropMenuMessage.edit({embeds: [statusUpdatedEmbed], components: []})
                                    }

                                    //if the user wants to disable the bot
                                    if(collected.customId === "Disable"){
                                        Status = false

                                        //successfully updated
                                        const statusUpdatedEmbed = new Discord.EmbedBuilder()
                                        statusUpdatedEmbed.setColor(FNBRMENA.Colors("embedSuccess"))
                                        statusUpdatedEmbed.setTitle(`The ${commandName} command has been disabled successfully ${emojisObject.checkEmoji}`)
                                        dropMenuMessage.edit({embeds: [statusUpdatedEmbed], components: []})
                                    }

                                    //get user inputs
                                    var reasonEN = await modalCollect.fields.getTextInputValue('reasonEN')
                                    var reasonAR = await modalCollect.fields.getTextInputValue('reasonAR')

                                    if(reasonEN == "*") reasonEN = null
                                    if(reasonAR == "*") reasonAR = null

                                    //change moment language
                                    moment.locale("en")

                                    //update the data
                                    await db.collection("Commands").doc(`${text.toLowerCase()}`).update({
                                        'commandData.commandStatus': {
                                            status: Status,
                                            by: message.author.id,
                                            date: moment().format(),
                                            reasonEN: reasonEN,
                                            reasonAR: reasonAR,
                                        }
                                    })
                                    
                                }).catch(err => {
                                    FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject)
                                })
                            }
                        }).catch(err => {
                            FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject)
                        })
                    }

                    //when user selects appearance
                    if(collected.values[0] === "appearance"){

                        //create an embed
                        const commandStatusEmbed = new Discord.EmbedBuilder()
                        commandStatusEmbed.setColor(FNBRMENA.Colors("embed"))
                        commandStatusEmbed.setTitle(`Show in Commands, ${commandName}`)
                        commandStatusEmbed.setDescription('Click on show or hide to change appearance in commands.\n\`You have only 30 seconds until this operation ends, Make it quick\`')

                        //add a button row
                        const appearanceButtonDataRow = new Discord.ActionRowBuilder()
                        
                        //add enable and disable buttons
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

                        //edit the message
                        await dropMenuMessage.edit({embeds: [commandStatusEmbed], components: [appearanceButtonDataRow]})

                        //await for the user
                        await message.channel.awaitMessageComponent({filter, time: 30000})
                        .then(async collected => {

                            //if the user wants to cancel
                            if(collected.customId === "Cancel") dropMenuMessage.delete()

                            //if the user wants to show the command
                            if(collected.customId === "Show"){
            
                                //update the data
                                await db.collection("Commands").doc(`${text.toLowerCase()}`).update({
                                    'commandData.showInCommands': true
                                })

                                //successfully updated
                                const showInCommandsUpdatedEmbed = new Discord.EmbedBuilder()
                                showInCommandsUpdatedEmbed.setColor(FNBRMENA.Colors("embedSuccess"))
                                showInCommandsUpdatedEmbed.setTitle(`The ${commandName} command is now visible in commands list ${emojisObject.checkEmoji}`)
                                dropMenuMessage.edit({embeds: [showInCommandsUpdatedEmbed], components: []})
                            }

                            //if the user wants to hide the command
                            if(collected.customId === "Hide"){

                                //update the data
                                await db.collection("Commands").doc(`${text.toLowerCase()}`).update({
                                    'commandData.showInCommands': false
                                })

                                //successfully updated
                                const showInCommandsUpdatedEmbed = new Discord.EmbedBuilder()
                                showInCommandsUpdatedEmbed.setColor(FNBRMENA.Colors("embedSuccess"))
                                showInCommandsUpdatedEmbed.setTitle(`The ${commandName} command is now invisible in commands list ${emojisObject.checkEmoji}`)
                                dropMenuMessage.edit({embeds: [showInCommandsUpdatedEmbed], components: []})
                                
                            }

                        }).catch(err => {
                            FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject)
                        })
                    }

                    //when user selects roles
                    if(collected.values[0] === "roles"){

                        //create an embed
                        const addRolesEmbed = new Discord.EmbedBuilder()
                        addRolesEmbed.setColor(FNBRMENA.Colors("embed"))
                        addRolesEmbed.setTitle(`Roles, ${commandName}`)
                        addRolesEmbed.setDescription('Click on add a role or remove to start.\n\`You have only 30 seconds until this operation ends, Make it quick\`')

                        //add a button row
                        const addRolesButtonDataRow = new Discord.ActionRowBuilder()
                        
                        //add buttons to the row
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
                        )

                        addRolesButtonDataRow.addComponents(
                            new Discord.ButtonBuilder()
                            .setCustomId('List')
                            .setStyle(Discord.ButtonStyle.Secondary)
                            .setLabel("List All Roles")
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
                        addRolesModal.setTitle(`Manage A Role To ${commandName}`) //set modal title
                        addRolesModal.addComponents( // add fields
                            new Discord.ActionRowBuilder().addComponents(
                                new Discord.TextInputBuilder()
                                .setCustomId('roleID')
                                .setLabel("Please enter the role id and submit")
                                .setStyle(Discord.TextInputStyle.Short)
                            )
                        )

                        //edit the message
                        await dropMenuMessage.edit({embeds: [addRolesEmbed], components: [addRolesButtonDataRow]})

                        //await for the user
                        await message.channel.awaitMessageComponent({filter, time: 30000})
                        .then(async collected => {

                            //if the user wants to cancel
                            if(collected.customId === "Cancel") dropMenuMessage.delete()

                            //if the user wants to add a role
                            if(collected.customId === "Add"){
                                collected.showModal(addRolesModal) //show modal

                                //listen for modal submission
                                const modalFilter = (interaction) => interaction.customId === 'roles';
                                await collected.awaitModalSubmit({modalFilter, time: 2 * 60000})
                                .then(async modalCollect => {
                                    modalCollect.deferUpdate();
                                    
                                    //check if the given role id does exist
                                    if(message.guild.roles.cache.has(modalCollect.fields.getTextInputValue('roleID'))){

                                        //get the existing roles from database
                                        const serversRoles = await commandData.data().commandData.roles
                                        serversRoles.push(modalCollect.fields.getTextInputValue('roleID'))

                                        //update the data
                                        await db.collection("Commands").doc(`${text.toLowerCase()}`).update({
                                            'commandData.roles': serversRoles
                                        })

                                        //successfully updated
                                        const rolesUpdatedEmbed = new Discord.EmbedBuilder()
                                        rolesUpdatedEmbed.setColor(FNBRMENA.Colors("embedSuccess"))
                                        rolesUpdatedEmbed.setTitle(`The ${message.guild.roles.cache.get(modalCollect.fields.getTextInputValue('roleID')).name} has been added successfully ${emojisObject.checkEmoji}.`)
                                        dropMenuMessage.edit({embeds: [rolesUpdatedEmbed], components: []})

                                    }else{

                                        //wrong role id provided error
                                        const wrongRoleIdError = new Discord.EmbedBuilder()
                                        wrongRoleIdError.setColor(FNBRMENA.Colors("embedError"))
                                        wrongRoleIdError.setTitle(`The ${modalCollect.fields.getTextInputValue('roleID')} role id doesn't exists ${emojisObject.errorEmoji}.`)
                                        dropMenuMessage.edit({embeds: [wrongRoleIdError], components: []})
                                    }
                                    
                                }).catch(err => {
                                    FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject)
                                })
                            }

                            //if the user wants to remove a role
                            if(collected.customId === "Remove"){
                                collected.showModal(addRolesModal) //show modal

                                //listen for modal submission
                                const modalFilter = (interaction) => interaction.customId === 'roles';
                                await collected.awaitModalSubmit({modalFilter, time: 2 * 60000})
                                .then(async modalCollect => {
                                    modalCollect.deferUpdate();
                                    
                                    //check if the given role id does exist
                                    if(message.guild.roles.cache.has(modalCollect.fields.getTextInputValue('roleID'))){

                                        //get the existing roles from database
                                        const serversRoles = await commandData.data().commandData.roles
                                        serversRoles.splice(serversRoles.findIndex(ids => {
                                            return ids === modalCollect.fields.getTextInputValue('roleID')
                                        }), 1)

                                        //update the data
                                        await db.collection("Commands").doc(`${text.toLowerCase()}`).update({
                                            'commandData.roles': serversRoles
                                        })

                                        //successfully updated
                                        const rolesUpdatedEmbed = new Discord.EmbedBuilder()
                                        rolesUpdatedEmbed.setColor(FNBRMENA.Colors("embedSuccess"))
                                        rolesUpdatedEmbed.setTitle(`The ${message.guild.roles.cache.get(modalCollect.fields.getTextInputValue('roleID')).name} has been removed successfully ${emojisObject.checkEmoji}.`)
                                        dropMenuMessage.edit({embeds: [rolesUpdatedEmbed], components: []})

                                    }else{

                                        //wrong role id provided error
                                        const wrongRoleIdError = new Discord.EmbedBuilder()
                                        wrongRoleIdError.setColor(FNBRMENA.Colors("embedError"))
                                        wrongRoleIdError.setTitle(`The ${modalCollect.fields.getTextInputValue('roleID')} role id doesn't exists ${emojisObject.errorEmoji}.`)
                                        dropMenuMessage.edit({embeds: [wrongRoleIdError], components: []})
                                    }
                                })
                            }

                            //if the user wants to list all roles
                            if(collected.customId === "List"){

                                //get the existing roles from database
                                const serversRoles = await commandData.data().commandData.roles

                                let string = ``
                                for(const role of serversRoles){
                                    if(message.guild.roles.cache.has(role)) string += `${message.guild.roles.cache.get(role).name} --> ${role}\n`
                                }

                                //successfully updated
                                const listAllRolesEmbed = new Discord.EmbedBuilder()
                                listAllRolesEmbed.setColor(FNBRMENA.Colors("embed"))
                                listAllRolesEmbed.setTitle(`All Roles, ${commandName}`)
                                listAllRolesEmbed.setDescription(`Here is all the roles that are assigned to ${commandName} command\n\n${string}`)
                                dropMenuMessage.edit({embeds: [listAllRolesEmbed], components: []})
                            }

                        }).catch(err => {
                            FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject)
                        })
                    }
                }
            })
        }
    }
}