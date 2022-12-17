const Canvas = require('canvas');

module.exports = {
    commands: 'set',
    type: 'Fortnite',
    descriptionEN: 'ُReturns an image contains all of the cosmetics in a set.',
    descriptionAR: 'يسترجع لك الأمر صورة تحتوي على جميع العناصر في مجموعة معينة.',
    expectedArgsEN: 'To start type the command then set name.',
    expectedArgsAR: 'للبدء اكتب الأمر ثم اسم المجموعة',
    argsExample: ['Storm Scavenger', 'Rick, C-137'],
    minArgs: 1,
    maxArgs: null,
    cooldown: 10,
    callback: async (FNBRMENA, message, args, text, Discord, client, admin, userData, alias, emojisObject) => {
        
        // Request a specific set
        FNBRMENA.Set(userData.lang, text)
        .then(async res => {

            // Check if a set has been found
            if(res.data.items.length === 0){

                // No set has been found
                const noSetHasBeenFoundError = new Discord.EmbedBuilder()
                noSetHasBeenFoundError.setColor(FNBRMENA.Colors("embedError"))
                if(userData.lang === "en") noSetHasBeenFoundError.setTitle(`Sorry, No cosmetics has been found ${emojisObject.errorEmoji}`)
                else if(userData.lang === "ar") noSetHasBeenFoundError.setTitle(`عذرا لم يتم العثور على عناصر ${emojisObject.errorEmoji}`)
                message.reply({embeds: [noSetHasBeenFoundError], components: [], files: []})

            }else{

                // Generating text
                const generating = new Discord.EmbedBuilder()
                generating.setColor(FNBRMENA.Colors("embed"))
                if(userData.lang === "en") generating.setTitle(`Searching for Cosmetics... ${emojisObject.loadingEmoji}`)
                else if(userData.lang === "ar") generating.setTitle(`جاري البحث عن عناصر... ${emojisObject.loadingEmoji}`)
                const msg = await message.reply({embeds: [generating], components: [], files: []})
                try {

                    // Variables
                    var width = 0
                    var height = 1024
                    var newline = 0
                    var x = 0
                    var y = 0

                    // Creating length
                    var length = res.data.items.length
                    if(length <= 2) length = length
                    else if(length > 2 && length <= 4) length = length / 2
                    else if(length > 4 && length <= 7) length = length / 3
                    else length = length / 4

                    //forcing to be int
                    if (length % 2 !== 0){
                        length += 1;
                        length = length | 0;
                    }

                    // Creating width
                    if(res.data.items.length === 1) width = 1024
                    else width += (length * 1024) + (length * 10) - 10

                    // Creating height
                    for(let i = 0; i < res.data.items.length; i++){
                        
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

                    for(let i = 0; i < res.data.items.length; i++){
                        ctx.fillStyle = '#ffffff';

                        // Skin informations
                        if(res.data.items[i].introduction != null){
                            var chapter = res.data.items[i].introduction.chapter.substring(res.data.items[i].introduction.chapter.indexOf(" "), res.data.items[i].introduction.chapter.length).trim()

                            if(userData.lang === "en"){
                                var season = res.data.items[i].introduction.season.substring(res.data.items[i].introduction.season.indexOf(" "), res.data.items[i].introduction.season.length).trim()
                                if(userData.lang === "en") var seasonChapter = `C${chapter}S${season}`

                            }else if(userData.lang == "ar"){
                                if(res.data.items[i].introduction.season.includes("X")) var seasonChapter = `الفصل ${chapter} الموسم X`
                                else{
                                    var season = res.data.items[i].introduction.season.substring(res.data.items[i].introduction.season.indexOf(" "), res.data.items[i].introduction.season.length).trim()
                                    var seasonChapter = `الفصل ${chapter} الموسم ${season}`
                                }
                            }

                        }else{

                            if(userData.lang === "en") var seasonChapter = `${res.data.items[i].added.version}v`
                            else if(userData.lang == "ar") var seasonChapter = `تحديث ${res.data.items[i].added.version}`
                            
                        }

                        if(res.data.items[i].gameplayTags.length != 0){
                            for(let j = 0; j < res.data.items[i].gameplayTags.length; j++){
                                if(res.data.items[i].gameplayTags[j].includes('Source')){

                                    if(res.data.items[i].gameplayTags[j].toLowerCase().includes("itemshop")){

                                        if(userData.lang === "en") var Source = "ITEMSHOP"
                                        else if(userData.lang === "ar") var Source = "متجر العناصر"
                                    }else if(res.data.items[i].gameplayTags[j].toLowerCase().includes("seasonshop")){

                                        if(userData.lang === "en") var Source = "SEASON SHOP"
                                        else if(userData.lang === "ar") var Source = "متجر الموسم"
                                    }else if(res.data.items[i].gameplayTags[j].toLowerCase().includes("battlepass")){

                                        if(userData.lang === "en") var Source = "BATTLEPASS"
                                        else if(userData.lang === "ar") var Source = "بطاقة المعركة"
                                    }else if(res.data.items[i].gameplayTags[j].toLowerCase().includes("firstwin")){

                                        if(userData.lang === "en") var Source = "FIRST WIN"
                                        else if(userData.lang === "ar") var Source = "اول انتصار"
                                    }else if(res.data.items[i].gameplayTags[j].toLowerCase().includes("event")){

                                        if(userData.lang === "en") var Source = "EVENT"
                                        else if(userData.lang === "ar") var Source = "حدث"
                                    }else if(res.data.items[i].gameplayTags[j].toLowerCase().includes("platform") || (res.data.items[i].gameplayTags[j].toLowerCase().includes("promo"))){

                                        if(userData.lang === "en") var Source = "EXCLUSIVE"
                                        else if(userData.lang === "ar") var Source = "حصري"
                                    }

                                    break
                                }else var Source = res.data.items[i].type.name.toUpperCase()
                            }

                        }else var Source = res.data.items[i].type.name.toUpperCase()

                        if(res.data.items[i].name !== "") var name = res.data.items[i].name
                        else{
                            if(userData.lang === "en") var name = 'NAME NOT FOUND'
                            else if(userData.lang === "ar") var name = 'لا يوجد اسم'
                        }
                        if(res.data.items[i].images.icon === null) var image = 'https://imgur.com/HVH5sqV.png'
                        else var image = res.data.items[i].images.icon
                        if(res.data.items[i].series !== null) var rarity = res.data.items[i].series.id
                        else var rarity = res.data.items[i].rarity.id
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

                        // Initializing tags
                        var wTags = (1024 / 512) * 15
                        var hTags = (1024 / 512) * 15
                        var yTags = 7 + y
                        var xTags = ((1024 - wTags) - 7) + x

                        for(let t = 0; t < res.data.items[i].gameplayTags.length; t++){

                            // If the item is animated
                            if(res.data.items[i].gameplayTags[t].includes('Animated')){

                                // Add the animated icon
                                const Animated = await Canvas.loadImage('./assets/Tags/T-Icon-Animated-64.png')
                                ctx.drawImage(Animated, xTags, yTags, wTags, hTags)

                                yTags += hTags + 10
                            }

                            // If the item is reactive
                            if(res.data.items[i].gameplayTags[t].includes('Reactive')){

                                // Add the reactive icon
                                const Reactive = await Canvas.loadImage('./assets/Tags/T-Icon-Adaptive-64.png')
                                ctx.drawImage(Reactive, xTags, yTags, wTags, hTags)

                                yTags += hTags + 10
                                
                            }

                            // If the item is synced emote
                            if(res.data.items[i].gameplayTags[t].includes('Synced')){

                                // Add the Synced icon
                                const Synced = await Canvas.loadImage('./assets/Tags/T-Icon-Synced-64x.png')
                                ctx.drawImage(Synced, xTags, yTags, wTags, hTags)

                                yTags += hTags + 10
                                
                            }

                            // If the item is traversal
                            if(res.data.items[i].gameplayTags[t].includes('Traversal')){

                                // Add the Traversal icon
                                const Traversal = await Canvas.loadImage('./assets/Tags/T-Icon-Traversal-64.png')
                                ctx.drawImage(Traversal, xTags, yTags, wTags, hTags)

                                yTags += hTags + 10
                            }

                            // If the item has styles
                            if(res.data.items[i].gameplayTags[t].includes('HasVariants') || res.data.items[i].gameplayTags[t].includes('HasUpgradeQuests')){

                                // Add the HasVariants icon
                                const HasVariants = await Canvas.loadImage('./assets/Tags/T-Icon-Variant-64.png')
                                ctx.drawImage(HasVariants, xTags, yTags, wTags, hTags)

                                yTags += hTags + 10
                            }
                        }

                        // If the item contains copyrited audio
                        if(res.data.items[i].copyrightedAudio){

                            // Add the copyrightedAudio icon
                            const copyrightedAudio = await Canvas.loadImage('./assets/Tags/mute.png')
                            ctx.drawImage(copyrightedAudio, xTags, yTags, wTags, hTags)

                            yTags += hTags + 10
                        }

                        // If the item contains built in emote
                        if(res.data.items[i].builtInEmote != null){

                            // Add the builtInEmote icon
                            const builtInEmote = await Canvas.loadImage(res.data.items[i].builtInEmote.images.icon)
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

                    // Create set embed
                    const setEmbed = new Discord.EmbedBuilder()
                    setEmbed.setColor(FNBRMENA.Colors(rarity))

                    // Loop through every item
                    var string = ""
                    for(let i = 0; i < res.data.items.length; i++){
                        string += `\n• ${1 + i}: ${res.data.items[i].name}`
                    }

                    // If user userData.lang is english
                    if(userData.lang === "en"){
                        string += `\n\n• All Cosmetic ${res.data.items.length}`
                        setEmbed.setTitle(`All cosmetics in set ${res.data.items[0].set.name}`)
                        
                    }else if(userData.lang === "ar"){
                        string += `\n\n• المجموع ${res.data.items.length} عناصر`
                        setEmbed.setTitle(`جميع العناصر في مجموعة ${res.data.items[0].set.name}`)
                        
                    }

                    // Set description
                    setEmbed.setDescription(string)
                    
                    // Send the image
                    var att = new Discord.AttachmentBuilder(canvas.toBuffer(), {name: `${res.data.items[0].set.id}.png`})
                    msg.edit({embeds: [setEmbed], components: [], files: [att]})
                    .catch(err => {

                        // Try sending it on jpg file format [LOWER QUALITY]
                        var att = new Discord.AttachmentBuilder(canvas.toBuffer('image/jpeg'), {name: `${res.data.items[0].set.id}.jpg`})
                        msg.edit({embeds: [setEmbed], components: [], files: [att]})
                        .catch(err => {
                            FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, msg)
                        })
                    })
                

                }catch(err) {
                    FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, msg)
                }
            }
        
        }).catch((err) => {
            FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, null)
        })
    }
}
