const Canvas = require('canvas');

module.exports = {
    commands: 'crew',
    type: 'Fortnite',
    minArgs: 0,
    maxArgs: 0,
    cooldown: 10,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (FNBRMENA, message, args, text, Discord, client, admin, userData, alias, emojisObject) => {

        //create the crew image
        const drawCrewPack = async (res, num) => {

            //if the num index is a valid index
            if(res.data.history[num] !== undefined){

                //send the generating message
                const generating = new Discord.EmbedBuilder()
                generating.setColor(FNBRMENA.Colors("embed"))
                if(userData.lang === "en") generating.setTitle(`Loading the crew information ${emojisObject.loadingEmoji}`)
                else if(userData.lang === "ar") generating.setTitle(`جاري تحميل بيانات طاقم فورت نايت ${emojisObject.loadingEmoji}`)
                message.reply({embeds: [generating]})
                .then( async msg => {

                    //creating length
                    var length = res.data.history[num].rewards.length

                    //variables
                    var width = 0
                    var height = 1024
                    var newline = 0
                    var x = 0
                    var y = 0

                    if(length <= 2) length = length
                    else if(length > 2 && length <= 4) length = length / 2
                    else if(length > 4 && length <= 9) length = length / 3
                    else if(length > 7 && length <= 50) length = length / 5
                    else if(length > 50 && length < 70) length = length / 7
                    else length = length / 10

                    if(length % 2 !== 0 && length != 1){
                        length += 1;
                        length = length | 0
                    }

                    //creating width
                    width += (length * 1024) + (length * 10) - 10

                    //creating height
                    for(let i = 0; i < res.data.history[num].rewards.length; i++){
                        
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
                    };

                    //creating canvas
                    const canvas = Canvas.createCanvas(width, height);
                    const ctx = canvas.getContext('2d');

                    //background
                    const background = await Canvas.loadImage('./assets/backgroundwhite.jpg')
                    ctx.drawImage(background, 0, 0, canvas.width, canvas.height)

                    //res.data.historyet newline
                    newline = 0

                    //items
                    for(let i = 0; i < res.data.history[num].rewards.length; i++){
                        ctx.fillStyle = '#ffffff';

                        //skin informations
                        if(res.data.history[num].rewards[i].item.introduction != null){
                            var chapter = res.data.history[num].rewards[i].item.introduction.chapter.substring(res.data.history[num].rewards[i].item.introduction.chapter.indexOf(" "), res.data.history[num].rewards[i].item.introduction.chapter.length).trim()
                            var season = res.data.history[num].rewards[i].item.introduction.season.substring(res.data.history[num].rewards[i].item.introduction.season.indexOf(" "), res.data.history[num].rewards[i].item.introduction.season.length).trim()

                            if(userData.lang === "en") var seasonChapter = `C${chapter}S${season}`
                            else if(userData.lang == "ar")var seasonChapter = `الفصل ${chapter} الموسم ${season}`

                        }else{

                            if(userData.lang === "en") var seasonChapter = `${res.data.history[num].rewards[i].item.added.version}v`
                            else if(userData.lang == "ar")var seasonChapter = `تحديث ${res.data.history[num].rewards[i].item.added.version}`
                            
                        }
                        var name = res.data.history[num].rewards[i].item.name;
                        var image = res.data.history[num].rewards[i].item.images.icon
                        if(res.data.history[num].rewards[i].item.series === null) var rarity = res.data.history[num].rewards[i].item.rarity.id
                        else var rarity = res.data.history[num].rewards[i].item.series.id
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
                            ctx.font = applyText(canvas, "CREW", 900, 40)
                            ctx.fillText("CREW", (1024 - 5) + x, (1024 - 7.5) + y)

                        }else if(userData.lang === "ar"){
                            ctx.fillText(name, 512 + x, (1024 - 60) + y)

                            //add season chapter text
                            ctx.textAlign = "left"
                            ctx.font = applyText(canvas, seasonChapter, 900, 40)
                            ctx.fillText(seasonChapter, 5 + x, (1024 - 12.5) + y)

                            //add the item source
                            ctx.textAlign = "right"
                            ctx.font = applyText(canvas, "طاقم فورت نايت", 900, 40)
                            ctx.fillText("طاقم فورت نايت", (1024 - 5) + x, (1024 - 12.5) + y)

                        }

                        //inilizing tags
                        var wTags = (1024 / 512) * 15
                        var hTags = (1024 / 512) * 15
                        var yTags = 7 + y
                        var xTags = ((1024 - wTags) - 7) + x

                        for(let t = 0; t < res.data.history[num].rewards[i].item.gameplayTags.length; t++){

                            //if the item is animated
                            if(res.data.history[num].rewards[i].item.gameplayTags[t].includes('Animated')){

                                //add the animated icon
                                const Animated = await Canvas.loadImage('./assets/Tags/T-Icon-Animated-64.png')
                                ctx.drawImage(Animated, xTags, yTags, wTags, hTags)

                                yTags += hTags + 10
                            }

                            //if the item is reactive
                            if(res.data.history[num].rewards[i].item.gameplayTags[t].includes('Reactive')){

                                //add the reactive icon
                                const Reactive = await Canvas.loadImage('./assets/Tags/T-Icon-Adaptive-64.png')
                                ctx.drawImage(Reactive, xTags, yTags, wTags, hTags)

                                yTags += hTags + 10
                                
                            }

                            //if the item is synced emote
                            if(res.data.history[num].rewards[i].item.gameplayTags[t].includes('Synced')){

                                //add the Synced icon
                                const Synced = await Canvas.loadImage('./assets/Tags/T-Icon-Synced-64x.png')
                                ctx.drawImage(Synced, xTags, yTags, wTags, hTags)

                                yTags += hTags + 10
                                
                            }

                            //if the item is traversal
                            if(res.data.history[num].rewards[i].item.gameplayTags[t].includes('Traversal')){

                                //add the Traversal icon
                                const Traversal = await Canvas.loadImage('./assets/Tags/T-Icon-Traversal-64.png')
                                ctx.drawImage(Traversal, xTags, yTags, wTags, hTags)

                                yTags += hTags + 10
                            }

                            //if the item has styles
                            if(res.data.history[num].rewards[i].item.gameplayTags[t].includes('HasVariants') || res.data.history[num].rewards[i].item.gameplayTags[t].includes('HasUpgradeQuests')){

                                //add the HasVariants icon
                                const HasVariants = await Canvas.loadImage('./assets/Tags/T-Icon-Variant-64.png')
                                ctx.drawImage(HasVariants, xTags, yTags, wTags, hTags)

                                yTags += hTags + 10
                            }
                        }

                        //if the item contains copyrited audio
                        if(res.data.history[num].rewards[i].item.copyrightedAudio){

                            //add the copyrightedAudio icon
                            const copyrightedAudio = await Canvas.loadImage('./assets/Tags/mute.png')
                            ctx.drawImage(copyrightedAudio, xTags, yTags, wTags, hTags)

                            yTags += hTags + 10
                        }

                        //if the item contains built in emote
                        if(res.data.history[num].rewards[i].item.builtInEmote != null){

                            //add the builtInEmote icon
                            const builtInEmote = await Canvas.loadImage(res.data.history[num].rewards[i].item.builtInEmote.images.icon)
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

                    const year = res.data.history[num].date.substring(0, 4)
                    const month = res.data.history[num].date.substring(5, 7)

                    //the crew data has been found lets cread an embed
                    const crewData = new Discord.EmbedBuilder()
                    crewData.setColor(res.data.history[num].colors.A)

                    if(userData.lang === "en") crewData.setTitle(`The Fortnite Crew for month ${month} of ${year}`)
                    else if(userData.lang === "ar") crewData.setTitle(`حزمة طاقم فورت نايت لشهر ${month} سنه ${year}`)
                    crewData.setImage(res.data.history[num].images.apiRender)

                    //creating a row
                    const row = new Discord.ActionRowBuilder()

                    //check if there is a video link
                    if(res.data.history[num].video != null){

                        //creating button
                        if(userData.lang === "en") row.addComponents(
                            new Discord.ButtonBuilder()
                            .setStyle(Discord.ButtonStyle.Link)
                            .setLabel("Crew Pack Trailer")
                            .setURL(res.data.history[num].video)
                        )

                        //creating button
                        else if(userData.lang === "ar") row.addComponents(
                            new Discord.ButtonBuilder()
                            .setStyle(Discord.ButtonStyle.Link)
                            .setLabel("عرض طاقم فورت نايت")
                            .setURL(res.data.history[num].video)
                        )

                        //send embed
                        const att = new Discord.AttachmentBuilder(canvas.toBuffer(), `${res.data.history[num].date}.png`)
                        await message.reply({embeds: [crewData], files: [att], components: [row]})
                        msg.delete()

                    }else{

                        //send embed
                        const att = new Discord.AttachmentBuilder(canvas.toBuffer(), `${res.data.history[num].date}.png`)
                        await message.reply({embeds: [crewData], files: [att]})
                        msg.delete()
                    }
                    
                }).catch(async err => {
                    FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject)
                })
            }
        }

        //request crew data
        await FNBRMENA.Crew("list", userData.lang)
        .then(async res => {

            //create an embed
            const yearCrewPickerEmbed = new Discord.EmbedBuilder()
            yearCrewPickerEmbed.setColor(FNBRMENA.Colors("embed"))
            if(userData.lang === "en"){
                yearCrewPickerEmbed.setAuthor({name: `Fortnite Crew`, iconURL: 'https://i.imgur.com/7Sp9z5H.png'})
                yearCrewPickerEmbed.setDescription('Please click on the Drop-Down menu and select a crew year.\n`You have only 30 seconds until this operation ends, Make it quick`!')
            }else if(userData.lang === "ar"){
                yearCrewPickerEmbed.setAuthor({name: `طاقم فورت نايت`, iconURL: 'https://i.imgur.com/7Sp9z5H.png'})
                yearCrewPickerEmbed.setDescription('الرجاء الضغط على السهم لاختيار سنه الطاقم.\n`لديك فقط 30 ثانية حتى تنتهي العملية, استعجل`!')
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
            
            if(userData.lang === "ar") buttonDataRow.addComponents(
                new Discord.ButtonBuilder()
                .setCustomId('Cancel')
                .setStyle(Discord.ButtonStyle.Danger)
                .setLabel("اغلاق")
            )

            //create a row for drop down menu for categories
            const yearCrewPickerRow = new Discord.ActionRowBuilder()

            //loop throw every patch
            var yearsAvalaible = [], stored = []
            for(const obj of res.data.history){

                if(!stored.includes(obj.date.substring(0, 4))){
                    stored.push(obj.date.substring(0, 4))

                    yearsAvalaible.push({
                        label: `${obj.date.substring(0, 4)}`,
                        value: `${obj.date.substring(0, 4)}`,
                    })
                }
            }

            const yearCrewPickerDropMenu = new Discord.SelectMenuBuilder()
            yearCrewPickerDropMenu.setCustomId('crewYear')
            if(userData.lang === "en") yearCrewPickerDropMenu.setPlaceholder('Select a year!')
            else if(userData.lang === "ar") yearCrewPickerDropMenu.setPlaceholder('اختر سنة!')
            yearCrewPickerDropMenu.addOptions(yearsAvalaible)

            //add the drop menu to the categoryDropMenu
            yearCrewPickerRow.addComponents(yearCrewPickerDropMenu)

            //send the message
            const dropMenuMessage = await message.reply({embeds: [yearCrewPickerEmbed], components: [yearCrewPickerRow, buttonDataRow]})

            //filtering the user clicker
            const filter = i => i.user.id === message.author.id

            //await for the user
            await message.channel.awaitMessageComponent({filter, time: 30000})
            .then(async collected => {
                collected.deferUpdate();

                //if cancel button has been clicked
                if(collected.customId === "Cancel") dropMenuMessage.delete()

                //if a year has been selected
                if(collected.customId === "crewYear"){

                    //create an embed
                    const crewPickerEmbed = new Discord.EmbedBuilder()
                    crewPickerEmbed.setColor(FNBRMENA.Colors("embed"))
                    if(userData.lang === "en"){
                        crewPickerEmbed.setAuthor({name: `Fortnite Crew`, iconURL: 'https://i.imgur.com/7Sp9z5H.png'})
                        crewPickerEmbed.setDescription('Now please click the drop-down menu and select a crew pack.\n`You have only 30 seconds until this operation ends, Make it quick`!')
                    }else if(userData.lang === "ar"){
                        crewPickerEmbed.setAuthor({name: `طاقم فورت نايت`, iconURL: 'https://i.imgur.com/7Sp9z5H.png'})
                        crewPickerEmbed.setDescription('الان الرجاء الضغط على السهم لاختيار حزمة الطاقم فورت نايت.\n`لديك فقط 30 ثانية حتى تنتهي العملية, استعجل`!')
                    }

                    //create a row for drop down menu for categories
                    const crewPickerRow = new Discord.ActionRowBuilder()

                    //loop throw every patch
                    var crewsInAYear = []
                    for(let i = 0; i < res.data.history.length; i++){

                        if(collected.values[0] === res.data.history[i].date.substring(0, 4)) crewsInAYear.push({
                            label: `${res.data.history[i].rewards[0].item.name}`,
                            value: `${i}`,
                        })
                    }

                    const crewPickerDropMenu = new Discord.SelectMenuBuilder()
                    crewPickerDropMenu.setCustomId('crewPack')
                    if(userData.lang === "en") crewPickerDropMenu.setPlaceholder('Select a crew pack!')
                    else if(userData.lang === "ar") crewPickerDropMenu.setPlaceholder('اختر حزمة طاقم فورت نايت!')
                    crewPickerDropMenu.addOptions(crewsInAYear)

                    //add the drop menu to the categoryDropMenu
                    crewPickerRow.addComponents(crewPickerDropMenu)

                    //send the message
                    await dropMenuMessage.edit({embeds: [crewPickerEmbed], components: [crewPickerRow, buttonDataRow]})

                    //filtering the user clicker
                    const filter = i => i.user.id === message.author.id

                    //await for the user
                    await message.channel.awaitMessageComponent({filter, time: 30000})
                    .then(async collected => {

                        //if cancel button has been clicked
                        if(collected.customId === "Cancel") dropMenuMessage.delete()

                        //if a user selected a crew pack
                        if(collected.customId === "crewPack"){
                            await dropMenuMessage.delete()
                            drawCrewPack(res, collected.values[0])
                        }
                    }).catch(async err => {
                        FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject)
                    })
                }
            
            }).catch(async err => {
                FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject)
            })

        }).catch(async err => {
            FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject)
        })
    }
}