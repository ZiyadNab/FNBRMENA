const Canvas = require('canvas')

module.exports = {
    commands: 'battlepass',
    type: 'Fortnite',
    descriptionEN: 'Generates a battlepass iamge of any season.',
    descriptionAR: 'استخراج صورة لطاقة المعركة لأي موسم.',
    minArgs: 0,
    maxArgs: 0,
    cooldown: 40,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (FNBRMENA, message, args, text, Discord, client, admin, userData, alias, emojisObject) => {

        const battlepass = async (season, msg) => {

            // Request data
            FNBRMENA.getBattlepassRewards(userData.lang, season)
            .then(async res => {
                
                // If there a battlepass data found
                if(!res.data.result){

                    // Create error embed
                    const noBattlepassFoundError = new Discord.EmbedBuilder()
                    noBattlepassFoundError.setColor(FNBRMENA.Colors("embedError"))
                    if(userData.lang === "en") noBattlepassFoundError.setTitle(`There is no battlepass with that number ${emojisObject.errorEmoji}.`)
                    else if(userData.lang === "ar") noBattlepassFoundError.setTitle(`لا يوجد باتل باس بهذا الرقم ${emojisObject.errorEmoji}.`)
                    return msg.edit({embeds: [noBattlepassFoundError], components: [], files: []})
                    .catch(err => {
                        FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, null)
                    })
                }

                // generating animation
                var length = res.data.rewards.length;
                const generating = new Discord.EmbedBuilder()
                generating.setColor(FNBRMENA.Colors("embed"))
                if(userData.lang === "en") generating.setTitle(`Loading a total ${length} cosmetics please wait... ${emojisObject.loadingEmoji}`)
                else if(userData.lang === "ar") generating.setTitle(`تحميل جميع العناصر بمجموع ${length} عنصر الرجاء الانتظار... ${emojisObject.loadingEmoji}`)
                msg.edit({embeds: [generating], components: [], files: []})
                .catch(err => {
                    FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, null)
                })

                try {

                    // Variables
                    var width = 62
                    var height = 300
                    var newline = 0
                    var x = 62
                    var y = 120
                    var paid = 0
                    var free = 0

                    // Width
                    width += (10 * 107) + (10 * 37) + 37

                    // Height
                    for(let i = 0; i < length; i++){
                        if(10 === newline){
                            height += 107 + 37
                            newline = 0
                        }
                        newline += 1
                    }

                    // Register fonts
                    Canvas.registerFont('./assets/font/Lalezar-Regular.ttf', {family: 'Arabic',weight: "700",style: "bold"});
                    Canvas.registerFont('./assets/font/BurbankBigCondensed-Black.ttf' ,{family: 'Burbank Big Condensed',weight: "700",style: "bold"})

                    // Canvas
                    const canvas = Canvas.createCanvas(width, height);
                    const ctx = canvas.getContext('2d');

                    // Background
                    ctx.fillStyle = '#47178f'
                    ctx.fillRect(0, 0, canvas.width, canvas.height)

                    // Upper
                    ctx.fillStyle = '#25076b'
                    ctx.fillRect(0, 0, canvas.width, 75)

                    // Fnbrmena
                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign='left';
                    ctx.font = '50px Burbank Big Condensed'
                    ctx.fillText("FNBRMENA", 12, 53)

                    // Season
                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign='right';
                    if(userData.lang === "en") ctx.font = '50px Burbank Big Condensed'
                    else if (userData.lang === "ar") ctx.font = '50px Arabic'
                    ctx.fillText(res.data.displayInfo.chapterSeason, (canvas.width - 12), 53)

                    // Res.dataeting new line
                    newline = 0

                    // Loop through every item
                    for(let i = 0; i < length; i++){

                        // If the item is paid
                        if(res.data.rewards[i].battlepass === 'paid') paid += 1

                        // If the item is free
                        if(res.data.rewards[i].battlepass === 'free') free += 1

                        // Add new line
                        newline += 1

                        // Variables
                        if(res.data.rewards[i].price === null) var tier = res.data.rewards[i].tier
                        else var tier = res.data.rewards[i].price.amount
                        var image = res.data.rewards[i].item.images.icon
                        if(res.data.rewards[i].item.series === null) var rarity = res.data.rewards[i].item.rarity.id
                        else var rarity = res.data.rewards[i].item.series.id

                        // Searching...
                        if(rarity === "Legendary"){
                            const holder = await Canvas.loadImage('./assets/Rarities/newStyle/legendary.png')
                            ctx.drawImage(holder, x, y, 107, 107)
                            const pic = await Canvas.loadImage(image)
                            ctx.drawImage(pic, x, y, 107, 107)
                            const cover = await Canvas.loadImage('./assets/Rarities/battlepass/borderLegendary.png')
                            ctx.drawImage(cover, x, y, 107, 107)
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = '30px Burbank Big Condensed'
                            if(res.data.rewards[i].price === null) ctx.fillText(tier, (x + 53), (y + 137))
                            else {
                                const holder = await Canvas.loadImage('./assets/battlepass/star.png')
                                ctx.drawImage(holder, x + 50, y + 110, 30, 30)
                                ctx.fillText(tier, (x + 36), (y + 136))
                            }
                        }else
                        if(rarity === "Epic"){
                            const holder = await Canvas.loadImage('./assets/Rarities/newStyle/epic.png')
                            ctx.drawImage(holder, x, y, 107, 107)
                            const pic = await Canvas.loadImage(image)
                            ctx.drawImage(pic, x, y, 107, 107)
                            const cover = await Canvas.loadImage('./assets/Rarities/battlepass/borderEpic.png')
                            ctx.drawImage(cover, x, y, 107, 107)
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = '30px Burbank Big Condensed'
                            if(res.data.rewards[i].price === null) ctx.fillText(tier, (x + 53), (y + 137))
                            else {
                                const holder = await Canvas.loadImage('./assets/battlepass/star.png')
                                ctx.drawImage(holder, x + 50, y + 110, 30, 30)
                                ctx.fillText(tier, (x + 36), (y + 136))
                            }
                        }else
                        if(rarity === "Rare"){
                            const holder = await Canvas.loadImage('./assets/Rarities/newStyle/rare.png')
                            ctx.drawImage(holder, x, y, 107, 107)
                            const pic = await Canvas.loadImage(image)
                            ctx.drawImage(pic, x, y, 107, 107)
                            const cover = await Canvas.loadImage('./assets/Rarities/battlepass/borderRare.png')
                            ctx.drawImage(cover, x, y, 107, 107)
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = '30px Burbank Big Condensed'
                            if(res.data.rewards[i].price === null) ctx.fillText(tier, (x + 53), (y + 137))
                            else {
                                const holder = await Canvas.loadImage('./assets/battlepass/star.png')
                                ctx.drawImage(holder, x + 50, y + 110, 30, 30)
                                ctx.fillText(tier, (x + 36), (y + 136))
                            }
                        }else
                        if(rarity === "Uncommon"){
                            const holder = await Canvas.loadImage('./assets/Rarities/newStyle/uncommon.png')
                            ctx.drawImage(holder, x, y, 107, 107)
                            const pic = await Canvas.loadImage(image)
                            ctx.drawImage(pic, x, y, 107, 107)
                            const cover = await Canvas.loadImage('./assets/Rarities/battlepass/borderUncommon.png')
                            ctx.drawImage(cover, x, y, 107, 107)
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = '30px Burbank Big Condensed'
                            if(res.data.rewards[i].price === null) ctx.fillText(tier, (x + 53), (y + 137))
                            else {
                                const holder = await Canvas.loadImage('./assets/battlepass/star.png')
                                ctx.drawImage(holder, x + 50, y + 110, 30, 30)
                                ctx.fillText(tier, (x + 36), (y + 136))
                            }
                        }else
                        if(rarity === "Common"){
                            const holder = await Canvas.loadImage('./assets/Rarities/newStyle/common.png')
                            ctx.drawImage(holder, x, y, 107, 107)
                            const pic = await Canvas.loadImage(image)
                            ctx.drawImage(pic, x, y, 107, 107)
                            const cover = await Canvas.loadImage('./assets/Rarities/battlepass/borderCommon.png')
                            ctx.drawImage(cover, x, y, 107, 107)
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = '30px Burbank Big Condensed'
                            if(res.data.rewards[i].price === null) ctx.fillText(tier, (x + 53), (y + 137))
                            else {
                                const holder = await Canvas.loadImage('./assets/battlepass/star.png')
                                ctx.drawImage(holder, x + 50, y + 110, 30, 30)
                                ctx.fillText(tier, (x + 36), (y + 136))
                            }
                        }else
                        if(rarity === "MarvelSeries"){
                            const holder = await Canvas.loadImage('./assets/Rarities/newStyle/marvel.png')
                            ctx.drawImage(holder, x, y, 107, 107)
                            const pic = await Canvas.loadImage(image)
                            ctx.drawImage(pic, x, y, 107, 107)
                            const cover = await Canvas.loadImage('./assets/Rarities/battlepass/borderMarvel.png')
                            ctx.drawImage(cover, x, y, 107, 107)
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = '30px Burbank Big Condensed'
                            if(res.data.rewards[i].price === null) ctx.fillText(tier, (x + 53), (y + 137))
                            else {
                                const holder = await Canvas.loadImage('./assets/battlepass/star.png')
                                ctx.drawImage(holder, x + 50, y + 110, 30, 30)
                                ctx.fillText(tier, (x + 36), (y + 136))
                            }
                        }else
                        if(rarity === "DCUSeries"){
                            const holder = await Canvas.loadImage('./assets/Rarities/newStyle/dc.png')
                            ctx.drawImage(holder, x, y, 107, 107)
                            const pic = await Canvas.loadImage(image)
                            ctx.drawImage(pic, x, y, 107, 107)
                            const cover = await Canvas.loadImage('./assets/Rarities/battlepass/borderDc.png')
                            ctx.drawImage(cover, x, y, 107, 107)
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = '30px Burbank Big Condensed'
                            if(res.data.rewards[i].price === null) ctx.fillText(tier, (x + 53), (y + 137))
                            else {
                                const holder = await Canvas.loadImage('./assets/battlepass/star.png')
                                ctx.drawImage(holder, x + 50, y + 110, 30, 30)
                                ctx.fillText(tier, (x + 36), (y + 136))
                            }
                        }else
                        if(rarity === "DarkSeries"){
                            const holder = await Canvas.loadImage('./assets/Rarities/newStyle/dark.png')
                            ctx.drawImage(holder, x, y, 107, 107)
                            const pic = await Canvas.loadImage(image)
                            ctx.drawImage(pic, x, y, 107, 107)
                            const cover = await Canvas.loadImage('./assets/Rarities/battlepass/borderDark.png')
                            ctx.drawImage(cover, x, y, 107, 107)
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = '30px Burbank Big Condensed'
                            if(res.data.rewards[i].price === null) ctx.fillText(tier, (x + 53), (y + 137))
                            else {
                                const holder = await Canvas.loadImage('./assets/battlepass/star.png')
                                ctx.drawImage(holder, x + 50, y + 110, 30, 30)
                                ctx.fillText(tier, (x + 36), (y + 136))
                            }
                        }else
                        if(rarity === "CreatorCollabSeries"){
                            const holder = await Canvas.loadImage('./assets/Rarities/newStyle/icon.png')
                            ctx.drawImage(holder, x, y, 107, 107)
                            const pic = await Canvas.loadImage(image)
                            ctx.drawImage(pic, x, y, 107, 107)
                            const cover = await Canvas.loadImage('./assets/Rarities/battlepass/borderIcon.png')
                            ctx.drawImage(cover, x, y, 107, 107)
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = '30px Burbank Big Condensed'
                            if(res.data.rewards[i].price === null) ctx.fillText(tier, (x + 53), (y + 137))
                            else {
                                const holder = await Canvas.loadImage('./assets/battlepass/star.png')
                                ctx.drawImage(holder, x + 50, y + 110, 30, 30)
                                ctx.fillText(tier, (x + 36), (y + 136))
                            }
                        }else
                        if(rarity === "ColumbusSeries"){
                            const holder = await Canvas.loadImage('./assets/Rarities/newStyle/starwars.png')
                            ctx.drawImage(holder, x, y, 107, 107)
                            const pic = await Canvas.loadImage(image)
                            ctx.drawImage(pic, x, y, 107, 107)
                            const cover = await Canvas.loadImage('./assets/Rarities/battlepass/borderStarwars.png')
                            ctx.drawImage(cover, x, y, 107, 107)
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = '30px Burbank Big Condensed'
                            if(res.data.rewards[i].price === null) ctx.fillText(tier, (x + 53), (y + 137))
                            else {
                                const holder = await Canvas.loadImage('./assets/battlepass/star.png')
                                ctx.drawImage(holder, x + 50, y + 110, 30, 30)
                                ctx.fillText(tier, (x + 36), (y + 136))
                            }
                        }else
                        if(rarity === "ShadowSeries"){
                            const holder = await Canvas.loadImage('./assets/Rarities/newStyle/shadow.png')
                            ctx.drawImage(holder, x, y, 107, 107)
                            const pic = await Canvas.loadImage(image)
                            ctx.drawImage(pic, x, y, 107, 107)
                            const cover = await Canvas.loadImage('./assets/Rarities/battlepass/borderShadow.png')
                            ctx.drawImage(cover, x, y, 107, 107)
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = '30px Burbank Big Condensed'
                            if(res.data.rewards[i].price === null) ctx.fillText(tier, (x + 53), (y + 137))
                            else {
                                const holder = await Canvas.loadImage('./assets/battlepass/star.png')
                                ctx.drawImage(holder, x + 50, y + 110, 30, 30)
                                ctx.fillText(tier, (x + 36), (y + 136))
                            }
                        }else
                        if(rarity === "SlurpSeries"){
                            const holder = await Canvas.loadImage('./assets/Rarities/newStyle/slurp.png')
                            ctx.drawImage(holder, x, y, 107, 107)
                            const pic = await Canvas.loadImage(image)
                            ctx.drawImage(pic, x, y, 107, 107)
                            const cover = await Canvas.loadImage('./assets/Rarities/battlepass/borderSlurp.png')
                            ctx.drawImage(cover, x, y, 107, 107)
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = '30px Burbank Big Condensed'
                            if(res.data.rewards[i].price === null) ctx.fillText(tier, (x + 53), (y + 137))
                            else {
                                const holder = await Canvas.loadImage('./assets/battlepass/star.png')
                                ctx.drawImage(holder, x + 50, y + 110, 30, 30)
                                ctx.fillText(tier, (x + 36), (y + 136))
                            }
                        }else
                        if(rarity === "FrozenSeries"){
                            const holder = await Canvas.loadImage('./assets/Rarities/newStyle/frozen.png')
                            ctx.drawImage(holder, x, y, 107, 107)
                            const pic = await Canvas.loadImage(image)
                            ctx.drawImage(pic, x, y, 107, 107)
                            const cover = await Canvas.loadImage('./assets/Rarities/battlepass/borderFrozen.png')
                            ctx.drawImage(cover, x, y, 107, 107)
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = '30px Burbank Big Condensed'
                            if(res.data.rewards[i].price === null) ctx.fillText(tier, (x + 53), (y + 137))
                            else {
                                const holder = await Canvas.loadImage('./assets/battlepass/star.png')
                                ctx.drawImage(holder, x + 50, y + 110, 30, 30)
                                ctx.fillText(tier, (x + 36), (y + 136))
                            }
                        }else
                        if(rarity === "LavaSeries"){
                            const holder = await Canvas.loadImage('./assets/Rarities/newStyle/lava.png')
                            ctx.drawImage(holder, x, y, 107, 107)
                            const pic = await Canvas.loadImage(image)
                            ctx.drawImage(pic, x, y, 107, 107)
                            const cover = await Canvas.loadImage('./assets/Rarities/battlepass/borderLava.png')
                            ctx.drawImage(cover, x, y, 107, 107)
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = '30px Burbank Big Condensed'
                            if(res.data.rewards[i].price === null) ctx.fillText(tier, (x + 53), (y + 137))
                            else {
                                const holder = await Canvas.loadImage('./assets/battlepass/star.png')
                                ctx.drawImage(holder, x + 50, y + 110, 30, 30)
                                ctx.fillText(tier, (x + 36), (y + 136))
                            }
                        }else
                        if(rarity === "PlatformSeries"){
                            const holder = await Canvas.loadImage('./assets/Rarities/newStyle/gaming.png')
                            ctx.drawImage(holder, x, y, 107, 107)
                            const pic = await Canvas.loadImage(image)
                            ctx.drawImage(pic, x, y, 107, 107)
                            const cover = await Canvas.loadImage('./assets/Rarities/battlepass/borderGaming.png')
                            ctx.drawImage(cover, x, y, 107, 107)
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = '30px Burbank Big Condensed'
                            if(res.data.rewards[i].price === null) ctx.fillText(tier, (x + 53), (y + 137))
                            else {
                                const holder = await Canvas.loadImage('./assets/battlepass/star.png')
                                ctx.drawImage(holder, x + 50, y + 110, 30, 30)
                                ctx.fillText(tier, (x + 36), (y + 136))
                            }
                        }else{
                            const holder = await Canvas.loadImage('./assets/Rarities/newStyle/common.png')
                            ctx.drawImage(holder, x, y, 107, 107)
                            const pic = await Canvas.loadImage(image)
                            ctx.drawImage(pic, x, y, 107, 107)
                            const cover = await Canvas.loadImage('./assets/Rarities/battlepass/borderCommon.png')
                            ctx.drawImage(cover, x, y, 107, 107)
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = '30px Burbank Big Condensed'
                            if(res.data.rewards[i].price === null) ctx.fillText(tier, (x + 53), (y + 137))
                            else {
                                const holder = await Canvas.loadImage('./assets/battlepass/star.png')
                                ctx.drawImage(holder, x + 50, y + 110, 30, 30)
                                ctx.fillText(tier, (x + 36), (y + 136))
                            }
                        }

                        //x, y
                        x += 37 + 107
                        if(10 === newline){
                            x = 62
                            y += 107 + 37
                            newline = 0
                        }
                    }

                    // Create info embed
                    const info = new Discord.EmbedBuilder()
                    info.setColor(FNBRMENA.Colors("embed"))
                    info.setTitle(`${res.data.displayInfo.chapterSeason}, ${res.data.displayInfo.battlepassName}`)

                    // Set title and add fields
                    if(userData.lang === "en") info.setDescription(`All Cosmetics: \`${length}\`\nPaid Cosmetics: \`${paid}\`\nFree Cosmetics: \`${free}\``)
                    else if(userData.lang === "ar") info.setDescription(`جميع العناصر: \`${length}\`\nالعناصر المدفوعة: \`${paid}\`\nالعناصر المجانية: \`${free}\``)

                    // Creating a row
                    const row = new Discord.ActionRowBuilder()

                    //get videos
                    for(let i = 0; i < res.data.videos.length; i++){

                        // If the video is a battlepass trailer
                        if(res.data.videos[i].type === "bp"){

                            // Creating button
                            if(userData.lang === "en") row.addComponents(
                                new Discord.ButtonBuilder()
                                .setStyle(Discord.ButtonStyle.Link)
                                .setLabel("Battlepass Trailer")
                                .setURL(res.data.videos[i].url)
                            )

                            // Creating button
                            else if(userData.lang === "ar") row.addComponents(
                                new Discord.ButtonBuilder()
                                .setStyle(Discord.ButtonStyle.Link)
                                .setLabel("عرض الباتل باس")
                                .setURL(res.data.videos[i].url)
                            )

                        }else

                        // If the video is a season story trailer
                        if(res.data.videos[i].type === "trailer"){

                            // Creating button
                            if(userData.lang === "en") row.addComponents(
                                new Discord.ButtonBuilder()
                                .setStyle(Discord.ButtonStyle.Link)
                                .setLabel("Season Trailer")
                                .setURL(res.data.videos[i].url)
                            )

                            // Creating button
                            else if(userData.lang === "ar") row.addComponents(
                                new Discord.ButtonBuilder()
                                .setStyle(Discord.ButtonStyle.Link)
                                .setLabel("عرض السيزون")
                                .setURL(res.data.videos[i].url)
                            )
                        }
                    }

                    // Send the info embed
                    var att = new Discord.AttachmentBuilder(canvas.toBuffer(), {name: `season${res.data.season}.png`})
                    msg.edit({embeds: [info], components: [row], files: [att]})
                    .catch(err => {

                        // Try sending it on jpg file format [LOWER QUALITY]
                        var att = new Discord.AttachmentBuilder(canvas.toBuffer('image/jpeg'), {name: `season${res.data.season}.jpg`})
                        msg.edit({embeds: [info], components: [row], files: [att]})
                        .catch(err => {
                            FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, msg)
                        })
                    })
                    
                }catch(err) {
                    FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, msg)
                    
                }

            }).catch(err => {
                FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, null)
                
            })
        }

        await FNBRMENA.Seasons(userData.lang)
        .then(async res => {

            // Create an embed
            const battlepassChapterEmbed = new Discord.EmbedBuilder()
            battlepassChapterEmbed.setColor(FNBRMENA.Colors("embed"))
            if(userData.lang === "en"){
                battlepassChapterEmbed.setAuthor({name: `Battlepass, Chapter`, iconURL: 'https://imgur.com/90m1ldM.png'})
                battlepassChapterEmbed.setDescription(`Please click on the Drop-Down menu and choose the battlepass's chapter.`)
            }else if(userData.lang === "ar"){
                battlepassChapterEmbed.setAuthor({name: `بطاقة المعركة, الفصل`, iconURL: 'https://imgur.com/90m1ldM.png'})
                battlepassChapterEmbed.setDescription('الرجاء الضغط على السهم لاختيار فصل بطاقة المعركة')
            }

            // Create a row for cancel button
            const buttonDataRow = new Discord.ActionRowBuilder()

            // Add buttons
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
            

            // Loop through seasons
            const allChapters = [], foundChapters = []
            for(const season of res.data.seasons){

                if(!foundChapters.includes(season.chapter)){
                    foundChapters.push(season.chapter)
                    if(userData.lang === "en") allChapters.push(
                        {
                            label: `Chapter ${season.chapter}`,
                            value: `${season.chapter}`,
                            default: false,
                        }
                    )

                    else if(userData.lang === "ar") allChapters.push(
                        {
                            label: `الفصل ${season.chapter}`,
                            value: `${season.chapter}`,
                            default: false,
                        }
                    )
                }
            }

            // Create a row for drop down menu for categories
            const battlepassChapterRow = new Discord.ActionRowBuilder()

            // Create the drop menu
            const battlepassChapterDropMenu = new Discord.StringSelectMenuBuilder()
            battlepassChapterDropMenu.setCustomId('Chapter')
            if(userData.lang === "en") battlepassChapterDropMenu.setPlaceholder('Select a chapter!')
            else if(userData.lang === "ar") battlepassChapterDropMenu.setPlaceholder('اختار فصل!')
            battlepassChapterDropMenu.addOptions(allChapters)

            // Add the drop menu to its row
            battlepassChapterRow.addComponents(battlepassChapterDropMenu)

            // Send dropMenuMessage
            const dropMenuMessage = await message.reply({embeds: [battlepassChapterEmbed], components: [battlepassChapterRow, buttonDataRow], files: []})
            .catch(err => {
                FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, null)
            })

            // Filtering the user clicker
            const filter = (i => {
                return (i.user.id === message.author.id && i.message.id === dropMenuMessage.id && i.guild.id === message.guild.id)
            })
            
            // Await the user click
            const colllector = await message.channel.createMessageComponentCollector({filter, time: 60000, errors: ['time']})
            colllector.on('collect', async collected => {
                collected.deferUpdate()

                // Cancel has been selected
                if(collected.customId === "Cancel") colllector.stop()

                // Chapter has been selected
                if(collected.customId === "Chapter"){

                    // Update options
                    allChapters.map(e => {
                        if(e.value === collected.values[0]) e.default = true
                        else e.default = false
                    })

                    // Set options
                    battlepassChapterRow.components[0].setOptions(allChapters)

                    // Create an embed
                    const battlepassSeasonEmbed = new Discord.EmbedBuilder()
                    battlepassSeasonEmbed.setColor(FNBRMENA.Colors("embed"))
                    if(userData.lang === "en"){
                        battlepassSeasonEmbed.setAuthor({name: `Battlepass, Season`, iconURL: 'https://imgur.com/90m1ldM.png'})
                        battlepassSeasonEmbed.setDescription(`Please click on the Drop-Down menu and choose the battlepass's season`)
                    }else if(userData.lang === "ar"){
                        battlepassSeasonEmbed.setAuthor({name: `بطاقة المعركة, الموسم`, iconURL: 'https://imgur.com/90m1ldM.png'})
                        battlepassSeasonEmbed.setDescription('الرجاء الضغط على السهم لاختيار موسم بطاقة المعركة')
                    }

                    // Loop through seasons
                    const allSeasons = []
                    for(const seasons of res.data.seasons){

                        if(seasons.chapter === Number(collected.values[0])) allSeasons.push({
                                label: seasons.displayName,
                                value: `${seasons.season}`
                            })
                    }

                    // Create a row for drop down menu for categories
                    const battlepassSeasonRow = new Discord.ActionRowBuilder()

                    // Create the drop menu
                    const battlepassSeasonDropMenu = new Discord.StringSelectMenuBuilder()
                    battlepassSeasonDropMenu.setCustomId('Season')
                    if(userData.lang === "en") battlepassSeasonDropMenu.setPlaceholder('Select a season!')
                    else if(userData.lang === "ar") battlepassSeasonDropMenu.setPlaceholder('اختار موسم!')
                    battlepassSeasonDropMenu.addOptions(allSeasons)

                    // Add the drop menu to its row
                    battlepassSeasonRow.addComponents(battlepassSeasonDropMenu)

                    // Edit the orignal image
                    dropMenuMessage.edit({embeds: [battlepassSeasonEmbed], components: [battlepassChapterRow, battlepassSeasonRow, buttonDataRow], files: []})
                    .catch(err => {
                        FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, dropMenuMessage)
                    })
                }

                // Season has been selected
                if(collected.customId === "Season") battlepass(collected.values[0], dropMenuMessage)

            })

            // When time has ended
            colllector.on('end', async (e) => {

                const map = []
                e.map(interaction => map.push(interaction.customId))

                if(map.includes("Cancel") || !map.includes("Season")) try {
                    dropMenuMessage.delete()
                } catch {
                    
                }
                    
            })

        }).catch(async err => {
            FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, null)
        })
    }
}