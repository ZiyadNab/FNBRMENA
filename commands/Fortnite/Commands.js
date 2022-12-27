module.exports = {
    commands: 'commands',
    type: 'Fortnite',
    minArgs: 0,
    maxArgs: 0,
    cooldown: -1,
    callback: async (FNBRMENA, message, args, text, Discord, client, admin, userData, alias, emojisObject) => {

        // Setting up the db firestore
        const db = await admin.firestore()

        // Commands collection
        const firestoreCommands = await db.collection("Commands")
        const commandList = await firestoreCommands.get()

        // Index to start the commands from and how many commands in a single page
        var index = 0
        var pagesLength = 0
        var page = 1
        var pageCommands = 3
        var newPage = 0

        // Commands
        const Commands = []

        // Add all the commands to an array
        for(const data of commandList.docs){

            // Check if 
            if(data.data().commandData.showInCommands){

                // Command status
                if(data.data().commandData.commandStatus.status) var Status = `${emojisObject.uncommon}`
                else var Status = `${emojisObject.marvel}`

                if(data.data().commandData.cooldown.filesSource){
                    if(data.data().commandData.cooldown.filesCooldown != -1) var cooldown = data.data().commandData.cooldown.filesCooldown
                    else var cooldown = 0
                }else{
                    if(data.data().commandData.cooldown.serversCooldown != -1) var cooldown = data.data().commandData.cooldown.serversCooldown
                    else var cooldown = 0
                }

                if(userData.lang === "en"){

                    Commands.push({name: `Status: ${Status}`, value: `${emojisObject.countEmoji} Aliases: \`${data.data().aliases}\`
                    ${emojisObject.countEmoji} Command Description: \`${data.data().commandData.descriptionEN}\`
                    ${emojisObject.countEmoji} Cooldown: \`${cooldown}s\`
                    ${emojisObject.endEmoji} Command Type: \`${data.data().commandData.type}\``})
                }else if(userData.lang === "ar"){

                    Commands.push({name: `حالة الأمر: ${Status}`, value: `الأمر: \`${data.data().aliases}\` ${emojisObject.countEmoji}
                    وصف الأمر: \`${data.data().commandData.descriptionAR}\` ${emojisObject.countEmoji}
                    العد التنازلي: \`${cooldown}s\` ${emojisObject.countEmoji}
                    نوع الأمر: \`${data.data().commandData.type}\` ${emojisObject.endEmoji}`})
                }
            }
        }

        // Creating an embed and its row
        const row = new Discord.ActionRowBuilder()
        const list = new Discord.EmbedBuilder()
        list.setColor(FNBRMENA.Colors("embed"))

        // See how many pages
        pagesLength = Commands.length / pageCommands
        
        // Forcing to be an int
        if(pagesLength % 2 !== 0){
            pagesLength += 1
            pagesLength = pagesLength | 0
        }

        // Add footer for page number
        list.setFooter({text: `( ${page}/${pagesLength} )`})
        
        // List the first 5 commands
        for(let i = index; i < pageCommands; i++){

            // Get commands from the en array
            list.addFields(
                Commands[i]
            )
        }

        // Add the button for ?x previous page
        row.addComponents(
            new Discord.ButtonBuilder()
            .setCustomId('prevD')
            .setStyle(Discord.ButtonStyle.Primary)
            .setEmoji('985226016735776788')
        )

        // Add the button for previous page
        row.addComponents(
            new Discord.ButtonBuilder()
            .setCustomId('prev')
            .setStyle(Discord.ButtonStyle.Primary)
            .setEmoji('985226010599497728')
        )

        // Add the button for next page
        row.addComponents(
            new Discord.ButtonBuilder()
            .setCustomId('next')
            .setStyle(Discord.ButtonStyle.Primary)
            .setEmoji('985226013044797531')
        )

        // Add the button for ?x next page
        row.addComponents(
            new Discord.ButtonBuilder()
            .setCustomId('nextD')
            .setStyle(Discord.ButtonStyle.Primary)
            .setEmoji('985226020795863121')
        )

        // Add the button for Cancel button
        if(userData.lang === "en"){
            row.addComponents(
                new Discord.ButtonBuilder()
                .setCustomId('cancel')
                .setStyle(Discord.ButtonStyle.Danger)
                .setLabel('Cancel!')
            )
        } else if(userData.lang === "ar"){
            row.addComponents(
                new Discord.ButtonBuilder()
                .setCustomId('cancel')
                .setStyle(Discord.ButtonStyle.Danger)
                .setLabel('اغلاق!')
            )
        }

        
        // Send the embed
        const commandsMessage = await message.reply({embeds: [list], components: [row], files: []})
        .catch(err => {
            FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, null)
        })

        // Filtering the user clicker
        const filter = (i => {
            return (i.user.id === message.author.id && i.message.id === commandsMessage.id && i.guild.id === message.guild.id)
        })

        const colllector = message.channel.createMessageComponentCollector({filter, time: 2.5 * 60000, errors: ['time'] })
        colllector.on('collect', async collected => {
            collected.deferUpdate();

            // Delete button was clicked
            if(collected.customId === "cancel") commandsMessage.delete()

            // Prev to page 1 was clicked
            if(collected.customId === "prevD"){

                // Create embed
                const firstPage = new Discord.EmbedBuilder()
                firstPage.setColor(FNBRMENA.Colors("embed"))
                
                // Change the page value
                page = 1

                // Change the commands list
                index = 0
                newPage = pageCommands

                // Set footer
                list.setFooter({text: `( ${page}/${pagesLength} )`})

                // List the next page
                for(let i = index; i < newPage; i++){

                    // Get commands from the en array
                    firstPage.addFields(
                        Commands[i]
                    )
                }

                // Edit the message
                commandsMessage.edit({embeds: [firstPage], components: [row], files: []})
            }
            
            // One page prev was clicked
            if(collected.customId === "prev"){

                // Create embed
                const backwardPage = new Discord.EmbedBuilder()
                backwardPage.setColor(FNBRMENA.Colors("embed"))

                //u cant backword at the first page
                if(page === 1){
                    return
                }

                // Change the page value
                page--

                // Change the commands list
                index -= pageCommands
                newPage = pageCommands + index

                // Add footer for page number
                backwardPage.setFooter({text: `( ${page}/${pagesLength} )`})

                // Check for undefined commands
                while(newPage > Commands.length){
                    newPage--
                }

                if(index < Commands.length){

                    // List the next page
                    for(let i = index; i < newPage; i++){

                        // Get commands from the en array
                        backwardPage.addFields(
                            Commands[i]
                        )
                    }
                    
                }else if(userData.lang === "en") backwardPage.setTitle(`Sorry, this is the last page ${emojisObject.errorEmoji}`)
                else if(userData.lang === "ar") backwardPage.setTitle(`لقد وصلت لاخر صفحه ${emojisObject.errorEmoji}`)

                // Edit the message
                commandsMessage.edit({embeds: [backwardPage], components: [row], files: []})
            }

            // One page next was clicked
            if(collected.customId === "next"){

                // Create embed
                const forwardPage = new Discord.EmbedBuilder()
                forwardPage.setColor(FNBRMENA.Colors("embed"))

                // Change the page value
                page++

                // Change the commands list
                index += pageCommands
                newPage = index + pageCommands

                // Add footer for page number
                forwardPage.setFooter({text: `( ${page}/${pagesLength} )`})

                // Check for undefined commands
                while(newPage > Commands.length){
                    newPage--
                }

                if(index < Commands.length){

                    // List the next page
                    for(let i = index; i < newPage; i++){

                        // Get commands from the en array
                        forwardPage.addFields(
                            Commands[i]
                        )
                    }

                }else if(userData.lang === "en") forwardPage.setTitle(`Sorry, this is the last page ${emojisObject.errorEmoji}`)
                else if(userData.lang === "ar") forwardPage.setTitle(`لقد وصلت لاخر صفحه ${emojisObject.errorEmoji}`)

                // Edit the message
                commandsMessage.edit({embeds: [forwardPage], components: [row], files: []})
            }

            // Next to the last page was clicked
            if(collected.customId === "nextD"){

                // Create embed
                const firstPage = new Discord.EmbedBuilder()
                firstPage.setColor(FNBRMENA.Colors("embed"))
                
                // Change the page value
                page = pagesLength

                // Change the commands list
                index = pagesLength * pageCommands
                newPage = pagesLength * pageCommands
                index  -= pageCommands

                // Set footer
                firstPage.setFooter({text: `( ${page}/${pagesLength} )`})
                    
                // Check for undefined commands
                while(newPage > Commands.length){
                    newPage--
                }

                // List the next page
                for(let i = index; i < newPage; i++){

                    // Get commands from the en array
                    firstPage.addFields(
                        Commands[i]
                    )
                }

                // Edit the message
                commandsMessage.edit({embeds: [firstPage], components: [row], files: []})
            }
        })

        // If time has ended
        colllector.on('end', async () => {
            try {
                await commandsMessage.delete()
            } catch {
                
            }
        })
    }
}