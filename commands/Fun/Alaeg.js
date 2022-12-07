module.exports = {
    commands: 'alaeg',
    type: 'Fun',
    minArgs: null,
    maxArgs: null,
    cooldown: -1,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (FNBRMENA, message, args, text, Discord, client, admin, userData, alias, emojisObject) => {

        // Show alaeg embed function
        async function showAlaegEmbed(){

            // Request data from the databse
            await admin.database().ref("ERA's").child("The Boys").child("Alaeg").once('value')
            .then(async data => {

                // Create embed
                const alaegEmbed = new Discord.EmbedBuilder()

                // Set title and description
                alaegEmbed.setTitle(data.val().title)
                alaegEmbed.setDescription(data.val().description)

                // Check if color is present
                if(data.val().color) alaegEmbed.setColor(data.val().color)
                else alaegEmbed.setColor(FNBRMENA.Colors("embed")) 

                // Check if image is present
                if(data.val().image) alaegEmbed.setImage(data.val().image)

                // Check if a url is present
                if(data.val().url) alaegEmbed.setURL(data.val().url)

                // Send alaeg embed
                message.reply({embeds: [alaegEmbed]})
            })
        }

        // If alaeg or Ewew typed the command
        if(message.author.id === "841439392279429170" || message.author.id === "325507145871130624"){
            
            // Create an embed
            const chooseTypeEmbed = new Discord.EmbedBuilder()
            chooseTypeEmbed.setColor(FNBRMENA.Colors("embed"))
            chooseTypeEmbed.setTitle(`Alaeg Command`)
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
            const alaegModal = new Discord.ModalBuilder()

            // Request data from the databse
            await admin.database().ref("ERA's").child("The Boys").child("Alaeg").once('value')
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
                alaegModal.setCustomId(`alaeg-${message.id}`)
                alaegModal.setTitle('Alaeg Command')
                alaegModal.addComponents(
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
            const alaegMessage = await message.reply({embeds: [chooseTypeEmbed], components: [buttonData]})

            // Filtering the user clicker
            const filter = (i => {
                return (i.user.id === message.author.id && i.message.id === alaegMessage.id && i.guild.id === message.guild.id)
            })

            // Await for the user
            await message.channel.awaitMessageComponent({filter, time: 2 * 60000})
            .then(async collected => {

                // If the user clicked on cancel
                if(collected.customId === "cancel") alaegMessage.delete() //delete the main message

                // If the user clicked on view
                if(collected.customId === "view"){
                    alaegMessage.delete()
                    showAlaegEmbed()
                }

                // If the user clicked on edit
                if(collected.customId === "edit"){
                    alaegMessage.delete()
                    await collected.showModal(alaegModal)

                    // Listen for modal submission
                    const filter = (i => {
                        return i.customId === `alaeg-${message.id}` && i.user.id === message.author.id && i.guild.id === message.guild.id
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

                        // Update data
                        admin.database().ref("ERA's").child("The Boys").child("Alaeg").update({
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
        }else showAlaegEmbed()
    }
}
