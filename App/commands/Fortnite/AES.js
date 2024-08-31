module.exports = {
    commands: 'aes',
    type: 'Fortnite',
    descriptionEN: 'Returns general informations about the game files.',
    descriptionAR: 'إرجاع معلومات عامة حول ملفات اللعبة.',
    minArgs: 0,
    maxArgs: 0,
    cooldown: -1,
    callback: async (FNBRMENA, message, args, text, Discord, client, admin, userData, alias, emojisObject) => {

        // Index to start the AES from and how many dynamicKeys in a single page
        var index = 0
        var pagesLength = 0
        var page = 1
        var pageAES = 3
        var newPage = 0

        // AES
        const AES = []
        
        // Request Data
        FNBRMENA.AESGM()
        .then(async res => {

            // Generating animation
            const generating = new Discord.EmbedBuilder()
            generating.setColor(FNBRMENA.Colors("embed"))
            if(userData.lang === "en") generating.setTitle(`Loading a total ${res.data.dynamicKeys.length + res.data.unloaded.length}, please wait... ${emojisObject.loadingEmoji}`)
            else if(userData.lang === "ar") generating.setTitle(`جاري تحميل ${res.data.dynamicKeys.length + res.data.unloaded.length} مفتاح , الرجاء الانتظار... ${emojisObject.loadingEmoji}`)
            const msg = await message.reply({embeds: [generating]})
            .catch(err => {
                FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, null)
            })
            try {

                // Create an embed, row
                const row = new Discord.ActionRowBuilder()
                const aesEmbed = new Discord.EmbedBuilder()
                aesEmbed.setColor(FNBRMENA.Colors("embed"))

                // Set title
                if(userData.lang === "en") aesEmbed.setTitle(`AES for ${res.data.version}`)
                else if(userData.lang === "ar") aesEmbed.setTitle(`مفاتيح التشفير لتحديث ${res.data.version}`)

                // Set description
                aesEmbed.setDescription(`${res.data.mainKey}`)

                // Set unloaded
                for(const key of res.data.unloaded){

                    // Check if high texture
                    if(key.hasHighResTextures){
                        if(userData.lang === "en") var highTexture = `\`Yes, it is.\` ${emojisObject.up}`
                        else if(userData.lang === "ar") var highTexture = `\`نعم!\` ${emojisObject.up}`
                    }
                    else{
                        if(userData.lang === "en") var highTexture = `\`No, it is not.\` ${emojisObject.down}`
                        else if(userData.lang === "ar") var highTexture = `\`لا!\` ${emojisObject.down}`
                    }

                    // Add the field
                    if(userData.lang === "en") AES.push({
                        name: `${key.name}`,
                        value: `Status: ${emojisObject.MarvelSeries}\nKey: \`UNKNOWN\`\nHigh Texture: ${highTexture}\nSize: \`${key.size.formatted}\``
                    })
                    else if(userData.lang === "ar") AES.push({
                        name: `${key.name}`,
                        value: `الحالة: ${emojisObject.MarvelSeries}\nالمفتاح: \`غير معلوم\`\nعالي الجودة: ${highTexture}\nالحجم: \`${key.size.formatted}\``
                    })
                }

                // Set dynamicKeys
                for(const key of res.data.dynamicKeys){

                    // Check if high texture
                    if(key.hasHighResTextures){
                        if(userData.lang === "en") var highTexture = `\`Yes, it is.\` ${emojisObject.up}`
                        else if(userData.lang === "ar") var highTexture = `\`نعم!\` ${emojisObject.up}`
                    }
                    else{
                        if(userData.lang === "en") var highTexture = `\`No, it is not.\` ${emojisObject.down}`
                        else if(userData.lang === "ar") var highTexture = `\`لا!\` ${emojisObject.down}`
                    }
                    
                    // Add the field
                    if(userData.lang === "en") AES.push({
                        name: `${key.name}`,
                        value: `Status: ${emojisObject.uncommon}\nKey: \`${key.key}\`\nHigh Texture: ${highTexture}\nSize: \`${key.size.formatted}\``
                    })
                    else if(userData.lang === "ar") AES.push({
                        name: `${key.name}`,
                        value: `الحالة: ${emojisObject.uncommon}\nالمفتاح: \`${key.key}\`\nعالي الجودة: ${highTexture}\nالحجم: \`${key.size.formatted}\``
                    })
                }

                // Pages length
                pagesLength = AES.length / pageAES

                // Forcing to be an int
                if(pagesLength % 2 !== 0){
                    pagesLength += 1
                    pagesLength = pagesLength | 0
                }

                // Add footer for page number
                aesEmbed.setFooter({text: `( ${page}/${pagesLength} )`})

                // List the first 5 dynamicKeys
                for(let i = index; i < pageAES; i++){

                    // Get dynamicKeys from the array
                    aesEmbed.addFields(
                        AES[i]
                    )
                }

                // Add previous page button
                row.addComponents(
                    new Discord.ButtonBuilder()
                    .setCustomId('prev')
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('985226010599497728')
                )

                // Add next page button
                row.addComponents(
                    new Discord.ButtonBuilder()
                    .setCustomId('next')
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('985226013044797531')
                )

                // Add cancel button
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

                
                // Edit the loadingt message
                msg.edit({embeds: [aesEmbed], components: [row]})

                //filtering the user clicker
                const filter = (i => {
                    return (i.user.id === message.author.id && i.message.id === msg.id && i.guild.id === message.guild.id)
                })

                const colllector = message.channel.createMessageComponentCollector({filter, time: 2 * 60000, errors: ['time'] })
                colllector.on('collect', async collected => {
                    collected.deferUpdate();

                    // Delete button was clicked
                    if(collected.customId === "cancel") msg.delete()
                    
                    // One page prev was clicked
                    if(collected.customId === "prev"){

                        // Create an embed
                        const backwardPage = new Discord.EmbedBuilder()
                        backwardPage.setColor(FNBRMENA.Colors("embed"))

                        // Prevent backwording at the first page
                        if(page === 1) return

                        // Change the page value
                        page--

                        // Change the AES list
                        index -= pageAES
                        newPage = pageAES + index

                        // Add footer for page number
                        backwardPage.setFooter({text: `( ${page}/${pagesLength} )`})

                        // Check for undefined AES
                        while(newPage > AES.length){
                            newPage--
                        }

                        if(index < AES.length){

                            // List the next page
                            for(let i = index; i < newPage; i++){

                                // Get dynamicKeys from the en array
                                backwardPage.addFields(
                                    AES[i]
                                )
                            }
                            
                        }else if(userData.lang === "en") backwardPage.setTitle(`Sorry, this is the last page ${emojisObject.errorEmoji}`)
                        else if(userData.lang === "ar") backwardPage.setTitle(`لقد وصلت لاخر صفحه ${emojisObject.errorEmoji}`)

                        //edit the message
                        msg.edit({embeds: [backwardPage], components: [row]})
                    }

                    // One page next was clicked
                    if(collected.customId === "next"){

                        // Create an embed
                        const forwardPage = new Discord.EmbedBuilder()
                        forwardPage.setColor(FNBRMENA.Colors("embed"))

                        // Change the page value
                        page++

                        // Change the dynamicKeys list
                        index += pageAES
                        newPage = index + pageAES

                        // Add footer for page number
                        forwardPage.setFooter({text: `( ${page}/${pagesLength} )`})

                        // Check for undefined AES
                        while(newPage > AES.length){
                            newPage--
                        }

                        if(index < AES.length){

                            // List the next page
                            for(let i = index; i < newPage; i++){

                                // Get dynamicKeys from the en array
                                forwardPage.addFields(
                                    AES[i]
                                )
                            }

                        }else if(userData.lang === "en") forwardPage.setTitle(`Sorry, this is the last page ${emojisObject.errorEmoji}`)
                        else if(userData.lang === "ar") forwardPage.setTitle(`لقد وصلت لاخر صفحه ${emojisObject.errorEmoji}`)

                        //edit the message
                        msg.edit({embeds: [forwardPage], components: [row]})
                    }

                })

                // If time has ended
                colllector.on('end', async () => {
                    try {
                        msg.delete()
                    } catch {
                        
                    }
                })
            } catch (err) {
                FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, msg)
            }
        })
    }
}