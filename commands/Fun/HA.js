module.exports = {
    commands: 'ha',
    type: 'Fun',
    minArgs: null,
    maxArgs: null,
    cooldown: -1,
    callback: async (FNBRMENA, message, args, text, Discord, client, admin, userData, alias, emojisObject) => {

        // Show ha268 embed function
        async function showHa268Embed(){

            // Request data from the databse
            await admin.database().ref("ERA's").child("The Boys").child("Ha268").once('value')
            .then(async data => {

                // Create embed
                const ha268Embed = new Discord.EmbedBuilder()

                // Set title and description
                ha268Embed.setTitle(data.val().title)
                ha268Embed.setDescription(data.val().description)

                // Check if color is present
                if(data.val().color) ha268Embed.setColor(data.val().color)
                else ha268Embed.setColor(FNBRMENA.Colors("embed")) 

                // Check if image is present
                if(data.val().image) ha268Embed.setImage(data.val().image)

                // Check if a url is present
                if(data.val().url) ha268Embed.setURL(data.val().url)

                // Send ha268 embed
                message.reply({embeds: [ha268Embed]})
            })
        }

        // If ha268 or Ewew typed the command
        if(message.author.id === "804230882693087242" || message.author.id === "325507145871130624"){
            
            // Create an embed
            const chooseTypeEmbed = new Discord.EmbedBuilder()
            chooseTypeEmbed.setColor(FNBRMENA.Colors("embed"))
            chooseTypeEmbed.setTitle(`Ha268 Command`)
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
            const ha268Modal = new Discord.ModalBuilder()

            // Request data from the databse
            await admin.database().ref("ERA's").child("The Boys").child("Ha268").once('value')
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
                ha268Modal.setCustomId(`ha268-${message.id}`)
                ha268Modal.setTitle('Ha268 Command')
                ha268Modal.addComponents(
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
            const ha268Message = await message.reply({embeds: [chooseTypeEmbed], components: [buttonData]})

            // Filtering the user clicker
            const filter = (i => {
                return (i.user.id === message.author.id && i.message.id === ha268Message.id && i.guild.id === message.guild.id)
            })

            // Await for the user
            await message.channel.awaitMessageComponent({filter, time: 2 * 60000})
            .then(async collected => {

                // If the user clicked on cancel
                if(collected.customId === "cancel") ha268Message.delete() //delete the main message

                // If the user clicked on view
                if(collected.customId === "view"){
                    ha268Message.delete()
                    showHa268Embed()
                }

                // If the user clicked on edit
                if(collected.customId === "edit"){
                    ha268Message.delete()
                    await collected.showModal(ha268Modal)

                    // Listen for modal submission
                    const filter = (i => {
                        return i.customId === `ha268-${message.id}` && i.user.id === message.author.id && i.guild.id === message.guild.id
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
                        admin.database().ref("ERA's").child("The Boys").child("Ha268").update({
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
        }else showHa268Embed()
    }
}
