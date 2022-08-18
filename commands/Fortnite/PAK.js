const Canvas = require('canvas');

module.exports = {
    commands: 'pak',
    type: 'Fortnite',
    descriptionEN: 'Use this command to extract all the cosmetics in a single pak file',
    descriptionAR: 'أستخدم الأمر لأستخراج جميع العناصر المشفرة في ملف معين',
    expectedArgsEN: 'Use this command then type pak file number.',
    expectedArgsAR: 'أستعمل الأمر ثم اكتب رقم الملف.',
    argsExample: ['1002', '1013'],
    minArgs: 0,
    maxArgs: 1,
    cooldown: 10,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (FNBRMENA, message, args, text, Discord, client, admin, userData, alias, emojisObject) => {

        //pak viewer
        const pak = async (res, pak) => {

            //variables
            var x = 0
            var y = 0
            var width = 0
            var height = 1024
            var newline = 0

            //generating animation
            const generating = new Discord.EmbedBuilder()
            generating.setColor(FNBRMENA.Colors("embed"))
            if(userData.lang === "en") generating.setTitle(`Loading a total ${res.data.data.length} cosmetics please wait... ${emojisObject.loadingEmoji}`)
            else if(userData.lang === "ar") generating.setTitle(`تحميل جميع العناصر بمجموع ${res.data.data.length} عنصر الرجاء الانتظار... ${emojisObject.loadingEmoji}`)
            message.reply({embeds: [generating]})
            .then( async msg => {

                //creating length
                var length = res.data.data.length
                
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
                for(let i = 0; i < res.data.data.length; i++){
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
                for(let i = 0; i < res.data.data.length; i++){
                    ctx.fillStyle = '#ffffff';

                    //skin informations
                    if(res.data.data[i].introduction != null){
                        if(userData.lang === "en") var seasonChapter = `C${res.data.data[i].introduction.chapter}S${res.data.data[i].introduction.season}`
                        else if(userData.lang == "ar")var seasonChapter = `الفصل ${res.data.data[i].introduction.chapter} الموسم ${res.data.data[i].introduction.season}`

                    }else{
                        if(userData.lang === "en") var seasonChapter = `${res.data.data.build.substring(19, 24)}v`
                        else if(userData.lang == "ar")var seasonChapter = `تحديث ${res.data.data.build.substring(19, 24)}`
                        
                    }

                    if(res.data.data[i].gameplayTags.length != 0){
                        for(let j = 0; j < res.data.data[i].gameplayTags.length; j++){
                            if(res.data.data[i].gameplayTags[j].includes('Source')){

                                if(res.data.data[i].gameplayTags[j].toLowerCase().includes("itemshop")){

                                    if(userData.lang === "en") var Source = "ITEMSHOP"
                                    else if(userData.lang === "ar") var Source = "متجر العناصر"
                                }else if(res.data.data[i].gameplayTags[j].toLowerCase().includes("battlepass")){

                                    if(userData.lang === "en") var Source = "BATTLEPASS"
                                    else if(userData.lang === "ar") var Source = "بطاقة المعركة"
                                }else if(res.data.data[i].gameplayTags[j].toLowerCase().includes("event")){

                                    if(userData.lang === "en") var Source = "EVENT"
                                    else if(userData.lang === "ar") var Source = "حدث"
                                }else if(res.data.data[i].gameplayTags[j].toLowerCase().includes("platform") || (res.data.data[i].gameplayTags[j].toLowerCase().includes("promo"))){

                                    if(userData.lang === "en") var Source = "EXCLUSIVE"
                                    else if(userData.lang === "ar") var Source = "حصري"
                                }

                                break
                            }else var Source = res.data.data[i].type.displayValue.toUpperCase()
                        }
                    }else var Source = res.data.data[i].type.displayValue.toUpperCase()

                    var name = res.data.data[i].name
                    if(res.data.data[i].images.icon === null) var image = res.data.data[i].images.smallIcon
                    else var image = res.data.data[i].images.icon
                    var rarity = res.data.data[i].rarity.value
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

                    for(let t = 0; t < res.data.data[i].gameplayTags.length; t++){

                        //if the item is animated
                        if(res.data.data[i].gameplayTags[t].includes('Animated')){

                            //add the animated icon
                            const Animated = await Canvas.loadImage('./assets/Tags/T-Icon-Animated-64.png')
                            ctx.drawImage(Animated, xTags, yTags, wTags, hTags)

                            yTags += hTags + 10
                        }

                        //if the item is reactive
                        if(res.data.data[i].gameplayTags[t].includes('Reactive')){

                            //add the reactive icon
                            const Reactive = await Canvas.loadImage('./assets/Tags/T-Icon-Adaptive-64.png')
                            ctx.drawImage(Reactive, xTags, yTags, wTags, hTags)

                            yTags += hTags + 10
                            
                        }

                        //if the item is synced emote
                        if(res.data.data[i].gameplayTags[t].includes('Synced')){

                            //add the Synced icon
                            const Synced = await Canvas.loadImage('./assets/Tags/T-Icon-Synced-64x.png')
                            ctx.drawImage(Synced, xTags, yTags, wTags, hTags)

                            yTags += hTags + 10
                            
                        }

                        //if the item is traversal
                        if(res.data.data[i].gameplayTags[t].includes('Traversal')){

                            //add the Traversal icon
                            const Traversal = await Canvas.loadImage('./assets/Tags/T-Icon-Traversal-64.png')
                            ctx.drawImage(Traversal, xTags, yTags, wTags, hTags)

                            yTags += hTags + 10
                        }

                        //if the item has styles
                        if(res.data.data[i].gameplayTags[t].includes('HasVariants') || res.data.data[i].gameplayTags[t].includes('HasUpgradeQuests')){

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
                    
                //create info embed
                const info = new Discord.EmbedBuilder()
                info.setColor(FNBRMENA.Colors(rarity))

                //adding string
                var string = ``
                if(userData.lang === "en"){

                    //set the title
                    info.setTitle(`All cosmetic names in pak ${pak}`)

                    //loop throw every item found
                    for(let i = 0; i < res.data.data.length; i++){
                        var num = 1 + i
                        string += `\n• ${num}: ${res.data.data[i].name}`
                    }

                    //add the total string
                    string += `\n\n• ${res.data.data.length} Cosmetic(s) in total`

                    //add the introduction
                    string += `\n• ${res.data.data[0].introduction.text}`

                    //add the set if avalabile
                    if(res.data.data[0].set !== null){
                        string += `\n• ${res.data.data[0].set.text}`
                    }

                }else if(userData.lang === "ar"){

                    //set the title
                    info.setTitle(`جميع العناصر في باك ${pak}`)

                    //loop throw every item found
                    for(let i = 0; i < res.data.data.length; i++){
                        var num = 1 + i
                        string += `\n• ${num}: ${res.data.data[i].name}`
                    }

                    //add the total string
                    string += `\n\n• المجموع ${res.data.data.length} عناصر`

                    //add the introduction
                    string += `\n• ${res.data.data[0].introduction.text}`

                    //add the set if avalabile
                    if(res.data.data[0].set !== null){
                        string += `\n• ${res.data.data[0].set.text}`
                    }
                }

                //set description
                info.setDescription(string)

                //send the image to discord channel
                const att = new Discord.AttachmentBuilder(canvas.toBuffer(), `${pak}.png`)
                await message.reply({embeds: [info], files: [att]})
                msg.delete()

            }).catch(err => {
                FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject)
                
            })
        }

        //if args == 0
        if(args.length === 0){

            //requesting data
            FNBRMENA.PAK(userData.lang, "hasDynamicPakId=true")
            .then(async res => {

                //create an embed
                const paksEmbed = new Discord.EmbedBuilder()
                paksEmbed.setColor(FNBRMENA.Colors("embed"))
                if(userData.lang === "en"){
                    paksEmbed.setAuthor({name: `List Pak File`, iconURL: 'https://icon-library.com/images/file-icon-image/file-icon-image-5.jpg'})
                    paksEmbed.setDescription('Please click on the Drop-Down menu and choose a file pak.\n`You have only 30 seconds until this operation ends, Make it quick`!')
                }else if(userData.lang === "ar"){
                    paksEmbed.setAuthor({name: `سرد جميع الملفات`, iconURL: 'https://icon-library.com/images/file-icon-image/file-icon-image-5.jpg'})
                    paksEmbed.setDescription('الرجاء الضغط على السهم لاختيار ملف.\n`لديك فقط 30 ثانية حتى تنتهي العملية, استعجل`!')
                }

                //create a row for cancel button
                const buttonDataRow = new Discord.ActionRowBuilder()
                
                //add EN cancel button
                if(userData.lang === "en") buttonDataRow.addComponents(
                    new Discord.ButtonBuilder()
                    .setCustomId('Cancel')
                    .setStyle(Discord.ButtonStyle.Danger)
                    .setLabel("Cancel")
                )
                

                else if(userData.lang === "ar") buttonDataRow.addComponents(
                    new Discord.ButtonBuilder()
                    .setCustomId('Cancel')
                    .setStyle(Discord.ButtonStyle.Danger)
                    .setLabel("اغلاق")
                )

                //create a row for drop down menu for categories
                const allAvaliablePaksRow = new Discord.ActionRowBuilder()

                //loop through all the cosmetics
                const avalabilePaks = [], foundPaks = []
                for(const item of res.data.data){
                    if(!foundPaks.includes(item.dynamicPakId)){
                        foundPaks.push(item.dynamicPakId)
                        avalabilePaks.push({
                            label: `${item.dynamicPakId}`,
                            value: `${item.dynamicPakId}`,
                        })
                    }
                }

                const allAvaliablePaksDropMenu = new Discord.SelectMenuBuilder()
                allAvaliablePaksDropMenu.setCustomId('Paks')
                if(userData.lang === "en") allAvaliablePaksDropMenu.setPlaceholder('Select a pak file!')
                else if(userData.lang === "ar") allAvaliablePaksDropMenu.setPlaceholder('الرجاء الأختيار!')
                allAvaliablePaksDropMenu.addOptions(avalabilePaks)

                //add the drop menu to the categoryDropMenu
                allAvaliablePaksRow.addComponents(allAvaliablePaksDropMenu)

                //send the message
                const dropMenuMessage = await message.reply({embeds: [paksEmbed], components: [allAvaliablePaksRow, buttonDataRow]})

                //filtering the user clicker
                const filter = i => i.user.id === message.author.id

                //await for the user
                await message.channel.awaitMessageComponent({filter, time: 30000})
                .then(async collected => {
                    collected.deferUpdate();

                    //if canecl button has been clicked
                    if(collected.customId === "Cancel") dropMenuMessage.delete()

                    //if the user chose a type
                    if(collected.customId === "Paks"){
                        dropMenuMessage.delete()
                        pak(await FNBRMENA.PAK(userData.lang, `dynamicPakId=${collected.values[0]}`), collected.values[0])
                    }

                }).catch(err => {
                    FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject)
                    
                })
                
            }).catch(err => {
                FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject)
                
            })

        }else{
            await FNBRMENA.PAK(userData.lang, `dynamicPakId=${text}`)
            .then(async res => {
                pak(res, text) //user has specified a pak file

            }).catch(async err => {

                //when no pak has been found
                if(err.response.data.status === 404){
                    const noPakHasBeenFoundError = new Discord.EmbedBuilder()
                    noPakHasBeenFoundError.setColor(FNBRMENA.Colors("embedError"))
                    if(userData.lang === "en") noPakHasBeenFoundError.setTitle(`No pak file has been found! ${emojisObject.errorEmoji}`)
                    else if(userData.lang === "ar") noPakHasBeenFoundError.setTitle(`لم يتم العثور على ملف! ${emojisObject.errorEmoji}`)
                    await message.reply({embeds: [noPakHasBeenFoundError]})

                }else FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject) //other errors
                
            })
        }
    }
}