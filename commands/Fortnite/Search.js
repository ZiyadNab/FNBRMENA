const moment = require('moment');
const Canvas = require('canvas');
const itemFinder = require('../../Handlers/itemFinder');

module.exports = {
    commands: 'search',
    type: 'Fortnite',
    descriptionEN: 'Search any cosmetics and gets its data with an image.',
    descriptionAR: 'ابحث عن أي عنصر باللعبة و احصل على معلوماتة.',
    expectedArgsEN: 'ُTo start searching type the command then item name, id or (*) symbol.',
    expectedArgsAR: 'للبدء اكتب الأمر ثم اسم العنصر او معرف الأي دي او رمز (*)',
    hintEN: 'You can search by using name, id or (*) symbol where the symbol can be used to search for an item you dont know its name by just answering questions',
    hintAR: 'يمكنك البحث من خلال الأسم او معرف الأي دي الخاص بالعنصر او يمكنك البحث من خلال رمز (*) و تستخدم النجمه في حال اذا ك فقط من خلال الأجابة على الأسئلة',
    argsExample: ['Ninja', 'EID_Floss', '*'],
    minArgs: 1,
    maxArgs: null,
    cooldown: -1,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (FNBRMENA, message, args, text, Discord, client, admin, userData, alias, emojisObject) => {

        //the item index
        var num = 0

        //handleing errors
        var errorHandleing = 0

        //specify the parms
        var type = "name"

        //search by id
        if(text.includes("_")) type = "id"

        //search by parms
        if(args[0] === "*"){

            //get the url request
            text = await itemFinder(FNBRMENA, message, client, userData.lang, emojisObject)

            //change the request type
            type = "custom"
        }

        //if there is no errors YET
        if(errorHandleing === 0){

            //request data
            if(text) FNBRMENA.Search(userData.lang, type, text)
            .then(async res => {

                //if the result is more than one item
                if(res.data.items.length > 1){

                    //create embed
                    const itemsMatched = new Discord.EmbedBuilder()
                    itemsMatched.setColor(FNBRMENA.Colors("embed"))

                    //set title
                    if(userData.lang === "en") itemsMatched.setTitle(`Please choose your item from the list below`)
                    else if(userData.lang === "ar") itemsMatched.setTitle(`الرجاء اختيار من القائمه بالاسفل`)

                    //loop throw every item matching the user input
                    var string = ``
                    for(let i = 0; i < res.data.items.length; i++){

                        //store the name to the string
                        string += `• ${i}: ${res.data.items[i].name} (${res.data.items[i].type.name}) \n`
                    }

                    //how many items where matchinh the user input?
                    if(userData.lang === "en") string += `\nFound ${res.data.items.length} item matching your search`
                    else if(userData.lang === "ar") string += `\nيوجد ${res.data.items.length} عنصر يطابق عملية البحث`

                    //set Description
                    itemsMatched.setDescription(string)

                    //filtering outfits
                    const filter = async m => m.author.id === message.author.id

                    //add the reply
                    if(userData.lang === "en") var reply = `please choose your item, listening will be stopped after 20 seconds`
                    else if(userData.lang === "ar") var reply = `الرجاء كتابة اسم العنصر، راح يتوقف الامر بعد ٢٠ ثانية`
                    
                    await message.reply({content: reply, embeds: [itemsMatched]})
                    .then(async notify => {

                        //listen for user input
                        await message.channel.awaitMessages({filter, max: 1, time: 20000})
                        .then(async collected => {

                            //delete messages
                            notify.delete()

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
                        }).catch(err => {

                            //add an error
                            errorHandleing++
    
                            //if user took to long to excute the command
                            notify.delete()
    
                            const error = new Discord.EmbedBuilder()
                            error.setColor(FNBRMENA.Colors("embedError"))
                            error.setTitle(`${FNBRMENA.Errors("Time", userData.lang)} ${emojisObject.errorEmoji}`)
                            message.reply({embeds: [error]})
                        })

                    }).catch(err => {

                        //add an error
                        errorHandleing++

                        //request entry error
                        const requestEntryTooLargeError = new Discord.EmbedBuilder()
                        requestEntryTooLargeError.setColor(FNBRMENA.Colors("embedError"))
                        if(userData.lang === "en") requestEntryTooLargeError.setTitle(`Request entry too large ${emojisObject.errorEmoji}`)
                        else if(userData.lang === "ar") requestEntryTooLargeError.setTitle(`تم تخطي الكميه المحدودة ${emojisObject.errorEmoji}`)
                        message.reply({embeds: [requestEntryTooLargeError]})

                    })
                }

                //if there is no item found
                if(res.data.items.length === 0){

                    //error happened
                    errorHandleing++
                    const noItemsMatchingError = new Discord.EmbedBuilder()
                    noItemsMatchingError.setColor(FNBRMENA.Colors("embedError"))
                    if(userData.lang === "en") noItemsMatchingError.setTitle(`There is no items matching your entry ${emojisObject.errorEmoji}`)
                    else if(userData.lang === "ar") noItemsMatchingError.setTitle(`لا يمكنني العثور على عناصر تناسب ادوات البحث الخاصة بك ${emojisObject.errorEmoji}`)
                    message.reply({embeds: [noItemsMatchingError]})
                    
                }

                if(errorHandleing === 0 && res.data.items.length > 0){

                    //getting item data loading
                    const generating = new Discord.EmbedBuilder()
                    generating.setColor(FNBRMENA.Colors("embed"))
                    if(userData.lang === "en") generating.setTitle(`Loading item data... ${emojisObject.loadingEmoji}`)
                    else if(userData.lang === "ar") generating.setTitle(`تحميل معلومات العنصر... ${emojisObject.loadingEmoji}`)
                    const msg = await message.reply({embeds: [generating]})
                    try {

                        //aplyText
                        const applyText = (canvas, text, width, font) => {
                            const ctx = canvas.getContext('2d');
                            let fontSize = font;
                            do {
                                if(userData.lang === "en") ctx.font = `italic ${fontSize -= 1}px Burbank Big Condensed`;
                                else if(userData.lang === "ar") ctx.font = `italic ${fontSize -= 1}px Arabic`;
                            } while (ctx.measureText(text).width > width);
                            return ctx.font;
                        };

                        //registering fonts
                        Canvas.registerFont('./assets/font/Lalezar-Regular.ttf', {family: 'Arabic', weight: "700", style: "italic"});
                        Canvas.registerFont('./assets/font/BurbankBigCondensed-Black.ttf', {family: 'Burbank Big Condensed', weight: "700", style: "italic"})

                        //creating canvas
                        const canvas = Canvas.createCanvas(1024, 1024);
                        const ctx = canvas.getContext('2d');

                        ctx.fillStyle = '#ffffff';

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
                            else if(userData.lang == "ar") var seasonChapter = `تحديث ${res.data.items[num].added.version}`
                            
                        }

                        if(res.data.items[num].gameplayTags.length != 0){
                            for(let j = 0; j < res.data.items[num].gameplayTags.length; j++){
                                if(res.data.items[num].gameplayTags[j].includes('Source')){

                                    if(res.data.items[num].gameplayTags[j].toLowerCase().includes("itemshop")){

                                        if(userData.lang === "en") var Source = "ITEMSHOP"
                                        else if(userData.lang === "ar") var Source = "متجر العناصر"
                                    }else if(res.data.items[num].gameplayTags[j].toLowerCase().includes("seasonshop")){

                                        if(userData.lang === "en") var Source = "SEASON SHOP"
                                        else if(userData.lang === "ar") var Source = "متجر الموسم"
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
                        if(res.data.items[num].name !== "") var name = res.data.items[num].name
                        else{
                            if(userData.lang === "en") var name = 'NAME NOT FOUND'
                            else if(userData.lang === "ar") var name = 'لا يوجد اسم'
                        }
                        if(res.data.items[num].images.icon === null) var image = 'https://imgur.com/HVH5sqV.png'
                        else var image = res.data.items[num].images.icon
                        if(res.data.items[num].series !== null) var rarity = res.data.items[num].series.id
                        else var rarity = res.data.items[num].rarity.id

                        //searching...
                        if(rarity === "Legendary"){
                            
                            //creating image
                            const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/legendary.png')
                            ctx.drawImage(skinholder, 0, 0, canvas.width, canvas. height)
                            const skin = await Canvas.loadImage(image);
                            ctx.drawImage(skin, 0, 0, canvas.width, canvas. height)
                            const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderLegendary.png')
                            ctx.drawImage(skinborder, 0, 0, canvas.width, canvas. height)
                            
                        }else if(rarity === "Epic"){

                            //creating image
                            const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/epic.png')
                            ctx.drawImage(skinholder, 0, 0, canvas.width, canvas. height)
                            const skin = await Canvas.loadImage(image);
                            ctx.drawImage(skin, 0, 0, canvas.width, canvas. height)
                            const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderEpic.png')
                            ctx.drawImage(skinborder, 0, 0, canvas.width, canvas. height)
                            
                        }else if(rarity === "Rare"){

                            //creating image
                            const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/rare.png')
                            ctx.drawImage(skinholder, 0, 0, canvas.width, canvas. height)
                            const skin = await Canvas.loadImage(image);
                            ctx.drawImage(skin, 0, 0, canvas.width, canvas. height)
                            const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderRare.png')
                            ctx.drawImage(skinborder, 0, 0, canvas.width, canvas. height)
                            
                        }else if(rarity === "Uncommon"){

                            //creating image
                            const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/uncommon.png')
                            ctx.drawImage(skinholder, 0, 0, canvas.width, canvas. height)
                            const skin = await Canvas.loadImage(image);
                            ctx.drawImage(skin, 0, 0, canvas.width, canvas. height)
                            const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderUncommon.png')
                            ctx.drawImage(skinborder, 0, 0, canvas.width, canvas. height)
                            
                        }else if(rarity === "Common"){

                            //creating image
                            const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/common.png')
                            ctx.drawImage(skinholder, 0, 0, canvas.width, canvas. height)
                            const skin = await Canvas.loadImage(image);
                            ctx.drawImage(skin, 0, 0, canvas.width, canvas. height)
                            const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderCommon.png')
                            ctx.drawImage(skinborder, 0, 0, canvas.width, canvas. height)
                            
                        }else if(rarity === "MarvelSeries"){

                            //creating image
                            const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/marvel.png')
                            ctx.drawImage(skinholder, 0, 0, canvas.width, canvas. height)
                            const skin = await Canvas.loadImage(image);
                            ctx.drawImage(skin, 0, 0, canvas.width, canvas. height)
                            const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderMarvel.png')
                            ctx.drawImage(skinborder, 0, 0, canvas.width, canvas. height)
                            
                        }else if(rarity === "DCUSeries"){

                            //creating image
                            const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/dc.png')
                            ctx.drawImage(skinholder, 0, 0, canvas.width, canvas. height)
                            const skin = await Canvas.loadImage(image);
                            ctx.drawImage(skin, 0, 0, canvas.width, canvas. height)
                            const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderDc.png')
                            ctx.drawImage(skinborder, 0, 0, canvas.width, canvas. height)
                            
                        }else if(rarity === "CUBESeries"){

                            //creating image
                            const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/dark.png')
                            ctx.drawImage(skinholder, 0, 0, canvas.width, canvas. height)
                            const skin = await Canvas.loadImage(image);
                            ctx.drawImage(skin, 0, 0, canvas.width, canvas. height)
                            const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderDark.png')
                            ctx.drawImage(skinborder, 0, 0, canvas.width, canvas. height)
                            
                        }else if(rarity === "CreatorCollabSeries"){

                            //creating image
                            const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/icon.png')
                            ctx.drawImage(skinholder, 0, 0, canvas.width, canvas. height)
                            const skin = await Canvas.loadImage(image);
                            ctx.drawImage(skin, 0, 0, canvas.width, canvas. height)
                            const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderIcon.png')
                            ctx.drawImage(skinborder, 0, 0, canvas.width, canvas. height)
                            
                        }else if(rarity === "ColumbusSeries"){

                            //creating image
                            const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/starwars.png')
                            ctx.drawImage(skinholder, 0, 0, canvas.width, canvas. height)
                            const skin = await Canvas.loadImage(image);
                            ctx.drawImage(skin, 0, 0, canvas.width, canvas. height)
                            const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderStarwars.png')
                            ctx.drawImage(skinborder, 0, 0, canvas.width, canvas. height)
                            
                        }else if(rarity === "ShadowSeries"){

                            //creating image
                            const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/shadow.png')
                            ctx.drawImage(skinholder, 0, 0, canvas.width, canvas. height)
                            const skin = await Canvas.loadImage(image);
                            ctx.drawImage(skin, 0, 0, canvas.width, canvas. height)
                            const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderShadow.png')
                            ctx.drawImage(skinborder, 0, 0, canvas.width, canvas. height)
                            
                        }else if(rarity === "SlurpSeries"){

                            //creating image
                            const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/slurp.png')
                            ctx.drawImage(skinholder, 0, 0, canvas.width, canvas. height)
                            const skin = await Canvas.loadImage(image);
                            ctx.drawImage(skin, 0, 0, canvas.width, canvas. height)
                            const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderSlurp.png')
                            ctx.drawImage(skinborder, 0, 0, canvas.width, canvas. height)
                            
                        }else if(rarity === "FrozenSeries"){

                            //creating image
                            const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/frozen.png')
                            ctx.drawImage(skinholder, 0, 0, canvas.width, canvas. height)
                            const skin = await Canvas.loadImage(image);
                            ctx.drawImage(skin, 0, 0, canvas.width, canvas. height)
                            const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderFrozen.png')
                            ctx.drawImage(skinborder, 0, 0, canvas.width, canvas. height)
                            
                        }else if(rarity === "LavaSeries"){

                            //creating image
                            const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/lava.png')
                            ctx.drawImage(skinholder, 0, 0, canvas.width, canvas. height)
                            const skin = await Canvas.loadImage(image);
                            ctx.drawImage(skin, 0, 0, canvas.width, canvas. height)
                            const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderLava.png')
                            ctx.drawImage(skinborder, 0, 0, canvas.width, canvas. height)
                            
                        }else if(rarity === "PlatformSeries"){

                            //creating image
                            const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/gaming.png')
                            ctx.drawImage(skinholder, 0, 0, canvas.width, canvas. height)
                            const skin = await Canvas.loadImage(image);
                            ctx.drawImage(skin, 0, 0, canvas.width, canvas. height)
                            const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderGaming.png')
                            ctx.drawImage(skinborder, 0, 0, canvas.width, canvas. height)

                        }else{

                            //creating image
                            const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/common.png')
                            ctx.drawImage(skinholder, 0, 0, canvas.width, canvas. height)
                            const skin = await Canvas.loadImage(image);
                            ctx.drawImage(skin, 0, 0, canvas.width, canvas. height)
                            const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderCommon.png')
                            ctx.drawImage(skinborder, 0, 0, canvas.width, canvas. height)

                        }

                        //add the item name
                        ctx.textAlign = 'center';
                        ctx.fillStyle = '#ffffff'
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
                        var wTags = (canvas.width / 512) * 15
                        var hTags = (canvas.height / 512) * 15
                        var yTags = 7
                        var xTags = (canvas.width - wTags) - 7

                        for(let i = 0; i < res.data.items[num].gameplayTags.length; i++){

                            //if the item is animated
                            if(res.data.items[num].gameplayTags[i].includes('Animated')){

                                //the item is animated add the animated icon
                                const Animated = await Canvas.loadImage('./assets/Tags/T-Icon-Animated-64.png')
                                ctx.drawImage(Animated, xTags, yTags, wTags, hTags)

                                yTags += hTags + 10
                            }
  
                            //if the item is reactive
                            if(res.data.items[num].gameplayTags[i].includes('Reactive')){

                                //the itm is animated add the animated icon
                                const Reactive = await Canvas.loadImage('./assets/Tags/T-Icon-Adaptive-64.png')
                                ctx.drawImage(Reactive, xTags, yTags, wTags, hTags)

                                yTags += hTags + 10
                            }

                            //if the item is synced emote
                            if(res.data.items[num].gameplayTags[i].includes('Synced')){

                                //the itm is animated add the animated icon
                                const Synced = await Canvas.loadImage('./assets/Tags/T-Icon-Synced-64x.png')
                                ctx.drawImage(Synced, xTags, yTags, wTags, hTags)

                                yTags += hTags + 10
                            }

                            //if the item- is traversal
                            if(res.data.items[num].gameplayTags[i].includes('Traversal')){

                                //the itm is animated add the animated icon
                                const Traversal = await Canvas.loadImage('./assets/Tags/T-Icon-Traversal-64.png')
                                ctx.drawImage(Traversal, xTags, yTags, wTags, hTags)

                                yTags += hTags + 10
                            }

                            //if the item has styles
                            if(res.data.items[num].gameplayTags[i].includes('HasVariants') || res.data.items[num].gameplayTags[i].includes('HasUpgradeQuests')){

                                //the itm is animated add the animated icon
                                const HasVariants = await Canvas.loadImage('./assets/Tags/T-Icon-Variant-64.png')
                                ctx.drawImage(HasVariants, xTags, yTags, wTags, hTags)

                                yTags += hTags + 10
                            }
                        }

                        //if the item contains copyrited audio
                        if(res.data.items[num].copyrightedAudio){

                            //the itm is animated add the animated icon
                            const copyrightedAudio = await Canvas.loadImage('./assets/Tags/mute.png')
                            ctx.drawImage(copyrightedAudio, xTags, yTags, wTags, hTags)

                            yTags += hTags + 10
                        }

                        if(res.data.items[num].builtInEmote != null){
                            const builtInEmote = await Canvas.loadImage(res.data.items[num].builtInEmote.images.icon)
                            ctx.drawImage(builtInEmote, xTags - 15, yTags, (canvas.width / 512) * 30, (canvas.height / 512) * 30)
                        }

                        //setting up moment
                        const Now = moment()
                        moment.locale(userData.lang)

                        //inisilizing item details data
                        if(res.data.items[num].set !== null) var set = res.data.items[num].set.partOf
                        else if(userData.lang === "en") var set = "There is no set for the item"
                        else if(userData.lang === "ar") var set = "لا يوجد مجموعة للعنصر"
                        
                        //introduction
                        if(res.data.items[num].introduction !== null) var introduction = res.data.items[num].introduction.text
                        else if(userData.lang === "en") var introduction = "No data"
                        else if(userData.lang === "ar") var introduction = "لا يوجد معلومات"

                        //reactive?
                        if(userData.lang === "en"){
                            if(res.data.items[num].reactive === true) var reactive = "Yes, it is"
                            else if(res.data.items[num].reactive === false) var reactive = "No, it is not"
                        }else if(userData.lang === "ar"){
                            if(res.data.items[num].reactive === true) var reactive = "نعم، عنصر متفاعل"
                            else if(res.data.items[num].reactive === false) var reactive = "لا, ليس عنصر متفاعل"
                        }

                        //copyrighted?
                        if(userData.lang === "en"){
                            if(res.data.items[num].copyrightedAudio === true) var copyrighted = "Yes, it is"
                            else if(res.data.items[num].copyrightedAudio === false) var copyrighted = "No, it is not"
                        }else if(userData.lang === "ar"){
                            if(res.data.items[num].copyrightedAudio === true) var copyrighted = "نعم، يحتوي على حقوق الطبع و النشر"
                            else if(res.data.items[num].copyrightedAudio === false) var copyrighted = "لا، لا يحتوي على حقوق الطبع و النشر"
                        }
                        
                        //occurrences
                        if(res.data.items[num].shopHistory !== null) var occurrences = res.data.items[num].shopHistory.length
                        else var occurrences = 0

                        //description
                        if(res.data.items[num].description != "") var description = res.data.items[num].description
                        else{
                            if(userData.lang == "en") var description = "No data.."
                            else if(userData.lang == "ar") var description = "لا يوجد معلومات"
                        }

                        //first and last
                        if(res.data.items[num].releaseDate !== null){

                            var FirstSeenDays = Now.diff(res.data.items[num].releaseDate, 'days');
                            var FirstSeenDate = moment(res.data.items[num].releaseDate).format("ddd, hA")
                            if(userData.lang === "en") var First = FirstSeenDays + " days at " + FirstSeenDate
                            else if(userData.lang === "ar") var First = FirstSeenDays + " يوم في " + FirstSeenDate
            
                            //last release
                            if(res.data.items[num].lastAppearance !== null){
                                const Now = moment();
                                var LastSeenDays = Now.diff(res.data.items[num].lastAppearance, 'days');
                                var LastSeenDate = moment(res.data.items[num].lastAppearance).format("ddd, hA")
                                if(userData.lang === "en") var Last = LastSeenDays + " days at " + LastSeenDate
                                else if(userData.lang === "ar") var Last = LastSeenDays + " يوم في " + LastSeenDate
                            }
            
                        }else{
                            if(userData.lang === "en"){
                                First = "not out yet or the source is not an itemshop"
                                Last = "not out yet or the source is not an itemshop"
                            }else if(userData.lang === "ar"){
                                First = "لم يتم نزول العنصر بعد او مصدر العنصر ليس من الايتم شوب"
                                Last = "لم يتم نزول العنصر بعد او مصدر العنصر ليس من الايتم شوب"
                            }
                        }

                        //create embed for the item details
                        const itemInfo = new Discord.EmbedBuilder()
                        itemInfo.setColor(FNBRMENA.Colors(rarity))

                        //set title
                        if(userData.lang === "en"){
                            itemInfo.addFields(
                                {name: "ID", value: res.data.items[num].id, inline: true},
                                {name: "Name", value: res.data.items[num].name, inline: true},
                                {name: "Description", value: description, inline: true},
                                {name: "Type", value: res.data.items[num].type.name, inline: true},
                                {name: "Rarity", value: res.data.items[num].rarity.name, inline: true},
                                {name: "Price", value: `${res.data.items[num].price}`, inline: true},
                                {name: "Introduction", value: introduction, inline: true},
                                {name: "Set", value: set, inline: true},
                                {name: "Reactive ?", value: reactive, inline: true},
                                {name: "Copy Righted Music ?", value: copyrighted, inline: true},
                                {name: "Occurrences", value: `${occurrences}`, inline: true},
                                {name: "Added", value: `${Now.diff(res.data.items[num].added.date, 'days')} days at ${moment(res.data.items[num].added.date).format("ddd, hA")}`, inline: true},
                                {name: "First Seen", value: First, inline: true},
                                {name: "Last Seen", value: Last, inline: true},
                            )
                        }else if(userData.lang === "ar"){
                            itemInfo.addFields(
                                {name: "المعرف", value: res.data.items[num].id, inline: true},
                                {name: "الاسم", value: res.data.items[num].name, inline: true},
                                {name: "الوصف", value: description, inline: true},
                                {name: "النوع", value: res.data.items[num].type.name, inline: true},
                                {name: "الندرة", value: res.data.items[num].rarity.name, inline: true},
                                {name: "السعر", value: `${res.data.items[num].price}`, inline: true},
                                {name: "تم تقديمه", value: introduction, inline: true},
                                {name: "المجموعة", value: set, inline: true},
                                {name: "متفاعل ؟", value: reactive, inline: true},
                                {name: "حقوق الطبع و النشر ؟", value: copyrighted, inline: true},
                                {name: "عدد النزول", value: `${occurrences}`, inline: true},
                                {name: "تم اضافته", value: `${Now.diff(res.data.items[num].added.date, 'days')} يوم في ${moment(res.data.items[num].added.date).format("ddd, hA")}`, inline: true},
                                {name: "اول ظهور", value: First, inline: true},
                                {name: "اخر ظهور", value: Last, inline: true},
                            )
                        }

                        //send the item picture
                        const att = new Discord.AttachmentBuilder(canvas.toBuffer(), {name: `${res.data.items[num].id}.png`})
                        await message.reply({embeds: [itemInfo], files: [att]})
                        msg.delete()

                    }catch(err) {
                        FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, msg)
                    }
                }
            }).catch(err => {
                FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, null)
            })
        }
    }
}
