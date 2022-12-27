const Canvas = require('canvas');
const moment = require('moment')

module.exports = {
    commands: 'map',
    type: 'Fortnite',
    descriptionEN: 'Returns a map image.',
    descriptionAR: 'استرجاع صورة للخريطة.',
    expectedArgsEN: 'ُTo get the current map image just use just the command without any arguments, And if you want to get older map images type the season number.',
    expectedArgsAR: 'للحصول على صورة الخريطة فقط اكتب الأمر , و للحصول علي صورة خرائط  قديمة اكتب رقم الموسم',
    hintEN: 'You can get a map from a specific game version.',
    hintAR: 'يمكنك الحصول على خريطة من إصدار لعبة معين.',
    argsExample: ['', '5', '13'],
    minArgs: 0,
    maxArgs: 1,
    cooldown: -1,
    callback: async (FNBRMENA, message, args, text, Discord, client, admin, userData, alias, emojisObject) => {
        moment.locale(userData.lang)

        // If the use did not add any season number
        if(text === ''){

            // Generating animation
            const generating = new Discord.EmbedBuilder()
            generating.setColor(FNBRMENA.Colors("embed"))
            if(userData.lang === "en") generating.setTitle(`Loading... ${emojisObject.loadingEmoji}`)
            else if(userData.lang == "ar") generating.setTitle(`جاري التحميل... ${emojisObject.loadingEmoji}`)
            const msg = await message.reply({embeds: [generating], components: [], files: []})
            .catch(err => {
                FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, null)
            })
            try {

                // Request data
                FNBRMENA.Map(userData.lang)
                .then(async res => {

                    // Get the image data
                    if(res.data.data.images.pois === null) var image = res.data.data.images.blank
                    else var image = res.data.data.images.pois
                    
                    // Creating canvas
                    const canvas = Canvas.createCanvas(2048, 2048);
                    const ctx = canvas.getContext('2d');

                    // Map image
                    const map = await Canvas.loadImage(image)
                    ctx.drawImage(map, 0, 0, canvas.width, canvas.height)

                    // Fnbrmena credits
                    const border = await Canvas.loadImage('./assets/NPC/border.png')
                    ctx.drawImage(border, 0, 0, canvas.width, canvas.height)

                    // Send the map image
                    var att = new Discord.AttachmentBuilder(canvas.toBuffer(), {name: 'map.png'})
                    msg.edit({embeds: [], components: [], files: [att]})
                    .catch(err => {

                        // Try sending it on jpg file format [LOWER QUALITY]
                        var att = new Discord.AttachmentBuilder(canvas.toBuffer('image/jpeg'), {name: `map.jpg`})
                        msg.edit({embeds: [], components: [], files: [att]})
                        .catch(err => {
                            FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, msg)
                        })
                    })

                }).catch(err => {
                    FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, msg)
                    
                })
            }catch(err) {
                FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, msg)
                
            }
                
        }else{

            // Request data
            FNBRMENA.MapIO()
            .then(async res => {

                // Check if user entered a valid season that has images
                var allAvaliableVersions = []
                var Counter = 0

                // Loop throw every map avaliable
                for(let i = 0; i < res.data.maps.length; i++){

                    //only go in when the version first number matches the user input
                    if(res.data.maps[i].patchVersion.substring(0, res.data.maps[i].patchVersion.indexOf(".")) == text){

                        // Store the all avaliable versions in the array
                        allAvaliableVersions[Counter++] = res.data.maps[i]

                    }
                }

                // If the allAvaliableVersions is empty then no matching game version found
                if(allAvaliableVersions.length != 0){

                    // Create embed handleing the season error
                    const noSeasonHasBeenFoundError = new Discord.EmbedBuilder()
                    noSeasonHasBeenFoundError.setColor(FNBRMENA.Colors("embedError"))
                    if(userData.lang === "en") noSeasonHasBeenFoundError.setTitle(`Sorry there is no season with that number ${emojisObject.errorEmoji}`)
                    else if(userData.lang === "ar") noSeasonHasBeenFoundError.setTitle(`عذرا لا يوجد موسم بنفس هذا الرقم ${emojisObject.errorEmoji}`)
                    return message.reply({embeds: [noSeasonHasBeenFoundError], components: [], files: []})
                    .catch(err => {
                        FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, null)
                    })
                }

                // Create an embed
                const allAvaliableVersionsEmbed = new Discord.EmbedBuilder()
                allAvaliableVersionsEmbed.setColor(FNBRMENA.Colors("embed"))
                if(userData.lang === "en"){
                    allAvaliableVersionsEmbed.setAuthor({name: `Map History`, iconURL: `https://fortnite-api.com/images/cosmetics/br/spid_139_tiltedmap/decal.png`})
                    allAvaliableVersionsEmbed.setDescription('Please click on the Drop-Down menu and choose a game verion.\n`You have only 30 seconds until this operation ends, Make it quick`!')
                }else if(userData.lang === "ar"){
                    allAvaliableVersionsEmbed.setAuthor({name: `تاريخ الماب`, iconURL: `https://fortnite-api.com/images/cosmetics/br/spid_139_tiltedmap/decal.png`})
                    allAvaliableVersionsEmbed.setDescription('الرجاء الضغط على السهم لاختيار تحديث.\n`لديك فقط 30 ثانية حتى تنتهي العملية, استعجل`!')
                }

                // Create a row for cancel button
                const buttonDataRow = new Discord.ActionRowBuilder()

                // Add EN cancel button
                if(userData.lang === "en") buttonDataRow.addComponents(
                    new Discord.ButtonBuilder()
                    .setCustomId('Cancel')
                    .setStyle(Discord.ButtonStyle.Danger)
                    .setLabel("Cancel")
                )
                
                // Add AR cancel button
                else if(userData.lang === "ar") buttonDataRow.addComponents(
                    new Discord.ButtonBuilder()
                    .setCustomId('Cancel')
                    .setStyle(Discord.ButtonStyle.Danger)
                    .setLabel("اغلاق")
                )
                
                // Create a row for drop down menu for categories
                const allAvaliableVersionsRow = new Discord.ActionRowBuilder()

                // Loop throw every patch
                var versionsFound = []
                for(let i = 0; i < allAvaliableVersions.length; i++){

                    if(userData.lang === "en"){
                        versionsFound.push({
                            label: `${allAvaliableVersions[i].patchVersion}'s version\n`,
                            description: `${moment(allAvaliableVersions[i].releaseDate).fromNow()}`,
                            value: `${i}`,
                        })

                    }else if(userData.lang === "ar"){
                        versionsFound.push({
                            label: `تحديث ${allAvaliableVersions[i].patchVersion}\n`,
                            description: `${moment(allAvaliableVersions[i].releaseDate).fromNow()}`,
                            value: `${i}`,
                        })
                    }
                }

                const allAvaliableVersionsDropMenu = new Discord.SelectMenuBuilder()
                allAvaliableVersionsDropMenu.setCustomId('versions')
                if(userData.lang === "en") allAvaliableVersionsDropMenu.setPlaceholder('Nothing selected!')
                else if(userData.lang === "ar") allAvaliableVersionsDropMenu.setPlaceholder('الرجاء الأختيار!')
                allAvaliableVersionsDropMenu.addOptions(versionsFound)

                // Add the drop menu to the categoryDropMenu
                allAvaliableVersionsRow.addComponents(allAvaliableVersionsDropMenu)

                // Send the message
                const dropMenuMessage = await message.reply({embeds: [allAvaliableVersionsEmbed], components: [allAvaliableVersionsRow, buttonDataRow], files: []})
                .catch(err => {
                    FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, null)
                })

                // Filtering the user clicker
                const filter = (i => {
                    return (i.user.id === message.author.id && i.message.id === dropMenuMessage.id && i.guild.id === message.guild.id)
                })

                // Await the user click
                await message.channel.awaitMessageComponent({filter, time: 30000})
                .then(async collected => {
                    collected.deferUpdate();

                    // If cancel button has been clicked
                    if(collected.customId === "Cancel") dropMenuMessage.delete()
                    
                    // If the user selected a map version
                    if(collected.customId === "versions"){

                        // Generating animation
                        const generating = new Discord.EmbedBuilder()
                        generating.setColor(FNBRMENA.Colors("embed"))
                        if(userData.lang === "en") generating.setTitle(`Loading ${allAvaliableVersions[collected.values[0]].patchVersion}'s map... ${emojisObject.loadingEmoji}`)
                        else if(userData.lang == "ar") generating.setTitle(`جاري التحميل ماب ${allAvaliableVersions[collected.values[0]].patchVersion}... ${emojisObject.loadingEmoji}`)
                        dropMenuMessage.edit({embeds: [generating], components: [], files: []})
                        .catch(err => {
                            FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, dropMenuMessage)
                        })
                        try {
                            
                            // Creating canvas
                            const canvas = Canvas.createCanvas(2048, 2048);
                            const ctx = canvas.getContext('2d');

                            // Map image
                            const map = await Canvas.loadImage(allAvaliableVersions[collected.values[0]].url)
                            ctx.drawImage(map, 0, 0, canvas.width, canvas.height)

                            // Fnbrmena credits
                            const border = await Canvas.loadImage('./assets/NPC/border.png')
                            ctx.drawImage(border, 0, 0, canvas.width, canvas.height)

                            // Send the map image
                            var att = new Discord.AttachmentBuilder(canvas.toBuffer(), {name: `${allAvaliableVersions[collected.values[0]].patchVersion}.png`})
                            dropMenuMessage.edit({embeds: [], components: [], files: [att]})
                            .catch(err => {

                                // Try sending it on jpg file format [LOWER QUALITY]
                                var att = new Discord.AttachmentBuilder(canvas.toBuffer('image/jpeg'), {name: `${allAvaliableVersions[collected.values[0]].patchVersion}.jpg`})
                                msg.edit({embeds: [], components: [], files: [att]})
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
                
            }).catch(err => {
                FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, null)
                
            })
        }
    }
}