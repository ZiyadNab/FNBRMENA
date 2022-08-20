const Canvas = require('canvas');
const { DiscordAPIError } = require('discord.js');
const itemFinder = require('../../Handlers/itemFinder');

module.exports = {
    commands: 'merge',
    type: 'Fortnite',
    descriptionEN: 'Merge any cosmetics together in one image.',
    descriptionAR: 'ادمج مجموعة من العناصر في صورة وحدة.',
    expectedArgsEN: 'ُTo start merging type the command then the first item name and add (+) symbole and type another item then (+ symbol)... continue like this.',
    expectedArgsAR: 'للبدء اكتب الأمر ثم اسم اول عنصر بعد ذلك اكتب علامة (+) ثم اسم العنصر التالي بعد ذلك علامة (+) و أستمر على هذا الحال حتى تنتهي',
    hintEN: 'You can merge by using name, id or (*) symbol where the symbol can be used to merge lots of items is the same type once without typing each item name or if you wanna merge an item you dont know its name by just answering questions',
    hintAR: 'يمكنك الدمج من خلال الأسم او معرف الأي دي الخاص بالعنصر او يمكنك الدمج من خلال رمز (*) و تستخدم النجمه في حال تريد دمج مجموعة عناصر من نوع معي فقط بضغطة زر بدلا من كتابة اسم العناصر جميعا او يمكنك استخدام النجمة اذا كان لديك عنصر لا تعرف اسمه',
    argsExample: ['Ninja + Harley Quinn + Light Knives', 'Ninja + EID_Floss + Light Knives', 'Ninja + * + EID_Socks_XA9HM'],
    minArgs: 1,
    maxArgs: null,
    cooldown: 15,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (FNBRMENA, message, args, text, Discord, client, admin, userData, alias, emojisObject) => {

        //num for the specific item
        var num = 0

        //inisilizing mergedItemsDataList
        const mergedItemsDataList = []

        //handling errors
        var errorHandleing = 0

        //specify the parms
        var type = "name"

        //get all the data
        const listItems = async () => {

            //storing the items
            var list = []
            var listCounter = 0
            while(text.indexOf("+") !== -1){

                //getting the index of the + in text string
                var stringNumber = text.indexOf("+")
                //substring the cosmetic name and store it
                var cosmetic = text.substring(0,stringNumber)
                //trimming every space
                cosmetic = cosmetic.trim()
                //store it into the array
                list[listCounter] = cosmetic
                //remove the cosmetic from text to start again if the while statment !== -1
                text = text.replace(cosmetic + ' +','')
                //remove every space in text
                text = text.trim()
                //add the listCounter index
                listCounter++
                //end of wile lets try aagin
            }

            //still there is the last cosmetic name so lets trim text
            text = text.trim()
            //add the what text holds in the last index
            list[listCounter++] = text

            //loop throw every item
            for(let i = 0; i < list.length; i++){

                //if the input is an id
                if(list[i].includes("_")) type = "id"
                else type = "name"

                //if the input is *
                if(list[i] === "*" && errorHandleing === 0){

                    //get the url request
                    list[i] = await itemFinder(FNBRMENA, message, client, userData.lang, emojisObject)

                    //change the request type
                    type = "custom"
                }
                
                //request data
                if(list[i]) await FNBRMENA.Search(userData.lang, type, list[i])
                .then(async res => {

                    //if the result is more than one item
                    if(errorHandleing === 0 && res.data.items.length > 1){

                        //create embed
                        const list = new Discord.EmbedBuilder()
                        list.setColor(FNBRMENA.Colors("embed"))

                        //loop throw every item matching the user input
                        var string = ``
                        for(let i = 0; i < res.data.items.length; i++){

                            //store the name to the string
                            string += `• ${i}: ${res.data.items[i].name} (${res.data.items[i].type.name}) \n`
                        }

                        if(userData.lang === "en") string += `• -1: Merge them all \nFound ${res.data.items.length} item matching your search`
                        else if(userData.lang === "ar") string += `• -1: دمج جميع العناصر \n يوجد ${res.data.items.length} عنصر يطابق عملية البحث`

                        //set Description
                        list.setDescription(string)

                        //filtering outfits
                        const filter = async m => await m.author.id === message.author.id

                        //add the reply
                        if(userData.lang === "en") var reply = `please choose your item, listening will be stopped after 20 seconds`
                        else if(userData.lang === "ar") var reply = `الرجاء كتابة اسم العنصر، راح يتوقف الامر بعد ٢٠ ثانية`
                        
                        await message.reply({content: reply, embeds: [list]})
                        .then( async notify => {

                            //listen for user input
                            await message.channel.awaitMessages({filter, max: 1, time: 20000, errors: ['time']})
                            .then( async collected => {

                                //delete messages
                                notify.delete()

                                //if the user chosen inside range
                                if(collected.first().content >= 0 && collected.first().content < res.data.items.length || collected.first().content === "-1")
                                    num = collected.first().content

                                else{

                                    //error happened
                                    errorHandleing++

                                    //create out of range embed
                                    const outOfRangeError = new Discord.EmbedBuilder()
                                    outOfRangeError.setColor(FNBRMENA.Colors("embedError"))
                                    outOfRangeError.setTitle(`${FNBRMENA.Errors("outOfRange", userData.lang)} ${emojisObject.errorEmoji}`)
                                    message.reply({embeds: [outOfRangeError]})
                                    
                                }
                            }).catch(async err => {

                                //error hapeened
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
                            errorHandleing++

                            //request entry too large error
                            if(err instanceof DiscordAPIError){
                                const requestEntryTooLargeError = new Discord.EmbedBuilder()
                                requestEntryTooLargeError.setColor(FNBRMENA.Colors("embedError"))
                                if(userData.lang === "en") requestEntryTooLargeError.setTitle(`Request entry too large ${emojisObject.errorEmoji}`)
                                else if(userData.lang === "ar") requestEntryTooLargeError.setTitle(`تم تخطي الكميه المحدودة ${emojisObject.errorEmoji}`)
                                message.reply({embeds: [requestEntryTooLargeError]})

                            }else FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject)
                            
                        })
                    }

                    //if there is no item found
                    if(errorHandleing === 0 && res.data.items.length === 0 && list.length > 1){

                        //error happened
                        const noItemsMatchingError = new Discord.EmbedBuilder()
                        noItemsMatchingError.setColor(FNBRMENA.Colors("embedError"))
                        if(userData.lang === "en") noItemsMatchingError.setTitle(`There is no items matching your entry ${emojisObject.errorEmoji}\n\`Attempting to skip '${list[i]}' item.\``)
                        else if(userData.lang === "ar") noItemsMatchingError.setTitle(`لا يمكنني العثور على عناصر تناسب ادوات البحث الخاصة بك ${emojisObject.errorEmoji}\n\`سوف يتم تخطي '${list[i]}'.\``)
                        message.reply({embeds: [noItemsMatchingError]})
                        
                    }

                    //if there is no item found
                    if(errorHandleing === 0 && res.data.items.length === 0 && list.length <= 1){
                        errorHandleing++

                        //error happened
                        const noItemsMatchingError = new Discord.EmbedBuilder()
                        noItemsMatchingError.setColor(FNBRMENA.Colors("embedError"))
                        if(userData.lang === "en") noItemsMatchingError.setTitle(`Couldn't find ${list[i]} item, please try again ${emojisObject.errorEmoji}`)
                        else if(userData.lang === "ar") noItemsMatchingError.setTitle(`لم يمكنني العثور على ${list[i]} من فضلك حاول مجددا ${emojisObject.errorEmoji}`)
                        message.reply({embeds: [noItemsMatchingError]})
                        
                    }

                    //if everything is correct start merging
                    if(errorHandleing === 0 && res.data.items.length > 0){

                        //if the user wants to merge all or not
                        if(num !== "-1") mergedItemsDataList.push(res.data.items[num])
                        else res.data.items.forEach(itemData => {
                            mergedItemsDataList.push(itemData)
                        })
                    }
                }).catch(async err => {
                    FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject)
                    
                })
                
                //change the index
                num = 0
            }
        }

        //creat an image of all gathered items
        const printItems = async () => {

            //getting item data loading
            const generating = new Discord.EmbedBuilder()
            generating.setColor(FNBRMENA.Colors("embed"))
            if(userData.lang === "en") generating.setTitle(`Loading a total ${mergedItemsDataList.length} items... ${emojisObject.loadingEmoji}`)
            else if(userData.lang === "ar") generating.setTitle(`جاري تحميل ${mergedItemsDataList.length} عنصر... ${emojisObject.loadingEmoji}`)
            message.reply({embeds: [generating]})
            .then(async msg => {

                //registering fonts
                Canvas.registerFont('./assets/font/Lalezar-Regular.ttf', {family: 'Arabic',weight: "400",style: "bold"});
                Canvas.registerFont('./assets/font/BurbankBigCondensed-Black.ttf' ,{family: 'Burbank Big Condensed',weight: "400",style: "bold"})

                //aplyText
                const applyText = (canvas, text, width, font) => {
                    const ctx = canvas.getContext('2d');
                    let fontSize = font;
                    do {
                        if(userData.lang === "en") ctx.font = `${fontSize -= 1}px Burbank Big Condensed`;
                        else if(userData.lang === "ar") ctx.font = `${fontSize -= 1}px Arabic`;
                    } while (ctx.measureText(text).width > width);
                    return ctx.font;
                };

                //canvas variables
                var width = 0
                var height = 1024
                var newline = 0
                var x = 0
                var y = 0

                //canvas length
                var length = mergedItemsDataList.length

                if(length <= 2) length = length
                else if(length >= 3 && length <= 4) length = length / 2
                else if(length > 4 && length <= 7) length = length / 3
                else if(length > 7 && length <= 50)length = length / 5
                else length = length / 5

                //forcing to be int
                if (length % 2 !== 0){
                    length += 1;
                    length = length | 0;
                }
                
                //creating width
                if(mergedItemsDataList.length === 1) width = 1024
                else width += (length * 1024) + (length * 10) - 10

                //creating height
                for(let i = 0; i < mergedItemsDataList.length; i++){
                    
                    if(newline === length){
                        height += 1024 + 10
                        newline = 0
                    }
                    newline++
                }

                //creating canvas
                const canvas = Canvas.createCanvas(width, height);
                const ctx = canvas.getContext('2d');

                //background
                const background = await Canvas.loadImage('./assets/backgroundwhite.jpg')
                ctx.drawImage(background, 0, 0, canvas.width, canvas.height)

                //reseting newline
                newline = 0

                //loop throw every item
                for(let i = 0; i < mergedItemsDataList.length; i++){
                    ctx.fillStyle = '#ffffff';

                    //skin informations
                    if(mergedItemsDataList[i].introduction != null){
                        var chapter = mergedItemsDataList[i].introduction.chapter.substring(mergedItemsDataList[i].introduction.chapter.indexOf(" "), mergedItemsDataList[i].introduction.chapter.length).trim()
                        var season = mergedItemsDataList[i].introduction.season.substring(mergedItemsDataList[i].introduction.season.indexOf(" "), mergedItemsDataList[i].introduction.season.length).trim()

                        if(userData.lang === "en") var seasonChapter = `C${chapter}S${season}`
                        else if(userData.lang == "ar")var seasonChapter = `الفصل ${chapter} الموسم ${season}`

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
                                }else if(mergedItemsDataList[i].gameplayTags[j].toLowerCase().includes("battlepass")){

                                    if(userData.lang === "en") var Source = "BATTLEPASS"
                                    else if(userData.lang === "ar") var Source = "بطاقة المعركة"
                                }else if(mergedItemsDataList[i].gameplayTags[j].toLowerCase().includes("event")){

                                    if(userData.lang === "en") var Source = "EVENT"
                                    else if(userData.lang === "ar") var Source = "حدث"
                                }else if(mergedItemsDataList[i].gameplayTags[j].toLowerCase().includes("platform") || (mergedItemsDataList[i].gameplayTags[j].toLowerCase().includes("promo"))){

                                    if(userData.lang === "en") var Source = "EXCLUSIVE"
                                    else if(userData.lang === "ar") var Source = "حصري"
                                }

                                break
                            }else var Source = mergedItemsDataList[i].type.name.toUpperCase()
                        }

                    }else var Source = mergedItemsDataList[i].type.name.toUpperCase()

                   //skin informations
                   var name = mergedItemsDataList[i].name
                   var image = mergedItemsDataList[i].images.icon
                   if(mergedItemsDataList[i].series === null) var rarity = mergedItemsDataList[i].rarity.id
                   else var rarity = mergedItemsDataList[i].series.id
                   newline = newline + 1;

                   //searching...
                   if(rarity === "Legendary"){

                       //creating image
                       const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/legendary.png')
                       ctx.drawImage(skinholder, x, y, 1024, 1024)
                       const skin = await Canvas.loadImage(image);
                       ctx.drawImage(skin, x, y, 1024, 1024)
                       const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderLegendary.png')
                       ctx.drawImage(skinborder, x, y, 1024, 1024)
                       
                   }else if(rarity === "Epic"){

                       //creating image
                       const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/epic.png')
                       ctx.drawImage(skinholder, x, y, 1024, 1024)
                       const skin = await Canvas.loadImage(image);
                       ctx.drawImage(skin, x, y, 1024, 1024)
                       const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderEpic.png')
                       ctx.drawImage(skinborder, x, y, 1024, 1024)
                       
                   }else if(rarity === "Rare"){

                       //creating image
                       const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/rare.png')
                       ctx.drawImage(skinholder, x, y, 1024, 1024)
                       const skin = await Canvas.loadImage(image);
                       ctx.drawImage(skin, x, y, 1024, 1024)
                       const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderRare.png')
                       ctx.drawImage(skinborder, x, y, 1024, 1024)

                   }else if(rarity === "Uncommon"){

                       //creating image
                       const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/uncommon.png')
                       ctx.drawImage(skinholder, x, y, 1024, 1024)
                       const skin = await Canvas.loadImage(image);
                       ctx.drawImage(skin, x, y, 1024, 1024)
                       const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderUncommon.png')
                       ctx.drawImage(skinborder, x, y, 1024, 1024)
                       
                   }else if(rarity === "Common"){
                    
                       //creating image
                       const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/common.png')
                       ctx.drawImage(skinholder, x, y, 1024, 1024)
                       const skin = await Canvas.loadImage(image);
                       ctx.drawImage(skin, x, y, 1024, 1024)
                       const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderCommon.png')
                       ctx.drawImage(skinborder, x, y, 1024, 1024)
                       
                   }else if(rarity === "MarvelSeries"){

                       //creating image
                       const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/marvel.png')
                       ctx.drawImage(skinholder, x, y, 1024, 1024)
                       const skin = await Canvas.loadImage(image);
                       ctx.drawImage(skin, x, y, 1024, 1024)
                       const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderMarvel.png')
                       ctx.drawImage(skinborder, x, y, 1024, 1024)
                       
                   }else if(rarity === "DCUSeries"){

                       //creating image
                       const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/dc.png')
                       ctx.drawImage(skinholder, x, y, 1024, 1024)
                       const skin = await Canvas.loadImage(image);
                       ctx.drawImage(skin, x, y, 1024, 1024)
                       const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderDc.png')
                       ctx.drawImage(skinborder, x, y, 1024, 1024)
                       
                   }else if(rarity === "CUBESeries"){

                       //creating image
                       const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/dark.png')
                       ctx.drawImage(skinholder, x, y, 1024, 1024)
                       const skin = await Canvas.loadImage(image);
                       ctx.drawImage(skin, x, y, 1024, 1024)
                       const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderDark.png')
                       ctx.drawImage(skinborder, x, y, 1024, 1024)
                       
                   }else if(rarity === "CreatorCollabSeries"){

                       //creating image
                       const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/icon.png')
                       ctx.drawImage(skinholder, x, y, 1024, 1024)
                       const skin = await Canvas.loadImage(image);
                       ctx.drawImage(skin, x, y, 1024, 1024)
                       const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderIcon.png')
                       ctx.drawImage(skinborder, x, y, 1024, 1024)
                       
                   }else if(rarity === "ColumbusSeries"){

                       //creating image
                       const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/starwars.png')
                       ctx.drawImage(skinholder, x, y, 1024, 1024)
                       const skin = await Canvas.loadImage(image);
                       ctx.drawImage(skin, x, y, 1024, 1024)
                       const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderStarwars.png')
                       ctx.drawImage(skinborder, x, y, 1024, 1024)
                       
                   }else if(rarity === "ShadowSeries"){

                       //creating image
                       const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/shadow.png')
                       ctx.drawImage(skinholder, x, y, 1024, 1024)
                       const skin = await Canvas.loadImage(image);
                       ctx.drawImage(skin, x, y, 1024, 1024)
                       const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderShadow.png')
                       ctx.drawImage(skinborder, x, y, 1024, 1024)
                       
                   }else if(rarity === "SlurpSeries"){

                       //creating image
                       const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/slurp.png')
                       ctx.drawImage(skinholder, x, y, 1024, 1024)
                       const skin = await Canvas.loadImage(image);
                       ctx.drawImage(skin, x, y, 1024, 1024)
                       const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderSlurp.png')
                       ctx.drawImage(skinborder, x, y, 1024, 1024)
                       
                   }else if(rarity === "FrozenSeries"){

                       //creating image
                       const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/frozen.png')
                       ctx.drawImage(skinholder, x, y, 1024, 1024)
                       const skin = await Canvas.loadImage(image);
                       ctx.drawImage(skin, x, y, 1024, 1024)
                       const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderFrozen.png')
                       ctx.drawImage(skinborder, x, y, 1024, 1024)
                       
                   }else if(rarity === "LavaSeries"){

                       //creating image
                       const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/lava.png')
                       ctx.drawImage(skinholder, x, y, 1024, 1024)
                       const skin = await Canvas.loadImage(image);
                       ctx.drawImage(skin, x, y, 1024, 1024)
                       const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderLava.png')
                       ctx.drawImage(skinborder, x, y, 1024, 1024)
                       
                   }else if(rarity === "PlatformSeries"){

                       //creating image
                       const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/gaming.png')
                       ctx.drawImage(skinholder, x, y, 1024, 1024)
                       const skin = await Canvas.loadImage(image);
                       ctx.drawImage(skin, x, y, 1024, 1024)
                       const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderGaming.png')
                       ctx.drawImage(skinborder, x, y, 1024, 1024)
                       
                   }else{

                       //creating image
                       const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/common.png')
                       ctx.drawImage(skinholder, x, y, 1024, 1024)
                       const skin = await Canvas.loadImage(image);
                       ctx.drawImage(skin, x, y, 1024, 1024)
                       const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderCommon.png')
                       ctx.drawImage(skinborder, x, y, 1024, 1024)
                       
                   }

                   //add the item name
                   ctx.textAlign = 'center';
                   ctx.font = applyText(canvas, name, 900, 72)

                   if(userData.lang === "en"){
                       ctx.fillText(name, 512 + x, (1024 - 30) + y)

                       //add the item season chapter text
                       ctx.textAlign = "left"
                       ctx.font = applyText(canvas, seasonChapter, 900, 40)
                       ctx.fillText(seasonChapter, 5 + x, (1024 - 7.5) + y)

                       //add the item source
                       ctx.textAlign = "right"
                       ctx.font = applyText(canvas, Source, 900, 40)
                       ctx.fillText(Source, (1024 - 5) + x, (1024 - 7.5) + y)

                   }else if(userData.lang === "ar"){
                       ctx.fillText(name, 512 + x, (1024 - 60) + y)

                       //add season chapter text
                       ctx.textAlign = "left"
                       ctx.font = applyText(canvas, seasonChapter, 900, 40)
                       ctx.fillText(seasonChapter, 5 + x, (1024 - 12.5) + y)

                       //add the item source
                       ctx.textAlign = "right"
                       ctx.font = applyText(canvas, Source, 900, 40)
                       ctx.fillText(Source, (1024 - 5) + x, (1024 - 12.5) + y)

                   }

                   //inilizing tags
                   var wTags = (1024 / 512) * 15
                   var hTags = (1024 / 512) * 15
                   var yTags = 7 + y
                   var xTags = ((1024 - wTags) - 7) + x

                   for(let t = 0; t < mergedItemsDataList[i].gameplayTags.length; t++){

                       //if the item is animated
                       if(mergedItemsDataList[i].gameplayTags[t].includes('Animated')){

                           //add the animated icon
                           const Animated = await Canvas.loadImage('./assets/Tags/T-Icon-Animated-64.png')
                           ctx.drawImage(Animated, xTags, yTags, wTags, hTags)

                           yTags += hTags + 10
                       }

                       //if the item is reactive
                       if(mergedItemsDataList[i].gameplayTags[t].includes('Reactive')){

                           //add the reactive icon
                           const Reactive = await Canvas.loadImage('./assets/Tags/T-Icon-Adaptive-64.png')
                           ctx.drawImage(Reactive, xTags, yTags, wTags, hTags)

                           yTags += hTags + 10
                           
                       }

                       //if the item is synced emote
                       if(mergedItemsDataList[i].gameplayTags[t].includes('Synced')){

                           //add the Synced icon
                           const Synced = await Canvas.loadImage('./assets/Tags/T-Icon-Synced-64x.png')
                           ctx.drawImage(Synced, xTags, yTags, wTags, hTags)

                           yTags += hTags + 10
                           
                       }

                       //if the item is traversal
                       if(mergedItemsDataList[i].gameplayTags[t].includes('Traversal')){

                           //add the Traversal icon
                           const Traversal = await Canvas.loadImage('./assets/Tags/T-Icon-Traversal-64.png')
                           ctx.drawImage(Traversal, xTags, yTags, wTags, hTags)

                           yTags += hTags + 10
                       }

                       //if the item has styles
                       if(mergedItemsDataList[i].gameplayTags[t].includes('HasVariants') || mergedItemsDataList[i].gameplayTags[t].includes('HasUpgradeQuests')){

                           //add the HasVariants icon
                           const HasVariants = await Canvas.loadImage('./assets/Tags/T-Icon-Variant-64.png')
                           ctx.drawImage(HasVariants, xTags, yTags, wTags, hTags)

                           yTags += hTags + 10
                       }
                   }

                   //if the item contains copyrited audio
                   if(mergedItemsDataList[i].copyrightedAudio){

                       //add the copyrightedAudio icon
                       const copyrightedAudio = await Canvas.loadImage('./assets/Tags/mute.png')
                       ctx.drawImage(copyrightedAudio, xTags, yTags, wTags, hTags)

                       yTags += hTags + 10
                   }

                   //if the item contains built in emote
                   if(mergedItemsDataList[i].builtInEmote != null){

                       //add the builtInEmote icon
                       const builtInEmote = await Canvas.loadImage(mergedItemsDataList[i].builtInEmote.images.icon)
                       ctx.drawImage(builtInEmote, xTags - 15, yTags, ((1024 / 512) * 30) + x, ((1024 / 512) * 30) + y)
                   }

                   //changing x and y
                   x = x + 10 + 1024; 
                   if(length === newline){
                       y = y + 10 + 1024;
                       x = 0;
                       newline = 0;
                   }
                }

                try{
                    var att = new Discord.AttachmentBuilder(canvas.toBuffer(), {name: `${message.author.id}.png`})
                    await message.channel.send({files: [att]})
                    msg.delete()

                }catch{
                    var att = new Discord.AttachmentBuilder(canvas.toBuffer('image/jpeg'), {name: `${message.author.id}.jpg`})
                    await message.channel.send({files: [att]})
                    msg.delete()

                }

            }).catch(async err => {
                FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject)
                
            })
        }

        await listItems()
        if(errorHandleing === 0 && mergedItemsDataList.length > 0) await printItems()
    }
}