const Discord = require('discord.js')
const Canvas = require('canvas')
const key = require('../Configs/config.json')

module.exports = (FNBRMENA, client, admin, emojisObject) => {
    const message = client.channels.cache.find(channel => channel.id === key.events.PAK)

    // Results
    var result = []
    const Set = async () => {

        // Getting the sets data
        admin.database().ref("ERA's").child("Events").child("set").once('value', async function (data) {
            const status = data.val().Active
            const lang = data.val().Lang
            const push = data.val().Push
            const role = data.val().Role

            // Checking if the event is active
            if(status){

                // Request all sets
                FNBRMENA.listSets(options = {lang: "en"})
                .then(async res => {

                    // Store the first data
                    if(result.length === 0) for(const i of res.data.sets) result.push(i)

                    // If push is enabled
                    if(push.Status){

                        // Trun off push if enabled
                        admin.database().ref("ERA's").child("Events").child("set").child("Push").update({
                            Status: false
                        })
                        
                        // Apply push request
                        for(let i = 0; i < result.length; i++){

                            if(result[i].id.toLowerCase() == push.setNameOrId.toLowerCase()){
                                result.splice(i, 1)
                                break
                            }
                            
                            if(result[i].name.toLowerCase() == push.setNameOrId.toLowerCase()){
                                result.splice(i, 1)
                                break
                            }
                        }
                    }

                    // Delete outdated sets if there are any
                    for(const i of result) if(!res.data.sets.some(e => e.id == i.id && e.name == i.name)) result.splice(result.indexOf(i), 1)

                    // Find any new sets
                    for(const i of res.data.sets){

                        // Check whether onject i is included in results or not
                        if(!result.some(e => e.id == i.id && e.name == i.name)){

                            // Request a specific set
                            await FNBRMENA.Set(lang, i.name)
                            .then(async set => {

                                // Variables
                                var width = 0
                                var height = 1024
                                var newline = 0
                                var x = 0
                                var y = 0

                                // Creating length
                                var length = set.data.items.length
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
                                if(set.data.items.length === 1) width = 1024
                                else width += (length * 1024) + (length * 10) - 10

                                // Creating height
                                for(let i = 0; i < set.data.items.length; i++){
                                    
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
                                        if(lang === "en") ctx.font = `${fontSize -= 1}px Burbank Big Condensed`;
                                        else if(lang === "ar") ctx.font = `${fontSize -= 1}px Arabic`;
                                    } while (ctx.measureText(text).width > width);
                                    return ctx.font;
                                };

                                // Creating canvas
                                const canvas = Canvas.createCanvas(width, height)
                                const ctx = canvas.getContext('2d')

                                // Background
                                const background = await Canvas.loadImage('./assets/backgroundwhite.jpg')
                                ctx.drawImage(background, 0, 0, canvas.width, canvas.height)

                                // Reseting newline
                                newline = 0

                                for(let i = 0; i < set.data.items.length; i++){
                                    ctx.fillStyle = '#ffffff'

                                    // Skin informations
                                    if(set.data.items[i].introduction != null){
                                        var chapter = set.data.items[i].introduction.chapter.substring(set.data.items[i].introduction.chapter.indexOf(" "), set.data.items[i].introduction.chapter.length).trim()

                                        if(lang === "en"){
                                            var season = set.data.items[i].introduction.season.substring(set.data.items[i].introduction.season.indexOf(" "), set.data.items[i].introduction.season.length).trim()
                                            if(lang === "en") var seasonChapter = `C${chapter}S${season}`

                                        }else if(lang == "ar"){
                                            if(set.data.items[i].introduction.season.includes("X")) var seasonChapter = `الفصل ${chapter} الموسم X`
                                            else{
                                                var season = set.data.items[i].introduction.season.substring(set.data.items[i].introduction.season.indexOf(" "), set.data.items[i].introduction.season.length).trim()
                                                var seasonChapter = `الفصل ${chapter} الموسم ${season}`
                                            }
                                        }

                                    }else{

                                        if(lang === "en") var seasonChapter = `${set.data.items[i].added.version}v`
                                        else if(lang == "ar") var seasonChapter = `تحديث ${set.data.items[i].added.version}`
                                        
                                    }

                                    if(set.data.items[i].gameplayTags.length != 0){
                                        for(let j = 0; j < set.data.items[i].gameplayTags.length; j++){
                                            if(set.data.items[i].gameplayTags[j].includes('Source')){

                                                if(set.data.items[i].gameplayTags[j].toLowerCase().includes("itemshop")){

                                                    if(lang === "en") var Source = "ITEMSHOP"
                                                    else if(lang === "ar") var Source = "متجر العناصر"
                                                }else if(set.data.items[i].gameplayTags[j].toLowerCase().includes("seasonshop")){

                                                    if(lang === "en") var Source = "SEASON SHOP"
                                                    else if(lang === "ar") var Source = "متجر الموسم"
                                                }else if(set.data.items[i].gameplayTags[j].toLowerCase().includes("battlepass")){

                                                    if(lang === "en") var Source = "BATTLEPASS"
                                                    else if(lang === "ar") var Source = "بطاقة المعركة"
                                                }else if(set.data.items[i].gameplayTags[j].toLowerCase().includes("firstwin")){

                                                    if(lang === "en") var Source = "FIRST WIN"
                                                    else if(lang === "ar") var Source = "اول انتصار"
                                                }else if(set.data.items[i].gameplayTags[j].toLowerCase().includes("event")){

                                                    if(lang === "en") var Source = "EVENT"
                                                    else if(lang === "ar") var Source = "حدث"
                                                }else if(set.data.items[i].gameplayTags[j].toLowerCase().includes("platform") || (set.data.items[i].gameplayTags[j].toLowerCase().includes("promo"))){

                                                    if(lang === "en") var Source = "EXCLUSIVE"
                                                    else if(lang === "ar") var Source = "حصري"
                                                }else if(set.data.items[i].gameplayTags[j].toLowerCase().includes("starterpack")){

                                                    if(userData.lang === "en") var Source = "Starter Pack"
                                                    else if(userData.lang === "ar") var Source = "حزمة المبتدئين"
                                                }

                                                break
                                            }else var Source = set.data.items[i].type.name.toUpperCase()
                                        }

                                    }else var Source = set.data.items[i].type.name.toUpperCase()

                                    if(set.data.items[i].name !== "") var name = set.data.items[i].name
                                    else{
                                        if(lang === "en") var name = 'NAME NOT FOUND'
                                        else if(lang === "ar") var name = 'لا يوجد اسم'
                                    }
                                    if(set.data.items[i].images.icon === null) var image = 'https://firebasestorage.googleapis.com/v0/b/fnbrmena-bot.appspot.com/o/code_images%2FHVH5sqV.png?alt=media&token=41c26ee2-c98e-492d-a84c-299a69ac6012'
                                    else var image = set.data.items[i].images.icon
                                    if(set.data.items[i].series !== null) var rarity = set.data.items[i].series.id
                                    else var rarity = set.data.items[i].rarity.id
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
                                    ctx.textAlign = 'center'
                                    ctx.font = applyText(canvas, name, 900, 72)

                                    if(lang === "en"){
                                        ctx.fillText(name, 512 + x, (1024 - 30) + y)

                                        // Add the item season chapter text
                                        ctx.textAlign = "left"
                                        ctx.font = applyText(canvas, seasonChapter, 900, 40)
                                        ctx.fillText(seasonChapter, 5 + x, (1024 - 7.5) + y)

                                        // Add the item source
                                        ctx.textAlign = "right"
                                        ctx.font = applyText(canvas, Source, 900, 40)
                                        ctx.fillText(Source, (1024 - 5) + x, (1024 - 7.5) + y)

                                    }else if(lang === "ar"){
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

                                    for(let t = 0; t < set.data.items[i].gameplayTags.length; t++){

                                        // If the item is animated
                                        if(set.data.items[i].gameplayTags[t].includes('Animated')){

                                            // Add the animated icon
                                            const Animated = await Canvas.loadImage('./assets/Tags/T-Icon-Animated-64.png')
                                            ctx.drawImage(Animated, xTags, yTags, wTags, hTags)

                                            yTags += hTags + 10
                                        }

                                        // If the item is reactive
                                        if(set.data.items[i].gameplayTags[t].includes('Reactive')){

                                            // Add the reactive icon
                                            const Reactive = await Canvas.loadImage('./assets/Tags/T-Icon-Adaptive-64.png')
                                            ctx.drawImage(Reactive, xTags, yTags, wTags, hTags)

                                            yTags += hTags + 10
                                            
                                        }

                                        // If the item is synced emote
                                        if(set.data.items[i].gameplayTags[t].includes('Synced')){

                                            // Add the Synced icon
                                            const Synced = await Canvas.loadImage('./assets/Tags/T-Icon-Synced-64x.png')
                                            ctx.drawImage(Synced, xTags, yTags, wTags, hTags)

                                            yTags += hTags + 10
                                            
                                        }

                                        // If the item is traversal
                                        if(set.data.items[i].gameplayTags[t].includes('Traversal')){

                                            // Add the Traversal icon
                                            const Traversal = await Canvas.loadImage('./assets/Tags/T-Icon-Traversal-64.png')
                                            ctx.drawImage(Traversal, xTags, yTags, wTags, hTags)

                                            yTags += hTags + 10
                                        }

                                        // If the item has styles
                                        if(set.data.items[i].gameplayTags[t].includes('HasVariants') || set.data.items[i].gameplayTags[t].includes('HasUpgradeQuests')){

                                            // Add the HasVariants icon
                                            const HasVariants = await Canvas.loadImage('./assets/Tags/T-Icon-Variant-64.png')
                                            ctx.drawImage(HasVariants, xTags, yTags, wTags, hTags)

                                            yTags += hTags + 10
                                        }
                                    }

                                    // If the item contains copyrited audio
                                    if(set.data.items[i].copyrightedAudio){

                                        // Add the copyrightedAudio icon
                                        const copyrightedAudio = await Canvas.loadImage('./assets/Tags/mute.png')
                                        ctx.drawImage(copyrightedAudio, xTags, yTags, wTags, hTags)

                                        yTags += hTags + 10
                                    }

                                    // If the item contains built in emote
                                    if(set.data.items[i].builtInEmote != null){

                                        // Add the builtInEmote icon
                                        const builtInEmote = await Canvas.loadImage(set.data.items[i].builtInEmote.images.icon)
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
                                for(let i = 0; i < set.data.items.length; i++){
                                    string += `\n• ${1 + i}: ${set.data.items[i].name}`
                                }

                                // If user lang is english
                                if(lang === "en"){
                                    string += `\n\n• All Cosmetic ${set.data.items.length}`
                                    setEmbed.setTitle(`All cosmetics in set ${set.data.items[0].set.name}`)
                                    
                                }else if(lang === "ar"){
                                    string += `\n\n• المجموع ${set.data.items.length} عناصر`
                                    setEmbed.setTitle(`جميع العناصر في مجموعة ${set.data.items[0].set.name}`)
                                    
                                }

                                // Set description
                                setEmbed.setDescription(string)

                                // Send the image
                                var att = new Discord.AttachmentBuilder(canvas.toBuffer(), {name: `${i.id}.png`})
                                if(role.Status) await message.send({content: `<@&${role.roleID}>`, embeds: [setEmbed], files: [att]})
                                else await message.send({embeds: [setEmbed], files: [att]})
                                result.push(i)

                            })
                        }
                    }

                    
                }).catch(async err => {
                    FNBRMENA.eventsLogs(admin, client, err, 'sets')
        
                })
            }
        })
    }
    setInterval(Set, 2 * 60000)
}