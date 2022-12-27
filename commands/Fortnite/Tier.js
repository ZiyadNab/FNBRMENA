module.exports = {
    commands: 'tier',
    type: 'Fortnite',
    descriptionEN: 'A command that will return a tier of any season\'s information of a battlepass of your choice from season 2 till current season.',
    descriptionAR: 'أمر راح يسترجع لك معلومات اي تاير من عناصر الباتل باس بإختيارك من الموسم 2 الى الموسم الحالي.',
    expectedArgsEN: 'To use the command you need to specifiy a season number from season 2 to latest season.',
    expectedArgsAR: 'من اجل استخدام الأمر يجب عليك تحديد موسم معين من الموسم الثاني الى الموسم الحالي.',
    hintEN: 'You can add + then type any tier to start with. \nFor example: tier 2 + 68 that will give you the black knight from season 2',
    hintAR: 'يمكنك اضافة + ثم رقم المستى للبداية.\nعلى سبيل المثال: tier 2 + 68 راح يعطيك عنصر بلاك نيات من سيزون 2',
    argsExample: ['2', '14'],
    minArgs: 1,
    maxArgs: null,
    cooldown: 40,
    callback: async (FNBRMENA, message, args, text, Discord, client, admin, userData, alias, emojisObject) => {

        // Tier index
        let tierIndex = 0

         // If the user added a tier to start
         if(text.includes("+")){

            // Extract the season from the text string
            var season = text.substring(0, text.indexOf("+"))
            tierIndex = text.substring(text.indexOf("+") + 1, text.length).trim()

        }else var season = text

        // Request data
        FNBRMENA.getBattlepassRewards(userData.lang, season)
        .then(async res => {

            // Check season validity
            if(!res.data.result){

                // Create error embed
                const noBattlepassFoundError = new Discord.EmbedBuilder()
                noBattlepassFoundError.setColor(FNBRMENA.Colors("embedError"))
                if(userData.lang === "en") noBattlepassFoundError.setTitle(`There is no battlepass with that number ${emojisObject.errorEmoji}`)
                else if(userData.lang === "ar") noBattlepassFoundError.setTitle(`لا يوجد باتل باس بهذا الرقم ${emojisObject.errorEmoji}`)
                return message.reply({embeds: [noBattlepassFoundError]})
                .catch(err => {
                    FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, null)
                })
            }

            // If the started index above the rewards length
            if(Number(tierIndex) > res.data.rewards.length){

                // Create error embed
                const startTierIsNotValidError = new Discord.EmbedBuilder()
                startTierIsNotValidError.setColor(FNBRMENA.Colors("embedError"))
                if(userData.lang === "en") startTierIsNotValidError.setTitle(`The given tier is incorrect ${emojisObject.errorEmoji}`)
                else if(userData.lang === "ar") startTierIsNotValidError.setTitle(`المستوى غير صحيح ${emojisObject.errorEmoji}`)
                return message.reply({embeds: [startTierIsNotValidError]})
                .catch(err => {
                    FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, null)
                })
            }

            const buttonsDataRow = new Discord.ActionRowBuilder()
            if(userData.lang === "en"){
                        
                // Back 20
                buttonsDataRow.addComponents(
                    new Discord.ButtonBuilder()
                    .setCustomId(`BACK20-${alias}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setLabel("Back 20 Tier")
                )

                // Back 1
                buttonsDataRow.addComponents(
                    new Discord.ButtonBuilder()
                    .setCustomId(`BACK-${alias}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setLabel("Back 1 Tier")
                )

                // Next 1
                buttonsDataRow.addComponents(
                    new Discord.ButtonBuilder()
                    .setCustomId(`NEXT-${alias}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setLabel("Next 1 Tier")
                )

                // Next 20
                buttonsDataRow.addComponents(
                    new Discord.ButtonBuilder()
                    .setCustomId(`NEXT20-${alias}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setLabel("Next 20 Tier")
                )

                // Stop
                buttonsDataRow.addComponents(
                    new Discord.ButtonBuilder()
                    .setCustomId(`STOP-${alias}`)
                    .setStyle(Discord.ButtonStyle.Danger)
                    .setLabel("Stop!")
                )
            }else if(userData.lang === "ar"){
                // Back 20
                buttonsDataRow.addComponents(
                    new Discord.ButtonBuilder()
                    .setCustomId(`BACK20-${alias}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setLabel("ارجع 20 مستوى")
                )

                // Back 1
                buttonsDataRow.addComponents(
                    new Discord.ButtonBuilder()
                    .setCustomId(`BACK-${alias}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setLabel("ارجع 1 مستوى")
                )

                // Next 1
                buttonsDataRow.addComponents(
                    new Discord.ButtonBuilder()
                    .setCustomId(`NEXT-${alias}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setLabel("تقدم 1 مستوى")
                )

                // Next 20
                buttonsDataRow.addComponents(
                    new Discord.ButtonBuilder()
                    .setCustomId(`NEXT20-${alias}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setLabel("تقدم 20 مستوى")
                )

                // Stop
                buttonsDataRow.addComponents(
                    new Discord.ButtonBuilder()
                    .setCustomId(`STOP-${alias}`)
                    .setStyle(Discord.ButtonStyle.Danger)
                    .setLabel("إيقات!")
                )
            }

            // Preview tier details based on the given index
            const tierViewer = async () => {

                // Get tier data by filtering
                const TierData = res.data.rewards[tierIndex]

                // Inisilizing tierDATA
                const tierDataEmbed = new Discord.EmbedBuilder()

                // Set the embed color is there is no rarity then use the default
                if(TierData !== undefined){
                    if(TierData.item.series !== null) tierDataEmbed.setColor(FNBRMENA.Colors(TierData.item.series.id))
                    else tierDataEmbed.setColor(FNBRMENA.Colors(TierData.item.rarity.id))
                }else tierDataEmbed.setColor(FNBRMENA.Colors("embed"))

                // If the index is not -1
                if(tierIndex < res.data.rewards.length){

                    // Set title
                    if(await TierData.page !== null){
                        if(userData.lang === "en") await tierDataEmbed.setAuthor({name: `${res.data.displayInfo.chapterSeason} | Page ${TierData.page}`, iconURL: TierData.item.images.icon})
                        else if(userData.lang === "ar") await tierDataEmbed.setAuthor({name: `${res.data.displayInfo.chapterSeason} | صفحة ${TierData.page}`, iconURL: TierData.item.images.icon})
                    }else{
                        if(userData.lang === "en") await tierDataEmbed.setAuthor({name: `${res.data.displayInfo.chapterSeason} | Tier ${TierData.tier}`, iconURL: TierData.item.images.icon})
                        else if(userData.lang === "ar") await tierDataEmbed.setAuthor({name: `${res.data.displayInfo.chapterSeason} | مستوى ${TierData.tier}`, iconURL: TierData.item.images.icon})
                    }
                    
                    // Set title
                    tierDataEmbed.setTitle(`${emojisObject.battlepassTiers} ${TierData.item.name}`)
                    tierDataEmbed.setDescription(TierData.item.description)
                    tierDataEmbed.setThumbnail(TierData.item.images.icon)

                    // Add styles
                    var Styles = ``
                    if(TierData.item.styles.length !== 0){
                        for(let i = 0; i < TierData.item.styles.length; i++){
                            Styles += `\`${TierData.item.styles[i].name}\`\n`
                        }
                    }else if(userData.lang === "en") Styles = `\`No styles for ${TierData.item.name} ${TierData.item.type.name}.\``
                    else if(userData.lang === "ar") Styles = `\`لا يوجد ستايلات لـ ${TierData.item.type.name} ${TierData.item.name}.\``

                    // Add grants
                    var Grants = ``
                    if(TierData.item.grants.length !== 0){
                        for(let i = 0; i < TierData.item.grants.length; i++){
                            if(userData.lang === "en") Grants += `**ID:** \`${TierData.item.grants[i].id}\`\n**Name:** \`${TierData.item.grants[i].name}\`\n**Rarity:** \`${TierData.item.grants[i].rarity.name}\``
                            else if(userData.lang === "ar") Grants += `**المعرف:** \`${TierData.item.grants[i].id}\`\n**الإسم:** \`${TierData.item.grants[i].name}\`\n**الندرة:** \`${TierData.item.grants[i].rarity.name}\``
                        }
                    }else if(userData.lang === "en") Grants = `\`The ${TierData.item.name} ${TierData.item.type.name} doesn't grants you anything.\``
                    else if(userData.lang === "ar") Grants = `\`لا يمنحك ${TierData.item.type.name} ${TierData.item.name} عناصر أضافية.\``

                    // Add gameplayTags
                    var gameplayTags = ``
                    if(TierData.item.gameplayTags.length !== 0){
                        for(let i = 0; i < TierData.item.gameplayTags.length; i++){
                            gameplayTags += `\`${TierData.item.gameplayTags[i]}\`\n`
                        }
                    }else if(userData.lang === "en") gameplayTags = `\`No gameplayTags for ${TierData.item.name} ${TierData.item.type.name}.\``
                    else if(userData.lang === "ar") gameplayTags = `\`لا يوجد شعارات لـ ${TierData.item.type.name} ${TierData.item.name}\``

                    // Add rarity
                    var rarity = ``
                    if(TierData.item.series !== null) rarity = TierData.item.series.name
                    else rarity = TierData.item.rarity.name

                    // Add set
                    if(userData.lang === "en") var set = `\`No set for ${TierData.item.name} ${TierData.item.type.name}.\``
                    else if(userData.lang === "ar") var set = `\`لا يوجد مجموعة للعنصر ${TierData.item.type.name} ${TierData.item.name}.\``
                    if(TierData.item.set !== null) set = TierData.item.set.partOf

                    // Add introduction
                    if(userData.lang === "en") var introduction = `No introduction for ${TierData.item.name}`
                    else if(userData.lang === "ar") var introduction = `لا يوجد تقديم للعنصر ${TierData.item.name}`
                    if(TierData.item.introduction !== null) introduction = TierData.item.introduction.text

                    // Add price
                    if(userData.lang === "en") var price = `\`No prices for ${TierData.item.name} ${TierData.item.type.name}.\``
                    else if(userData.lang === "ar") var price = `\`لا يوجد اسعار لـ ${TierData.item.type.name} ${TierData.item.name}.\``
                    if(TierData.price !== null) price = `${TierData.price.amount} ${emojisObject.battlepassStars}`

                    // Add fields
                    if(userData.lang === "en"){

                        // Battlepass type
                        const battlepassType = TierData.battlepass.charAt(0).toUpperCase() + TierData.battlepass.slice(1)

                        tierDataEmbed.addFields(
                            {name: `Battlepass Type`, value: `\`${battlepassType}\``, inline: true},
                            {name: `Quantity`, value: `\`${TierData.quantity}\``, inline: true},
                            {name: `Item Price`, value: `${price}`, inline: true},
                            {name: `Item Type`, value: `\`${TierData.item.type.name}\``, inline: true},
                            {name: `Rarity`, value: `\`${rarity}\``, inline: true},
                            {name: `Set`, value: `\`${set}\``, inline: true},
                            {name: `Introduction`, value: `\`${introduction}\``, inline: true},
                            {name: `Added`, value: `\`Date: ${TierData.item.added.date}\`\n\`Version: ${TierData.item.added.version}\``, inline: true},
                            {name: `Item ID`, value: `\`${TierData.item.id}\``, inline: true},
                            {name: `Styles`, value: `${Styles}`},
                            {name: `Grants`, value: `${Grants}`},
                            {name: `gameplayTags`, value: `${gameplayTags}`},
                        )
                    }else if(userData.lang === "ar"){

                        // Battlepass type
                        let battlepassType = `مدفوع`
                        if(TierData.battlepass === 'free') battlepassType = `مجاني`

                        tierDataEmbed.addFields(
                            {name: `نوع الباتل باس`, value: `\`${battlepassType}\``, inline: true},
                            {name: `الكمية`, value: `\`${TierData.quantity}\``, inline: true},
                            {name: `سعر العنصر`, value: `${price}`, inline: true},
                            {name: `نوع العنصر`, value: `\`${TierData.item.type.name}\``, inline: true},
                            {name: `الندرة`, value: `\`${rarity}\``, inline: true},
                            {name: `المجموعة`, value: `\`${set}\``, inline: true},
                            {name: `تم تقديمة`, value: `\`${introduction}\``, inline: true},
                            {name: `تم اضافتة`, value: `\`التاريخ: ${TierData.item.added.date}\`\n\`التحديث: ${TierData.item.added.version}\``, inline: true},
                            {name: `معرف العنصر`, value: `\`${TierData.item.id}\``, inline: true},
                            {name: `ستايلات`, value: `${Styles}`},
                            {name: `عناصر أضافية`, value: `${Grants}`},
                            {name: `شعارات`, value: `${gameplayTags}`},
                        )
                    }
                }else{

                    // Set description
                    if(userData.lang === "en") tierDataEmbed.setDescription(`You are the the last page please use backward or stop button to continue ${emojisObject.errorEmoji}`)
                    else if(userData.lang === "ar") tierDataEmbed.setDescription(`انت الأن في اخر صفحه الرجاء استعمال زر الرجوع او الإيقاف للأستمرار ${emojisObject.errorEmoji}`)
                }

                return tierDataEmbed
            }

            // Send the data
            const sendTierDataViewer = await message.reply({embeds: [await tierViewer()], components: [buttonsDataRow], files: []})

            // Filtering the user clicker
            const filter = (i => {
                return (i.user.id === message.author.id && i.message.id === sendTierDataViewer.id && i.guild.id === message.guild.id)
            })

            // Await the user click
            const collector = message.channel.createMessageComponentCollector({filter, time: 2 * 60000, errors: ['time'] })
            collector.on('collect', async collected => {
                collected.deferUpdate();

                // Back 20 button clicked
                if(collected.customId === `BACK20-${alias}`){

                    if(tierIndex > res.data.rewards.length) tierIndex = res.data.rewards.length

                    // If there is no more tiers
                    if(tierIndex - 20 > 0){

                        // Move to the 20 back index
                        tierIndex -= 20

                        // Edit the message
                        await sendTierDataViewer.edit({embeds: [await tierViewer()]})

                    }else{

                        tierIndex = 0

                        // Edit the message
                        await sendTierDataViewer.edit({embeds: [await tierViewer()]})

                    }
                }

                // Back button clicked
                if(collected.customId === `BACK-${alias}`){

                    if(tierIndex > res.data.rewards.length) tierIndex = res.data.rewards.length

                    // If there is no more tiers
                    if(tierIndex - 1 > 0){

                        // Move to the back index
                        tierIndex--

                        // Edit the message
                        await sendTierDataViewer.edit({embeds: [await tierViewer()]})

                    }else{

                        tierIndex = 0

                        // Edit the message
                        await sendTierDataViewer.edit({embeds: [await tierViewer()]})

                    }
                }

                // Next button clicked
                if(collected.customId === `NEXT-${alias}`){

                    // If there is no more tiers
                    if(tierIndex + 1 <= res.data.rewards.length){
                            
                        // Move to the next index
                        tierIndex++

                        // Edit the message
                        await sendTierDataViewer.edit({embeds: [await tierViewer()]})
                        
                    }else await sendTierDataViewer.edit({embeds: [await tierViewer()]})
                }

                // Next button clicked
                if(collected.customId === `NEXT20-${alias}`){

                    // If there is no more tiers
                    if(tierIndex + 20 <= res.data.rewards.length){

                        // Move to the next index
                        tierIndex += 20

                        // Edit the message
                        await sendTierDataViewer.edit({embeds: [await tierViewer()]})

                    }else{

                        tierIndex = res.data.rewards.length
                        await sendTierDataViewer.edit({embeds: [await tierViewer()]})
                    }
                }

                // Stop listening
                if(collected.customId === `STOP-${alias}`) collector.stop()
                
            })

            // When time has ended
            collector.on('end', async () => {
                try {
                    await sendTierDataViewer.delete()
                } catch {
                    
                }
            })

        }).catch(err => {
            FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, null)
        })
    }
}