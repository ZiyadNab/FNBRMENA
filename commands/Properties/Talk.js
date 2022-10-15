module.exports = {
    commands: 'talk',
    type: 'Administrator',
    minArgs: 0,
    maxArgs: 0,
    cooldown: -1,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (FNBRMENA, message, args, text, Discord, client, admin, userData, alias, emojisObject) => {

        // Create an embed
        const roleSelectionEmbed = new Discord.EmbedBuilder()
        roleSelectionEmbed.setColor(FNBRMENA.Colors("embed"))
        roleSelectionEmbed.setTitle(`Talk Command Instruction`)
        roleSelectionEmbed.setDescription('Click on the show modal button and fill the required fields keep in mind that this command is only for staff and using it without permission could result in a ban.\n\`You have only 30 seconds until this operation ends, Make it quick\`')

        // Create a row for cancel button
        const buttonDataRow = new Discord.ActionRowBuilder()
        
        // Add buttons
        buttonDataRow.addComponents(
            new Discord.ButtonBuilder()
            .setCustomId('ShowText')
            .setStyle(Discord.ButtonStyle.Primary)
            .setLabel("Text Based")
        )
        buttonDataRow.addComponents(
            new Discord.ButtonBuilder()
            .setCustomId('ShowEmbed')
            .setStyle(Discord.ButtonStyle.Success)
            .setLabel("Embed Based")
        )
        buttonDataRow.addComponents(
            new Discord.ButtonBuilder()
            .setCustomId('Cancel')
            .setStyle(Discord.ButtonStyle.Danger)
            .setLabel("Cancel")
        )

        // Send the message
        const showModalMessage = await message.reply({embeds: [roleSelectionEmbed], components: [buttonDataRow]})

        // Filtering the user clicker
        const filter = (i => {
            return (i.user.id === message.author.id && i.message.id === showModalMessage.id && i.guild.id === message.guild.id)
        })

        // Await for the user
        await message.channel.awaitMessageComponent({filter, time: 3 * 60000})
        .then(async collected => {

            // If cancel button has been clicked
            if(collected.customId === "Cancel") showModalMessage.delete()
            
            // If the user clicked on ShowText
            if(collected.customId === "ShowText"){

                // Create the modal and add text fields
                const talkTextModal = new Discord.ModalBuilder()
                talkTextModal.setCustomId(`talkText-${message.id}`)
                talkTextModal.setTitle('Brrrr, Please fill the fields.')
                talkTextModal.addComponents(
                    new Discord.ActionRowBuilder().addComponents(
                        new Discord.TextInputBuilder()
                        .setCustomId('textChannelID')
                        .setLabel("Please insert the text channel ID")
                        .setStyle(Discord.TextInputStyle.Short)
                        .setPlaceholder("Type something...")
                        .setRequired(true)
                        .setValue("1010198781561667648")
                    ),
                    new Discord.ActionRowBuilder().addComponents(
                        new Discord.TextInputBuilder()
                        .setCustomId('contentText')
                        .setLabel("What do you want me to say?")
                        .setStyle(Discord.TextInputStyle.Paragraph)
                        .setPlaceholder("Type something...")
                        .setRequired(true)
                    )
                )

                // Show Modal
                await collected.showModal(talkTextModal)

                // Listen for modal submission
                const filter = (i => {
                    return i.customId === `talkText-${message.id}` && i.user.id === message.author.id && i.guild.id === message.guild.id
                })
                await collected.awaitModalSubmit({filter, time: 10 * 60000})
                .then(async modalCollect => {

                    // Get all the submited input values
                    const channelID = modalCollect.fields.getTextInputValue('textChannelID');
                    const contentSent = modalCollect.fields.getTextInputValue('contentText');

                    // Find the given text channel
                    const channel = client.channels.cache.find(channel => channel.id === channelID)
                    if(channel){ // Check if the channel given does exist
                        modalCollect.deferUpdate()
                        await channel.send({content: contentSent})
                        await showModalMessage.delete()

                        // Create a successfull embed message
                        const successfulMessageEmbed = new Discord.EmbedBuilder()
                        successfulMessageEmbed.setColor(FNBRMENA.Colors("embedSuccess"))
                        successfulMessageEmbed.setTitle(`The message has been sent to \`${channel.name}\`'s channel successfully ${emojisObject.checkEmoji}.`)
                        await message.reply({embeds: [successfulMessageEmbed]})

                    }else modalCollect.reply({content: 'Please try again and specify a valid text channel id.', ephemeral: true})
                    
                })
            }

            // If the user clicked on ShowEmbed
            if(collected.customId === "ShowEmbed"){
                
                // Create the modal and add text fields
                const talkEmbedModal = new Discord.ModalBuilder()
                talkEmbedModal.setCustomId(`talkEmbed-${message.id}`)
                talkEmbedModal.setTitle('Brrrr, Please fill the fields.')
                talkEmbedModal.addComponents(
                    new Discord.ActionRowBuilder().addComponents(
                        new Discord.TextInputBuilder()
                        .setCustomId('textChannelID')
                        .setLabel("Please insert the text channel ID")
                        .setStyle(Discord.TextInputStyle.Short)
                        .setPlaceholder("Type something...")
                        .setRequired(true)
                        .setValue("1010198781561667648")
                    ),
                    new Discord.ActionRowBuilder().addComponents(
                        new Discord.TextInputBuilder()
                        .setCustomId('embedColor')
                        .setLabel("Embed color (HEX), type * for default")
                        .setStyle(Discord.TextInputStyle.Short)
                        .setPlaceholder("Leave it empty to skip")
                        .setRequired(false)
                    ),
                    new Discord.ActionRowBuilder().addComponents(
                        new Discord.TextInputBuilder()
                        .setCustomId('embedTitle')
                        .setLabel("Please type the embed title here")
                        .setStyle(Discord.TextInputStyle.Short)
                        .setPlaceholder("Type something...")
                        .setRequired(true)
                    ),
                    new Discord.ActionRowBuilder().addComponents(
                        new Discord.TextInputBuilder()
                        .setCustomId('embedDescription')
                        .setLabel("Please type the embed description here")
                        .setStyle(Discord.TextInputStyle.Paragraph)
                        .setPlaceholder("Type something...")
                        .setRequired(true)
                    )
                )

                // Show Modal
                await collected.showModal(talkEmbedModal)

                // Listen for modal submission
                const filter = (i => {
                    return i.customId === `talkEmbed-${message.id}` && i.user.id === message.author.id && i.guild.id === message.guild.id
                })
                await collected.awaitModalSubmit({filter, time: 10 * 60000})
                .then(async modalCollect => {

                    // Get all the submited input values
                    const channelID = modalCollect.fields.getTextInputValue('textChannelID');
                    const embedColor = modalCollect.fields.getTextInputValue('embedColor');
                    const embedTitle = modalCollect.fields.getTextInputValue('embedTitle');
                    const embedDescription = modalCollect.fields.getTextInputValue('embedDescription');

                    // Find the given text channel
                    const channel = client.channels.cache.find(channel => channel.id === channelID)
                    if(channel){ // Check if the channel given does exist
                        modalCollect.deferUpdate()

                        // Create embed
                        const talkEmbed = new Discord.EmbedBuilder()
                        if(embedColor !== "") talkEmbed.setColor(embedColor)
                        else talkEmbed.setColor(FNBRMENA.Colors("embed"))
                        talkEmbed.setTitle(embedTitle)
                        talkEmbed.setDescription(embedDescription)

                        // Send the embed message
                        await channel.send({embeds: [talkEmbed]})
                        await showModalMessage.delete()

                        // Create a successfull embed message
                        const successfulMessageEmbed = new Discord.EmbedBuilder()
                        successfulMessageEmbed.setColor(FNBRMENA.Colors("embedSuccess"))
                        successfulMessageEmbed.setTitle(`The message has been sent to \`${channel.name}\`'s channel successfully ${emojisObject.checkEmoji}.`)
                        await message.reply({embeds: [successfulMessageEmbed]})

                    }else modalCollect.reply({content: 'Please try again and specify a valid text channel id.', ephemeral: true})
                    
                })
            }

        }).catch(async err => {
            showModalMessage.delete()
            FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject)
        })
    }
}