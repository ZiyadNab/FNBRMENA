module.exports = {
    commands: 'extreme',
    type: 'Fun',
    minArgs: null,
    maxArgs: null,
    cooldown: -1,
    callback: async (FNBRMENA, message, args, text, Discord, client, admin, userData, alias, emojisObject) => {

        // Show extreme embed function
        async function showExtremeEmbed(){

            // Request data from the databse
            await admin.database().ref("ERA's").child("The Boys").child("Extreme").once('value')
            .then(async data => {

                // Create embed
                const extremeEmbed = new Discord.EmbedBuilder()

                // Set title and description
                extremeEmbed.setTitle(data.val().title)
                extremeEmbed.setDescription(data.val().description)

                // Check if color is present
                if(data.val().color) extremeEmbed.setColor(data.val().color)
                else extremeEmbed.setColor(FNBRMENA.Colors("embed")) 

                // Check if image is present
                if(data.val().image) extremeEmbed.setImage(data.val().image)

                // Check if a url is present
                if(data.val().url) extremeEmbed.setURL(data.val().url)

                // Send extreme embed
                message.reply({embeds: [extremeEmbed]})
            })
        }

        // If extreme or Ewew typed the command
        if(message.author.id === "680499496416837718" || message.author.id === "325507145871130624"){
            
            // Create an embed
            const chooseTypeEmbed = new Discord.EmbedBuilder()
            chooseTypeEmbed.setColor(FNBRMENA.Colors("embed"))
            chooseTypeEmbed.setTitle(`Extreme Command`)
            chooseTypeEmbed.setDescription(`Please choose an action.`)

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
                .setStyle(Discord.ButtonStyle.Success)
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
            const extremeModal = new Discord.ModalBuilder()

            // Request data from the databse
            await admin.database().ref("ERA's").child("The Boys").child("Extreme").once('value')
            .then(async data => {

                // Default value
                if(data.val()) var defaultTitle = data.val().title
                else var defaultTitle = ''
                if(data.val()) var defaultDescription = data.val().description
                else var defaultDescription = ''
                if(data.val()){
                    if(data.val().color) var defaultColor = data.val().color
                    else var defaultColor = FNBRMENA.Colors("embed")
                }else var defaultColor = FNBRMENA.Colors("embed")
                if(data.val()){
                    if(data.val().image) var defaultImage = data.val().image
                    else var defaultImage = ''
                }
                else var defaultImage = ''
                if(data.val()){
                    if(data.val().url) var defaultUrl = data.val().url
                    else var defaultUrl = ''
                }
                else var defaultUrl = ''
                
                // Set data
                extremeModal.setCustomId(`extreme-${message.id}`)
                extremeModal.setTitle('Extreme Command')
                extremeModal.addComponents(
                    new Discord.ActionRowBuilder().addComponents(
                        new Discord.TextInputBuilder()
                        .setCustomId('titleInput')
                        .setLabel("Type the title.")
                        .setPlaceholder("Type something...")
                        .setStyle(Discord.TextInputStyle.Short)
                        .setRequired(true)
                        .setValue(defaultTitle)
                    ),
                    new Discord.ActionRowBuilder().addComponents(
                        new Discord.TextInputBuilder()
                        .setCustomId('descriptionInput')
                        .setLabel("Type the description.")
                        .setPlaceholder("Type something...")
                        .setStyle(Discord.TextInputStyle.Short)
                        .setRequired(true)
                        .setValue(defaultDescription)
                    ),
                    new Discord.ActionRowBuilder().addComponents(
                        new Discord.TextInputBuilder()
                        .setCustomId('colorInput')
                        .setLabel("Type the color (HEX only).")
                        .setPlaceholder("Leave it empty to skip")
                        .setStyle(Discord.TextInputStyle.Short)
                        .setRequired(false)
                        .setValue(defaultColor)
                    ),
                    new Discord.ActionRowBuilder().addComponents(
                        new Discord.TextInputBuilder()
                        .setCustomId('imageInput')
                        .setLabel("Type the image url (* to skip).")
                        .setPlaceholder("Leave it empty to skip")
                        .setStyle(Discord.TextInputStyle.Short)
                        .setRequired(false)
                        .setValue(defaultImage)
                    ),
                    new Discord.ActionRowBuilder().addComponents(
                        new Discord.TextInputBuilder()
                        .setCustomId('urlInput')
                        .setLabel("Type the link url.")
                        .setPlaceholder("Leave it empty to skip")
                        .setStyle(Discord.TextInputStyle.Short)
                        .setRequired(false)
                        .setValue(defaultUrl)
                    )
                )
            })

            // Edit the orignal image
            const extremeMessage = await message.reply({embeds: [chooseTypeEmbed], components: [buttonData]})

            // Filtering the user clicker
            const filter = (i => {
                return (i.user.id === message.author.id && i.message.id === extremeMessage.id && i.guild.id === message.guild.id)
            })

            // Await for the user
            await message.channel.awaitMessageComponent({filter, time: 2 * 60000})
            .then(async collected => {

                // If the user clicked on cancel
                if(collected.customId === "cancel") extremeMessage.delete() //delete the main message

                // If the user clicked on view
                if(collected.customId === "view"){
                    extremeMessage.delete()
                    showExtremeEmbed()
                }

                // If the user clicked on edit
                if(collected.customId === "edit"){
                    extremeMessage.delete()
                    await collected.showModal(extremeModal)

                    // Listen for modal submission
                    const filter = (i => {
                        return i.customId === `extreme-${message.id}` && i.user.id === message.author.id && i.guild.id === message.guild.id
                    })
                    await collected.awaitModalSubmit({filter, time: 10 * 60000})
                    .then(async modalCollect => {
                        modalCollect.deferUpdate();

                        // Fields
                        var title = modalCollect.fields.getTextInputValue('titleInput');
                        var description = modalCollect.fields.getTextInputValue('descriptionInput');
                        var color = modalCollect.fields.getTextInputValue('colorInput');
                        var image = modalCollect.fields.getTextInputValue('imageInput');
                        var url = modalCollect.fields.getTextInputValue('urlInput');

                        // Check for empty fields
                        if(color == "") color = false
                        if(image == "") image = false
                        if(url == "") url = false

                        // Udate data
                        admin.database().ref("ERA's").child("The Boys").child("Extreme").update({
                            title: title,
                            description: description,
                            color: color,
                            image: image,
                            url: url
                        })
                    }).catch(async err => {
                        if(!err.message.includes("time")) FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, null)
                    })
                }
            }).catch(async err => {
                FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, null)
            })
        }else showExtremeEmbed()
    }
}
