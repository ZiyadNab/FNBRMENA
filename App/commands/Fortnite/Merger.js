const Canvas = require('canvas');
const discord = require('discord.js');
const itemFinder = require('../../Handlers/itemFinder');

module.exports = {
    commands: 'merge',
    type: 'Fortnite',
    descriptionEN: 'Merge any cosmetics together in one image.',
    descriptionAR: 'ادمج مجموعة من العناصر في صورة وحدة.',
    expectedArgsEN: 'ُTo start merging, Type the command, Then the first item name, and add the (+) symbol to add another item, and so on.',
    expectedArgsAR: 'لبدء الدمج ، اكتب الأمر ، ثم اسم العنصر الأول ، وأضف الرمز (+) لإضافة عنصر آخر ، وهكذا.',
    hintEN: 'You can merge items using their name, id, or (*) symbol. Where this symbol can be used to merge multiple items at once without typing each item\'s name or, if you want to merge items but you don\'t know their names by just answering some questions about them.',
    hintAR: 'يمكنك دمج العناصر باستخدام الاسم أو المعرف أو رمز (*). حيث يمكن استخدام هذا الرمز لدمج عدة عناصر مرة واحدة دون كتابة اسم كل عنصر ، أو إذا كنت تريد دمج العناصر ولكنك لا تعرف أسمائها بمجرد الإجابة على بعض الأسئلة المتعلقة بها.',
    argsExample: ['Ninja + Harley Quinn + Light Knives', 'Ninja + EID_Floss + Light Knives', 'Ninja + * + EID_Socks_XA9HM'],
    minArgs: 1,
    maxArgs: null,
    cooldown: 15,
    callback: async (FNBRMENA, message, args, text, Discord, client, admin, userData, alias, emojisObject) => {

        // Num for the specific item
        var num = 0

        // Inisilizing mergedItemsDataList
        const mergedItemsDataList = []

        // Specify the parms
        var type = "name"

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

            // If the input is an id
            if(list[i].includes("_")) type = "id"
            else type = "name"

            // If the input is *
            if(list[i] === "*"){

                // Get the url request
                list[i] = await itemFinder(FNBRMENA, message, client, userData.lang, emojisObject)

                // Change the request type
                type = "custom"
            }
            
            // Request data
            if(list[i]) var res = await FNBRMENA.Search(userData.lang, type, list[i])
            .catch(async err => {
                FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, null)
            })

            // If canceled
            if(!res) return

            try {

                // If the result is more than one item
                if(res.data.items.length > 1){

                    // Create embed
                    const list = new Discord.EmbedBuilder()
                    list.setColor(FNBRMENA.Colors("embed"))

                    // Loop through every item matching the user input
                    var string = ``
                    for(let i = 0; i < res.data.items.length; i++){

                        // Store the name to the string
                        string += `• ${i}: ${res.data.items[i].name} (${res.data.items[i].type.name}) \n`
                    }

                    if(userData.lang === "en") string += `• -1: Merge them all \nFound ${res.data.items.length} item matching your search`
                    else if(userData.lang === "ar") string += `• -1: دمج جميع العناصر \n يوجد ${res.data.items.length} عنصر يطابق عملية البحث`

                    // Set Description
                    if(string.length <= 4096) list.setDescription(string)
                    else throw new Error("too large")

                    // Filtering outfits
                    const filter = async m => await m.author.id === message.author.id

                    // Send the reply to the user
                    if(userData.lang === "en") var reply = `please choose your item, listening will be stopped after 20 seconds`
                    else if(userData.lang === "ar") var reply = `الرجاء كتابة اسم العنصر، راح يتوقف الامر بعد ٢٠ ثانية`
                    const notify = await message.reply({content: reply, embeds: [list], components: [], files: []})
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
                    
                    // Deleting messages
                    notify.delete()

                    // If the user chosen inside range
                    if(collected.first().content >= 0 && collected.first().content < res.data.items.length || collected.first().content === "-1") num = collected.first().content
                    else return FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, { message: "outOfRange" }, emojisObject, null)
                }

                // If there is no item found
                if(res.data.items.length === 0 && list.length > 1){

                    // Error happened
                    const noItemsMatchingError = new Discord.EmbedBuilder()
                    noItemsMatchingError.setColor(FNBRMENA.Colors("embedError"))
                    if(userData.lang === "en") noItemsMatchingError.setTitle(`There is no items matching your entry ${emojisObject.errorEmoji}\n\`Attempting to skip '${list[i]}' item.\``)
                    else if(userData.lang === "ar") noItemsMatchingError.setTitle(`لا يمكنني العثور على عناصر تناسب ادوات البحث الخاصة بك ${emojisObject.errorEmoji}\n\`سوف يتم تخطي '${list[i]}'.\``)
                    message.reply({embeds: [noItemsMatchingError], components: [], files: []})
                    .catch(err => {
                        FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, null)
                    })
                }

                // If there is no item found
                if(res.data.items.length === 0 && list.length <= 1){

                    // Error happened
                    const noItemsMatchingError = new Discord.EmbedBuilder()
                    noItemsMatchingError.setColor(FNBRMENA.Colors("embedError"))
                    if(userData.lang === "en") noItemsMatchingError.setTitle(`Couldn't find ${list[i]} item, please try again ${emojisObject.errorEmoji}`)
                    else if(userData.lang === "ar") noItemsMatchingError.setTitle(`لم يمكنني العثور على ${list[i]} من فضلك حاول مجددا ${emojisObject.errorEmoji}`)
                    return message.reply({embeds: [noItemsMatchingError], components: [], files: []})
                    .catch(err => {
                        FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, null)
                    })
                    
                }

                // If everything is correct start merging
                if(res.data.items.length > 0){

                    // If the user wants to merge all or not
                    if(num !== "-1") mergedItemsDataList.push(res.data.items[num])
                    else res.data.items.forEach(itemData => {
                        mergedItemsDataList.push(itemData)
                    })
                }
                
                // Change the index
                num = 0
            } catch (err) { 
                return FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, null)
            }
        }

        // Getting item data loading
        const generating = new Discord.EmbedBuilder()
        generating.setColor(FNBRMENA.Colors("embed"))
        if(userData.lang === "en") generating.setTitle(`Loading a total ${mergedItemsDataList.length} items... ${emojisObject.loadingEmoji}`)
        else if(userData.lang === "ar") generating.setTitle(`جاري تحميل ${mergedItemsDataList.length} عنصر... ${emojisObject.loadingEmoji}`)
        const msg = await message.reply({embeds: [generating], components: [], files: []})
        .catch(err => {
            FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, null)
        })

        try {

            // Registering fonts
            Canvas.registerFont('./assets/font/Lalezar-Regular.ttf', {family: 'Arabic',weight: "400",style: "bold"});
            Canvas.registerFont('./assets/font/BurbankBigCondensed-Black.ttf' ,{family: 'Burbank Big Condensed',weight: "400",style: "bold"})

            // AplyText
            const applyText = (canvas, text, width, font) => {
                const ctx = canvas.getContext('2d');
                let fontSize = font;
                do {
                    if(userData.lang === "en") ctx.font = `${fontSize -= 1}px Burbank Big Condensed`;
                    else if(userData.lang === "ar") ctx.font = `${fontSize -= 1}px Arabic`;
                } while (ctx.measureText(text).width > width);
                return ctx.font;
            };

            // Canvas variables
            var width = 0
            var height = 1024
            var newline = 0
            var x = 0
            var y = 0

            // Canvas length
            var length = mergedItemsDataList.length

            if(length <= 2) length = length
            else if(length >= 3 && length <= 4) length = length / 2
            else if(length > 4 && length <= 7) length = length / 3
            else if(length > 7 && length <= 50)length = length / 5
            else if(length > 50 && length <= 70) length = length / 7
            else length = length / 10

            // Forcing to be int
            if (length % 2 !== 0){
                length += 1;
                length = length | 0;
            }
            
            // Creating width
            if(mergedItemsDataList.length === 1) width = 1024
            else width += (length * 1024) + (length * 10) - 10

            // Creating height
            for(let i = 0; i < mergedItemsDataList.length; i++){
                
                if(newline === length){
                    height += 1024 + 10
                    newline = 0
                }
                newline++
            }

            // Creating canvas
            const canvas = Canvas.createCanvas(width, height);
            const ctx = canvas.getContext('2d');

            //background
            const background = await Canvas.loadImage('./assets/backgroundwhite.jpg')
            ctx.drawImage(background, 0, 0, canvas.width, canvas.height)

            // Reseting newline
            newline = 0

            // Loop through every item
            for(let i = 0; i < mergedItemsDataList.length; i++){
                ctx.fillStyle = '#ffffff';

                // Skin informations
                if(mergedItemsDataList[i].introduction != null){
                    var chapter = mergedItemsDataList[i].introduction.chapter.substring(mergedItemsDataList[i].introduction.chapter.indexOf(" "), mergedItemsDataList[i].introduction.chapter.length).trim()

                        if(userData.lang === "en"){
                            var season = mergedItemsDataList[i].introduction.season.substring(mergedItemsDataList[i].introduction.season.indexOf(" "), mergedItemsDataList[i].introduction.season.length).trim()
                            if(userData.lang === "en") var seasonChapter = `C${chapter}S${season}`

                        }else if(userData.lang == "ar"){
                            if(mergedItemsDataList[i].introduction.season.includes("X")) var seasonChapter = `الفصل ${chapter} الموسم X`
                            else{
                                var season = mergedItemsDataList[i].introduction.season.substring(mergedItemsDataList[i].introduction.season.indexOf(" "), mergedItemsDataList[i].introduction.season.length).trim()
                                var seasonChapter = `الفصل ${chapter} الموسم ${season}`
                            }
                        }

                }else{

                    if(userData.lang === "en") var seasonChapter = `${mergedItemsDataList[i].added.version}v`
                    else if(userData.lang == "ar")var seasonChapter = `تحديث ${mergedItemsDataList[i].added.version}`
                    
                }

                if(mergedItemsDataList[i].gameplayTags.length != 0){
                    for(let j = 0; j < mergedItemsDataList[i].gameplayTags.length; j++){
                        if(mergedItemsDataList[i].gameplayTags[j].includes('Source')){

                            if(mergedItemsDataList[i].gameplayTags[j].toLowerCase().includes("itemshop")){

                                if(userData.lang === "en") var Source = "ITEMSHOP"
                                else if(userData.lang === "ar") var Source = "متجر العناصر"
                            }else if(mergedItemsDataList[i].gameplayTags[j].toLowerCase().includes("seasonshop")){

                                if(userData.lang === "en") var Source = "SEASON SHOP"
                                else if(userData.lang === "ar") var Source = "متجر الموسم"
                            }else if(mergedItemsDataList[i].gameplayTags[j].toLowerCase().includes("battlepass")){

                                if(userData.lang === "en") var Source = "BATTLEPASS"
                                else if(userData.lang === "ar") var Source = "بطاقة المعركة"
                            }else if(mergedItemsDataList[i].gameplayTags[j].toLowerCase().includes("firstwin")){

                                if(userData.lang === "en") var Source = "FIRST WIN"
                                else if(userData.lang === "ar") var Source = "اول انتصار"
                            }else if(mergedItemsDataList[i].gameplayTags[j].toLowerCase().includes("event")){

                                if(userData.lang === "en") var Source = "EVENT"
                                else if(userData.lang === "ar") var Source = "حدث"
                            }else if(mergedItemsDataList[i].gameplayTags[j].toLowerCase().includes("platform") || (mergedItemsDataList[i].gameplayTags[j].toLowerCase().includes("promo"))){

                                if(userData.lang === "en") var Source = "EXCLUSIVE"
                                else if(userData.lang === "ar") var Source = "حصري"
                            }else if(mergedItemsDataList[i].gameplayTags[j].toLowerCase().includes("starterpack")){

                                if(userData.lang === "en") var Source = "Starter Pack"
                                else if(userData.lang === "ar") var Source = "حزمة المبتدئين"
                            }

                            break
                        }else var Source = mergedItemsDataList[i].type.name.toUpperCase()
                    }

                }else var Source = mergedItemsDataList[i].type.name.toUpperCase()

               // Skin informations
               var name = mergedItemsDataList[i].name
               if(mergedItemsDataList[i].images.icon === null) var image = 'https://imgur.com/HVH5sqV.png'
               else var image = mergedItemsDataList[i].images.icon
               if(mergedItemsDataList[i].series === null) var rarity = mergedItemsDataList[i].rarity.id
               else var rarity = mergedItemsDataList[i].series.id
               newline = newline + 1;

               // Searching...
               if(rarity === "Legendary"){

                // Creating image
                const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/legendary.png')
                ctx.drawImage(skinholder, x, y, 1024, 1024)
                const skin = await Canvas.loadImage(image);
                ctx.drawImage(skin, x, y, 1024, 1024)
                const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderLegendary.png')
                ctx.drawImage(skinborder, x, y, 1024, 1024)
                
                }else if(rarity === "Epic"){

                    // Creating image
                    const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/epic.png')
                    ctx.drawImage(skinholder, x, y, 1024, 1024)
                    const skin = await Canvas.loadImage(image);
                    ctx.drawImage(skin, x, y, 1024, 1024)
                    const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderEpic.png')
                    ctx.drawImage(skinborder, x, y, 1024, 1024)
                    
                }else if(rarity === "Rare"){

                    // Creating image
                    const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/rare.png')
                    ctx.drawImage(skinholder, x, y, 1024, 1024)
                    const skin = await Canvas.loadImage(image);
                    ctx.drawImage(skin, x, y, 1024, 1024)
                    const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderRare.png')
                    ctx.drawImage(skinborder, x, y, 1024, 1024)

                }else if(rarity === "Uncommon"){

                    // Creating image
                    const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/uncommon.png')
                    ctx.drawImage(skinholder, x, y, 1024, 1024)
                    const skin = await Canvas.loadImage(image);
                    ctx.drawImage(skin, x, y, 1024, 1024)
                    const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderUncommon.png')
                    ctx.drawImage(skinborder, x, y, 1024, 1024)
                    
                }else if(rarity === "Common"){
                
                    // Creating image
                    const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/common.png')
                    ctx.drawImage(skinholder, x, y, 1024, 1024)
                    const skin = await Canvas.loadImage(image);
                    ctx.drawImage(skin, x, y, 1024, 1024)
                    const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderCommon.png')
                    ctx.drawImage(skinborder, x, y, 1024, 1024)
                    
                }else if(rarity === "MarvelSeries"){

                    // Creating image
                    const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/marvel.png')
                    ctx.drawImage(skinholder, x, y, 1024, 1024)
                    const skin = await Canvas.loadImage(image);
                    ctx.drawImage(skin, x, y, 1024, 1024)
                    const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderMarvel.png')
                    ctx.drawImage(skinborder, x, y, 1024, 1024)
                    
                }else if(rarity === "DCUSeries"){

                    // Creating image
                    const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/dc.png')
                    ctx.drawImage(skinholder, x, y, 1024, 1024)
                    const skin = await Canvas.loadImage(image);
                    ctx.drawImage(skin, x, y, 1024, 1024)
                    const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderDc.png')
                    ctx.drawImage(skinborder, x, y, 1024, 1024)
                    
                }else if(rarity === "CUBESeries"){

                    // Creating image
                    const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/dark.png')
                    ctx.drawImage(skinholder, x, y, 1024, 1024)
                    const skin = await Canvas.loadImage(image);
                    ctx.drawImage(skin, x, y, 1024, 1024)
                    const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderDark.png')
                    ctx.drawImage(skinborder, x, y, 1024, 1024)
                    
                }else if(rarity === "CreatorCollabSeries"){

                    // Creating image
                    const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/icon.png')
                    ctx.drawImage(skinholder, x, y, 1024, 1024)
                    const skin = await Canvas.loadImage(image);
                    ctx.drawImage(skin, x, y, 1024, 1024)
                    const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderIcon.png')
                    ctx.drawImage(skinborder, x, y, 1024, 1024)
                    
                }else if(rarity === "ColumbusSeries"){

                    // Creating image
                    const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/starwars.png')
                    ctx.drawImage(skinholder, x, y, 1024, 1024)
                    const skin = await Canvas.loadImage(image);
                    ctx.drawImage(skin, x, y, 1024, 1024)
                    const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderStarwars.png')
                    ctx.drawImage(skinborder, x, y, 1024, 1024)
                    
                }else if(rarity === "ShadowSeries"){

                    // Creating image
                    const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/shadow.png')
                    ctx.drawImage(skinholder, x, y, 1024, 1024)
                    const skin = await Canvas.loadImage(image);
                    ctx.drawImage(skin, x, y, 1024, 1024)
                    const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderShadow.png')
                    ctx.drawImage(skinborder, x, y, 1024, 1024)
                    
                }else if(rarity === "SlurpSeries"){

                    // Creating image
                    const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/slurp.png')
                    ctx.drawImage(skinholder, x, y, 1024, 1024)
                    const skin = await Canvas.loadImage(image);
                    ctx.drawImage(skin, x, y, 1024, 1024)
                    const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderSlurp.png')
                    ctx.drawImage(skinborder, x, y, 1024, 1024)
                    
                }else if(rarity === "FrozenSeries"){

                    // Creating image
                    const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/frozen.png')
                    ctx.drawImage(skinholder, x, y, 1024, 1024)
                    const skin = await Canvas.loadImage(image);
                    ctx.drawImage(skin, x, y, 1024, 1024)
                    const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderFrozen.png')
                    ctx.drawImage(skinborder, x, y, 1024, 1024)
                    
                }else if(rarity === "LavaSeries"){

                    // Creating image
                    const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/lava.png')
                    ctx.drawImage(skinholder, x, y, 1024, 1024)
                    const skin = await Canvas.loadImage(image);
                    ctx.drawImage(skin, x, y, 1024, 1024)
                    const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderLava.png')
                    ctx.drawImage(skinborder, x, y, 1024, 1024)
                    
                }else if(rarity === "PlatformSeries"){

                    // Creating image
                    const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/gaming.png')
                    ctx.drawImage(skinholder, x, y, 1024, 1024)
                    const skin = await Canvas.loadImage(image);
                    ctx.drawImage(skin, x, y, 1024, 1024)
                    const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderGaming.png')
                    ctx.drawImage(skinborder, x, y, 1024, 1024)
                    
                }else{

                    // Creating image
                    const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/common.png')
                    ctx.drawImage(skinholder, x, y, 1024, 1024)
                    const skin = await Canvas.loadImage(image);
                    ctx.drawImage(skin, x, y, 1024, 1024)
                    const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderCommon.png')
                    ctx.drawImage(skinborder, x, y, 1024, 1024)
                    
                }

                // Add the item name
                ctx.textAlign = 'center';
                ctx.font = applyText(canvas, name, 900, 72)

                if(userData.lang === "en"){
                    ctx.fillText(name, 512 + x, (1024 - 30) + y)

                    // Add the item season chapter text
                    ctx.textAlign = "left"
                    ctx.font = applyText(canvas, seasonChapter, 900, 40)
                    ctx.fillText(seasonChapter, 5 + x, (1024 - 7.5) + y)

                    // Add the item source
                    ctx.textAlign = "right"
                    ctx.font = applyText(canvas, Source, 900, 40)
                    ctx.fillText(Source, (1024 - 5) + x, (1024 - 7.5) + y)

                }else if(userData.lang === "ar"){
                    ctx.fillText(name, 512 + x, (1024 - 60) + y)

                    // Add season chapter text
                    ctx.textAlign = "left"
                    ctx.font = applyText(canvas, seasonChapter, 900, 40)
                    ctx.fillText(seasonChapter, 5 + x, (1024 - 12.5) + y)

                    // Add the item source
                    ctx.textAlign = "right"
                    ctx.font = applyText(canvas, Source, 900, 40)
                    ctx.fillText(Source, (1024 - 5) + x, (1024 - 12.5) + y)

                }

                // Inilizing tags
                var wTags = (1024 / 512) * 15
                var hTags = (1024 / 512) * 15
                var yTags = 7 + y
                var xTags = ((1024 - wTags) - 7) + x

                for(let t = 0; t < mergedItemsDataList[i].gameplayTags.length; t++){

                    // If the item is animated
                    if(mergedItemsDataList[i].gameplayTags[t].includes('Animated')){

                        // Add the animated icon
                        const Animated = await Canvas.loadImage('./assets/Tags/T-Icon-Animated-64.png')
                        ctx.drawImage(Animated, xTags, yTags, wTags, hTags)

                        yTags += hTags + 10
                    }

                    // If the item is reactive
                    if(mergedItemsDataList[i].gameplayTags[t].includes('Reactive')){

                        // Add the reactive icon
                        const Reactive = await Canvas.loadImage('./assets/Tags/T-Icon-Adaptive-64.png')
                        ctx.drawImage(Reactive, xTags, yTags, wTags, hTags)

                        yTags += hTags + 10
                        
                    }

                    // If the item is synced emote
                    if(mergedItemsDataList[i].gameplayTags[t].includes('Synced')){

                        // Add the Synced icon
                        const Synced = await Canvas.loadImage('./assets/Tags/T-Icon-Synced-64x.png')
                        ctx.drawImage(Synced, xTags, yTags, wTags, hTags)

                        yTags += hTags + 10
                        
                    }

                    // If the item is traversal
                    if(mergedItemsDataList[i].gameplayTags[t].includes('Traversal')){

                        // Add the Traversal icon
                        const Traversal = await Canvas.loadImage('./assets/Tags/T-Icon-Traversal-64.png')
                        ctx.drawImage(Traversal, xTags, yTags, wTags, hTags)

                        yTags += hTags + 10
                    }

                    // If the item has styles
                    if(mergedItemsDataList[i].gameplayTags[t].includes('HasVariants') || mergedItemsDataList[i].gameplayTags[t].includes('HasUpgradeQuests')){

                        // Add the HasVariants icon
                        const HasVariants = await Canvas.loadImage('./assets/Tags/T-Icon-Variant-64.png')
                        ctx.drawImage(HasVariants, xTags, yTags, wTags, hTags)

                        yTags += hTags + 10
                    }
                }

                // If the item contains copyrited audio
                if(mergedItemsDataList[i].copyrightedAudio){

                    // Add the copyrightedAudio icon
                    const copyrightedAudio = await Canvas.loadImage('./assets/Tags/mute.png')
                    ctx.drawImage(copyrightedAudio, xTags, yTags, wTags, hTags)

                    yTags += hTags + 10
                }

                // If the item contains built in emote
                if(mergedItemsDataList[i].builtInEmote != null){

                    // Add the builtInEmote icon
                    const builtInEmote = await Canvas.loadImage(mergedItemsDataList[i].builtInEmote.images.icon)
                    ctx.drawImage(builtInEmote, xTags - 15, yTags, ((1024 / 512) * 30) + x, ((1024 / 512) * 30) + y)
                }

                // Changing x and y
                x = x + 10 + 1024; 
                if(length === newline){
                    y = y + 10 + 1024;
                    x = 0;
                    newline = 0;
                }
            }

            // Send the image
            var att = new Discord.AttachmentBuilder(canvas.toBuffer(), {name: `${message.author.id}.png`})
            msg.edit({embeds: [], components: [], files: [att]})
            .catch(err => {

                // Try sending it on jpg file format [LOWER QUALITY]
                var att = new Discord.AttachmentBuilder(canvas.toBuffer('image/jpeg'), {name: `${message.author.id}.jpg`})
                msg.edit({embeds: [], components: [], files: [att]})
                .catch(err => {
                    FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, msg)
                })
            })

        }catch(err) {
            FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, msg)
            
        }
    }
}
