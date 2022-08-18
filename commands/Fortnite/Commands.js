module.exports = {
    commands: 'commands',
    type: 'Fortnite',
    minArgs: 0,
    maxArgs: 0,
    cooldown: -1,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (FNBRMENA, message, args, text, Discord, client, admin, userData, alias, emojisObject) => {

        //seeting up the db firestore
        const db = await admin.firestore()

        //commands collection
        const firestoreCommands = await db.collection("Commands")
        const commandList = await firestoreCommands.get()

        //index to start the commands from and how many commands in a single page
        var index = 0
        var pagesLength = 0
        var page = 1
        var pageCommands = 3
        var newPage = 0

        //commands
        const Commands = []

        //add all the commands to an array
        for(const data of commandList.docs){

            //check if 
            if(data.data().commandData.showInCommands){

                //command status
                if(data.data().commandData.commandStatus.status) var Status = `${emojisObject.greenStatus}`
                else var Status = `${emojisObject.redStatus}`

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

        //creating an embed and its row
        const row = new Discord.ActionRowBuilder()
        const list = new Discord.EmbedBuilder()
        list.setColor(FNBRMENA.Colors("embed"))

        //see how many pages
        pagesLength = Commands.length / pageCommands
        
        //forcing to be an int
        if(pagesLength % 2 !== 0){
            pagesLength += 1
            pagesLength = pagesLength | 0
        }

        //add footer for page number
        list.setFooter({text: `( ${page}/${pagesLength} )`})
        
        //list the first 5 commands
        for(let i = index; i < pageCommands; i++){

            //get commands from the en array
            list.addFields(
                Commands[i]
            )
        }

        //add the button for ?x previous page
        row.addComponents(
            new Discord.ButtonBuilder()
            .setCustomId('prevD')
            .setStyle(Discord.ButtonStyle.Primary)
            .setEmoji('985226016735776788')
        )

        //add the button for previous page
        row.addComponents(
            new Discord.ButtonBuilder()
            .setCustomId('prev')
            .setStyle(Discord.ButtonStyle.Primary)
            .setEmoji('985226010599497728')
        )

        //add the button for next page
        row.addComponents(
            new Discord.ButtonBuilder()
            .setCustomId('next')
            .setStyle(Discord.ButtonStyle.Primary)
            .setEmoji('985226013044797531')
        )

        //add the button for ?x next page
        row.addComponents(
            new Discord.ButtonBuilder()
            .setCustomId('nextD')
            .setStyle(Discord.ButtonStyle.Primary)
            .setEmoji('985226020795863121')
        )

        //add the button for Cancel button
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

        
        //send the embed
        const commandsMessage = await message.reply({embeds: [list], components: [row]})

        //filtering the user clicker
        const filter = i => i.user.id === message.author.id

        const colllector = message.channel.createMessageComponentCollector({filter, time: 2.5 * 60000, errors: ['time'] })
        colllector.on('collect', async collected => {
            collected.deferUpdate();

            //delete button was clicked
            if(collected.customId === "cancel") commandsMessage.delete()

            //prev to page 1 was clicked
            if(collected.customId === "prevD"){

                //create embed
                const firstPage = new Discord.EmbedBuilder()
                firstPage.setColor(FNBRMENA.Colors("embed"))
                
                //change the page value
                page = 1

                //change the commands list
                index = 0
                newPage = pageCommands

                //set footer
                list.setFooter({text: `( ${page}/${pagesLength} )`})

                //list the next page
                for(let i = index; i < newPage; i++){

                    //get commands from the en array
                    firstPage.addFields(
                        Commands[i]
                    )
                }

                //edit the message
                commandsMessage.edit({embeds: [firstPage], components: [row]})
            }
            
            //one page prev was clicked
            if(collected.customId === "prev"){

                //create embed
                const backwardPage = new Discord.EmbedBuilder()
                backwardPage.setColor(FNBRMENA.Colors("embed"))

                //u cant backword at the first page
                if(page === 1){
                    return
                }

                //change the page value
                page--

                //change the commands list
                index -= pageCommands
                newPage = pageCommands + index

                //add footer for page number
                backwardPage.setFooter({text: `( ${page}/${pagesLength} )`})

                //check for undefined commands
                while(newPage > Commands.length){
                    newPage--
                }

                if(index < Commands.length){

                    //list the next page
                    for(let i = index; i < newPage; i++){

                        //get commands from the en array
                        backwardPage.addFields(
                            Commands[i]
                        )
                    }
                    
                }else if(userData.lang === "en") backwardPage.setTitle(`Sorry, this is the last page ${emojisObject.errorEmoji}`)
                else if(userData.lang === "ar") backwardPage.setTitle(`لقد وصلت لاخر صفحه ${emojisObject.errorEmoji}`)

                //edit the message
                commandsMessage.edit({embeds: [backwardPage], components: [row]})
            }

            //one page next was clicked
            if(collected.customId === "next"){

                //create embed
                const forwardPage = new Discord.EmbedBuilder()
                forwardPage.setColor(FNBRMENA.Colors("embed"))

                //change the page value
                page++

                //change the commands list
                index += pageCommands
                newPage = index + pageCommands

                //add footer for page number
                forwardPage.setFooter({text: `( ${page}/${pagesLength} )`})

                //check for undefined commands
                while(newPage > Commands.length){
                    newPage--
                }

                if(index < Commands.length){

                    //list the next page
                    for(let i = index; i < newPage; i++){

                        //get commands from the en array
                        forwardPage.addFields(
                            Commands[i]
                        )
                    }

                }else if(userData.lang === "en") forwardPage.setTitle(`Sorry, this is the last page ${emojisObject.errorEmoji}`)
                else if(userData.lang === "ar") forwardPage.setTitle(`لقد وصلت لاخر صفحه ${emojisObject.errorEmoji}`)

                //edit the message
                commandsMessage.edit({embeds: [forwardPage], components: [row]})
            }

            //next to the last page was clicked
            if(collected.customId === "nextD"){

                //create embed
                const firstPage = new Discord.EmbedBuilder()
                firstPage.setColor(FNBRMENA.Colors("embed"))
                
                //change the page value
                page = pagesLength

                //change the commands list
                index = pagesLength * pageCommands
                newPage = pagesLength * pageCommands
                index  -= pageCommands

                //set footer
                firstPage.setFooter({text: `( ${page}/${pagesLength} )`})
                    
                //check for undefined commands
                while(newPage > Commands.length){
                    newPage--
                }

                //list the next page
                for(let i = index; i < newPage; i++){

                    //get commands from the en array
                    firstPage.addFields(
                        Commands[i]
                    )
                }

                //edit the message
                commandsMessage.edit({embeds: [firstPage], components: [row]})
            }
        })

        //if time has ended
        colllector.on('end', async () => {
            try {
                await commandsMessage.delete()
            } catch {
                
            }
        })
    }
}