const Canvas = require('canvas')
const wrap = require('word-wrap')

module.exports = {
    commands: 'augment',
    type: 'Fortnite',
    minArgs: 1,
    maxArgs: null,
    cooldown: -1,
    callback: async (FNBRMENA, message, args, text, Discord, client, admin, userData, alias, emojisObject) => {

        // Registering fonts
        Canvas.registerFont('./assets/font/Lalezar-Regular.ttf', {
            family: 'Arabic',
            style: "bold"
        });
        Canvas.registerFont('./assets/font/BurbankBigCondensed-Black.ttf' ,{
            family: 'Burbank Big Condensed',
            style: "bold"
        })

        // Handle augment image builder
        const augmentsImageBuilder = async (res) => {

            if(userData.lang === "ar"){

                // Arabic is not supported yet
                const notSupportedError = new Discord.EmbedBuilder()
                notSupportedError.setColor(FNBRMENA.Colors("embedError"))
                notSupportedError.setTitle(`Arabic is not supported yet ${emojisObject.errorEmoji}.`)
                message.reply({embeds: [notSupportedError], components: [], files: []})
                return
            }

            // Send the loading message
            const generating = new Discord.EmbedBuilder()
            generating.setColor(FNBRMENA.Colors("embed"))
            if(userData.lang === "en") generating.setTitle(`Loading ${res.name} augment ${emojisObject.loadingEmoji}.`)
            else if(userData.lang === "ar") generating.setTitle(`جاري تحميل تعزيز ${res.name} ${emojisObject.loadingEmoji}.`)
            const msg = await message.reply({embeds: [generating], components: [], files: []})
            try {

                // English augments
                if(userData.lang === "en"){

                    // Create canvas
                    const canvas = Canvas.createCanvas(2200, 650);
                    const ctx = canvas.getContext('2d');

                    // Load background
                    const background = await Canvas.loadImage(`./assets/augments/background${userData.lang}.png`)
                    ctx.drawImage(background, 0, 0, canvas.width, canvas.height)

                    // Drop shadow
                    ctx.shadowOffsetY = 50
                    ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
                    ctx.shadowBlur = 100;

                    // Add the augment image
                    const augmentImg = await Canvas.loadImage(res.icon)
                    ctx.drawImage(augmentImg, 66, 118.5, 413, 413)

                    // Reset shadows
                    ctx.shadowColor = 'rgba(0,0,0,0)';

                    // Change opacity
                    ctx.globalAlpha = 0.1
                    
                    // Add the augment device image
                    const augmentDeviceImg = await Canvas.loadImage('https://media.fortniteapi.io/images/T-T-Icon-BR-PlayerAugmentsGadget-L.png')
                    ctx.drawImage(augmentDeviceImg, 1342, -291, 1192, 1192)

                    // Reset opacity
                    ctx.globalAlpha = 1

                    // Textings obj
                    const textings = {
                        h: 200,
                        tabTitle: {
                            text: `${res.tabTitle} • ${res.rarity.name}`.toUpperCase(),
                            font: '58px Burbank Big Condensed',
                            x: 628,
                            y: 0,
                            h: 65
                        },
                        name: {
                            text: res.name.toUpperCase(),
                            font: ctx.font = '165px Burbank Big Condensed',
                            x: 697,
                            y: 0,
                            h: 145
                        },
                        additionalDescription: {
                            text: wrap(res.additionalDescription).toUpperCase(),
                            font: ctx.font = '58px Burbank Big Condensed',
                            x: 897,
                            y: 0,
                            h: 0
                        },
                        description: {
                            text: wrap(res.description).toUpperCase(),
                            font: ctx.font = '67px Burbank Big Condensed',
                            x: 697,
                            y: 0,
                            h: 165
                        }
                    }

                    wrap(res.additionalDescription.toUpperCase(), {
                        escape: function (s){
                            textings.h += 58
                            textings.additionalDescription.h += 58
                        }
                    })

                    wrap(res.description.toUpperCase(), {
                        escape: function (s){
                            textings.h += 67
                            textings.description.h += 80
                        }
                    })

                    // Mapping y's
                    textings.tabTitle.y = (canvas.height / 2) - (textings.h / 2)
                    textings.name.y = textings.tabTitle.y + textings.tabTitle.h
                    textings.additionalDescription.y = textings.name.y + textings.name.h
                    textings.description.y = textings.additionalDescription.y + textings.additionalDescription.h
                    ctx.textBaseline = 'top'
                    ctx.textAlign = ctx.textAlign = 'left'

                    // Drop shadow
                    ctx.shadowOffsetY = 0
                    ctx.shadowColor = "rgba(0, 222, 255, 1)";

                    // Add tabTitle
                    ctx.fillStyle = '#00d8ff';
                    ctx.textAlign = textings.tabTitle.font
                    ctx.fillText(textings.tabTitle.text, textings.tabTitle.x, textings.tabTitle.y)

                    // Add name
                    ctx.fillStyle = '#ffffff';
                    ctx.font = textings.name.font
                    ctx.fillText(textings.name.text, textings.name.x, textings.name.y)

                    // Reset shadows
                    ctx.shadowColor = 'rgba(0,0,0,0)';

                    // Add additionalDescription
                    ctx.fillStyle = '#aaa9a9';
                    ctx.font = textings.additionalDescription.font
                    ctx.fillText(textings.additionalDescription.text, textings.additionalDescription.x, textings.additionalDescription.y)

                    // Add description
                    ctx.fillStyle = '#ffffff';
                    ctx.font = textings.description.font
                    ctx.fillText(textings.description.text, textings.description.x, textings.description.y)

                    // Send message
                    const att = new Discord.AttachmentBuilder(canvas.toBuffer(), {name: `${res.id}.png`})
                    msg.edit({embeds: [], components: [], files: [att]})
                    .catch(err => {
                        FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, msg)
                    })
                }

            } catch (err) {
                FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, msg)
            }
        }

        // Variables
        var augmentId = text
        
        // Request an augment
        await FNBRMENA.Augments("en")
        .then(async res => {

            // Check if the user searched using an id or a name
            if(augmentId.includes("_")){

                // Filter for aids
                augmentId = await res.data.augments.filter(aid => {
                    return aid.id.toLowerCase() === augmentId.toLowerCase()
                })

            }else{

                // Filter for names
                augmentId = await res.data.augments.filter(aid => {
                    return aid.name.toLowerCase().includes(augmentId.toLowerCase())
                })
            }

        }).catch(err => {
            FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, null)
        })

        // Check if there is an augments found
        if(augmentId.length === 0){
            
            // No augments has been found
            const noAugmentssFoundError = new Discord.EmbedBuilder()
            noAugmentssFoundError.setColor(FNBRMENA.Colors("embedError"))
            if(userData.lang === "en") noAugmentssFoundError.setTitle(`No augments has been found ${emojisObject.errorEmoji}.`)
            else if(userData.lang === "ar") noAugmentssFoundError.setTitle(`لم يتم العثور على اي تعزيزات الواقع ${emojisObject.errorEmoji}.`)
            message.reply({embeds: [noAugmentssFoundError], components: [], files: []})
            return
        }

        // If only one item has been found
        if(augmentId.length === 1){

            // Request a augment
            FNBRMENA.Augments(userData.lang)
            .then(async res => {

                // Check if there is data
                if(res.data.result){

                    // Filter for names
                    res.data.augments.filter(aid => {
                        if(aid.id === augmentId[0].id) // Find the augment
                        
                        // Call the augment image builder
                        augmentsImageBuilder(aid)
                    })
                }else{

                    // No result found
                    const noResultFoundError = new Discord.EmbedBuilder()
                    noResultFoundError.setColor(FNBRMENA.Colors("embedError"))
                    if(userData.lang === "en") noResultFoundError.setTitle(`No result found (API Error) ${emojisObject.errorEmoji}`)
                    else if(userData.lang === "ar") noResultFoundError.setTitle(`لم يتم العثور على نتائج (مشكلة API) ${emojisObject.errorEmoji}`)
                    message.reply({embeds: [noResultFoundError], components: [], files: []})
                }
            }).catch(async err => {
                FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, null)
            })

        }

        // If more than one item has been found
        if(augmentId.length > 1){

            // Check if out of range
            if(augmentId.length >= 120){

                // Too large entry
                const requestEntryTooLargeError = new Discord.EmbedBuilder()
                requestEntryTooLargeError.setColor(FNBRMENA.Colors("embedError"))
                if(userData.lang === "en") requestEntryTooLargeError.setTitle(`Request entry too large ${emojisObject.errorEmoji}`)
                else if(userData.lang === "ar") requestEntryTooLargeError.setTitle(`تم تخطي الكميه المحدودة ${emojisObject.errorEmoji}`)
                message.reply({embeds: [requestEntryTooLargeError], components: [], files: []})
                return

            }

            // Create an embed
            const listAugmentsEmbed = new Discord.EmbedBuilder()
            listAugmentsEmbed.setColor(FNBRMENA.Colors("embed"))

            //set Author
            if(userData.lang === "en"){
                listAugmentsEmbed.setAuthor({name: `Augments`, iconURL: 'https://media.fortniteapi.io/images/T-T-Icon-BR-PlayerAugmentsGadget-L.png'})
                listAugmentsEmbed.setDescription('Please click on the Drop-Down menu and choose an augment.\n`You have only 30 seconds until this operation ends, Make it quick`!')
            }else if(userData.lang === "ar"){
                listAugmentsEmbed.setAuthor({name: `تعزيزات الواقع`, iconURL: 'https://media.fortniteapi.io/images/T-T-Icon-BR-PlayerAugmentsGadget-L.png'})
                listAugmentsEmbed.setDescription('الرجاء الضغط على السهم لاختيار تعزيزات الواقع.\n`لديك فقط 30 ثانية حتى تنتهي العملية, استعجل`!')
            }

            // Create a row for buttons
            const buttonDataRow = new Discord.ActionRowBuilder()
            
            // Add buttons
            if(userData.lang === "en") buttonDataRow.addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`Cancel-${alias}`)
                    .setStyle(Discord.ButtonStyle.Danger)
                    .setLabel("Cancel")
                )

            else if(userData.lang === "ar") buttonDataRow.addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`Cancel-${alias}`)
                    .setStyle(Discord.ButtonStyle.Danger)
                    .setLabel("اغلاق")
                )

            // Force int
            var size = (augmentId.length / 25), components = [], limit = 0
            if(size % 2 !== 0 && size != 1){
                size += 1;
                size = size | 0
            }

            // Loop trough every augment found
            for(let i = 1; i <= size; i++){

                var augments = []
                for(let x = limit; x < 25 * i; x++){

                    if(augmentId[x]) augments.push({
                        label: `${augmentId[x].name}`,
                        value: `${augmentId[x].id}`,
                    })
                }

                // Create a drop menu
                var listAugmentsDropMenu = new Discord.SelectMenuBuilder()
                listAugmentsDropMenu.setCustomId(`${i}`)
                if(userData.lang === "en") listAugmentsDropMenu.setPlaceholder('Nothing selected!')
                else if(userData.lang === "ar") listAugmentsDropMenu.setPlaceholder('لم يتم اختيار شيء بعد!')
                listAugmentsDropMenu.addOptions(augments)

                // Add the drop menu to the categoryDropMenu
                components.push(new Discord.ActionRowBuilder().addComponents(listAugmentsDropMenu))
                limit = 25 * i

            } components.push(buttonDataRow)

            // Send the message
            const dropMenuMessage = await message.reply({embeds: [listAugmentsEmbed], components: components, files: []})

            // Filtering the user clicker
            const filter = (i => {
                return (i.user.id === message.author.id && i.message.id === dropMenuMessage.id && i.guild.id === message.guild.id)
            })

            // Await for the user
            await message.channel.awaitMessageComponent({filter, time: 30000})
            .then(async collected => {
                collected.deferUpdate();

                // If cancel button has been clicked
                if(collected.customId === `Cancel-${alias}`) dropMenuMessage.delete()
                else if(collected.type === Discord.ComponentType.SelectMenu){

                    // Request a augment
                    FNBRMENA.Augments(userData.lang)
                    .then(async res => {

                        // Check if there is a data
                        if(res.data.result){

                            // Call the augment image builder
                            await dropMenuMessage.delete()
                            
                            // Filter for names
                            res.data.augments.filter(aid => {
                                if(aid.id === collected.values[0]) // Find the augment
                                
                                // Call the augment image builder
                                augmentsImageBuilder(aid)
                            })
                        }else{

                            // No result found
                            const noResultFoundError = new Discord.EmbedBuilder()
                            noResultFoundError.setColor(FNBRMENA.Colors("embedError"))
                            if(userData.lang === "en") noResultFoundError.setTitle(`No result found (API Error) ${emojisObject.errorEmoji}.`)
                            else if(userData.lang === "ar") noResultFoundError.setTitle(`لم يتم العثور على نتائج (مشكلة API) ${emojisObject.errorEmoji}.`)
                            dropMenuMessage.edit({embeds: [noResultFoundError], components: [], files: []})
                        }
                    }).catch(async err => {
                        FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, dropMenuMessage)
                    })
                }
            
            }).catch(async err => {
                FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, dropMenuMessage)
            })
        }
    }
}    