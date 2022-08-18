const moment = require("moment")
const Canvas = require('canvas')

module.exports = {
    commands: 'bundle',
    type: 'Fortnite',
    descriptionEN: 'By using this command you will be able to get all the informations about a bundle of your choice (Only real money bundles)',
    descriptionAR: 'بأستعمال الأمر يمكنك استرجاع جميع المعلومات عن أي حزمة بأختيارك (فقط الحزم المالية)',
    expectedArgsEN: 'To use the command you need to specifiy a bundle name or a bundle name that contains a specifiy word.',
    expectedArgsAR: 'من اجل استخدام الأمر يجب عليك تحديد أسم الحزمة او اي حرف من اي حزمة',
    hintEN: 'You can search for a bundle with just one word you dont need to spell the bundle name correctly just type the words you know. e.g. search by (der) that will give u a list of all the bundles contains word der like Derby Dynamo',
    hintAR: 'يمكنك البحث فقط بأسخدام حرف واحد لا تحتاج الى ان تكتب اسم الحزمة بالكامل فقط اكتب الحروف الي تتذكرها من الحزمة. مثل البحث بأستخدام كلمة (der) سوف تحصل على قائمة لجميع الحزم التي تبدأ بكلمة der مثل Derby Dynamo',
    argsExample: ['Derby Dynamo Challenge Pack', 'D'],
    minArgs: 1,
    maxArgs: null,
    cooldown: 10,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (FNBRMENA, message, args, text, Discord, client, admin, userData, alias, emojisObject) => {

        //inisilizing number
        var offerID = null
        var vbucks = 0
        var outfitQuestData

        await FNBRMENA.getBundles("en")
        .then(async res => {

            //filtering
            const listOfBundles = res.data.bundles.filter(obj => {
                return obj.name.toLowerCase().includes(text.toLowerCase())
            })

            //if there is only one bundle found
            if(listOfBundles.length === 1) offerID = listOfBundles[0]['offerId']

            //ask the user what bundles he means
            if(listOfBundles.length > 1){

                //create embed
                const chooseBundleEmbed = new Discord.EmbedBuilder()
                chooseBundleEmbed.setColor(FNBRMENA.Colors("embed"))

                //create and fill a string of names
                var str = ``
                for(let i = 0; i < listOfBundles.length; i++) str += `• ${i}: ${listOfBundles[i].name}\n`
                chooseBundleEmbed.setDescription(str)

                //filtering
                const filter = m => m.author.id === message.author.id

                //send the reply to the user
                if(userData.lang === "en") reply = "please choose a bundle from the list above, will stop listen in 20 sec"
                else if(userData.lang === "ar") reply = "الرجاء الاختيار من القائمة بالاعلى، سوف ينتهي الامر خلال ٢٠ ثانية"

                //send the reply
                await message.reply({content: reply, embeds: [chooseBundleEmbed]})
                .then(async notify => {

                    //await messages
                    await message.channel.awaitMessages({filter, max: 1, time: 20000, errors: ['time']})
                    .then( async collected => {

                        //deleting messages
                        notify.delete()

                        //if the user input in range
                        if(collected.first().content >= 0 && collected.first().content < listOfBundles.length) offerID = listOfBundles[collected.first().content]['offerId']
                        else{

                            //create out of range embed
                            const outOfRangeError = new Discord.EmbedBuilder()
                            outOfRangeError.setColor(FNBRMENA.Colors("embedError"))
                            outOfRangeError.setTitle(`${FNBRMENA.Errors("outOfRange", userData.lang)} ${emojisObject.errorEmoji}`)
                            message.reply({embeds: [outOfRangeError]})
                            
                        }
                    }).catch(err => {

                        //deleting messages
                        notify.delete()

                        //time has passed
                        const timeError = new Discord.EmbedBuilder()
                        timeError.setColor(FNBRMENA.Colors("embedError"))
                        timeError.setTitle(`${FNBRMENA.Errors("Time", userData.lang)} ${emojisObject.errorEmoji}`)
                        message.reply({embeds: [timeError]})
                    })

                }).catch(err => {
                    FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject)
                })
            }
            
            //no bundle has been found
            if(listOfBundles.length === 0){
                
                const noBundleFoundError = new Discord.EmbedBuilder()
                noBundleFoundError.setColor(FNBRMENA.Colors("embedError"))
                if(userData.lang === "en") noBundleFoundError.setTitle(`No bundle has been found check your speling and try again ${emojisObject.errorEmoji}`)
                else if(userData.lang === "ar") noBundleFoundError.setTitle(`لا يمكنني العثور على الحزمة الرجاء التأكد من كتابة الاسم بشكل صحيح ${emojisObject.errorEmoji}`)
                message.reply({embeds: noBundleFoundError})
            }

        }).catch(err => {
            FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject)
        })

        if(offerID != null){

            const generating = new Discord.EmbedBuilder()
            generating.setColor(FNBRMENA.Colors("embed"))
            if(userData.lang === "en") generating.setTitle(`Loading the bundle data... ${emojisObject.loadingEmoji}`)
            else if(userData.lang === "ar") generating.setTitle(`جاري تحميل معلومات الحزمة... ${emojisObject.loadingEmoji}`)
            message.reply({embeds: [generating]})
            .then(async msg => {

                var searchedBundleData
                await FNBRMENA.getBundles(userData.lang)
                .then(async res => {

                    //filtering
                    await res.data.bundles.filter(obj => {
                        if(obj.offerId === offerID) searchedBundleData = obj
                    })
                    
                }).catch(err => {
                    FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject)
                    
                })

                //canvas variables
                var width = 0
                var height = 1024
                var newline = 0
                var x = 0
                var y = 0

                //canvas length
                var length = searchedBundleData.granted.length

                if(length <= 2) length = length
                else if(length > 2 && length <= 4) length = length / 2
                else if(length > 4 && length <= 8) length = length / 3
                else if(length > 7 && length <= 50) length = length / 5
                else if(length > 50 && length < 70) length = length / 7
                else length = length / 10

                //forcing to be int
                if(length % 2 !== 0){
                    length += 1;
                    length = length | 0;
                }
                
                //creating width
                width += (length * 1024) + (length * 10) - 10

                //creating height
                for(let i = 0; i < searchedBundleData.granted.length; i++){
                    
                    if(newline === length){
                        height += 1024 + 10
                        newline = 0
                    }
                    
                    if(searchedBundleData.granted[i].templateId !== "MtxPurchaseBonus") newline++
                }

                //registering fonts
                Canvas.registerFont('./assets/font/Lalezar-Regular.ttf', {family: 'Arabic',weight: "700",style: "bold"});
                Canvas.registerFont('./assets/font/BurbankBigCondensed-Black.ttf' ,{family: 'Burbank Big Condensed',weight: "700",style: "bold"})

                //aplyText
                const applyText = (canvas, text, font, width) => {
                    const ctx = canvas.getContext('2d');
                    let fontSize = font;
                    do {
                        if(userData.lang === "en") ctx.font = `${fontSize -= 1}px Burbank Big Condensed`;
                        else if(userData.lang === "ar") ctx.font = `${fontSize -= 1}px Arabic`;
                    } while (ctx.measureText(text).width > width);
                    return ctx.font;
                }

                //creating canvas
                const canvas = Canvas.createCanvas(width, height);
                const ctx = canvas.getContext('2d');

                //background
                const background = await Canvas.loadImage('./assets/backgroundwhite.jpg')
                ctx.drawImage(background, 0, 0, canvas.width, canvas.height)

                //reset newline
                newline = 0

                //loop throw every item
                for(let i = 0; i < searchedBundleData.granted.length; i++){

                    if(searchedBundleData.granted[i].templateId !== "MtxPurchased" && searchedBundleData.granted[i].templateId !== "MtxPurchaseBonus" &&
                    !searchedBundleData.granted[i].templateId.includes("bundleschedule") && searchedBundleData.granted[i].templateId !== "campaignaccess" &&
                    !searchedBundleData.granted[i].templateId.includes("stwstarterbundle")){

                        //request data
                        await FNBRMENA.Search(userData.lang, "id", searchedBundleData.granted[i].templateId)
                        .then(async res => {

                            //skin informations
                            if(res.data.items[0].introduction != null){
                                var chapter = res.data.items[0].introduction.chapter.substring(res.data.items[0].introduction.chapter.indexOf(" "), res.data.items[0].introduction.chapter.length).trim()
                                var season = res.data.items[0].introduction.season.substring(res.data.items[0].introduction.season.indexOf(" "), res.data.items[0].introduction.season.length).trim()
    
                                if(userData.lang === "en") var seasonChapter = `C${chapter}S${season}`
                                else if(userData.lang == "ar")var seasonChapter = `الفصل ${chapter} الموسم ${season}`
    
                            }else{
    
                                if(userData.lang === "en") var seasonChapter = `${res.data.items[0].added.version}v`
                                else if(userData.lang == "ar")var seasonChapter = `تحديث ${res.data.items[0].added.version}`
                                
                            }
                            var name = res.data.items[0].name;
                            var type = res.data.items[0].type.name
                            if(res.data.items[0].type.id === "outfit"){
                                outfitQuestData = {
                                    name: res.data.items[0].name,
                                    introduction: seasonChapter
                                }
                            }
                            var image = res.data.items[0].images.icon
                            if(res.data.items[0].series === null) var rarity = res.data.items[0].rarity.id
                            else var rarity = res.data.items[0].series.id
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
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign = 'center';
                            ctx.font = applyText(canvas, name, 72, 900)

                            if(userData.lang === "en"){
                                ctx.fillText(name, 512 + x, (1024 - 30) + y)

                                //add the item season chapter text
                                ctx.textAlign = "left"
                                ctx.font = applyText(canvas, seasonChapter, 40, 900)
                                ctx.fillText(seasonChapter, 5 + x, (1024 - 7.5) + y)

                                //add the item source
                                ctx.textAlign = "right"
                                ctx.font = applyText(canvas, type.toUpperCase(), 40, 900)
                                ctx.fillText(type.toUpperCase(), (1024 - 5) + x, (1024 - 7.5) + y)

                            }else if(userData.lang === "ar"){
                                ctx.fillText(name, 512 + x, (1024 - 60) + y)

                                //add season chapter text
                                ctx.textAlign = "left"
                                ctx.font = applyText(canvas, seasonChapter, 40, 900)
                                ctx.fillText(seasonChapter, 5 + x, (1024 - 12.5) + y)

                                //add the item source
                                ctx.textAlign = "right"
                                ctx.font = applyText(canvas, type, 40, 900)
                                ctx.fillText(type, (1024 - 5) + x, (1024 - 12.5) + y)

                            }

                            //inilizing tags
                            var wTags = (1024 / 512) * 15
                            var hTags = (1024 / 512) * 15
                            var yTags = 7 + y
                            var xTags = ((1024 - wTags) - 7) + x

                            for(let i = 0; i < res.data.items[0].gameplayTags.length; i++){

                                //if the item is animated
                                if(res.data.items[0].gameplayTags[i].includes('Animated')){

                                    //add the animated icon
                                    const Animated = await Canvas.loadImage('./assets/Tags/T-Icon-Animated-64.png')
                                    ctx.drawImage(Animated, xTags, yTags, wTags, hTags)

                                    yTags += hTags + 10
                                }

                                //if the item is reactive
                                if(res.data.items[0].gameplayTags[i].includes('Reactive')){

                                    //add the reactive icon
                                    const Adaptive = await Canvas.loadImage('./assets/Tags/T-Icon-Adaptive-64.png')
                                    ctx.drawImage(Adaptive, xTags, yTags, wTags, hTags)

                                    yTags += hTags + 10
                                }

                                //if the item is synced emote
                                if(res.data.items[0].gameplayTags[i].includes('Synced')){

                                    //add the synced icon
                                    const Synced = await Canvas.loadImage('./assets/Tags/T-Icon-Synced-64x.png')
                                    ctx.drawImage(Synced, xTags, yTags, wTags, hTags)

                                    yTags += hTags + 10
                                }

                                //if the item is traversal
                                if(res.data.items[0].gameplayTags[i].includes('Traversal')){

                                    //add the traversal icon
                                    const Traversal = await Canvas.loadImage('./assets/Tags/T-Icon-Traversal-64.png')
                                    ctx.drawImage(Traversal, xTags, yTags, wTags, hTags)

                                    yTags += hTags + 10
                                }

                                //if the item has styles
                                if(res.data.items[0].gameplayTags[i].includes('HasVariants') || res.data.items[0].gameplayTags[i].includes('HasUpgradeQuests')){

                                    //add the variant icon
                                    const Variant = await Canvas.loadImage('./assets/Tags/T-Icon-Variant-64.png')
                                    ctx.drawImage(Variant, xTags, yTags, wTags, hTags)

                                    yTags += hTags + 10
                                }
                            }

                            //if the item contains copyrited audio
                            if(res.data.items[0].copyrightedAudio){

                                //add the mute icon
                                const Mute = await Canvas.loadImage('./assets/Tags/mute.png')
                                ctx.drawImage(Mute, xTags, yTags, wTags, hTags)

                                yTags += hTags + 10
                            }

                            //if the item contains built in emote
                            if(res.data.items[0].builtInEmote != null){

                                //add the builtInEmote icon
                                const builtInEmote = await Canvas.loadImage(res.data.items[0].builtInEmote.images.icon)
                                ctx.drawImage(builtInEmote, xTags - 15, yTags, ((1024 / 512) * 30) + x, ((1024 / 512) * 30) + y)
                            }

                            // changing x and y
                            x = x + 10 + 1024; 
                            if (length === newline){
                                y = y + 10 + 1024;
                                x = 0;
                                newline = 0;
                            }
                        }).catch(err => {
                            FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject)
                            
                        })

                    }else if(searchedBundleData.granted[i].templateId === "MtxPurchased" || searchedBundleData.granted[i].templateId === "MtxPurchaseBonus") vbucks += await searchedBundleData.granted[i].quantity
                    
                }

                //load the image if there is a vbucks
                if(vbucks !== 0){

                    //creating image
                    const vbucksholder = await Canvas.loadImage('./assets/Rarities/newStyle/legendary.png')
                    ctx.drawImage(vbucksholder, x, y, 1024, 1024)
                    const vbucksImg = await Canvas.loadImage('https://media.fortniteapi.io/images/652b99f7863db4ba398c40c326ac15a9/transparent.png');
                    ctx.drawImage(vbucksImg, x, y, 1024, 1024)
                    const vbucksborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderLegendary.png')
                    ctx.drawImage(vbucksborder, x, y, 1024, 1024)

                    //add the item name
                    ctx.textAlign = 'center';
                    if(userData.lang === "en"){
                        ctx.font = applyText(canvas, `${vbucks} V-Bucks`, 72, 900)
                        ctx.fillText(`${vbucks} V-Bucks`, 512 + x, (1024 - 30) + y)

                        //add the item season chapter text
                        ctx.textAlign = "left"
                        ctx.font = applyText(canvas, 'C1S1', 40, 900)
                        ctx.fillText('C1S1', 5 + x, (1024 - 7.5) + y)

                        //add the item source
                        ctx.textAlign = "right"
                        ctx.font = applyText(canvas, 'CURRENCY', 40, 900)
                        ctx.fillText('CURRENCY', (1024 - 5) + x, (1024 - 7.5) + y)

                    }else if(userData.lang === "ar"){
                        ctx.font = applyText(canvas, `${vbucks} فيبوكس`, 72, 900)
                        ctx.fillText(`${vbucks} فيبوكس`, 512 + x, (1024 - 60) + y)

                        //add season chapter text
                        ctx.textAlign = "left"
                        ctx.font = applyText(canvas, 'لفصل  ١، لموسم  ١', 40, 900)
                        ctx.fillText('لفصل  ١، لموسم  ١', 5 + x, (1024 - 12.5) + y)

                        //add the item source
                        ctx.textAlign = "right"
                        ctx.font = applyText(canvas, 'عملة', 40, 900)
                        ctx.fillText('عملة', (1024 - 5) + x, (1024 - 12.5) + y)

                    }
                }

                //load the image if there is a challenges pack
                for(let i = 0; i < searchedBundleData.granted.length; i++){

                    //found an challenge pack
                    if(searchedBundleData.granted[i].templateId.includes("bundleschedule")){
                        newline++

                        //creating image
                        const bundlescheduleholder = await Canvas.loadImage('./assets/Rarities/newStyle/legendary.png')
                        ctx.drawImage(bundlescheduleholder, x, y, 1024, 1024)
                        const bundleschedule = await Canvas.loadImage('https://i.imgur.com/MaGvfNq.png');
                        ctx.drawImage(bundleschedule, x, y, 1024, 1024)
                        const bundlescheduleborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderLegendary.png')
                        ctx.drawImage(bundlescheduleborder, x, y, 1024, 1024)

                        //add the item name
                        ctx.textAlign = 'center';
                        if(userData.lang === "en"){
                            ctx.font = applyText(canvas, `Additional quests for ${outfitQuestData.name}.`, 72, 900)
                            ctx.fillText(`Additional quests for ${outfitQuestData.name}.`, 512 + x, (1024 - 30) + y)

                            //add the item season chapter text
                            ctx.textAlign = "left"
                            ctx.font = applyText(canvas, outfitQuestData.introduction, 40, 900)
                            ctx.fillText(outfitQuestData.introduction, 5 + x, (1024 - 7.5) + y)

                            //add the item source
                            ctx.textAlign = "right"
                            ctx.font = applyText(canvas, 'QUESTS', 40, 900)
                            ctx.fillText('QUESTS', (1024 - 5) + x, (1024 - 7.5) + y)

                        }else if(userData.lang === "ar"){
                            ctx.font = applyText(canvas, `مهام إضافية لـ ${outfitQuestData.name}.`, 72, 900)
                            ctx.fillText(`مهام إضافية لـ ${outfitQuestData.name}.`, 512 + x, (1024 - 60) + y)

                            //add season chapter text
                            ctx.textAlign = "left"
                            ctx.font = applyText(canvas, outfitQuestData.introduction, 40, 900)
                            ctx.fillText(outfitQuestData.introduction, 5 + x, (1024 - 12.5) + y)

                            //add the item source
                            ctx.textAlign = "right"
                            ctx.font = applyText(canvas, 'تحديات', 40, 900)
                            ctx.fillText('تحديات', (1024 - 5) + x, (1024 - 12.5) + y)

                        }

                        x = x + 10 + 1024; 
                        if (length === newline){
                            y = y + 10 + 1024;
                            x = 0;
                            newline = 0;
                        }
                    }

                    //found an stw access
                    if(searchedBundleData.granted[i].templateId.includes("campaignaccess")){
                        newline++

                        //creating image
                        const campaignaccessholder = await Canvas.loadImage('./assets/Rarities/newStyle/uncommon.png')
                        ctx.drawImage(campaignaccessholder, x, y, 1024, 1024)
                        const campaignaccess = await Canvas.loadImage('https://imgur.com/4LmOgaj.png');
                        ctx.drawImage(campaignaccess, x, y, 1024, 1024)
                        const campaignaccessborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderUncommon.png')
                        ctx.drawImage(campaignaccessborder, x, y, 1024, 1024)

                        //add the item name
                        ctx.textAlign = 'center';
                        if(userData.lang === "en"){
                            ctx.font = applyText(canvas, `Save the World Access`, 72, 900)
                            ctx.fillText(`Save the World Access`, 512 + x, (1024 - 30) + y)

                            //add the item season chapter text
                            ctx.textAlign = "left"
                            ctx.font = applyText(canvas, 'UNKNOWN', 40, 900)
                            ctx.fillText('UNKNOWN', 5 + x, (1024 - 7.5) + y)

                            //add the item source
                            ctx.textAlign = "right"
                            ctx.font = applyText(canvas, 'STW ACCESS', 40, 900)
                            ctx.fillText('STW ACCESS', (1024 - 5) + x, (1024 - 7.5) + y)

                        }else if(userData.lang === "ar"){
                            ctx.font = applyText(canvas, `الوصول إلى أنقِذ العالم`, 72, 900)
                            ctx.fillText(`الوصول إلى أنقِذ العالم`, 512 + x, (1024 - 60) + y)

                            //add season chapter text
                            ctx.textAlign = "left"
                            ctx.font = applyText(canvas, 'غير معلوم', 40, 900)
                            ctx.fillText('غير معلوم', 5 + x, (1024 - 12.5) + y)

                            //add the item source
                            ctx.textAlign = "right"
                            ctx.font = applyText(canvas, 'دخول انقاذ العالم', 40, 900)
                            ctx.fillText('دخول انقاذ العالم', (1024 - 5) + x, (1024 - 12.5) + y)

                        }

                        x = x + 10 + 1024; 
                        if (length === newline){
                            y = y + 10 + 1024;
                            x = 0;
                            newline = 0;
                        }

                        newline++

                        //creating image
                        const rewardsholder = await Canvas.loadImage('./assets/Rarities/newStyle/legendary.png')
                        ctx.drawImage(rewardsholder, x, y, 1024, 1024)
                        const rewards = await Canvas.loadImage('https://imgur.com/IM4C1Ab.png');
                        ctx.drawImage(rewards, x, y, 1024, 1024)
                        const rewardsborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderLegendary.png')
                        ctx.drawImage(rewardsborder, x, y, 1024, 1024)

                        //add the item name
                        ctx.textAlign = 'center';
                        if(userData.lang === "en"){
                            ctx.font = applyText(canvas, `${searchedBundleData.name} Rewards`, 72, 900)
                            ctx.fillText(`${searchedBundleData.name} Rewards`, 512 + x, (1024 - 30) + y)

                            //add the item season chapter text
                            ctx.textAlign = "left"
                            ctx.font = applyText(canvas, 'C1S1', 40, 900)
                            ctx.fillText('C1S1', 5 + x, (1024 - 7.5) + y)

                            //add the item source
                            ctx.textAlign = "right"
                            ctx.font = applyText(canvas, 'UNKNOWN', 40, 900)
                            ctx.fillText('UNKNOWN', (1024 - 5) + x, (1024 - 7.5) + y)

                        }else if(userData.lang === "ar"){
                            ctx.font = applyText(canvas, `جوائز ${searchedBundleData.name}`, 72, 900)
                            ctx.fillText(`جوائز ${searchedBundleData.name}`, 512 + x, (1024 - 60) + y)

                            //add season chapter text
                            ctx.textAlign = "left"
                            ctx.font = applyText(canvas, 'غير معلوم', 40, 900)
                            ctx.fillText('غير معلوم', 5 + x, (1024 - 12.5) + y)

                            //add the item source
                            ctx.textAlign = "right"
                            ctx.font = applyText(canvas, 'جوائز', 40, 900)
                            ctx.fillText('جوائز', (1024 - 5) + x, (1024 - 12.5) + y)

                        }
                    }
                }

                //setup moment locale
                moment.locale(userData.lang)

                //creating embed
                const bundleEmbed = new Discord.EmbedBuilder()
                bundleEmbed.setColor(FNBRMENA.Colors("embed"))
                bundleEmbed.setTitle(searchedBundleData.name)
                bundleEmbed.setDescription(searchedBundleData.description)

                //payable? and dates
                if(userData.lang === "en"){

                    //if the bundle is available
                    if(searchedBundleData.available) bundleEmbed.addFields({name: "Available", value: `\`Yes!\``})
                    else bundleEmbed.addFields({name: "Available", value: `\`No!\``})

                    //available since
                    if(searchedBundleData.viewableDate !== null) bundleEmbed.addFields({name: "Available Since", value: `\`${moment(searchedBundleData.viewableDate).format("dddd, MMMM Do of YYYY")}\``})
                    else bundleEmbed.addFields({name: "Available Since", value:`\`Not known yet!\``})

                    //if there is no expire date
                    if(searchedBundleData.expiryDate !== null) bundleEmbed.addFields({name: "Will be gone at", value: `\`${moment(searchedBundleData.expiryDate).format("dddd, MMMM Do of YYYY")}\``})
                    else bundleEmbed.addFields({name: "Will be gone at", value: `\`Not known yet!\``})
                            
                }else if(userData.lang === "ar"){

                    //if the bundle is available
                    if(searchedBundleData.available) bundleEmbed.addFields({name: "متاحة للشراء", value: `\`نعم!\``})
                    else bundleEmbed.addFields({name: "متاحة للشراء", value: `\`لا!\``})

                    //available since
                    if(searchedBundleData.viewableDate !== null) bundleEmbed.addFields({name: "متاحة منذ", value: `\`${moment(searchedBundleData.viewableDate).format("dddd, MMMM Do من YYYY")}\``})
                    else bundleEmbed.addFields({name: "متاحة منذ", value:`\`لا يوجد تاريخ معلوم حتى الان!\``})

                    //if there is no expire date
                    if(searchedBundleData.expiryDate !== null) bundleEmbed.addFields({name: "سوف تغادر في", value: `\`${moment(searchedBundleData.expiryDate).format("dddd, MMMM Do من YYYY")}\``})
                    else bundleEmbed.addFields({name: "سوف تغادر في", value: `\`لا يوجد تاريخ معلوم حتى الان!\``})

                }

                //check if there is prices
                if(searchedBundleData.prices.length !== 0){

                    //add prices
                    for(let i = 0; i < searchedBundleData.prices.length; i++){
                        bundleEmbed.addFields(
                            {name: searchedBundleData.prices[i].paymentCurrencyCode, value: `\`${searchedBundleData.prices[i].paymentCurrencyAmountNatural} ${searchedBundleData.prices[i].paymentCurrencySymbol}\``, inline: true}
                        )
                    }

                }else if(userData.lang === "en") bundleEmbed.addFields({name: 'Prices', value: `\`There is no prices yet\``})
                else if(userData.lang === "ar") bundleEmbed.addFields({name: 'الاسعار', value: `\`لا يوجد اسعار حاليا\``})
                

                //tumbnail and image
                if(searchedBundleData.displayAssets.length !== 0){

                    //store the url
                    var url = searchedBundleData.displayAssets[0].url
                        
                    //decode and encode
                    url = decodeURI(url);
                    url = encodeURI(url);

                    //add thumbnail
                    bundleEmbed.setThumbnail(url)

                    //add the image
                    if(searchedBundleData.thumbnail !== null){

                        //store the url
                        var url = searchedBundleData.thumbnail
                        
                        //decode and encode
                        url = decodeURI(url);
                        url = encodeURI(url);

                        //set the image
                        bundleEmbed.setImage(url)
                    }else{

                        //store the url
                        var url = searchedBundleData.displayAssets[0].background
                        
                        //decode and encode
                        url = decodeURI(url);
                        url = encodeURI(url);

                        //set the image
                        bundleEmbed.setImage(url)
                    }
                }else{

                    //add the image
                    if(searchedBundleData.thumbnail !== null){

                        //store the url
                        var url = searchedBundleData.thumbnail
                        
                        //decode and encode
                        url = decodeURI(url);
                        url = encodeURI(url);

                        //set the image
                        bundleEmbed.setImage(url)
                    }
                }

                const att = new Discord.AttachmentBuilder(canvas.toBuffer(), `${searchedBundleData.offerId}.png`)
                await message.reply({files: [att], embeds: [bundleEmbed]})
                msg.delete()

            }).catch(err => {
                FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject)
                
            })
        }
    }
}