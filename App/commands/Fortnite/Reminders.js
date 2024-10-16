const moment = require('moment')
const Canvas = require('canvas')

module.exports = {
    commands: 'reminders',
    type: 'Fortnite',
    descriptionEN: 'Get a list all of your reminders.',
    descriptionAR: 'احصل على قائمة بجميع التذكيرات الخاصة بك.',
    minArgs: 0,
    maxArgs: 1,
    cooldown: -1,
    callback: async (FNBRMENA, message, args, text, Discord, client, admin, userData, alias, emojisObject) => {

        // Get the userId
        if(args.length === 0) var userId = message.author
        else{

            // Check if its a tag or an id
            if(text.includes("@")){
                var userId = text.replace('<@', '')
                userId = userId.replace('>', '')
            }else var userId = text

            // Check user
            userId = await message.guild.members.cache.get(userId)
            if(!userId){

                // Create embed
                const userIdNotValidError = new Discord.EmbedBuilder()
                userIdNotValidError.setColor(FNBRMENA.Colors("embedError"))
                if(userData.lang === "en") userIdNotValidError.setTitle(`Please tag a valid user ${emojisObject.errorEmoji}.`)
                else if(userData.lang === "ar") userIdNotValidError.setTitle(`الرجاء ادخال اسم صحيح${emojisObject.errorEmoji}.`)
                return message.reply({embeds: [userIdNotValidError]})
                .catch(err => {
                    FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, null)
                })
                
            }else userId = userId.user
        }

        // Check if bot
        if(userId.bot){

            // Create embed
            const userIdABotError = new Discord.EmbedBuilder()
            userIdABotError.setColor(FNBRMENA.Colors("embedError"))
            if(userData.lang === "en") userIdABotError.setTitle(`You can't tag a bot ${emojisObject.errorEmoji}.`)
            else if(userData.lang === "ar") userIdABotError.setTitle(`لا يمكنك ادخال اسم روبوت ${emojisObject.errorEmoji}.`)
            return message.reply({embeds: [userIdABotError], components: [], files: []})
            .catch(err => {
                FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, null)
            })
        }

        // Total vbucks
        var totalVbucks = {
            vbucks: 0,
            found: 0,
            missing: 0,
        }

        // Setting up the db firestore
        var db = await admin.firestore()

        // Define the collection
        const docRef = await db.collection("Users").doc(`${userId.id}`).collection("Reminders")

        // Get the collection data
        const snapshot = await docRef.get()

        // If the user has reminders
        if(snapshot.size === 0){

            // Create embed
            const noRemindersFoundError = new Discord.EmbedBuilder()
            noRemindersFoundError.setColor(FNBRMENA.Colors("embedError"))
            if(userData.lang === "en") noRemindersFoundError.setTitle(`${userId.username} doesn't have any reminders yet ${emojisObject.errorEmoji}.`)
            else if(userData.lang === "ar") noRemindersFoundError.setTitle(`لا يوجد لدى ${userId.username} اي تنبيهات ${emojisObject.errorEmoji}.`)
            return message.reply({embeds: [noRemindersFoundError], components: [], files: []})
            .catch(err => {
                FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, null)
            })
        }

        // Send a generate message
        const generating = new Discord.EmbedBuilder()
        generating.setColor(FNBRMENA.Colors("embed"))
        if(userData.lang === "en") generating.setTitle(`Getting all of the reminders for ${userId.username} account ${emojisObject.loadingEmoji}`)
        if(userData.lang === "ar") generating.setTitle(`جاري جلب جميع التنبيهات لحساب ${userId.username} ${emojisObject.loadingEmoji}`)
        const msg = await message.reply({embeds: [generating], components: [], files: []})
        .catch(err => {
            FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, null)
        })
        
        try {

            // Variables
            var width = 0
            var height = 1024
            var newline = 0
            var x = 0
            var y = 0

            // Creating length
            var length = snapshot.size
            if(length <= 2) length = length
            else if(length > 2 && length <= 4) length = length / 2
            else if(length > 4 && length <= 7) length = length / 3
            else length = length / 4

            // Forcing to be int
            if (length % 2 !== 0){
                length += 1;
                length = length | 0;
            }

            // Creating width
            if(snapshot.size === 1) width = 1024
            else width += (length * 1024) + (length * 10) - 10

            // Creating height
            for(let i = 0; i < snapshot.size; i++){
                
                if(newline === length){
                    height += 1024 + 10
                    newline = 0
                }
                newline++
            }

            // Registering fonts
            Canvas.registerFont('./assets/font/Lalezar-Regular.ttf', {family: 'Arabic',weight: "400",style: "bold"});
            Canvas.registerFont('./assets/font/BurbankBigCondensed-Black.ttf' ,{family: 'Burbank Big Condensed',weight: "400",style: "bold"})

            // applyText
            const applyText = (canvas, text, width, font) => {
                const ctx = canvas.getContext('2d');
                let fontSize = font;
                do {
                    if(userData.lang === "en") ctx.font = `${fontSize -= 1}px Burbank Big Condensed`;
                    else if(userData.lang === "ar") ctx.font = `${fontSize -= 1}px Arabic`;
                } while (ctx.measureText(text).width > width);
                return ctx.font;
            };

            // Creating canvas
            const canvas = Canvas.createCanvas(width, height);
            const ctx = canvas.getContext('2d');

            // Background
            const background = await Canvas.loadImage('./assets/backgroundwhite.jpg')
            ctx.drawImage(background, 0, 0, canvas.width, canvas.height)

            // Reseting newline
            newline = 0

            // Get every single collection
            var string = ``
            for(let i = 0; i < snapshot.size; i++){

                // Get the item name
                await FNBRMENA.Search(userData.lang, "id", snapshot.docs[i].id)
                .then(async res => {
                    ctx.fillStyle = '#ffffff';

                    // Skin informations
                    if(res.data.items[0].introduction != null){
                        var chapter = res.data.items[0].introduction.chapter.substring(res.data.items[0].introduction.chapter.indexOf(" "), res.data.items[0].introduction.chapter.length).trim()

                        if(userData.lang === "en"){
                            var season = res.data.items[0].introduction.season.substring(res.data.items[0].introduction.season.indexOf(" "), res.data.items[0].introduction.season.length).trim()
                            if(userData.lang === "en") var seasonChapter = `C${chapter}S${season}`

                        }else if(userData.lang == "ar"){
                            if(res.data.items[0].introduction.season.includes("X")) var seasonChapter = `الفصل ${chapter} الموسم X`
                            else{
                                var season = res.data.items[0].introduction.season.substring(res.data.items[0].introduction.season.indexOf(" "), res.data.items[0].introduction.season.length).trim()
                                var seasonChapter = `الفصل ${chapter} الموسم ${season}`
                            }
                        }

                    }else{

                        if(userData.lang === "en") var seasonChapter = `${res.data.items[0].added.version}v`
                        else if(userData.lang == "ar") var seasonChapter = `تحديث ${res.data.items[0].added.version}`
                        
                    }

                    if(res.data.items[0].gameplayTags.length != 0){
                        for(let j = 0; j < res.data.items[0].gameplayTags.length; j++){
                            if(res.data.items[0].gameplayTags[j].includes('Source')){

                                if(res.data.items[0].gameplayTags[j].toLowerCase().includes("itemshop")){

                                    if(userData.lang === "en") var Source = "ITEMSHOP"
                                    else if(userData.lang === "ar") var Source = "متجر العناصر"
                                }else if(res.data.items[0].gameplayTags[j].toLowerCase().includes("seasonshop")){

                                    if(userData.lang === "en") var Source = "SEASON SHOP"
                                    else if(userData.lang === "ar") var Source = "متجر الموسم"
                                }else if(res.data.items[0].gameplayTags[j].toLowerCase().includes("battlepass")){

                                    if(userData.lang === "en") var Source = "BATTLEPASS"
                                    else if(userData.lang === "ar") var Source = "بطاقة المعركة"
                                }else if(res.data.items[0].gameplayTags[j].toLowerCase().includes("firstwin")){

                                    if(userData.lang === "en") var Source = "FIRST WIN"
                                    else if(userData.lang === "ar") var Source = "اول انتصار"
                                }else if(res.data.items[0].gameplayTags[j].toLowerCase().includes("event")){

                                    if(userData.lang === "en") var Source = "EVENT"
                                    else if(userData.lang === "ar") var Source = "حدث"
                                }else if(res.data.items[0].gameplayTags[j].toLowerCase().includes("platform") || (res.data.items[0].gameplayTags[j].toLowerCase().includes("promo"))){

                                    if(userData.lang === "en") var Source = "EXCLUSIVE"
                                    else if(userData.lang === "ar") var Source = "حصري"
                                }else if(res.data.items[0].gameplayTags[j].toLowerCase().includes("starterpack")){

                                    if(userData.lang === "en") var Source = "Starter Pack"
                                    else if(userData.lang === "ar") var Source = "حزمة المبتدئين"
                                }

                                break
                            }else var Source = res.data.items[0].type.name.toUpperCase()
                        }

                    }else var Source = res.data.items[0].type.name.toUpperCase()

                    if(res.data.items[0].name !== "") var name = res.data.items[0].name
                    else{
                        if(userData.lang === "en") var name = 'NAME NOT FOUND'
                        else if(userData.lang === "ar") var name = 'لا يوجد اسم'
                    }
                    if(res.data.items[0].images.icon === null) var image = 'https://firebasestorage.googleapis.com/v0/b/fnbrmena-bot.appspot.com/o/code_images%2FHVH5sqV.png?alt=media&token=41c26ee2-c98e-492d-a84c-299a69ac6012'
                    else var image = res.data.items[0].images.icon
                    if(res.data.items[0].series !== null) var rarity = res.data.items[0].series.id
                    else var rarity = res.data.items[0].rarity.id
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

                    if(res.data.items[0].juno.icon){
                        
                        //save the ctx
                        ctx.save()

                        //draw a circle and clip it
                        ctx.beginPath()
                        ctx.arc(x + 65, y + 10, 100, 0 * Math.PI, 2 * Math.PI);
                        ctx.clip()

                        //draw the npc img
                        const juno = await Canvas.loadImage(res.data.items[0].juno.icon);
                        ctx.drawImage(juno, x + 10, y + 10, 110, 110)

                        //restoe the clip
                        ctx.restore()
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

                    for(let t = 0; t < res.data.items[0].gameplayTags.length; t++){

                        // If the item is animated
                        if(res.data.items[0].gameplayTags[t].includes('Animated')){

                            // Add the animated icon
                            const Animated = await Canvas.loadImage('./assets/Tags/T-Icon-Animated-64.png')
                            ctx.drawImage(Animated, xTags, yTags, wTags, hTags)

                            yTags += hTags + 10
                        }

                        // If the item is reactive
                        if(res.data.items[0].gameplayTags[t].includes('Reactive')){

                            // Add the reactive icon
                            const Reactive = await Canvas.loadImage('./assets/Tags/T-Icon-Adaptive-64.png')
                            ctx.drawImage(Reactive, xTags, yTags, wTags, hTags)

                            yTags += hTags + 10
                            
                        }

                        // If the item is synced emote
                        if(res.data.items[0].gameplayTags[t].includes('Synced')){

                            // Add the Synced icon
                            const Synced = await Canvas.loadImage('./assets/Tags/T-Icon-Synced-64x.png')
                            ctx.drawImage(Synced, xTags, yTags, wTags, hTags)

                            yTags += hTags + 10
                            
                        }

                        // If the item is traversal
                        if(res.data.items[0].gameplayTags[t].includes('Traversal')){

                            // Add the Traversal icon
                            const Traversal = await Canvas.loadImage('./assets/Tags/T-Icon-Traversal-64.png')
                            ctx.drawImage(Traversal, xTags, yTags, wTags, hTags)

                            yTags += hTags + 10
                        }

                        // If the item has styles
                        if(res.data.items[0].gameplayTags[t].includes('HasVariants') || res.data.items[0].gameplayTags[t].includes('HasUpgradeQuests')){

                            // Add the HasVariants icon
                            const HasVariants = await Canvas.loadImage('./assets/Tags/T-Icon-Variant-64.png')
                            ctx.drawImage(HasVariants, xTags, yTags, wTags, hTags)

                            yTags += hTags + 10
                        }
                    }

                    // If the item contains copyrited audio
                    if(res.data.items[0].copyrightedAudio){

                        // Add the copyrightedAudio icon
                        const copyrightedAudio = await Canvas.loadImage('./assets/Tags/mute.png')
                        ctx.drawImage(copyrightedAudio, xTags, yTags, wTags, hTags)

                        yTags += hTags + 10
                    }

                    // If the item contains built in emote
                    if(res.data.items[0].builtInEmote != null){

                        // Add the builtInEmote icon
                        const builtInEmote = await Canvas.loadImage(res.data.items[0].builtInEmote.images.icon)
                        ctx.drawImage(builtInEmote, xTags - 15, yTags, ((1024 / 512) * 30) + x, ((1024 / 512) * 30) + y)
                    }

                    // Changing x and y
                    x = x + 10 + 1024; 
                    if(length === newline){
                        y = y + 10 + 1024;
                        x = 0;
                        newline = 0;
                    }

                    // Long client has been waiting for
                    moment.locale(userData.lang)
                    var Now = moment()
                    var long = moment(snapshot.docs[i].data().date)
                    const day = Now.diff(long, 'days')
                    
                    // Add every reminder to the array
                    if((i + 1) != snapshot.size){
                        if(userData.lang === "en") string += `${emojisObject.countEmoji} ${res.data.items[0].name} \`${day} Waiting days.\`\n`
                        else if(userData.lang === "ar") string += `${res.data.items[0].name} \`${day} يوم منتظر.\`\n`

                    }else{
                        if(userData.lang === "en") string += `${emojisObject.endEmoji} ${res.data.items[0].name} \`${day} Waiting days.\`\n`
                        else if(userData.lang === "ar") string += `${res.data.items[0].name} \`${day} يوم منتظر.\`\n`
                    }

                    // Calculate total vbucks
                    if(res.data.items[0].price !== 0) totalVbucks.vbucks += res.data.items[0].price, totalVbucks.found++
                    else totalVbucks.missing++

                // Handeling errors
                }).catch(err => {
                    FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, msg)

                })
            }

            // Creeate embed
            const remindersEmbed = new Discord.EmbedBuilder()
            remindersEmbed.setColor(FNBRMENA.Colors("embed"))
            if(userData.lang === "en"){
                remindersEmbed.setTitle(`Reminders for ${userId.username}`)
                remindersEmbed.setDescription(`You will be notified when these items are in the Item Shop. Add & remove items with remind and unremind. \n\n${string}\n\n${emojisObject.vbucks} Your Total Vbucks: \`${totalVbucks.vbucks} for ${totalVbucks.found} item(s)\`${(totalVbucks.missing > 0) ? `\n${emojisObject.MarvelSeries} Missing Counted Items: \`${totalVbucks.missing} item(s)\`` : ''}\n${emojisObject.ColumbusSeries} You can add ${20 - snapshot.size} more reminders (${snapshot.size}/20).`)
            }else if(userData.lang === "ar"){
                remindersEmbed.setTitle(`التذكيرات لـ ${userId.username}`)
                remindersEmbed.setDescription(`سوف يتم تنبيهك في حال توفر احد العناصر التاليه في متجر العناصر. اضف & احذف العناصر بأستخدام remind و unremind. \n\n${string}\n\n${emojisObject.vbucks} مجموع الفيبوكس الكلي: \`${totalVbucks.vbucks} لـ ${totalVbucks.found} عنصر\`${(totalVbucks.missing > 0) ? `\n${emojisObject.MarvelSeries} تم استثناء: \`${totalVbucks.missing} عنصر\`` : ''}\n${emojisObject.ColumbusSeries} يمكنك اضافة ${20 - snapshot.size} من المذكرات (${snapshot.size}/20).`)
            }

            // Send the image
            var att = new Discord.AttachmentBuilder(canvas.toBuffer(), {name: `${userId.id}.png`})
            msg.edit({embeds: [remindersEmbed], components: [], files: [att]})
            .catch(err => {

                // Try sending it on jpg file format [LOWER QUALITY]
                var att = new Discord.AttachmentBuilder(canvas.toBuffer('image/jpeg'), {name: `${userId.id}.jpg`})
                msg.edit({embeds: [remindersEmbed], components: [], files: [att]})
                .catch(err => {
                    FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, msg)
                })
            })

        // Handeling errors
        }catch(err) {
            FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, msg)

        }
    }
}