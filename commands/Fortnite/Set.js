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
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (FNBRMENA, message, args, text, Discord, client, admin, userData, alias, emojisObject) => {
        
        //request a specific set
        FNBRMENA.Set(userData.lang, text)
        .then(async res => {

            //generating text
            const generating = new Discord.EmbedBuilder()
            generating.setColor(FNBRMENA.Colors("embed"))
            if(userData.lang === "en") generating.setTitle(`Searching for Cosmetics... ${emojisObject.loadingEmoji}`)
            else if(userData.lang === "ar") generating.setTitle(`جاري البحث عن عناصر... ${emojisObject.loadingEmoji}`)
            message.reply({embeds: [generating]})
            .then(async msg => {

                //variables
                var width = 0
                var height = 1024
                var newline = 0
                var x = 0
                var y = 0

                //creating length
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

                //creating width
                if(res.data.items.length === 1) width = 1024
                else width += (length * 1024) + (length * 10) - 10

                //creating height
                for(let i = 0; i < res.data.items.length; i++){
                    
                    if(newline === length){
                        height += 1024 + 10
                        newline = 0
                    }
                    newline++
                }

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

                //creating canvas
                const canvas = Canvas.createCanvas(width, height);
                const ctx = canvas.getContext('2d');

                //background
                const background = await Canvas.loadImage('./assets/backgroundwhite.jpg')
                ctx.drawImage(background, 0, 0, canvas.width, canvas.height)

                //reseting newline
                newline = 0

                for(let i = 0; i < res.data.items.length; i++){
                    ctx.fillStyle = '#ffffff';

                    //skin informations
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

                    for(let t = 0; t < res.data.items[i].gameplayTags.length; t++){

                        //if the item is animated
                        if(res.data.items[i].gameplayTags[t].includes('Animated')){

                            //add the animated icon
                            const Animated = await Canvas.loadImage('./assets/Tags/T-Icon-Animated-64.png')
                            ctx.drawImage(Animated, xTags, yTags, wTags, hTags)

                            yTags += hTags + 10
                        }

                        //if the item is reactive
                        if(res.data.items[i].gameplayTags[t].includes('Reactive')){

                            //add the reactive icon
                            const Reactive = await Canvas.loadImage('./assets/Tags/T-Icon-Adaptive-64.png')
                            ctx.drawImage(Reactive, xTags, yTags, wTags, hTags)

                            yTags += hTags + 10
                            
                        }

                        //if the item is synced emote
                        if(res.data.items[i].gameplayTags[t].includes('Synced')){

                            //add the Synced icon
                            const Synced = await Canvas.loadImage('./assets/Tags/T-Icon-Synced-64x.png')
                            ctx.drawImage(Synced, xTags, yTags, wTags, hTags)

                            yTags += hTags + 10
                            
                        }

                        //if the item is traversal
                        if(res.data.items[i].gameplayTags[t].includes('Traversal')){

                            //add the Traversal icon
                            const Traversal = await Canvas.loadImage('./assets/Tags/T-Icon-Traversal-64.png')
                            ctx.drawImage(Traversal, xTags, yTags, wTags, hTags)

                            yTags += hTags + 10
                        }

                        //if the item has styles
                        if(res.data.items[i].gameplayTags[t].includes('HasVariants') || res.data.items[i].gameplayTags[t].includes('HasUpgradeQuests')){

                            //add the HasVariants icon
                            const HasVariants = await Canvas.loadImage('./assets/Tags/T-Icon-Variant-64.png')
                            ctx.drawImage(HasVariants, xTags, yTags, wTags, hTags)

                            yTags += hTags + 10
                        }
                    }

                    //if the item contains copyrited audio
                    if(res.data.items[i].copyrightedAudio){

                        //add the copyrightedAudio icon
                        const copyrightedAudio = await Canvas.loadImage('./assets/Tags/mute.png')
                        ctx.drawImage(copyrightedAudio, xTags, yTags, wTags, hTags)

                        yTags += hTags + 10
                    }

                    //if the item contains built in emote
                    if(res.data.items[i].builtInEmote != null){

                        //add the builtInEmote icon
                        const builtInEmote = await Canvas.loadImage(res.data.items[i].builtInEmote.images.icon)
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

                //create set embed
                const setEmbed = new Discord.EmbedBuilder()
                setEmbed.setColor(FNBRMENA.Colors(rarity))

                //loop throw every item
                var string = ""
                for(let i = 0; i < res.data.items.length; i++){
                    string += `\n• ${1 + i}: ${res.data.items[i].name}`
                }

                //if user userData.lang is english
                if(userData.lang === "en"){
                    string += `\n\n• All Cosmetic ${res.data.items.length}`
                    setEmbed.setTitle(`All cosmetics in set ${res.data.items[0].set.name}`)
                    
                }else if(userData.lang === "ar"){
                    string += `\n\n• المجموع ${res.data.items.length} عناصر`
                    setEmbed.setTitle(`جميع العناصر في مجموعة ${res.data.items[0].set.name}`)
                    
                }

                //set description
                setEmbed.setDescription(string)
                try{
                    var att = new Discord.AttachmentBuilder(canvas.toBuffer(), {name: `${res.data.items[0].set.id}.png`})
                    await message.reply({embeds: [setEmbed],files: [att]})
                    msg.delete()

                }catch{
                    var att = new Discord.AttachmentBuilder(canvas.toBuffer('image/jpeg'), {name: `${res.data.items[0].set.id}.jpg`})
                    await message.reply({embeds: [setEmbed],files: [att]})
                    msg.delete()

                }
            

            }).catch((err) => {
                FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject)
    
            })
        
        }).catch((err) => {

            //if there is no set found
            if(err.response.data.status === 404){

                //no emote has been found
                const noSetHasBeenFoundError = new Discord.EmbedBuilder()
                noSetHasBeenFoundError.setColor(FNBRMENA.Colors("embedError"))
                if(userData.lang === "en") noSetHasBeenFoundError.setTitle(`Sorry, No cosmetics has been found ${emojisObject.errorEmoji}`)
                else if(userData.lang === "ar") noSetHasBeenFoundError.setTitle(`عذرا لم يتم العثور على عناصر ${emojisObject.errorEmoji}`)
                message.reply({embeds: [noSetHasBeenFoundError]})

            }else FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject)

        })
    }
}
