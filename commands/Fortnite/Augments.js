const Canvas = require('canvas')
const wrap = require('word-wrap')

module.exports = {
    commands: 'augment',
    type: 'Fortnite',
    descriptionEN: 'Generates images for augments.',
    descriptionAR: 'استخراج صور لتعزيزات الواقع.',
    expectedArgsEN: 'To use the command you need to specifiy an augment name.',
    expectedArgsAR: 'من اجل استخدام الأمر يجب عليك تحديد أسم تعزيز الواقع.',
    hintEN: 'You can search for any augment with just one word. You don\'t need to spell the augment\'s full name. Just type the words you know. For example, search by (F), (Fir), or by its full name (First Assault), And the bot will list all possible augments.',
    hintAR: 'يمكنك البحث عن أي تعزيز الواقع بحرف واحدة فقط. لا تحتاج إلى تهجئة الاسم الكامل لتعزيز الواقع. فقط اكتب الأحرف التي تعرفها. على سبيل المثال ، ابحث عن طريق (F) أو (Fir) أو باسمه الكامل (First Assault) ، وسوف يسرد الروبوت جميع التعزيزات الممكنة.',
    argsExample: ['First Assault', 'F', 'Fir'],
    minArgs: 1,
    maxArgs: null,
    cooldown: -1,
    callback: async (FNBRMENA, message, args, text, Discord, client, admin, userData, alias, emojisObject) => {

        // Registering fonts
        Canvas.registerFont('./assets/font/Alexandria-Black.ttf', {
            family: 'augumentArabic',
            style: "bold"
        })
        Canvas.registerFont('./assets/font/BurbankBigCondensed-Black.ttf' ,{
            family: 'Burbank Big Condensed',
            style: "bold"
        })

        // Handle augment image builder
        const augmentsImageBuilder = async (res) => {

            // Send the loading message
            const generating = new Discord.EmbedBuilder()
            generating.setColor(FNBRMENA.Colors("embed"))
            if(userData.lang === "en") generating.setTitle(`Loading ${res.length} augments ${emojisObject.loadingEmoji}.`)
            else if(userData.lang === "ar") generating.setTitle(`جاري تحميل ${res.length} تعزيزات ${emojisObject.loadingEmoji}.`)
            const msg = await message.reply({embeds: [generating], components: [], files: []})
            .catch(err => {
                FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, null)
            })
            
            try {

                // Canvas variables
                var length = res.length
                var width = 2200
                var height = 0
                var newline = 0
                var x = 0
                var y = 0

                if(length <= 7) length = length
                else if(length >= 8 && length <= 16) length = length / 2
                else length = length / 3

                // Forcing to be int
                if (length % 2 !== 0 && length != 1){
                    length = length | 0;
                }
                
                // Creating height
                if(length === 1) height = 650
                else height += (length * 650) + (length * 10) - 10

                // Creating width
                for(let i = 0; i < res.length; i++){
                    
                    if(newline === length){
                        width += 2200 + 10
                        newline = 0
                    }
                    newline++
                }

                // Reset newline
                newline = 0

                // Create canvas
                const canvas = Canvas.createCanvas(width, height)
                const ctx = canvas.getContext('2d')

                // Load background
                const background = await Canvas.loadImage('./assets/backgroundwhite.jpg')
                ctx.drawImage(background, 0, 0, width, height)

                // Loop through all augments
                for(let i = 0; i < res.length; i++){
                    newline++

                    // Load augument background
                    const background = await Canvas.loadImage(`./assets/augments/background${userData.lang}.png`)
                    ctx.drawImage(background, x, y, 2200, 650)

                    // Drop shadow
                    ctx.shadowOffsetY = 50
                    ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
                    ctx.shadowBlur = 100;

                    // Add the augment image
                    const augmentImg = await Canvas.loadImage(res[i].icon)
                    ctx.drawImage(augmentImg, userData.lang === "ar" ? x + 1721 : x + 66, y + 118.5, 413, 413)

                    // Reset shadows
                    ctx.shadowColor = 'rgba(0,0,0,0)';

                    // Change opacity
                    ctx.globalAlpha = 0.1
                    
                    // Add the augment device image
                    const augmentDeviceImg = await Canvas.loadImage('https://media.fortniteapi.io/images/T-T-Icon-BR-PlayerAugmentsGadget-L.png')
                    ctx.save()
                    ctx.scale(userData.lang === "ar" ? -1 : 1, 1)
                    ctx.drawImage(augmentDeviceImg, userData.lang === "ar" ? x + -858 : x + 1342, y + -291, 1192, 1192)
                    ctx.restore()

                    // Reset opacity
                    ctx.globalAlpha = 1

                    // Chances
                    if(userData.lang === "en") var chance = `${(res[i].weight * 100) | 0}% Chance of luck`
                    else if(userData.lang === "ar") var chance = `نسبة الحظ %${(res[i].weight * 100) | 0}`

                    // Textings obj
                    const textings = {
                        h: 200,
                        tabTitle: {
                            text: `${res[i].tabTitle} • ${res[i].rarity.name} - ${chance}`.toUpperCase(),
                            font: (userData.lang === "en" ? '58px Burbank Big Condensed' : '38px augumentArabic'),
                            x: (userData.lang === "en" ? 628 : 2200 - 628),
                            y: 0,
                            h: (userData.lang === "en" ? 65 : 60)
                        },
                        name: {
                            text: res[i].name.toUpperCase(),
                            font: (userData.lang === "en" ? '165px Burbank Big Condensed' : '135px augumentArabic'),
                            x: (userData.lang === "en" ? 697 : 2200 - 697),
                            y: 0,
                            h: (userData.lang === "en" ? 145 : 195)
                        },
                        additionalDescription: {
                            text: wrap(res[i].additionalDescription).toUpperCase(),
                            font: (userData.lang === "en" ? '58px Burbank Big Condensed' : '38px augumentArabic'),
                            x: (userData.lang === "en" ? 897 : 2200 - 897),
                            y: 0,
                            h: (userData.lang === "en" ? 0 : 10)
                        },
                        description: {
                            text: wrap(res[i].description).toUpperCase(),
                            font: (userData.lang === "en" ? '67px Burbank Big Condensed' : '47px augumentArabic'),
                            x: (userData.lang === "en" ? 697 : 2200 - 697),
                            y: 0,
                            h: (userData.lang === "en" ? 165 : 240)
                        }
                    }

                    wrap(res[i].additionalDescription.toUpperCase(), {
                        escape: function (s){
                            textings.h += 58
                            textings.additionalDescription.h += 58
                        }
                    })

                    wrap(res[i].description.toUpperCase(), {
                        escape: function (s){
                            textings.h += 67
                            textings.description.h += 80
                        }
                    })

                    // Mapping y's
                    textings.tabTitle.y = (650 / (userData.lang === "ar" ? 3 : 2)) - (textings.h / (userData.lang === "ar" ? 3 : 2))
                    textings.name.y = textings.tabTitle.y + textings.tabTitle.h
                    textings.additionalDescription.y = textings.name.y + textings.name.h
                    textings.description.y = textings.additionalDescription.y + textings.additionalDescription.h
                    ctx.textBaseline = 'top'
                    ctx.textAlign = userData.lang === "en" ? 'left' : 'right'

                    // Drop shadow
                    ctx.shadowOffsetY = 0
                    ctx.shadowColor = "rgba(0, 222, 255, 1)";

                    // Add tabTitle
                    ctx.fillStyle = '#00d8ff';
                    ctx.font = textings.tabTitle.font
                    ctx.fillText(textings.tabTitle.text, x + textings.tabTitle.x, y + textings.tabTitle.y)

                    // Add name
                    ctx.fillStyle = '#ffffff';
                    ctx.font = textings.name.font
                    ctx.fillText(textings.name.text, x + textings.name.x, y + textings.name.y)

                    // Reset shadows
                    ctx.shadowColor = 'rgba(0,0,0,0)';

                    // Add additionalDescription
                    ctx.fillStyle = '#aaa9a9';
                    ctx.font = textings.additionalDescription.font
                    ctx.fillText(textings.additionalDescription.text, x + textings.additionalDescription.x, y + textings.additionalDescription.y)

                    // Add description
                    ctx.fillStyle = '#ffffff';
                    ctx.font = textings.description.font
                    ctx.fillText(textings.description.text, x + textings.description.x, y + textings.description.y)

                    // Changing x and y
                    y = y + 10 + 650;
                    if(length === newline){
                        x = x + 10 + 2200; 
                        y = 0;
                        newline = 0;
                    }
                }

                // Send message
                var att = new Discord.AttachmentBuilder(canvas.toBuffer(), {name: `${message.author.id}-${res.length}augments.png`})
                msg.edit({embeds: [], components: [], files: [att]})
                .catch(err => {

                    // Try sending it on jpg file format [LOWER QUALITY]
                    var att = new Discord.AttachmentBuilder(canvas.toBuffer('image/jpeg'), {name: `${message.author.id}-${res.length}augments.jpg`})
                    msg.edit({embeds: [], components: [], files: [att]})
                    .catch(err => {
                        FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, msg)
                    })
                })

            } catch (err) {
                FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, msg)
            }
        }

        // Variables
        var augmentId = []
        const listOfAugments = []
        
        // Request an augment
        const requestedAugment = await FNBRMENA.Augments("en")
        .catch(err => {
            FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, null)
        })

         // Storing the items
         var list = []
         var listCounter = 0
         while(text.indexOf("+") !== -1){
 
             // Getting the index of the + in text string
             var stringNumber = text.indexOf("+")
             // Substring the cosmetic name and store it
             var cosmetic = text.substring(0,stringNumber)
             // Trimming every space
             cosmetic = cosmetic.trim()
             // Store it into the array
             list[listCounter] = cosmetic
             // Remove the cosmetic from text to start again if the while statment !== -1
             text = text.replace(cosmetic + ' +','')
             // Remove every space in text
             text = text.trim()
             // Add the listCounter index
             listCounter++
             // End of wile lets try aagin
         }
 
         // Still there is the last cosmetic name so lets trim text
         text = text.trim()
         // Add the what text holds in the last index
         list[listCounter++] = text
 
         // Loop through every item
         for(let i = 0; i < list.length; i++){

            // Check if the user searched using an id or a name
            if(list[i].includes("_")){

                // Filter for aids
                augmentId = await requestedAugment.data.augments.filter(aid => {
                    return aid.id.toLowerCase() === list[i].toLowerCase()
                })

            }else{

                // Filter for names
                augmentId = await requestedAugment.data.augments.filter(aid => {
                    return aid.name.toLowerCase().includes(list[i].toLowerCase())
                })
            }

            // Check if there is an augments found
            if(augmentId.length === 0){
                
                // No augments has been found
                const noAugmentssFoundError = new Discord.EmbedBuilder()
                noAugmentssFoundError.setColor(FNBRMENA.Colors("embedError"))
                if(list.length === 1){
                    if(userData.lang === "en") noAugmentssFoundError.setTitle(`No augments has been found ${emojisObject.errorEmoji}.`)
                    else if(userData.lang === "ar") noAugmentssFoundError.setTitle(`لم يتم العثور على اي تعزيزات الواقع ${emojisObject.errorEmoji}.`)
                    return message.reply({embeds: [noAugmentssFoundError], components: [], files: []})
                    .catch(err => {
                        FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, msg)
                    })
                }else{
                    if(userData.lang === "en") noAugmentssFoundError.setTitle(`Can't find ${list[i]}, Attempting to skip ${emojisObject.errorEmoji}.`)
                    else if(userData.lang === "ar") noAugmentssFoundError.setTitle(`لا يمكنني العثور على ${list[i]} , سوف يتم تخطي العنصر ${emojisObject.errorEmoji}.`)
                    message.reply({embeds: [noAugmentssFoundError], components: [], files: []})
                    .catch(err => {
                        FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, msg)
                    })
                }
            }

            // If only one item has been found
            if(augmentId.length === 1){

                // Request a augment
                await FNBRMENA.Augments(userData.lang)
                .then(async res => {

                    // Check if there is data
                    if(!res.data.result){

                        // No result found
                        const noResultFoundError = new Discord.EmbedBuilder()
                        noResultFoundError.setColor(FNBRMENA.Colors("embedError"))
                        if(userData.lang === "en") noResultFoundError.setTitle(`No result found (API Error) ${emojisObject.errorEmoji}`)
                        else if(userData.lang === "ar") noResultFoundError.setTitle(`لم يتم العثور على نتائج (مشكلة API) ${emojisObject.errorEmoji}`)
                        return message.reply({embeds: [noResultFoundError], components: [], files: []})
                        .catch(err => {
                            FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, null)
                        })
                    }

                    // Filter for names
                    res.data.augments.filter(aid => {
                        if(aid.id === augmentId[0].id) // Find the augment
                        listOfAugments.push(aid)
                    })

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
                    return message.reply({embeds: [requestEntryTooLargeError], components: [], files: []})
                    .catch(err => {
                        FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, null)
                    })
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
                            description: `Added in ${augmentId[x].added.version}`,
                            emoji: `${emojisObject[augmentId[x].rarity.id].name}:${emojisObject[augmentId[x].rarity.id].id}`,
                            value: `${augmentId[x].id}`,
                        })
                    }

                    // Create a drop menu
                    var listAugmentsDropMenu = new Discord.StringSelectMenuBuilder()
                    listAugmentsDropMenu.setCustomId(`${i}`)
                    listAugmentsDropMenu.setMinValues(1)
                    listAugmentsDropMenu.setMaxValues(augments.length)
                    if(userData.lang === "en") listAugmentsDropMenu.setPlaceholder('Nothing selected!')
                    else if(userData.lang === "ar") listAugmentsDropMenu.setPlaceholder('لم يتم اختيار شيء بعد!')
                    listAugmentsDropMenu.addOptions(augments)

                    // Add the drop menu to the categoryDropMenu
                    components.push(new Discord.ActionRowBuilder().addComponents(listAugmentsDropMenu))
                    limit = 25 * i

                } components.push(buttonDataRow)

                // Send the message
                const dropMenuMessage = await message.reply({embeds: [listAugmentsEmbed], components: components, files: []})
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
                    if(collected.customId === `Cancel-${alias}`) dropMenuMessage.delete()
                    else if(collected.type === Discord.ComponentType.SelectMenu){

                        // Request a augment
                        await FNBRMENA.Augments(userData.lang)
                        .then(async res => {

                            // Check if there is a data
                            if(!res.data.result){

                                // No result found
                                const noResultFoundError = new Discord.EmbedBuilder()
                                noResultFoundError.setColor(FNBRMENA.Colors("embedError"))
                                if(userData.lang === "en") noResultFoundError.setTitle(`No result found (API Error) ${emojisObject.errorEmoji}.`)
                                else if(userData.lang === "ar") noResultFoundError.setTitle(`لم يتم العثور على نتائج (مشكلة API) ${emojisObject.errorEmoji}.`)
                                return dropMenuMessage.edit({embeds: [noResultFoundError], components: [], files: []})
                                .catch(err => {
                                    FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, dropMenuMessage)
                                })
                            }

                            // Call the augment image builder
                            await dropMenuMessage.delete()
                                
                            // Filter for names
                            res.data.augments.filter(aid => {
                                if(collected.values.includes(aid.id)) // Find the augment
                                listOfAugments.push(aid)
                            })

                        }).catch(async err => {
                            FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, dropMenuMessage)
                        })
                    }
                
                }).catch(async err => {
                    FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, dropMenuMessage)
                })
            }
        }

        // Call the augment image builder
        if(listOfAugments.length > 0) augmentsImageBuilder(listOfAugments)
    }
}    