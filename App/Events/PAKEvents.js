const config = require('../Configs/config.json')
const Discord = require('discord.js')
const Canvas = require('canvas')

module.exports = (FNBRMENA, client, admin, emojisObject) => {
    const message = client.channels.cache.find(channel => channel.id === config.events.PAK)

    // Results
    var result = []
    const PAK = async () => {

        // Getting the pak data
        admin.database().ref("ERA's").child("Events").child("pak").once('value', async function (data) {
            const status = data.val().Active
            const lang = data.val().Lang
            const push = data.val().Push
            const role = data.val().Role

            // Checking if the event is active
            if(status){
                
                // Request all dynamic paks
                FNBRMENA.Search(lang, "custom", "&apiTags=dynamic.utoc*")
                .then(async res => {

                    // Store the first data
                    if(result.length == 0) for(const i of res.data.items){

                        if(!result.find(e => e.pakNumber === i.apiTags.find(e => e.includes("dynamic.utoc.")).match(/\d+/g)[0]))
                            result.push({
                                pakNumber: i.apiTags.find(e => e.includes("dynamic.utoc.")).match(/\d+/g)[0],
                                ids: [i.id]
                            })
                        
                        else result[result.findIndex(e => e.pakNumber === i.apiTags.find(e => e.includes("dynamic.utoc.")).match(/\d+/g)[0])].ids.push(i.id)
                    }

                    // If push is enabled
                    if(push.Status){

                        // Trun off push if enabled
                        admin.database().ref("ERA's").child("Events").child("pak").child("Push").update({
                            Status: false
                        })
                        
                        // Apply push request
                        result.filter((e, i) => {
                            if(e.pakNumber == push.pakNumber) result.splice(i, 1)
                        })
                    }

                    // Getting data to compare results with
                    var compare = []
                    for(const i of res.data.items){

                        if(!compare.find(e => e.pakNumber === i.apiTags.find(e => e.includes("dynamic.utoc.")).match(/\d+/g)[0]))
                        compare.push({
                                pakNumber: i.apiTags.find(e => e.includes("dynamic.utoc.")).match(/\d+/g)[0],
                                ids: [i.id]
                            })
                        
                        else compare[compare.findIndex(e => e.pakNumber === i.apiTags.find(e => e.includes("dynamic.utoc.")).match(/\d+/g)[0])].ids.push(i.id)
                    }

                    // Delete outdated paks if there are any
                    for(const i of result) if(!compare.some(e => e.pakNumber == i.pakNumber && JSON.stringify(e.ids) == JSON.stringify(i.ids))) result.splice(result.indexOf(i), 1)

                    // Find any new paks
                    for(const i of compare){

                        if(!result.some(e => e.pakNumber == i.pakNumber && JSON.stringify(e.ids) == JSON.stringify(i.ids))){
                            result.push(i)
                            
                            // Find the items to create an image
                            const items = res.data.items.filter(e => i.ids.includes(e.id))
                            
                            // Variables
                            var x = 0
                            var y = 0
                            var width = 0
                            var height = 1024
                            var newline = 0

                            // Creating length
                            var length = items.length
                            
                            if(length <= 2) length = length
                            else if(length > 2 && length <= 4) length = length / 2
                            else if(length > 4 && length <= 9) length = length / 3
                            else if(length > 7 && length <= 50) length = length / 5
                            else if(length > 50 && length < 70) length = length / 7
                            else length = length / 10

                            if (length % 2 !== 0){
                                length += 1;
                                length = length | 0;
                            }

                            // Creating width
                            if(items.length === 1) width = 1024
                            else width = (length * 1024) + (length * 10) - 10

                            // Creating height
                            for(let i = 0; i < items.length; i++){
                                if(newline === length){
                                    height += 1024 + 10
                                    newline = 0
                                }
                                newline++
                            }

                            // Registering fonts
                            Canvas.registerFont('./assets/font/Lalezar-Regular.ttf', {
                                family: 'Arabic',
                                style: "bold"
                            });
                            Canvas.registerFont('./assets/font/BurbankBigCondensed-Black.ttf' ,{
                                family: 'Burbank Big Condensed',
                                style: "bold"
                            })

                            // AplyText
                            const applyText = (canvas, text, width, font) => {
                                const ctx = canvas.getContext('2d');
                                let fontSize = font;
                                do {
                                    if(lang === "en") ctx.font = `${fontSize -= 1}px Burbank Big Condensed`;
                                    else if(lang === "ar") ctx.font = `${fontSize -= 1}px Arabic`;
                                } while (ctx.measureText(text).width > width);
                                return ctx.font;
                            }

                            // Creating canvas
                            const canvas = Canvas.createCanvas(width, height);
                            const ctx = canvas.getContext('2d');
                            
                            // Creating the background
                            const background = await Canvas.loadImage('./assets/backgroundwhite.jpg')
                            ctx.drawImage(background, 0, 0, canvas.width, canvas.height)

                            // Reseting newline
                            newline = 0

                            // Loop through every item
                            for(const item of items){
                                ctx.fillStyle = '#ffffff';

                                // Skin informations
                                if(item.introduction != null){
                                    var chapter = item.introduction.chapter.substring(item.introduction.chapter.indexOf(" "), item.introduction.chapter.length).trim()
                
                                        if(lang === "en"){
                                            var season = item.introduction.season.substring(item.introduction.season.indexOf(" "), item.introduction.season.length).trim()
                                            if(lang === "en") var seasonChapter = `C${chapter}S${season}`
                
                                        }else if(lang == "ar"){
                                            if(item.introduction.season.includes("X")) var seasonChapter = `الفصل ${chapter} الموسم X`
                                            else{
                                                var season = item.introduction.season.substring(item.introduction.season.indexOf(" "), item.introduction.season.length).trim()
                                                var seasonChapter = `الفصل ${chapter} الموسم ${season}`
                                            }
                                        }
                
                                }else{
                                    if(lang === "en") var seasonChapter = `${item.added.version}v`
                                    else if(lang == "ar")var seasonChapter = `تحديث ${item.added.version}`
                                    
                                }

                                if(item.gameplayTags.length != 0){
                                    for(let j = 0; j < item.gameplayTags.length; j++){
                                        if(item.gameplayTags[j].includes('Source')){
                
                                            if(item.gameplayTags[j].toLowerCase().includes("itemshop")){
                
                                                if(lang === "en") var Source = "ITEMSHOP"
                                                else if(lang === "ar") var Source = "متجر العناصر"
                                            }else if(item.gameplayTags[j].toLowerCase().includes("seasonshop")){
                
                                                if(lang === "en") var Source = "SEASON SHOP"
                                                else if(lang === "ar") var Source = "متجر الموسم"
                                            }else if(item.gameplayTags[j].toLowerCase().includes("battlepass")){
                
                                                if(lang === "en") var Source = "BATTLEPASS"
                                                else if(lang === "ar") var Source = "بطاقة المعركة"
                                            }else if(item.gameplayTags[j].toLowerCase().includes("firstwin")){
                
                                                if(lang === "en") var Source = "FIRST WIN"
                                                else if(lang === "ar") var Source = "اول انتصار"
                                            }else if(item.gameplayTags[j].toLowerCase().includes("event")){
                
                                                if(lang === "en") var Source = "EVENT"
                                                else if(lang === "ar") var Source = "حدث"
                                            }else if(item.gameplayTags[j].toLowerCase().includes("platform") || (item.gameplayTags[j].toLowerCase().includes("promo"))){
                
                                                if(lang === "en") var Source = "EXCLUSIVE"
                                                else if(lang === "ar") var Source = "حصري"
                                            }else if(item.gameplayTags[j].toLowerCase().includes("starterpack")){

                                                if(userData.lang === "en") var Source = "Starter Pack"
                                                else if(userData.lang === "ar") var Source = "حزمة المبتدئين"
                                            }
                
                                            break
                                        }else var Source = item.type.name.toUpperCase()
                                    }
                
                                }else var Source = item.type.name.toUpperCase()

                                var name = item.name
                                if(item.images.icon === null) var image = 'https://i.ibb.co/XCDwKHh/HVH5sqV.png'
                                else var image = item.images.icon
                                if(item.series === null) var rarity = item.rarity.id
                                else var rarity = item.series.id
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

                                // Inilizing tags
                                var wTags = (1024 / 512) * 15
                                var hTags = (1024 / 512) * 15
                                var yTags = 7 + y
                                var xTags = ((1024 - wTags) - 7) + x

                                for(let t = 0; t < item.gameplayTags.length; t++){

                                    // If the item is animated
                                    if(item.gameplayTags[t].includes('Animated')){
                
                                        // Add the animated icon
                                        const Animated = await Canvas.loadImage('./assets/Tags/T-Icon-Animated-64.png')
                                        ctx.drawImage(Animated, xTags, yTags, wTags, hTags)
                
                                        yTags += hTags + 10
                                    }
                
                                    // If the item is reactive
                                    if(item.gameplayTags[t].includes('Reactive')){
                
                                        // Add the reactive icon
                                        const Reactive = await Canvas.loadImage('./assets/Tags/T-Icon-Adaptive-64.png')
                                        ctx.drawImage(Reactive, xTags, yTags, wTags, hTags)
                
                                        yTags += hTags + 10
                                        
                                    }
                
                                    // If the item is synced emote
                                    if(item.gameplayTags[t].includes('Synced')){
                
                                        // Add the Synced icon
                                        const Synced = await Canvas.loadImage('./assets/Tags/T-Icon-Synced-64x.png')
                                        ctx.drawImage(Synced, xTags, yTags, wTags, hTags)
                
                                        yTags += hTags + 10
                                        
                                    }
                
                                    // If the item is traversal
                                    if(item.gameplayTags[t].includes('Traversal')){
                
                                        // Add the Traversal icon
                                        const Traversal = await Canvas.loadImage('./assets/Tags/T-Icon-Traversal-64.png')
                                        ctx.drawImage(Traversal, xTags, yTags, wTags, hTags)
                
                                        yTags += hTags + 10
                                    }
                
                                    // If the item has styles
                                    if(item.gameplayTags[t].includes('HasVariants') || item.gameplayTags[t].includes('HasUpgradeQuests')){
                
                                        // Add the HasVariants icon
                                        const HasVariants = await Canvas.loadImage('./assets/Tags/T-Icon-Variant-64.png')
                                        ctx.drawImage(HasVariants, xTags, yTags, wTags, hTags)
                
                                        yTags += hTags + 10
                                    }
                                }
                
                                // If the item contains copyrited audio
                                if(item.copyrightedAudio){
                
                                    // Add the copyrightedAudio icon
                                    const copyrightedAudio = await Canvas.loadImage('./assets/Tags/mute.png')
                                    ctx.drawImage(copyrightedAudio, xTags, yTags, wTags, hTags)
                
                                    yTags += hTags + 10
                                }
                
                                // If the item contains built in emote
                                if(item.builtInEmote != null){
                
                                    // Add the builtInEmote icon
                                    const builtInEmote = await Canvas.loadImage(item.builtInEmote.images.icon)
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

                            // Create info embed
                            const newDynamicPakFileEmbed = new Discord.EmbedBuilder()
                            newDynamicPakFileEmbed.setColor(FNBRMENA.Colors(items[0].rarity.id))

                            // Adding string
                            var string = ``
                            if(lang === "en"){

                                // Set the title
                                newDynamicPakFileEmbed.setTitle(`ALL COSMETICS IN PAK ${i.pakNumber}`)

                                // Loop through every item found
                                for(let i = 0; i < items.length; i++) string += `\n• ${1 + i}: ${items[i].name}`

                                // Add the total string
                                string += `\n\n• ${items.length} Cosmetic(s) in total`

                                // Add the introduction
                                string += `\n• ${items[0].introduction.text}`

                                // Add the set if avalabile
                                if(items[0].set !== null){
                                    string += `\n• ${items[0].set.partOf}`
                                }

                            }else if(lang === "ar"){

                                // Set the title
                                newDynamicPakFileEmbed.setTitle(`جميع العناصر في باك ${i.pakNumber}`)

                                // Loop through every item found
                                for(let i = 0; i < items.length; i++) string += `\n• ${1 + i}: ${items[i].name}`

                                // Add the total string
                                string += `\n\n• المجموع ${items.length} عناصر`

                                // Add the introduction
                                string += `\n• ${items[0].introduction.text}`

                                // Add the set if avalabile
                                if(items[0].set !== null){
                                    string += `\n• ${items[0].set.partOf}`
                                }
                            }

                            // Set description
                            newDynamicPakFileEmbed.setDescription(string)

                            // Send message
                            var att = new Discord.AttachmentBuilder(canvas.toBuffer(), {name: `${i.pakNumber}.png`})
                            if(role.Status) await message.send({content: `<@&${role.roleID}>`, embeds: [newDynamicPakFileEmbed], files: [att]})
                            else await message.send({embeds: [newDynamicPakFileEmbed], files: [att]})
                       }
                   }
                }).catch(async err => {
                    FNBRMENA.eventsLogs(admin, client, err, 'pak')
        
                })
            }
        })
    }
    setInterval(PAK, 1 * 35000)
}