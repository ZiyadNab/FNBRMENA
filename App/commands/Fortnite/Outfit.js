module.exports = {
    commands: 'outfit',
    type: 'Fortnite',
    descriptionEN: 'Get a video for any outfit in-game.',
    descriptionAR: 'احصل على فيديو لأي زي داخل اللعبة.',
    expectedArgsEN: 'To use the command you need to specify any outfit name.',
    expectedArgsAR: 'لاستخدام الأمر ، تحتاج إلى تحديد اسم أي زي.',
    argsExample: ['Wildcat\'', 'Wonder'],
    minArgs: 1,
    maxArgs: null,
    cooldown: -1,
    callback: async (FNBRMENA, message, args, text, Discord, client, admin, userData, alias, emojisObject) => {

        // Search Type
        var searchType = "name"

        // If input is an id
        if(text.includes("_")) searchType = "id"

        // Request the outfit video
        FNBRMENA.SearchByType(userData.lang, text, 'outfit', searchType)
        .then(async res => {

            // Check if the user entered a valid outfit name
            if(res.data.items.length <= 0){

                // No emote has been found
                const noItemHasBeenFoundError = new Discord.EmbedBuilder()
                noItemHasBeenFoundError.setColor(FNBRMENA.Colors("embedError"))
                if(userData.lang === "en") noItemHasBeenFoundError.setTitle(`No outfit has been found check your speling and try again ${emojisObject.errorEmoji}.`)
                else if(userData.lang === "ar") noItemHasBeenFoundError.setTitle(`لا يمكنني العثور على الزي الرجاء التأكد من كتابة الاسم بشكل صحيح ${emojisObject.errorEmoji}.`)
                return message.reply({embeds: [noItemHasBeenFoundError], components: [], files: []})
                .catch(err => {
                    FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, null)
                })
            }

            // Check if the outfit has a video
            if(!res.data.items[0].previewVideos.length){

                // Create embed
                const noVideoFoundError = new Discord.EmbedBuilder()
                noVideoFoundError.setColor(FNBRMENA.Colors("embedError"))
                if(userData.lang === "en") noVideoFoundError.setTitle(`There is no video for ${res.data.items[0].name} yet ${emojisObject.errorEmoji}.`)
                else if(userData.lang === "ar") noVideoFoundError.setTitle(`لا يوجد فيديو لزي ${res.data.items[0].name} ${emojisObject.errorEmoji}.`)
                return message.reply({embeds: [noVideoFoundError], components: [], files: []})
                .catch(err => {
                    FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, null)
                })
            }

            // Check if styles exceeded 125 
            if(res.data.items[0].previewVideos.length > 125){

                // Create embed
                const exceeded125StylesError = new Discord.EmbedBuilder()
                exceeded125StylesError.setColor(FNBRMENA.Colors("embedError"))
                if(userData.lang === "en") exceeded125StylesError.setTitle(`The ${res.data.items[0].name} outfit has more than 125 styles ${emojisObject.errorEmoji}.`)
                else if(userData.lang === "ar") exceeded125StylesError.setTitle(`زي ${res.data.items[0].name} يحتوي على اكثر من 125 نمط ${emojisObject.errorEmoji}.`)
                return message.reply({embeds: [exceeded125StylesError], components: [], files: []})
                .catch(err => {
                    FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, null)
                })
            }

            // If the outfit has more than 1 style
            if(res.data.items[0].previewVideos.length > 1){

                // Create an embed
                const itemVariantsEmbed = new Discord.EmbedBuilder()

                // Get the item rarity
                if(res.data.items[0].series === null) itemVariantsEmbed.setColor(FNBRMENA.Colors(res.data.items[0].rarity.id))
                else itemVariantsEmbed.setColor(FNBRMENA.Colors(res.data.items[0].series.id))

                // Set Author
                if(userData.lang === "en"){
                    itemVariantsEmbed.setAuthor({name: `Variants, ${res.data.items[0].name}`, iconURL: res.data.items[0].images.icon})
                    itemVariantsEmbed.setDescription('Please click on the Drop-Down menu and choose a variant.\n`You have only 30 seconds until this operation ends, Make it quick`!')
                }else if(userData.lang === "ar"){
                    itemVariantsEmbed.setAuthor({name: `الأنماط, ${res.data.items[0].name}`, iconURL: res.data.items[0].images.icon})
                    itemVariantsEmbed.setDescription('الرجاء الضغط على السهم لاختيار نمط.\n`لديك فقط 30 ثانية حتى تنتهي العملية, استعجل`!')
                }

                // Create a row for cancel button
                const buttonDataRow = new Discord.ActionRowBuilder()
                
                // Add buttons
                if(userData.lang === "en") buttonDataRow.addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId('Cancel')
                        .setStyle(Discord.ButtonStyle.Danger)
                        .setLabel("Cancel")
                    )

                else if(userData.lang === "ar")buttonDataRow.addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId('Cancel')
                        .setStyle(Discord.ButtonStyle.Danger)
                        .setLabel("اغلاق")
                    )

                var size = (res.data.items[0].previewVideos.length / 25), components = [], limit = 0
                if(size % 2 !== 0 && size != 1){
                    size += 1;
                    size = size | 0
                }

                // Loop trough every style
                for(let i = 1; i <= size; i++){

                    var variant = []
                    for(let x = limit; x < 25 * i; x++){
                        const item = res.data.items[0].previewVideos[x]

                        var styleId
                        if(item){

                            if(item.styles.length){
                                res.data.items[0].styles.map(variantData => {
                                    if(variantData.tag === item.styles[0].tag) styleId = `${res.data.items[0].name} - ${variantData.name}`
                                })

                            }else styleId = res.data.items[0].name
                        
                            variant.push({
                                label: `${styleId}`,
                                value: `${x}`,
                            })
                        }
                    }

                    // Create a drop menu
                    var itemVariantsDropMenu = new Discord.StringSelectMenuBuilder()
                    itemVariantsDropMenu.setCustomId(`${i}`)
                    if(userData.lang === "en") itemVariantsDropMenu.setPlaceholder('Nothing selected!')
                    else if(userData.lang === "ar") itemVariantsDropMenu.setPlaceholder('لم يتم اختيار شيء بعد!')
                    itemVariantsDropMenu.addOptions(variant)

                    // Add the drop menu to the categoryDropMenu
                    components.push(new Discord.ActionRowBuilder().addComponents(itemVariantsDropMenu))
                    limit = 25 * i

                } components.push(buttonDataRow)

                // Send the message
                const dropMenuMessage = await message.reply({embeds: [itemVariantsEmbed], components: components, files: []})
                .catch(err => {
                    FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, null)
                })

                // Filtering the user clicker
                const filter = (i => {
                    return (i.user.id === message.author.id && i.message.id === dropMenuMessage.id && i.guild.id === message.guild.id)
                })

                // Await for the user
                await message.channel.awaitMessageComponent({filter, time: 30000})
                .then(async collected => {
                    collected.deferUpdate();

                    // If cancel button has been clicked
                    if(collected.customId === "Cancel") dropMenuMessage.delete()

                    // If all button is clicked
                    else{

                        // Aend the generating message
                        const generating = new Discord.EmbedBuilder()
                        generating.setColor(FNBRMENA.Colors("embed"))
                        if(userData.lang === "en") generating.setTitle(`Loading the ${res.data.items[0].name}... ${emojisObject.loadingEmoji}`)
                        else if(userData.lang === "ar") generating.setTitle(`جاري تحميل بيانات ${res.data.items[0].name}... ${emojisObject.loadingEmoji}`)
                        dropMenuMessage.edit({embeds: [generating], components: [], files: []})
                        .catch(err => {
                            FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, dropMenuMessage)
                        })
                        try {

                            // Aend attatchment
                            const att = new Discord.AttachmentBuilder(res.data.items[0].previewVideos[collected.values[0]].url)

                            // Send the outfit video
                            dropMenuMessage.edit({embeds: [], components: [], files: [att]})
                            .catch(err => {
                                
                                // Try sending it as a contect message
                                dropMenuMessage.edit({content: res.data.items[0].previewVideos[collected.values[0]].url, embeds: [], components: []})
                                .catch(err => {
                                    FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, dropMenuMessage)
                                })
                            })

                        }catch(err) {
                            FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, dropMenuMessage)
                        }
                    }
                
                }).catch(async err => {
                    FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, dropMenuMessage)
                })
            }

            // If the outfit has only 1 style
            if(res.data.items[0].previewVideos.length === 1){

                // Aend the generating message
                const generating = new Discord.EmbedBuilder()
                generating.setColor(FNBRMENA.Colors("embed"))
                if(userData.lang === "en") generating.setTitle(`Loading the ${res.data.items[0].name}... ${emojisObject.loadingEmoji}`)
                else if(userData.lang === "ar") generating.setTitle(`جاري تحميل بيانات ${res.data.items[0].name}... ${emojisObject.loadingEmoji}`)
                const msg = await message.reply({embeds: [generating], components: [], files: []})
                .catch(err => {
                    FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, null)
                })
                try {

                    // Aend attatchment
                    const att = new Discord.AttachmentBuilder(res.data.items[0].previewVideos[0].url)

                    // Send the outfit video
                    msg.edit({embeds: [], components: [], files: [att]})
                    .catch(err => {
                        
                        // Try sending it as a content message
                        msg.edit({content: res.data.items[0].previewVideos[0].url})
                        .catch(err => {
                            FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, msg)
                        })
                    })

                }catch(err) {
                    FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, msg)
                }
            }
            
        }).catch(err => {
            FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, null)
        })
    }
}