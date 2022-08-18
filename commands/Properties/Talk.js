module.exports = {
    commands: 'talk',
    type: 'Administrator',
    minArgs: 0,
    maxArgs: 0,
    cooldown: -1,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (FNBRMENA, message, args, text, Discord, client, admin, userData, alias, emojisObject) => {

        //create an embed
        const roleSelectionEmbed = new Discord.EmbedBuilder()
        roleSelectionEmbed.setColor(FNBRMENA.Colors("embed"))
        roleSelectionEmbed.setTitle(`Talk Command Instruction`)
        roleSelectionEmbed.setDescription('Click on the show modal button and fill the required fields keep in mind that this command is only for staff and using it without permission could result in a ban.\n\`You have only 30 seconds until this operation ends, Make it quick\`')

        //create a row for cancel button
        const buttonDataRow = new Discord.ActionRowBuilder()
        
        //add buttons
        buttonDataRow.addComponents(
            new Discord.ButtonBuilder()
            .setCustomId('Show')
            .setStyle(Discord.ButtonStyle.Primary)
            .setLabel("Show Modal")
        )
        buttonDataRow.addComponents(
            new Discord.ButtonBuilder()
            .setCustomId('Cancel')
            .setStyle(Discord.ButtonStyle.Danger)
            .setLabel("Cancel")
        )

        // Create the modal and add text fields
        const talkModal = new Discord.ModalBuilder()
        talkModal.setCustomId('talk')
        talkModal.setTitle('Brrrr, Please fill the fields.')
        talkModal.addComponents(
            new Discord.ActionRowBuilder().addComponents(
                new Discord.TextInputBuilder()
                .setCustomId('textChannelID')
                .setLabel("Please insert the text channel ID")
                .setStyle(Discord.TextInputStyle.Short)
            ),
            new Discord.ActionRowBuilder().addComponents(
                new Discord.TextInputBuilder()
                .setCustomId('contentText')
                .setLabel("What do you want me to say?")
                .setStyle(Discord.TextInputStyle.Paragraph)
            ),
        )

        //send the message
        const showModalMessage = await message.reply({embeds: [roleSelectionEmbed], components: [buttonDataRow]})

        //filtering the user clicker
        const filter = i => i.user.id === message.author.id

        //await for the user
        await message.channel.awaitMessageComponent({filter, time: 30000})
        .then(async collected => {

            //if cancel button has been clicked
            if(collected.customId === "Cancel") showModalMessage.delete()
            
            //if the user clicked on show modal
            if(collected.customId === "Show"){
                await collected.showModal(talkModal)

                //listen for modal submission
                const modalFilter = (interaction) => interaction.customId === 'talk';
                await collected.awaitModalSubmit({modalFilter, time: 2 * 60000})
                .then(async modalCollect => {

                    //get all the submited input values
                    const channelID = modalCollect.fields.getTextInputValue('textChannelID');
                    const contentSent = modalCollect.fields.getTextInputValue('contentText');

                    //find the given text channel
                    const channel = client.channels.cache.find(channel => channel.id === channelID)
                    if(channel){ //check if the channel given does exist
                        modalCollect.deferUpdate()
                        await channel.send({content: contentSent})
                        await showModalMessage.delete()

                        //create a successfull embed message
                        const successfulMessageEmbed = new Discord.EmbedBuilder()
                        successfulMessageEmbed.setColor(FNBRMENA.Colors("embedSuccess"))
                        successfulMessageEmbed.setTitle(`The message has been sent to \`${channel.name}\`'s channel successfully ${emojisObject.checkEmoji}.`)
                        successfulMessageEmbed.setDescription(contentSent)
                        await message.reply({embeds: [successfulMessageEmbed]})

                    }else modalCollect.reply({content: 'Please try again and specify a valid text channel id.', ephemeral: true})
                    
                })
            }
        })
    }
}