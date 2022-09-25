const Canvas = require('canvas')
const moment = require('moment')

module.exports = {
    commands: 'remind',
    type: 'Fortnite',
    descriptionEN: 'You can remind any item from the shop so he bot will tag you once the item has been released in the itemshop.',
    descriptionAR: 'تقدر تخلي البوت يذكرك لأي عنصر من الشوب واذا نزل راح يحط لك تاق و يعلمك انه نزل.',
    expectedArgsEN: 'ُTo get the bot reminds you just type the command then the item name.',
    expectedArgsAR: 'عشان تخلي البوت يذكرك كل الي عليك تكتب الأمر ثمن اسم العنصر',
    argsExample: ['Ninja', 'Harley Quinn'],
    minArgs: 1,
    maxArgs: null,
    cooldown: -1,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (FNBRMENA, message, args, text, Discord, client, admin, userData, alias, emojisObject) => {

        //inizilizing variables
        var num = 0
        var type = 'name'

        //maneging the time
        moment.locale("en")
        var time = moment(message.createdAt).format()

        //handleing errors
        var errorHandleing = 0

        //if the type is id
        if(text.includes("_")) type = 'id'

        //checking if the item is valid
        await FNBRMENA.Search(userData.lang, type, text)
        .then(async res => {

            //if there is more than one item
            if(res.data.items.length > 1){

                //create embed
                const listOfCosmeticts = new Discord.EmbedBuilder()
                listOfCosmeticts.setColor(FNBRMENA.Colors("embed"))

                //loop throw every item matching the user input
                var string = ""
                for(let i = 0; i < res.data.items.length; i++){

                    //store the name to the string
                    string += `• ${i}: ${res.data.items[i].name} (${res.data.items[i].type.name}) \n`
                }

                //how many items where matchinh the user input?
                if(userData.lang === "en") string += `\nFound ${res.data.items.length} item matching your search`
                else if(userData.lang === "ar") string += `\nيوجد ${res.data.items.length} عنصر يطابق عملية البحث`

                //set Description
                listOfCosmeticts.setDescription(string)

                //filtering outfits
                const filter = async m => await m.author.id === message.author.id

                //add the reply
                if(userData.lang === "en") var reply = `please choose your item, listening will be stopped after 20 seconds`
                else if(userData.lang === "ar") var reply = `الرجاء اختيار العنصر، راح يتوقف الامر بعد ٢٠ ثانية`
                
                await message.reply({content: reply, embeds: [listOfCosmeticts]})
                .then(async notify => {

                    //listen for user input
                    await message.channel.awaitMessages({filter, max: 1, time: 20000, errors: ['time']})
                    .then(async collected => {

                        //delete messages
                        await notify.delete()

                        //check if its a number
                        if(!isNaN(collected.first().content)){

                            //if the user chosen inside range
                            if(collected.first().content >= 0 && collected.first().content < res.data.items.length) num = collected.first().content
                            else{

                                //add an error
                                errorHandleing++

                                //create out of range embed
                                const outOfRangeError = new Discord.EmbedBuilder()
                                outOfRangeError.setColor(FNBRMENA.Colors("embedError"))
                                outOfRangeError.setTitle(`${FNBRMENA.Errors("outOfRange", userData.lang)} ${emojisObject.errorEmoji}`)
                                message.reply({embeds: [outOfRangeError]})

                            }
                        }else{
                            //add an error
                            errorHandleing++

                            //if user typed a syntax error etc
                            const syntaxError = await new Discord.EmbedBuilder()
                            syntaxError.setColor(FNBRMENA.Colors("embedError"))
                            if(userData.lang === "en") syntaxError.setTitle(`Please type only number without any symbols or words ${emojisObject.errorEmoji}`)
                            else if(userData.lang === "ar") syntaxError.setTitle(`رجاء كتابة فقط رقم بدون كلامات او علامات ${emojisObject.errorEmoji}`)
                            await message.reply({embeds: [syntaxError]})
                            
                        }
                    }).catch(async err => {

                        //error happened
                        errorHandleing++
                        notify.delete()

                        //time has passed
                        if(err instanceof Error) FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject)
                        else{
                            const timeError = new Discord.EmbedBuilder()
                            timeError.setColor(FNBRMENA.Colors("embedError"))
                            timeError.setTitle(`${FNBRMENA.Errors("Time", userData.lang)} ${emojisObject.errorEmoji}`)
                            message.reply({embeds: [timeError]})
                        }
                    })
                }).catch(async err => {
                    FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject)

                })
            }

            //if there is no errors
            if(errorHandleing === 0){

                //if the item is correct
                if(res.data.items.length !== 0){

                    //if the item is from the shop
                    if(res.data.items[num].gameplayTags.includes("Cosmetics.Source.ItemShop")){

                        //seeting up the db firestore
                        var db = admin.firestore()

                        //check if the item is already exists
                        const access = await db.collection("Users").doc(`${message.author.id}`).collection(`Reminders`).doc(`${res.data.items[num].id}`).get()

                        //if the item doen't exists in the database
                        if(!access.exists){

                            //get the collection from the database
                            const snapshot = await db.collection("Users").doc(`${message.author.id}`).collection(`Reminders`).get()

                            //check if the user has +20 reminders
                            if(snapshot.size + 1 <= 20){

                                const generating = new Discord.EmbedBuilder()
                                generating.setColor(FNBRMENA.Colors("embed"))
                                if(userData.lang === "en") generating.setTitle(`Getting info about the item ${emojisObject.loadingEmoji}`)
                                else if(userData.lang === "ar") generating.setTitle(`جاري البحث عن معلومات العنصر ${emojisObject.loadingEmoji}`)
                                message.reply({embeds: [generating]})
                                .then(async msg => {

                                    //registering fonts
                                    Canvas.registerFont('./assets/font/Lalezar-Regular.ttf', {
                                        family: 'Arabic',
                                        style: "bold"
                                    });
                                    Canvas.registerFont('./assets/font/BurbankBigCondensed-Black.ttf' ,{
                                        family: 'Burbank Big Condensed',
                                        style: "bold"
                                    })

                                    //aplyText
                                    const applyText = (canvas, text, width, font) => {
                                        const ctx = canvas.getContext('2d');
                                        let fontSize = font;
                                        do {
                                            if(userData.lang === "en") ctx.font = `${fontSize -= 1}px Burbank Big Condensed`;
                                            else if(userData.lang === "ar") ctx.font = `${fontSize -= 1}px Arabic`;
                                        } while (ctx.measureText(text).width > width);
                                        return ctx.font;
                                    }

                                    //creating canvas
                                    const canvas = Canvas.createCanvas(1024, 1024);
                                    const ctx = canvas.getContext('2d');

                                    //skin informations
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
                                                }

                                                break
                                            }else var Source = res.data.items[num].type.name.toUpperCase()
                                        }

                                    }else var Source = res.data.items[num].type.name.toUpperCase()

                                    //set the item info
                                    var name = res.data.items[num].name
                                    var price = res.data.items[num].price
                                    var image = res.data.items[num].images.icon
                                    if(res.data.items[num].series !== null) var rarity = res.data.items[num].series.id
                                    else var rarity = res.data.items[num].rarity.id

                                    //searching...
                                    if(rarity === "Legendary"){

                                        //creating image
                                        const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/legendary.png')
                                        ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                                        const skin = await Canvas.loadImage(image);
                                        ctx.drawImage(skin, 0, 0, 1024, 1024)
                                        const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderLegendary.png')
                                        ctx.drawImage(skinborder, 0, 0, 1024, 1024)

                                    }else if(rarity === "Epic"){

                                        //creating image
                                        const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/epic.png')
                                        ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                                        const skin = await Canvas.loadImage(image);
                                        ctx.drawImage(skin, 0, 0, 1024, 1024)
                                        const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderEpic.png')
                                        ctx.drawImage(skinborder, 0, 0, 1024, 1024)
                                        
                                    }else if(rarity === "Rare"){

                                        //creating image
                                        const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/rare.png')
                                        ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                                        const skin = await Canvas.loadImage(image);
                                        ctx.drawImage(skin, 0, 0, 1024, 1024)
                                        const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderRare.png')
                                        ctx.drawImage(skinborder, 0, 0, 1024, 1024)
                                        
                                    }else if(rarity === "Uncommon"){

                                        //creating image
                                        const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/uncommon.png')
                                        ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                                        const skin = await Canvas.loadImage(image);
                                        ctx.drawImage(skin, 0, 0, 1024, 1024)
                                        const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderUncommon.png')
                                        ctx.drawImage(skinborder, 0, 0, 1024, 1024)
                                        
                                    }else if(rarity === "Common"){

                                        //creating image
                                        const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/common.png')
                                        ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                                        const skin = await Canvas.loadImage(image);
                                        ctx.drawImage(skin, 0, 0, 1024, 1024)
                                        const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderCommon.png')
                                        ctx.drawImage(skinborder, 0, 0, 1024, 1024)
                                        
                                    }else if(rarity === "MarvelSeries"){

                                        //creating image
                                        const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/marvel.png')
                                        ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                                        const skin = await Canvas.loadImage(image);
                                        ctx.drawImage(skin, 0, 0, 1024, 1024)
                                        const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderMarvel.png')
                                        ctx.drawImage(skinborder, 0, 0, 1024, 1024)
                                        
                                    }else if(rarity === "DCUSeries"){

                                        //creating image
                                        const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/dc.png')
                                        ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                                        const skin = await Canvas.loadImage(image);
                                        ctx.drawImage(skin, 0, 0, 1024, 1024)
                                        const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderDc.png')
                                        ctx.drawImage(skinborder, 0, 0, 1024, 1024)
                                        
                                    }else if(rarity === "CUBESeries"){

                                        //creating image
                                        const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/dark.png')
                                        ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                                        const skin = await Canvas.loadImage(image);
                                        ctx.drawImage(skin, 0, 0, 1024, 1024)
                                        const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderDark.png')
                                        ctx.drawImage(skinborder, 0, 0, 1024, 1024)
                                        
                                    }else if(rarity === "CreatorCollabSeries"){

                                        //creating image
                                        const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/icon.png')
                                        ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                                        const skin = await Canvas.loadImage(image);
                                        ctx.drawImage(skin, 0, 0, 1024, 1024)
                                        const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderIcon.png')
                                        ctx.drawImage(skinborder, 0, 0, 1024, 1024)
                                        
                                    }else if(rarity === "ColumbusSeries"){

                                        //creating image
                                        const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/starwars.png')
                                        ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                                        const skin = await Canvas.loadImage(image);
                                        ctx.drawImage(skin, 0, 0, 1024, 1024)
                                        const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderStarwars.png')
                                        ctx.drawImage(skinborder, 0, 0, 1024, 1024)
                                        
                                    }else if(rarity === "ShadowSeries"){

                                        //creating image
                                        const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/shadow.png')
                                        ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                                        const skin = await Canvas.loadImage(image);
                                        ctx.drawImage(skin, 0, 0, 1024, 1024)
                                        const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderShadow.png')
                                        ctx.drawImage(skinborder, 0, 0, 1024, 1024)
                                        
                                    }else if(rarity === "SlurpSeries"){

                                        //creating image
                                        const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/slurp.png')
                                        ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                                        const skin = await Canvas.loadImage(image);
                                        ctx.drawImage(skin, 0, 0, 1024, 1024)
                                        const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderSlurp.png')
                                        ctx.drawImage(skinborder, 0, 0, 1024, 1024)
                                        
                                    }else if(rarity === "FrozenSeries"){

                                        //creating image
                                        const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/frozen.png')
                                        ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                                        const skin = await Canvas.loadImage(image);
                                        ctx.drawImage(skin, 0, 0, 1024, 1024)
                                        const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderFrozen.png')
                                        ctx.drawImage(skinborder, 0, 0, 1024, 1024)
                                        
                                    }else if(rarity === "LavaSeries"){

                                        //creating image
                                        const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/lava.png')
                                        ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                                        const skin = await Canvas.loadImage(image);
                                        ctx.drawImage(skin, 0, 0, 1024, 1024)
                                        const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderLava.png')
                                        ctx.drawImage(skinborder, 0, 0, 1024, 1024)
                                        
                                    }else if(rarity === "PlatformSeries"){

                                        //creating image
                                        const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/gaming.png')
                                        ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                                        const skin = await Canvas.loadImage(image);
                                        ctx.drawImage(skin, 0, 0, 1024, 1024)
                                        const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderGaming.png')
                                        ctx.drawImage(skinborder, 0, 0, 1024, 1024)
                                        
                                    }else{
                                        
                                        //creating image
                                        const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/common.png')
                                        ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                                        const skin = await Canvas.loadImage(image);
                                        ctx.drawImage(skin, 0, 0, 1024, 1024)
                                        const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderCommon.png')
                                        ctx.drawImage(skinborder, 0, 0, 1024, 1024)
                                        
                                    }

                                    //add the item name
                                    ctx.textAlign = 'center';
                                    ctx.fillStyle = '#ffffff';
                                    ctx.font = applyText(canvas, name, 900, 72)

                                    if(userData.lang === "en"){
                                        ctx.fillText(name, 512, (1024 - 30))

                                        //add the item season chapter text
                                        ctx.textAlign = "left"
                                        ctx.font = applyText(canvas, seasonChapter, 900, 40)
                                        ctx.fillText(seasonChapter, 5, (1024 - 7.5))

                                        //add the item source
                                        ctx.textAlign = "right"
                                        ctx.font = applyText(canvas, Source, 900, 40)
                                        ctx.fillText(Source, (1024 - 5), (1024 - 7.5))

                                    }else if(userData.lang === "ar"){
                                        ctx.fillText(name, 512, (1024 - 60))

                                        //add season chapter text
                                        ctx.textAlign = "left"
                                        ctx.font = applyText(canvas, seasonChapter, 900, 40)
                                        ctx.fillText(seasonChapter, 5, (1024 - 12.5))

                                        //add the item source
                                        ctx.textAlign = "right"
                                        ctx.font = applyText(canvas, Source, 900, 40)
                                        ctx.fillText(Source, (1024 - 5), (1024 - 12.5))

                                    }

                                    //inilizing tags
                                    var y = 7
                                    var x = (canvas.width - 30) - 7

                                    for(let i = 0; i < res.data.items[num].gameplayTags.length; i++){

                                        //if the item is animated
                                        if(res.data.items[num].gameplayTags[i].includes('Animated')){

                                            //the itm is animated add the animated icon
                                            const skinholder = await Canvas.loadImage('./assets/Tags/T-Icon-Animated-64.png')
                                            ctx.drawImage(skinholder, x, y, 30, 30)

                                            y += 40
                                        }

                                        //if the item is reactive
                                        if(res.data.items[num].gameplayTags[i].includes('Reactive')){

                                            //the itm is animated add the animated icon
                                            const skinholder = await Canvas.loadImage('./assets/Tags/T-Icon-Adaptive-64.png')
                                            ctx.drawImage(skinholder, x, y, 30, 30)

                                            y += 40
                                        }

                                        //if the item is synced emote
                                        if(res.data.items[num].gameplayTags[i].includes('Synced')){

                                            //the itm is animated add the animated icon
                                            const skinholder = await Canvas.loadImage('./assets/Tags/T-Icon-Synced-64x.png')
                                            ctx.drawImage(skinholder, x, y, 30, 30)

                                            y += 40
                                        }

                                        //if the item is traversal
                                        if(res.data.items[num].gameplayTags[i].includes('Traversal')){

                                            //the itm is animated add the animated icon
                                            const skinholder = await Canvas.loadImage('./assets/Tags/T-Icon-Traversal-64.png')
                                            ctx.drawImage(skinholder, x, y, 30, 30)

                                            y += 40
                                        }

                                        //if the item has styles
                                        if(res.data.items[num].gameplayTags[i].includes('HasVariants') || res.data.items[num].gameplayTags[i].includes('HasUpgradeQuests')){

                                            //the itm is animated add the animated icon
                                            const skinholder = await Canvas.loadImage('./assets/Tags/T-Icon-Variant-64.png')
                                            ctx.drawImage(skinholder, x, y, 30, 30)

                                            y += 40
                                        }
                                    }

                                    //if the item contains copyrited audio
                                    if(res.data.items[num].copyrightedAudio){

                                        //the itm is animated add the animated icon
                                        const skinholder = await Canvas.loadImage('./assets/Tags/mute.png')
                                        ctx.drawImage(skinholder, x, y, 30, 30)

                                        y += 40
                                    }

                                    //if the item contains built in emote
                                    if(res.data.items[num].builtInEmote != null){

                                        //add the builtInEmote icon
                                        const builtInEmote = await Canvas.loadImage(res.data.items[num].builtInEmote.images.icon)
                                        ctx.drawImage(builtInEmote, x, y, 30, 30)
                                    }

                                    //change the local of the moment
                                    moment.locale(userData.lang)

                                    //item last seen
                                    var Last = ""
                                    if(res.data.items[num].lastAppearance !== null){

                                        //setting up moment js
                                        const Now = moment();
                                        var LastSeenDays = Now.diff(res.data.items[num].lastAppearance, 'days');
                                        var LastSeenDate = moment(res.data.items[num].lastAppearance).format("ddd, hA")

                                        //set a last release message
                                        if(userData.lang === "en") Last = `${LastSeenDays} days at ${LastSeenDate}`
                                        else if(userData.lang === "ar") Last = `${LastSeenDays} يوم في ${LastSeenDate}`

                                    }else{

                                        //set non message last release
                                        if(userData.lang === "en") Last = "not out yet or the sorce is not an itemshop"
                                        else if(userData.lang === "ar") Last = "لم يتم نزول العنصر بعد او مصدر العنصر ليس من الايتم شوب"
                                    }

                                    //create embed
                                    const itemInfo = new Discord.EmbedBuilder()
                                    itemInfo.setColor(FNBRMENA.Colors(rarity))

                                    //set titles and fields
                                    if(userData.lang == "en"){
                                        itemInfo.setAuthor({name: `Reminder Added, ${res.data.items[num].name}`, iconURL: image})
                                        itemInfo.setDescription(`The ${res.data.items[num].name} (${res.data.items[num].type.name}) has been added to your reminders list, And you will now be notified when the ${res.data.items[num].type.name.toLowerCase()} enters the Itemshop.\n\nInformation about ${res.data.items[num].name}:\n**Price:** \`${price}\`\n**Last Appearance:** \`${Last}\`\n\nYou have ${snapshot.size + 1} reminders out of 20.`)
                                    }else if(userData.lang === "ar"){
                                        itemInfo.setAuthor({name: `تم اضافة تذكير, ${res.data.items[num].name}`, iconURL: image})
                                        itemInfo.setDescription(`تم اضافة ${res.data.items[num].name} (${res.data.items[num].type.name}) الى قائمة التذكير, و سوف يتم تنبيهك في حال ${res.data.items[num].type.name.toLowerCase()} توفر في متجر العناصر.\n\nمعلومات عن ${res.data.items[num].name}:\n**السعر:** \`${price}\`\n**اخر ظهور:** \`${Last}\`\n\nلديك ${snapshot.size} عنصر مضاف من اصل 20.`)
                                    }

                                    //send the message
                                    const att = new Discord.AttachmentBuilder(canvas.toBuffer(), {name: `${res.data.items[num].id}.png`})
                                    await message.reply({files: [att], embeds: [itemInfo]})
                                    msg.delete()

                                    //get documents data
                                    const doc = await db.collection("Users").doc(`${message.author.id}`)

                                    //add the reminder to the database
                                    await doc.collection(`Reminders`).doc(`${res.data.items[num].id}`).set({
                                        date: `${time}`,
                                        lang: userData.lang
                                    })

                                }).catch(async err => {
                                    FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject)

                                })
                            }else{

                                //if the reminders passed the limit
                                const remindersHasPassedTheLimitError = new Discord.EmbedBuilder()
                                remindersHasPassedTheLimitError.setColor(FNBRMENA.Colors("embedError"))
                                if(userData.lang === "en") remindersHasPassedTheLimitError.setTitle(`You have passed the limit, please remove items to get enough space ${emojisObject.errorEmoji}.`)
                                else if(userData.lang === "ar") remindersHasPassedTheLimitError.setTitle(`لقد تخطيت الحد المسموح, اخذف بعض العناصر${emojisObject.errorEmoji}.`)
                                message.reply({embeds: [remindersHasPassedTheLimitError]})
                            }
                        }else{

                            //if the item is already added
                            const itemIsAlreadyAddedError = new Discord.EmbedBuilder()
                            itemIsAlreadyAddedError.setColor(FNBRMENA.Colors("embedError"))
                            if(userData.lang === "en") itemIsAlreadyAddedError.setTitle(`The item is already added for the reminding system ${emojisObject.errorEmoji}.`)
                            else if(userData.lang === "ar") itemIsAlreadyAddedError.setTitle(`تم بالفعل اضافة العنصر من قبل في نظام التذكير ${emojisObject.errorEmoji}.`)
                            message.reply({embeds: [itemIsAlreadyAddedError]})

                        }
                    }else{

                        //if the item source is not an itemshop
                        const itemSourceIsNotAnItemshopError = new Discord.EmbedBuilder()
                        itemSourceIsNotAnItemshopError.setColor(FNBRMENA.Colors("embedError"))
                        if(userData.lang === "en") itemSourceIsNotAnItemshopError.setTitle(`The item source is not an itemshop please reselect again ${emojisObject.errorEmoji}.`)
                        else if(userData.lang === "ar") itemSourceIsNotAnItemshopError.setTitle(`لا يمكنني تذكيرك بالعنصر لانه ليس من متجر العناصر ${emojisObject.errorEmoji}.`)
                        message.reply({embeds: [itemSourceIsNotAnItemshopError]})
                    }
                }else{
                    
                    //if user typed a number out of range
                    const noCosmeticsHasBeenFoundError = new Discord.EmbedBuilder()
                    noCosmeticsHasBeenFoundError.setColor(FNBRMENA.Colors("embedError"))
                    if(userData.lang === "en") noCosmeticsHasBeenFoundError.setTitle(`No cosmetic has been found check your speling and try again ${emojisObject.errorEmoji}.`)
                    else if(userData.lang === "ar") noCosmeticsHasBeenFoundError.setTitle(`لا يمكنني العثور على العنصر الرجاء التأكد من كتابة الاسم بشكل صحيح ${emojisObject.errorEmoji}.`)
                    message.reply({embeds: [noCosmeticsHasBeenFoundError]})

                }
            }

            //handeling errors
        }).catch(err => {
            FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject)

        })
    }
}
