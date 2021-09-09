module.exports = {
    commands: 'commands',
    type: 'Fortnite',
    minArgs: 0,
    maxArgs: 0,
    cooldown: -1,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (FNBRMENA, message, args, text, Discord, client, admin, alias, errorEmoji, checkEmoji, loadingEmoji, greenStatus, redStatus) => {

        //get the user language from the database
        const lang = await FNBRMENA.Admin(admin, message, "", "Lang")

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
                if(data.data().commandStatus.Status) var Status = `${greenStatus}`
                else var Status = `${redStatus}`

                if(lang === "en"){

                    Commands.push({name: `Status: ${Status}`, value: `Aliases: \`${data.data().Aliases}\`
                    Command Description: \`${data.data().commandData.descriptionEN}\`
                    Cooldown: \`${data.data().commandData.cooldown}s\`
                    Command Type: \`${data.data().commandData.type}\``})
                }else if(lang === "ar"){

                    Commands.push({name: `حالة الأمر: ${Status}`, value: `الأمر: \`${data.data().Aliases}\`
                    وصف الأمر: \`${data.data().commandData.descriptionEN}\`
                    العد التنازلي: \`${data.data().commandData.cooldown}s\`
                    نوع الأمر: \`${data.data().commandData.type}\``})
                }
            }
        }

        //creating an embed
        const list = new Discord.MessageEmbed()
        list.setColor(FNBRMENA.Colors("embed"))

        //see how many pages
        pagesLength = Commands.length / pageCommands
        
        //forcing to be an int
        if(pagesLength % 2 !== 0){
            pagesLength += 1
            pagesLength = pagesLength | 0
        }

        //add footer for page number
        list.setFooter(`( ${page}/${pagesLength} )`)
        
        //list the first 5 commands
        for(let i = index; i < pageCommands; i++){

            //get commands from the en array
            list.addFields(
                Commands[i]
            )
        }

        //send the embed
        const msgReact = await message.channel.send(list)

        //add reactions
        await msgReact.react('⏮️')
        await msgReact.react('◀️')
        await msgReact.react('▶️')
        await msgReact.react('⏭️')
        const filter = (reaction, user) => {
            return ['⏮️','◀️', '▶️','⏭️'].includes(reaction.emoji.name) && user.id === message.author.id;
        };
        const collected = await msgReact.createReactionCollector(filter, {time: 2.5 * 60000, errors: ['time']})
        collected.on("collect", collect => {

            const reaction = collect
            if(reaction.emoji.name === '⏮️'){

                //create embed
                const firstPage = new Discord.MessageEmbed()
                firstPage.setColor(FNBRMENA.Colors("embed"))
                
                //change the page value
                page = 1

                //change the commands list
                index = 0
                newPage = pageCommands

                //set footer
                list.setFooter(`( ${page}/${pagesLength} )`)

                //list the next page
                for(let i = index; i < newPage; i++){
                    //get commands from the en array
                    firstPage.addFields(
                        Commands[i]
                    )
                }

                msgReact.edit(firstPage)
            }
            
            if(reaction.emoji.name === '◀️'){

                //create embed
                const backwardPage = new Discord.MessageEmbed()
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
                backwardPage.setFooter(`( ${page}/${pagesLength} )`)

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
                }else if(lang === "en") backwardPage.setTitle(`Sorry, this is the last page ${errorEmoji}`)
                else if(lang === "ar") backwardPage.setTitle(`لقد وصلت لاخر صفحه ${errorEmoji}`)

                msgReact.edit(backwardPage)
            }
            if(reaction.emoji.name === '▶️'){

                //create embed
                const forwardPage = new Discord.MessageEmbed()
                forwardPage.setColor(FNBRMENA.Colors("embed"))

                //change the page value
                page++

                //change the commands list
                index += pageCommands
                newPage = index + pageCommands

                //add footer for page number
                forwardPage.setFooter(`( ${page}/${pagesLength} )`)

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
                }else if(lang === "en") forwardPage.setTitle(`Sorry, this is the last page ${errorEmoji}`)
                else if(lang === "ar") forwardPage.setTitle(`لقد وصلت لاخر صفحه ${errorEmoji}`)

                msgReact.edit(forwardPage)
            }
            if(reaction.emoji.name === '⏭️'){

                //create embed
                const firstPage = new Discord.MessageEmbed()
                firstPage.setColor(FNBRMENA.Colors("embed"))
                
                //change the page value
                page = pagesLength

                //change the commands list
                index = pagesLength * pageCommands
                newPage = pagesLength * pageCommands
                index  -= pageCommands

                //set footer
                firstPage.setFooter(`( ${page}/${pagesLength} )`)
                    
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
                msgReact.edit(firstPage)
            }
        })
        collected.on('end', async () => {
            await msgReact.delete()
        })
    }
}