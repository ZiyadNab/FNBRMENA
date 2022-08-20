const Canvas = require('canvas');

module.exports = {
    commands: 'new',
    type: 'Fortnite',
    minArgs: 0,
    maxArgs: 0,
    cooldown: 8,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (FNBRMENA, message, args, text, Discord, client, admin, userData, alias, emojisObject) => {

        //create image
        const cosmeticsImage = async (items, build) => {

            //variables
            var x = 0
            var y = 0
            var width = 0
            var height = 1024
            var newline = 0

            //generating animation
            const generating = new Discord.EmbedBuilder()
            generating.setColor(FNBRMENA.Colors("embed"))
            if(userData.lang === "en") generating.setTitle(`Loading a total ${items.length} cosmetics please wait... ${emojisObject.loadingEmoji}`)
            else if(userData.lang === "ar") generating.setTitle(`تحميل جميع العناصر بمجموع ${items.length} عنصر الرجاء الانتظار... ${emojisObject.loadingEmoji}`)
            message.reply({embeds: [generating]})
            .then( async msg => {

                //creating length
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

                //creating width
                width = (length * 1024) + (length * 10) - 10

                //creating height
                for(let i = 0; i < items.length; i++){
                    if(newline === length){
                        height += 1024 + 10
                        newline = 0
                    }
                    newline++
                }

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
                const canvas = Canvas.createCanvas(width, height);
                const ctx = canvas.getContext('2d');
                
                //creating the background
                const background = await Canvas.loadImage('./assets/backgroundwhite.jpg')
                ctx.drawImage(background, 0, 0, canvas.width, canvas.height)

                //reseting newline
                newline = 0

                //loop throw every item
                for(const item of items){
                    ctx.fillStyle = '#ffffff';

                    //skin informations
                    if(item.introduction != null){
                        if(userData.lang === "en") var seasonChapter = `C${item.introduction.chapter}S${item.introduction.season}`
                        else if(userData.lang == "ar")var seasonChapter = `الفصل ${item.introduction.chapter} الموسم ${item.introduction.season}`

                    }else{
                        if(userData.lang === "en") var seasonChapter = `${build.substring(19, 24)}v`
                        else if(userData.lang == "ar")var seasonChapter = `تحديث ${build.substring(19, 24)}`
                        
                    }

                    if(item.gameplayTags){
                        if(item.gameplayTags.length !== 0){
                            for(const gameplayTag of item.gameplayTags){
                                if(gameplayTag.includes('Source')){
    
                                    if(gameplayTag.toLowerCase().includes("itemshop")){
    
                                        if(userData.lang === "en") var Source = "ITEMSHOP"
                                        else if(userData.lang === "ar") var Source = "متجر العناصر"
                                    }else if(gameplayTag.toLowerCase().includes("battlepass")){
    
                                        if(userData.lang === "en") var Source = "BATTLEPASS"
                                        else if(userData.lang === "ar") var Source = "بطاقة المعركة"
                                    }else if(gameplayTag.toLowerCase().includes("event")){
    
                                        if(userData.lang === "en") var Source = "EVENT"
                                        else if(userData.lang === "ar") var Source = "حدث"
                                    }else if(gameplayTag.toLowerCase().includes("platform") || (gameplayTag.toLowerCase().includes("promo"))){
    
                                        if(userData.lang === "en") var Source = "EXCLUSIVE"
                                        else if(userData.lang === "ar") var Source = "حصري"
                                    }
    
                                    break
                                }else var Source = item.type.displayValue.toUpperCase()
                            }
                        }else var Source = item.type.displayValue.toUpperCase()
                    }else var Source = item.type.displayValue.toUpperCase()

                    var name = item.name
                    if(item.images.icon === null) var image = item.images.smallIcon
                    else var image = item.images.icon
                    var rarity = item.rarity.value
                    newline = newline + 1;

                    //searching...
                    if(rarity === "legendary"){

                        //creating image
                        const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/legendary.png')
                        ctx.drawImage(skinholder, x, y, 1024, 1024)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, x, y, 1024, 1024)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderLegendary.png')
                        ctx.drawImage(skinborder, x, y, 1024, 1024)

                    }else if(rarity === "epic"){

                        //creating image
                        const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/epic.png')
                        ctx.drawImage(skinholder, x, y, 1024, 1024)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, x, y, 1024, 1024)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderEpic.png')
                        ctx.drawImage(skinborder, x, y, 1024, 1024)

                    }else if(rarity === "rare"){

                        //creating image
                        const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/rare.png')
                        ctx.drawImage(skinholder, x, y, 1024, 1024)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, x, y, 1024, 1024)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderRare.png')
                        ctx.drawImage(skinborder, x, y, 1024, 1024)

                    }else if(rarity === "uncommon"){

                        //creating image
                        const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/uncommon.png')
                        ctx.drawImage(skinholder, x, y, 1024, 1024)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, x, y, 1024, 1024)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderUncommon.png')
                        ctx.drawImage(skinborder, x, y, 1024, 1024)

                    }else if(rarity === "common"){

                        //creating image
                        const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/common.png')
                        ctx.drawImage(skinholder, x, y, 1024, 1024)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, x, y, 1024, 1024)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderCommon.png')
                        ctx.drawImage(skinborder, x, y, 1024, 1024)

                    }else if(rarity === "marvel"){
                        
                        //creating image
                        const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/marvel.png')
                        ctx.drawImage(skinholder, x, y, 1024, 1024)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, x, y, 1024, 1024)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderMarvel.png')
                        ctx.drawImage(skinborder, x, y, 1024, 1024)

                    }else if(rarity === "dc"){

                        //creating image
                        const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/dc.png')
                        ctx.drawImage(skinholder, x, y, 1024, 1024)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, x, y, 1024, 1024)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderDc.png')
                        ctx.drawImage(skinborder, x, y, 1024, 1024)

                    }else if(rarity === "dark"){

                        //creating image
                        const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/dark.png')
                        ctx.drawImage(skinholder, x, y, 1024, 1024)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, x, y, 1024, 1024)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderDark.png')
                        ctx.drawImage(skinborder, x, y, 1024, 1024)

                    }else if(rarity === "icon"){

                        //creating image
                        const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/icon.png')
                        ctx.drawImage(skinholder, x, y, 1024, 1024)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, x, y, 1024, 1024)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderIcon.png')
                        ctx.drawImage(skinborder, x, y, 1024, 1024)

                    }else if(rarity === "starwars"){

                        //creating image
                        const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/starwars.png')
                        ctx.drawImage(skinholder, x, y, 1024, 1024)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, x, y, 1024, 1024)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderStarwars.png')
                        ctx.drawImage(skinborder, x, y, 1024, 1024)

                    }else if(rarity === "shadow"){

                        //creating image
                        const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/shadow.png')
                        ctx.drawImage(skinholder, x, y, 1024, 1024)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, x, y, 1024, 1024)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderShadow.png')
                        ctx.drawImage(skinborder, x, y, 1024, 1024)

                    }else if(rarity === "slurp"){

                        //creating image
                        const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/slurp.png')
                        ctx.drawImage(skinholder, x, y, 1024, 1024)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, x, y, 1024, 1024)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderSlurp.png')
                        ctx.drawImage(skinborder, x, y, 1024, 1024)

                    }else if(rarity === "frozen"){

                        //creating image
                        const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/frozen.png')
                        ctx.drawImage(skinholder, x, y, 1024, 1024)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, x, y, 1024, 1024)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderFrozen.png')
                        ctx.drawImage(skinborder, x, y, 1024, 1024)

                    }else if(rarity === "lava"){

                        //creating image
                        const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/lava.png')
                        ctx.drawImage(skinholder, x, y, 1024, 1024)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, x, y, 1024, 1024)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderLava.png')
                        ctx.drawImage(skinborder, x, y, 1024, 1024)

                    }else if(rarity === "gaminglegends"){

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
                        ctx.fillText(name, 1024 + x, (1024 - 60) + y)

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

                    if(item.gameplayTags) for(const gameplayTag of item.gameplayTags){

                        //if the item is animated
                        if(gameplayTag.includes('Animated')){

                            //add the animated icon
                            const Animated = await Canvas.loadImage('./assets/Tags/T-Icon-Animated-64.png')
                            ctx.drawImage(Animated, xTags, yTags, wTags, hTags)

                            yTags += hTags + 10
                        }

                        //if the item is reactive
                        if(gameplayTag.includes('Reactive')){

                            //add the reactive icon
                            const Reactive = await Canvas.loadImage('./assets/Tags/T-Icon-Adaptive-64.png')
                            ctx.drawImage(Reactive, xTags, yTags, wTags, hTags)

                            yTags += hTags + 10
                            
                        }

                        //if the item is synced emote
                        if(gameplayTag.includes('Synced')){

                            //add the Synced icon
                            const Synced = await Canvas.loadImage('./assets/Tags/T-Icon-Synced-64x.png')
                            ctx.drawImage(Synced, xTags, yTags, wTags, hTags)

                            yTags += hTags + 10
                            
                        }

                        //if the item is traversal
                        if(gameplayTag.includes('Traversal')){

                            //add the Traversal icon
                            const Traversal = await Canvas.loadImage('./assets/Tags/T-Icon-Traversal-64.png')
                            ctx.drawImage(Traversal, xTags, yTags, wTags, hTags)

                            yTags += hTags + 10
                        }

                        //if the item has styles
                        if(gameplayTag.includes('HasVariants') || gameplayTag.includes('HasUpgradeQuests')){

                            //add the HasVariants icon
                            const HasVariants = await Canvas.loadImage('./assets/Tags/T-Icon-Variant-64.png')
                            ctx.drawImage(HasVariants, xTags, yTags, wTags, hTags)

                            yTags += hTags + 10
                        }
                    }

                    //changing x and y
                    x = x + 10 + 1024; 
                    if(length === newline){
                        y = y + 10 + 1024;
                        x = 0;
                        newline = 0;
                    }
                }

                //send the image to discord channel
                try{
                    var att = new Discord.AttachmentBuilder(canvas.toBuffer(), {name: `${build}.png`})
                    await message.reply({files: [att]})
                    msg.delete()
                    
                }catch{
                    var att = new Discord.AttachmentBuilder(canvas.toBuffer('image/jpeg'), {name: `${build}.jpg`})
                    await message.reply({files: [att]})
                    msg.delete()
                }
                

            }).catch(err => {
                FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject)
                
            })
        }

        //requesting data
        FNBRMENA.CosmeticsNew(userData.lang)
        .then(async res => {

            //create an embed
            const cosmeticsTypesEmbed = new Discord.EmbedBuilder()
            cosmeticsTypesEmbed.setColor(FNBRMENA.Colors("embed"))
            if(userData.lang === "en"){
                cosmeticsTypesEmbed.setTitle(`Cosmetics Type`)
                cosmeticsTypesEmbed.setDescription('Please click on the Drop-Down menu and choose a cosmetic type.\n`You have only 30 seconds until this operation ends, Make it quick`!')
            }else if(userData.lang === "ar"){
                cosmeticsTypesEmbed.setTitle(`نوع العناصر`)
                cosmeticsTypesEmbed.setDescription('الرجاء الضغط على السهم لاختيار نوع العناصر.\n`لديك فقط 30 ثانية حتى تنتهي العملية, استعجل`!')
            }

            //create a row for cancel button
            const buttonDataRow = new Discord.ActionRowBuilder()
            
            //add EN cancel button
            if(userData.lang === "en"){
                buttonDataRow.addComponents(
                    new Discord.ButtonBuilder()
                    .setCustomId('All')
                    .setStyle(Discord.ButtonStyle.Success)
                    .setLabel("All")
                )

                buttonDataRow.addComponents(
                    new Discord.ButtonBuilder()
                    .setCustomId('Cancel')
                    .setStyle(Discord.ButtonStyle.Danger)
                    .setLabel("Cancel")
                )
            }

            else if(userData.lang === "ar"){
                buttonDataRow.addComponents(
                    new Discord.ButtonBuilder()
                    .setCustomId('All')
                    .setStyle(Discord.ButtonStyle.Success)
                    .setLabel("الكل")
                )

                buttonDataRow.addComponents(
                    new Discord.ButtonBuilder()
                    .setCustomId('Cancel')
                    .setStyle(Discord.ButtonStyle.Danger)
                    .setLabel("اغلاق")
                )
            }

            //create a row for drop down menu for categories
            const allAvaliableTypesRow = new Discord.ActionRowBuilder()

            //loop throw every patch
            var types = [], foundTypes = []
            for(const item of res.data.data.items){

                if(!foundTypes.includes(item.type.value)){
                    foundTypes.push(item.type.value)

                   types.push({
                        label: `${item.type.displayValue}`,
                        value: `${item.type.value}`,
                        emoji: `${emojisObject[item.type.value].name}:${emojisObject[item.type.value].id}`
                    })
                }
            }

            //create a drop menu
            const allAvaliableTypesDropMenu = new Discord.SelectMenuBuilder()
            allAvaliableTypesDropMenu.setCustomId('Types')
            if(userData.lang === "en") allAvaliableTypesDropMenu.setPlaceholder('Nothing selected!')
            else if(userData.lang === "ar") allAvaliableTypesDropMenu.setPlaceholder('الرجاء الأختيار!')
            allAvaliableTypesDropMenu.addOptions(types)

            //add the drop menu to the categoryDropMenu
            allAvaliableTypesRow.addComponents(allAvaliableTypesDropMenu)

            //send the message
            const dropMenuMessage = await message.reply({embeds: [cosmeticsTypesEmbed], components: [allAvaliableTypesRow, buttonDataRow]})

            //filtering the user clicker
            const filter = i => i.user.id === message.author.id

            //await for the user
            await message.channel.awaitMessageComponent({filter, time: 30000})
            .then(async collected => {
                collected.deferUpdate();

                //if cancel button has been clicked
                if(collected.customId === "Cancel") dropMenuMessage.delete()

                //if all button is clicked
                if(collected.customId === "All"){
                    dropMenuMessage.delete()
                    cosmeticsImage(res.data.data.items, res.data.data.build)
                }

                //if the user chose a type
                if(collected.customId === "Types"){
                    dropMenuMessage.delete()

                    const items = []
                    res.data.data.items.map(obj => {
                        if(obj.type.value === collected.values[0]) items.push(obj)
                    })

                    cosmeticsImage(items, res.data.data.build)
                }
            
            }).catch(async err => {
                FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject)
            })
            
        }).catch(err => {
            console.log(err)
            FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject)
            
        })
    }
}