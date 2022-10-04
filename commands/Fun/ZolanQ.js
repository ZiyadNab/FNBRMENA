module.exports = {
    commands: 'zolan',
    type: 'Fun',
    minArgs: null,
    maxArgs: null,
    cooldown: -1,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (FNBRMENA, message, args, text, Discord, client, admin, userData, alias, emojisObject) => {

        // Show xolan embed function
        async function showZolanEmbed(){

            // Request data from the databse
            await admin.database().ref("ERA's").child("Zolan").once('value')
            .then(async data => {

                // Create embed
                const zolanEmbed = new Discord.EmbedBuilder()

                // Set title and description
                zolanEmbed.setTitle(data.val().title)
                zolanEmbed.setDescription(data.val().description)

                // Check if color is present
                if(data.val().color) zolanEmbed.setColor(FNBRMENA.Colors("embed"))
                else zolanEmbed.setColor(data.val().color)

                // Check if image is present
                if(data.val().image) zolanEmbed.setImage(data.val().image)

                // Check if a url is present
                if(data.val().url) zolanEmbed.setURL(data.val().url)

                // Send zolan embed
                message.reply({embeds: [zolanEmbed]})
            })
        }

        // If Zolan or Ewew typed the command
        if(message.author.id === "670067434278879235" || message.author.id === "325507145871130624"){
            
            // Create an embed
            const chooseTypeEmbed = new Discord.EmbedBuilder()
            chooseTypeEmbed.setColor(FNBRMENA.Colors("embed"))
            if(lang === "en"){
                chooseTypeEmbed.setTitle(`Cosmetic Update Version`)
                chooseTypeEmbed.setDescription(`Please click on the start button to add a cosmetic update version.`)
            }else if(lang === "ar"){
                chooseTypeEmbed.setTitle(`رقم تحديث العنصر`)
                chooseTypeEmbed.setDescription('الرجاء الضغط على زر البدء لتحديد رقم تحديث العنصر.')
            }

            // Create a row for buttons
            const buttonData = new Discord.ActionRowBuilder()

            // Add view button
            buttonData.addComponents(
                new Discord.ButtonBuilder()
                .setCustomId('view')
                .setStyle(Discord.ButtonStyle.Primary)
                .setLabel("View")
            ) 

            // Add edit button
            buttonData.addComponents(
                new Discord.ButtonBuilder()
                .setCustomId('edit')
                .setStyle(Discord.ButtonStyle.Secondary)
                .setLabel("Edit")
            )

            // Add cancel button
            buttonData.addComponents(
                new Discord.ButtonBuilder()
                .setCustomId('cancel')
                .setStyle(Discord.ButtonStyle.Danger)
                .setLabel("Cancel")
            )

            // Create the modal and add text fields
            const zolanModal = new Discord.ModalBuilder()
            zolanModal.setCustomId('zolan')
            zolanModal.setTitle('Zolan Command')
            zolanModal.addComponents(
                new Discord.ActionRowBuilder().addComponents(
                    new Discord.TextInputBuilder()
                    .setCustomId('titleInput')
                    .setLabel("Type the title.")
                    .setPlaceholder("Type something...")
                    .setStyle(Discord.TextInputStyle.Short)
                    .setRequired(true)
                ),
                new Discord.ActionRowBuilder().addComponents(
                    new Discord.TextInputBuilder()
                    .setCustomId('descriptionInput')
                    .setLabel("Type the description.")
                    .setPlaceholder("Type something...")
                    .setStyle(Discord.TextInputStyle.Short)
                    .setRequired(true)
                ),
                new Discord.ActionRowBuilder().addComponents(
                    new Discord.TextInputBuilder()
                    .setCustomId('colorInput')
                    .setLabel("Type the color (HEX only).")
                    .setPlaceholder("Leave it empty to skip")
                    .setStyle(Discord.TextInputStyle.Short)
                    .setRequired(false)
                ),
                new Discord.ActionRowBuilder().addComponents(
                    new Discord.TextInputBuilder()
                    .setCustomId('imageInput')
                    .setLabel("Type the image url (* to skip).")
                    .setPlaceholder("Leave it empty to skip")
                    .setStyle(Discord.TextInputStyle.Short)
                    .setRequired(false)
                ),
                new Discord.ActionRowBuilder().addComponents(
                    new Discord.TextInputBuilder()
                    .setCustomId('urlInput')
                    .setLabel("Type the link url.")
                    .setPlaceholder("Leave it empty to skip")
                    .setStyle(Discord.TextInputStyle.Short)
                    .setRequired(false)
                )
            )

            // Edit the orignal image
            const zolanMessage = message.reply({embeds: [chooseTypeEmbed], components: [buttonData]})

            // Await for the user
            await message.channel.awaitMessageComponent({filter, time: limit})
            .then(async collected => {

                // If the user clicked on cancel
                if(collected.customId === "cancel") zolanMessage.delete() //delete the main message

                // If the user clicked on view
                if(collected.customId === "view") showZolanEmbed()

                // If the user clicked on edit
                if(collected.customId === "edit"){
                    await collected.showModal(zolanModal)

                    // Listen for modal submission
                    const modalFilter = (interaction) => interaction.customId === 'zolan';
                    await collected.awaitModalSubmit({modalFilter, time: 10 * 60000})
                    .then(async modalCollect => {
                        modalCollect.deferUpdate();

                        // Fields
                        var title = modalCollect.fields.getTextInputValue('titleInput');
                        var description = modalCollect.fields.getTextInputValue('descriptionInput');
                        var color = modalCollect.fields.getTextInputValue('colorInput');
                        var image = modalCollect.fields.getTextInputValue('imageInput');
                        var url = modalCollect.fields.getTextInputValue('urlInput');

                        // Udate data
                        admin.database().ref("ERA's").child("Zolan").update({
                            title: title,
                            description: description,
                            color: color,
                            image: image,
                            url: url
                        })
                    })
                }
            })
        }else showZolanEmbed()
    }
}
