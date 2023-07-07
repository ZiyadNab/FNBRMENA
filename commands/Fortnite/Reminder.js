const Canvas = require('canvas')
const moment = require('moment')

module.exports = {
    commands: 'remind',
    type: 'Fortnite',
    descriptionEN: 'Set a reminder for any item in the Itemshop.',
    descriptionAR: 'قم بتعيين تذكير لأي عنصر في متجر العناصر.',
    expectedArgsEN: 'ُTo set a reminder you need to specify any item\'s name.',
    expectedArgsAR: 'لتعيين تذكير ، تحتاج إلى تحديد اسم أي عنصر.',
    argsExample: ['Harley Quinn', 'Son Goku'],
    minArgs: 1,
    maxArgs: null,
    cooldown: -1,
    callback: async (FNBRMENA, message, args, text, Discord, client, admin, userData, alias, emojisObject) => {

        // initializing variables
        var num = 0
        var type = 'name'

        // If the type is id
        if(text.includes("_")) type = 'id'

        // Checking if the item is valid
        await FNBRMENA.Search(userData.lang, type, text)
        .then(async res => {

            // No items has been found
            if(res.data.items.length === 0){

                // No results
                const noCosmeticsHasBeenFoundError = new Discord.EmbedBuilder()
                noCosmeticsHasBeenFoundError.setColor(FNBRMENA.Colors("embedError"))
                if(userData.lang === "en") noCosmeticsHasBeenFoundError.setTitle(`No cosmetic has been found check your speling and try again ${emojisObject.errorEmoji}.`)
                else if(userData.lang === "ar") noCosmeticsHasBeenFoundError.setTitle(`لا يمكنني العثور على العنصر الرجاء التأكد من كتابة الاسم بشكل صحيح ${emojisObject.errorEmoji}.`)
                return message.reply({embeds: [noCosmeticsHasBeenFoundError], components: [], files: []})
                .catch(err => {
                    FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, null)
                })
            }

            // If there is more than one item
            if(res.data.items.length > 1){

                // Create embed
                const listOfCosmeticts = new Discord.EmbedBuilder()
                listOfCosmeticts.setColor(FNBRMENA.Colors("embed"))

                // Loop through every item matching the user input
                var string = ""
                for(let i = 0; i < res.data.items.length; i++){

                    // Store the name to the string
                    string += `• ${i}: ${res.data.items[i].name} (${res.data.items[i].type.name}) \n`
                }

                // How many items where matchinh the user input?
                if(userData.lang === "en") string += `\nFound ${res.data.items.length} item matching your search`
                else if(userData.lang === "ar") string += `\nيوجد ${res.data.items.length} عنصر يطابق عملية البحث`

                // Set Description
                listOfCosmeticts.setDescription(string)

                // Filtering outfits
                const filter = async m => await m.author.id === message.author.id

                // Send the reply to the user
                if(userData.lang === "en") var reply = `please choose your item, listening will be stopped after 20 seconds`
                else if(userData.lang === "ar") var reply = `الرجاء اختيار العنصر، راح يتوقف الامر بعد ٢٠ ثانية`
                const notify = await message.reply({content: reply, embeds: [listOfCosmeticts], components: [], files: []})
                .catch(async err => {
                    FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, null)
                })

                // Await messages
                const collected = await message.channel.awaitMessages({filter, max: 1, time: 20000, errors: ['time']})
                .catch(async err => {
                    FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, { message: "Time" }, emojisObject, notify)
                })

                // Check for collected messages
                if(!collected) return

                // Delete messages
                notify.delete()

                // If the user chosen inside range
                if(collected.first().content >= 0 && collected.first().content < res.data.items.length) num = collected.first().content
                else return FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, { message: "outOfRange" }, emojisObject, null)
            }

            // If the item is correct
            if(res.data.items.length > 0){

                // If the item is from the shop
                if(!res.data.items[num].gameplayTags.includes("Cosmetics.Source.ItemShop")){

                    // If the item source is not an itemshop
                    const itemSourceIsNotAnItemshopError = new Discord.EmbedBuilder()
                    itemSourceIsNotAnItemshopError.setColor(FNBRMENA.Colors("embedError"))
                    if(userData.lang === "en") itemSourceIsNotAnItemshopError.setTitle(`The item source is not an itemshop please reselect again ${emojisObject.errorEmoji}.`)
                    else if(userData.lang === "ar") itemSourceIsNotAnItemshopError.setTitle(`لا يمكنني تذكيرك بالعنصر لانه ليس من متجر العناصر ${emojisObject.errorEmoji}.`)
                    return message.reply({embeds: [itemSourceIsNotAnItemshopError], components: [], files: []})
                    .catch(err => {
                        FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, null)
                    })
                }

                // Seeting up the db firestore
                var db = admin.firestore()

                // Check if the item is already exists
                const access = await db.collection("Users").doc(`${message.author.id}`).collection(`Reminders`).doc(`${res.data.items[num].id}`).get()

                // If the item doen't exists in the database
                if(access.exists){

                    // If the item is already added
                    const itemIsAlreadyAddedError = new Discord.EmbedBuilder()
                    itemIsAlreadyAddedError.setColor(FNBRMENA.Colors("embedError"))
                    if(userData.lang === "en") itemIsAlreadyAddedError.setTitle(`The item is already added for the reminding system ${emojisObject.errorEmoji}.`)
                    else if(userData.lang === "ar") itemIsAlreadyAddedError.setTitle(`تم بالفعل اضافة العنصر من قبل في نظام التذكير ${emojisObject.errorEmoji}.`)
                    return message.reply({embeds: [itemIsAlreadyAddedError], components: [], files: []})
                    .catch(err => {
                        FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, null)
                    })
                }

                // Get the collection from the database
                const snapshot = await db.collection("Users").doc(`${message.author.id}`).collection(`Reminders`).get()

                // Check if the user has enough reminders space
                if(snapshot.size + 1 > 20){

                    // If the reminders passed the limit
                    const remindersHasPassedTheLimitError = new Discord.EmbedBuilder()
                    remindersHasPassedTheLimitError.setColor(FNBRMENA.Colors("embedError"))
                    if(userData.lang === "en") remindersHasPassedTheLimitError.setTitle(`You have passed the limit, please remove items to get enough space ${emojisObject.errorEmoji}.`)
                    else if(userData.lang === "ar") remindersHasPassedTheLimitError.setTitle(`لقد تخطيت الحد المسموح, اخذف بعض العناصر${emojisObject.errorEmoji}.`)
                    return message.reply({embeds: [remindersHasPassedTheLimitError], components: [], files: []})
                    .catch(err => {
                        FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, null)
                    })

                }

                // Loading message
                const generating = new Discord.EmbedBuilder()
                generating.setColor(FNBRMENA.Colors("embed"))
                if(userData.lang === "en") generating.setTitle(`Getting info about the item ${emojisObject.loadingEmoji}`)
                else if(userData.lang === "ar") generating.setTitle(`جاري البحث عن معلومات العنصر ${emojisObject.loadingEmoji}`)
                const msg = await message.reply({embeds: [generating], components: [], files: []})
                .catch(err => {
                    FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, null)
                })

                try {

                    // Registering fonts
                    Canvas.registerFont('./assets/font/Lalezar-Regular.ttf', {
                        family: 'Arabic',
                        style: "bold"
                    })
                    Canvas.registerFont('./assets/font/BurbankBigCondensed-Black.ttf' ,{
                        family: 'Burbank Big Condensed',
                        style: "bold"
                    })

                    // AplyText
                    const applyText = (canvas, text, width, font) => {
                        const ctx = canvas.getContext('2d');
                        let fontSize = font;
                        do {
                            if(userData.lang === "en") ctx.font = `${fontSize -= 1}px Burbank Big Condensed`;
                            else if(userData.lang === "ar") ctx.font = `${fontSize -= 1}px Arabic`;
                        } while (ctx.measureText(text).width > width);
                        return ctx.font;
                    }

                    // Creating canvas
                    const canvas = Canvas.createCanvas(1024, 1024);
                    const ctx = canvas.getContext('2d');

                    // Skin informations
                    if(res.data.items[num].introduction != null){
                        var chapter = res.data.items[num].introduction.chapter.substring(res.data.items[num].introduction.chapter.indexOf(" "), res.data.items[num].introduction.chapter.length).trim()

                        if(userData.lang === "en"){
                            var season = res.data.items[num].introduction.season.substring(res.data.items[num].introduction.season.indexOf(" "), res.data.items[num].introduction.season.length).trim()
                            if(userData.lang === "en") var seasonChapter = `C${chapter}S${season}`

                        }else if(userData.lang == "ar"){
                            if(res.data.items[num].introduction.season.includes("X")) var seasonChapter = `الفصل ${chapter} الموسم X`
                            else{
                                var season = res.data.items[num].introduction.season.substring(res.data.items[num].introduction.season.indexOf(" "), res.data.items[num].introduction.season.length).trim()
                                var seasonChapter = `الفصل ${chapter} الموسم ${season}`
                            }
                        }

                    }else{

                        if(userData.lang === "en") var seasonChapter = `${res.data.items[num].added.version}v`
                        else if(userData.lang == "ar")var seasonChapter = `تحديث ${res.data.items[num].added.version}`
                        
                    }

                    if(res.data.items[num].gameplayTags.length != 0){
                        for(let j = 0; j < res.data.items[num].gameplayTags.length; j++){
                            if(res.data.items[num].gameplayTags[j].includes('Source')){

                                if(res.data.items[num].gameplayTags[j].toLowerCase().includes("itemshop")){

                                    if(userData.lang === "en") var Source = "ITEMSHOP"
                                    else if(userData.lang === "ar") var Source = "متجر العناصر"
                                }else if(res.data.items[num].gameplayTags[j].toLowerCase().includes("battlepass")){

                                    if(userData.lang === "en") var Source = "BATTLEPASS"
                                    else if(userData.lang === "ar") var Source = "بطاقة المعركة"
                                }else if(res.data.items[num].gameplayTags[j].toLowerCase().includes("firstwin")){

                                    if(userData.lang === "en") var Source = "FIRST WIN"
                                    else if(userData.lang === "ar") var Source = "اول انتصار"
                                }else if(res.data.items[num].gameplayTags[j].toLowerCase().includes("event")){

                                    if(userData.lang === "en") var Source = "EVENT"
                                    else if(userData.lang === "ar") var Source = "حدث"
                                }else if(res.data.items[num].gameplayTags[j].toLowerCase().includes("platform") || (res.data.items[num].gameplayTags[j].toLowerCase().includes("promo"))){

                                    if(userData.lang === "en") var Source = "EXCLUSIVE"
                                    else if(userData.lang === "ar") var Source = "حصري"
                                }else if(res.data.items[num].gameplayTags[j].toLowerCase().includes("starterpack")){

                                    if(userData.lang === "en") var Source = "Starter Pack"
                                    else if(userData.lang === "ar") var Source = "حزمة المبتدئين"
                                }

                                break
                            }else var Source = res.data.items[num].type.name.toUpperCase()
                        }

                    }else var Source = res.data.items[num].type.name.toUpperCase()

                    // Set the item info
                    var name = res.data.items[num].name
                    var price = res.data.items[num].price
                    if(res.data.items[num].images.icon === null) var image = 'https://imgur.com/HVH5sqV.png'
                    else var image = res.data.items[num].images.icon
                    if(res.data.items[num].series !== null) var rarity = res.data.items[num].series.id
                    else var rarity = res.data.items[num].rarity.id

                    // Searching...
                    if(rarity === "Legendary"){

                        // Creating image
                        const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/legendary.png')
                        ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, 0, 0, 1024, 1024)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderLegendary.png')
                        ctx.drawImage(skinborder, 0, 0, 1024, 1024)

                    }else if(rarity === "Epic"){

                        // Creating image
                        const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/epic.png')
                        ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, 0, 0, 1024, 1024)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderEpic.png')
                        ctx.drawImage(skinborder, 0, 0, 1024, 1024)
                        
                    }else if(rarity === "Rare"){

                        // Creating image
                        const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/rare.png')
                        ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, 0, 0, 1024, 1024)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderRare.png')
                        ctx.drawImage(skinborder, 0, 0, 1024, 1024)
                        
                    }else if(rarity === "Uncommon"){

                        // Creating image
                        const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/uncommon.png')
                        ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, 0, 0, 1024, 1024)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderUncommon.png')
                        ctx.drawImage(skinborder, 0, 0, 1024, 1024)
                        
                    }else if(rarity === "Common"){

                        // Creating image
                        const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/common.png')
                        ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, 0, 0, 1024, 1024)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderCommon.png')
                        ctx.drawImage(skinborder, 0, 0, 1024, 1024)
                        
                    }else if(rarity === "MarvelSeries"){

                        // Creating image
                        const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/marvel.png')
                        ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, 0, 0, 1024, 1024)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderMarvel.png')
                        ctx.drawImage(skinborder, 0, 0, 1024, 1024)
                        
                    }else if(rarity === "DCUSeries"){

                        // Creating image
                        const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/dc.png')
                        ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, 0, 0, 1024, 1024)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderDc.png')
                        ctx.drawImage(skinborder, 0, 0, 1024, 1024)
                        
                    }else if(rarity === "CUBESeries"){

                        // Creating image
                        const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/dark.png')
                        ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, 0, 0, 1024, 1024)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderDark.png')
                        ctx.drawImage(skinborder, 0, 0, 1024, 1024)
                        
                    }else if(rarity === "CreatorCollabSeries"){

                        // Creating image
                        const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/icon.png')
                        ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, 0, 0, 1024, 1024)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderIcon.png')
                        ctx.drawImage(skinborder, 0, 0, 1024, 1024)
                        
                    }else if(rarity === "ColumbusSeries"){

                        // Creating image
                        const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/starwars.png')
                        ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, 0, 0, 1024, 1024)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderStarwars.png')
                        ctx.drawImage(skinborder, 0, 0, 1024, 1024)
                        
                    }else if(rarity === "ShadowSeries"){

                        // Creating image
                        const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/shadow.png')
                        ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, 0, 0, 1024, 1024)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderShadow.png')
                        ctx.drawImage(skinborder, 0, 0, 1024, 1024)
                        
                    }else if(rarity === "SlurpSeries"){

                        // Creating image
                        const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/slurp.png')
                        ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, 0, 0, 1024, 1024)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderSlurp.png')
                        ctx.drawImage(skinborder, 0, 0, 1024, 1024)
                        
                    }else if(rarity === "FrozenSeries"){

                        // Creating image
                        const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/frozen.png')
                        ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, 0, 0, 1024, 1024)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderFrozen.png')
                        ctx.drawImage(skinborder, 0, 0, 1024, 1024)
                        
                    }else if(rarity === "LavaSeries"){

                        // Creating image
                        const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/lava.png')
                        ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, 0, 0, 1024, 1024)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderLava.png')
                        ctx.drawImage(skinborder, 0, 0, 1024, 1024)
                        
                    }else if(rarity === "PlatformSeries"){

                        // Creating image
                        const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/gaming.png')
                        ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, 0, 0, 1024, 1024)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderGaming.png')
                        ctx.drawImage(skinborder, 0, 0, 1024, 1024)
                        
                    }else{
                        
                        // Creating image
                        const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/common.png')
                        ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, 0, 0, 1024, 1024)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderCommon.png')
                        ctx.drawImage(skinborder, 0, 0, 1024, 1024)
                        
                    }

                    // Add the item name
                    ctx.textAlign = 'center';
                    ctx.fillStyle = '#ffffff';
                    ctx.font = applyText(canvas, name, 900, 72)

                    if(userData.lang === "en"){
                        ctx.fillText(name, 512, (1024 - 30))

                        // Add the item season chapter text
                        ctx.textAlign = "left"
                        ctx.font = applyText(canvas, seasonChapter, 900, 40)
                        ctx.fillText(seasonChapter, 5, (1024 - 7.5))

                        // Add the item source
                        ctx.textAlign = "right"
                        ctx.font = applyText(canvas, Source, 900, 40)
                        ctx.fillText(Source, (1024 - 5), (1024 - 7.5))

                    }else if(userData.lang === "ar"){
                        ctx.fillText(name, 512, (1024 - 60))

                        // Add season chapter text
                        ctx.textAlign = "left"
                        ctx.font = applyText(canvas, seasonChapter, 900, 40)
                        ctx.fillText(seasonChapter, 5, (1024 - 12.5))

                        // Add the item source
                        ctx.textAlign = "right"
                        ctx.font = applyText(canvas, Source, 900, 40)
                        ctx.fillText(Source, (1024 - 5), (1024 - 12.5))

                    }

                    // Inilizing tags
                    var y = 7
                    var x = (canvas.width - 30) - 7

                    for(let i = 0; i < res.data.items[num].gameplayTags.length; i++){

                        // If the item is animated
                        if(res.data.items[num].gameplayTags[i].includes('Animated')){

                            // The itm is animated add the animated icon
                            const skinholder = await Canvas.loadImage('./assets/Tags/T-Icon-Animated-64.png')
                            ctx.drawImage(skinholder, x, y, 30, 30)

                            y += 40
                        }

                        // If the item is reactive
                        if(res.data.items[num].gameplayTags[i].includes('Reactive')){

                            // The itm is animated add the animated icon
                            const skinholder = await Canvas.loadImage('./assets/Tags/T-Icon-Adaptive-64.png')
                            ctx.drawImage(skinholder, x, y, 30, 30)

                            y += 40
                        }

                        // If the item is synced emote
                        if(res.data.items[num].gameplayTags[i].includes('Synced')){

                            // The itm is animated add the animated icon
                            const skinholder = await Canvas.loadImage('./assets/Tags/T-Icon-Synced-64x.png')
                            ctx.drawImage(skinholder, x, y, 30, 30)

                            y += 40
                        }

                        // If the item is traversal
                        if(res.data.items[num].gameplayTags[i].includes('Traversal')){

                            // The itm is animated add the animated icon
                            const skinholder = await Canvas.loadImage('./assets/Tags/T-Icon-Traversal-64.png')
                            ctx.drawImage(skinholder, x, y, 30, 30)

                            y += 40
                        }

                        // If the item has styles
                        if(res.data.items[num].gameplayTags[i].includes('HasVariants') || res.data.items[num].gameplayTags[i].includes('HasUpgradeQuests')){

                            // The itm is animated add the animated icon
                            const skinholder = await Canvas.loadImage('./assets/Tags/T-Icon-Variant-64.png')
                            ctx.drawImage(skinholder, x, y, 30, 30)

                            y += 40
                        }
                    }

                    // If the item contains copyrited audio
                    if(res.data.items[num].copyrightedAudio){

                        // The itm is animated add the animated icon
                        const skinholder = await Canvas.loadImage('./assets/Tags/mute.png')
                        ctx.drawImage(skinholder, x, y, 30, 30)

                        y += 40
                    }

                    // If the item contains built in emote
                    if(res.data.items[num].builtInEmote != null){

                        // Add the builtInEmote icon
                        const builtInEmote = await Canvas.loadImage(res.data.items[num].builtInEmote.images.icon)
                        ctx.drawImage(builtInEmote, x, y, 30, 30)
                    }

                    // Change the local of the moment
                    moment.locale(userData.lang)

                    // Item last seen
                    var Last = ""
                    if(res.data.items[num].lastAppearance !== null){

                        // Setting up moment js
                        const Now = moment();
                        var LastSeenDays = Now.diff(res.data.items[num].lastAppearance, 'days');
                        var LastSeenDate = moment(res.data.items[num].lastAppearance).format("ddd, hA")

                        // Set a last release message
                        if(userData.lang === "en") Last = `${LastSeenDays} days at ${LastSeenDate}`
                        else if(userData.lang === "ar") Last = `${LastSeenDays} يوم في ${LastSeenDate}`

                    }else{

                        // Set non message last release
                        if(userData.lang === "en") Last = "not out yet or the sorce is not an itemshop"
                        else if(userData.lang === "ar") Last = "لم يتم نزول العنصر بعد او مصدر العنصر ليس من الايتم شوب"
                    }

                    // Create embed
                    const itemInfo = new Discord.EmbedBuilder()
                    itemInfo.setColor(FNBRMENA.Colors(rarity))

                    // Set titles and fields
                    if(userData.lang == "en"){
                        itemInfo.setAuthor({name: `Reminder Added, ${res.data.items[num].name}`, iconURL: image})
                        itemInfo.setDescription(`The ${res.data.items[num].name} (${res.data.items[num].type.name}) has been added to your reminders list, And you will now be notified when the ${res.data.items[num].type.name.toLowerCase()} enters the Itemshop.\n\nInformation about ${res.data.items[num].name}:\n**Price:** \`${price}\`\n**Last Appearance:** \`${Last}\`\n\n${emojisObject.ColumbusSeries}You have ${snapshot.size + 1} reminders out of 20.`)
                    }else if(userData.lang === "ar"){
                        itemInfo.setAuthor({name: `تم اضافة تذكير, ${res.data.items[num].name}`, iconURL: image})
                        itemInfo.setDescription(`تم اضافة ${res.data.items[num].name} (${res.data.items[num].type.name}) الى قائمة التذكير, و سوف يتم تنبيهك في حال ${res.data.items[num].type.name.toLowerCase()} توفر في متجر العناصر.\n\nمعلومات عن ${res.data.items[num].name}:\n**السعر:** \`${price}\`\n**اخر ظهور:** \`${Last}\`\n\n${emojisObject.ColumbusSeries} لديك ${snapshot.size} عنصر مضاف من اصل 20.`)
                    }

                    // Send the message
                    var att = new Discord.AttachmentBuilder(canvas.toBuffer(), {name: `${res.data.items[num].id}.png`})
                    msg.edit({embeds: [itemInfo], components: [], files: [att]})
                    .catch(err => {
                
                        // Try sending it on jpg file format [LOWER QUALITY]
                        var att = new Discord.AttachmentBuilder(canvas.toBuffer('image/jpeg'), {name: `${res.data.items[num].id}.jpg`})
                        msg.edit({embeds: [itemInfo], components: [], files: [att]})
                        .catch(err => {
                            FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, msg)
                        })
                    })

                    // Get documents data
                    const doc = await db.collection("Users").doc(`${message.author.id}`)

                    // Add the reminder to the database
                    moment.locale("en")
                    await doc.collection(`Reminders`).doc(`${res.data.items[num].id}`).set({
                        date: `${moment(message.createdAt).format()}`,
                        lang: userData.lang
                    })

                }catch(err) {
                    FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, msg)

                }
            }

        }).catch(async err => {
            FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, null)

        })
    }
}
