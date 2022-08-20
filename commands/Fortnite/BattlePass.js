const Canvas = require('canvas')

module.exports = {
    commands: 'battlepass',
    type: 'Fortnite',
    descriptionEN: 'A command that will return a picture of a battlepass of your choice from season 2 till current season.',
    descriptionAR: 'أمر راح يسترجع لك صورة تحتوي على عناصر باتل باس بأختيارك من الموسم 2 الى الموسم الحالي.',
    expectedArgsEN: 'To use the command you need to specifiy a season number from season 2 to latest season.',
    expectedArgsAR: 'من اجل استخدام الأمر يجب عليك تحديد موسم معين من الموسم الثاني الى الموسم الحالي.',
    argsExample: ['2', '14'],
    minArgs: 0,
    maxArgs: 1,
    cooldown: 40,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (FNBRMENA, message, args, text, Discord, client, admin, userData, alias, emojisObject) => {

        const battlepass = async (season) => {

            //request data
            FNBRMENA.getBattlepassRewards(userData.lang, season)
            .then(async res => {
                
                //if there a battlepass data found
                if(res.data.result){

                    // generating animation
                    var length = res.data.rewards.length;
                    const generating = new Discord.EmbedBuilder()
                    generating.setColor(FNBRMENA.Colors("embed"))
                    if(userData.lang === "en") generating.setTitle(`Loading a total ${length} cosmetics please wait... ${emojisObject.loadingEmoji}`)
                    else if(userData.lang === "ar") generating.setTitle(`تحميل جميع العناصر بمجموع ${length} عنصر الرجاء الانتظار... ${emojisObject.loadingEmoji}`)
                    message.reply({embeds: [generating]})
                    .then(async msg => {

                        //variables
                        var width = 62
                        var height = 300
                        var newline = 0
                        var x = 62
                        var y = 120
                        var paid = 0
                        var free = 0

                        //width
                        width += (10 * 107) + (10 * 37) + 37

                        //height
                        for(let i = 0; i < length; i++){
                            if(10 === newline){
                                height += 107 + 37
                                newline = 0
                            }
                            newline += 1
                        }

                        //register fonts
                        Canvas.registerFont('./assets/font/Lalezar-Regular.ttf', {family: 'Arabic',weight: "700",style: "bold"});
                        Canvas.registerFont('./assets/font/BurbankBigCondensed-Black.ttf' ,{family: 'Burbank Big Condensed',weight: "700",style: "bold"})

                        //canvas
                        const canvas = Canvas.createCanvas(width, height);
                        const ctx = canvas.getContext('2d');

                        //background
                        ctx.fillStyle = '#47178f'
                        ctx.fillRect(0, 0, canvas.width, canvas.height)

                        //upper
                        ctx.fillStyle = '#25076b'
                        ctx.fillRect(0, 0, canvas.width, 75)

                        //fnbrmena
                        ctx.fillStyle = '#ffffff';
                        ctx.textAlign='left';
                        ctx.font = '50px Burbank Big Condensed'
                        ctx.fillText("FNBRMENA", 12, 53)

                        //season
                        ctx.fillStyle = '#ffffff';
                        ctx.textAlign='right';
                        if(userData.lang === "en") ctx.font = '50px Burbank Big Condensed'
                        else if (userData.lang === "ar") ctx.font = '50px Arabic'
                        ctx.fillText(res.data.displayInfo.chapterSeason, (canvas.width - 12), 53)

                        //res.dataeting new line
                        newline = 0

                        //loop through every item
                        for(let i = 0; i < length; i++){

                            //if the item is paid
                            if(res.data.rewards[i].battlepass === 'paid') paid += 1

                            //if the item is free
                            if(res.data.rewards[i].battlepass === 'free') free += 1

                            //add new line
                            newline += 1

                            //variables
                            if(res.data.rewards[i].price === null) var tier = res.data.rewards[i].tier
                            else var tier = res.data.rewards[i].price.amount
                            var image = res.data.rewards[i].item.images.icon
                            if(res.data.rewards[i].item.series === null) var rarity = res.data.rewards[i].item.rarity.id
                            else var rarity = res.data.rewards[i].item.series.id

                            //searching...
                            if(rarity === "Legendary"){
                                const holder = await Canvas.loadImage('./assets/Rarities/battlepass/legendary.png')
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
                                const holder = await Canvas.loadImage('./assets/Rarities/battlepass/epic.png')
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
                                const holder = await Canvas.loadImage('./assets/Rarities/battlepass/rare.png')
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
                                const holder = await Canvas.loadImage('./assets/Rarities/battlepass/uncommon.png')
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
                                const holder = await Canvas.loadImage('./assets/Rarities/battlepass/common.png')
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
                                const holder = await Canvas.loadImage('./assets/Rarities/battlepass/marvel.png')
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
                                const holder = await Canvas.loadImage('./assets/Rarities/battlepass/dc.png')
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
                                const holder = await Canvas.loadImage('./assets/Rarities/battlepass/dark.png')
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
                                const holder = await Canvas.loadImage('./assets/Rarities/battlepass/icon.png')
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
                                const holder = await Canvas.loadImage('./assets/Rarities/standard/starwars.png')
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
                                const holder = await Canvas.loadImage('./assets/Rarities/battlepass/shadow.png')
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
                                const holder = await Canvas.loadImage('./assets/Rarities/battlepass/slurp.png')
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
                                const holder = await Canvas.loadImage('./assets/Rarities/battlepass/frozen.png')
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
                                const holder = await Canvas.loadImage('./assets/Rarities/battlepass/lava.png')
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
                                const holder = await Canvas.loadImage('./assets/Rarities/battlepass/gaming.png')
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
                                const holder = await Canvas.loadImage('./assets/Rarities/battlepass/common.png')
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

                        //create info embed
                        const info = new Discord.EmbedBuilder()
                        info.setColor(FNBRMENA.Colors("embed"))
                        info.setTitle(`${res.data.displayInfo.chapterSeason}, ${res.data.displayInfo.battlepassName}`)

                        //set title and add fields
                        if(userData.lang === "en") info.setDescription(`All Cosmetics: \`${length}\`\nPaid Cosmetics: \`${paid}\`\nFree Cosmetics: \`${free}\``)
                        else if(userData.lang === "ar") info.setDescription(`جميع العناصر: \`${length}\`\nالعناصر المدفوعة: \`${paid}\`\nالعناصر المجانية: \`${free}\``)

                        //creating a row
                        const row = new Discord.ActionRowBuilder()

                        //get videos
                        for(let i = 0; i < res.data.videos.length; i++){

                            //if the video is a battlepass trailer
                            if(res.data.videos[i].type === "bp"){

                                //creating button
                                if(userData.lang === "en") row.addComponents(
                                    new Discord.ButtonBuilder()
                                    .setStyle(Discord.ButtonStyle.Link)
                                    .setLabel("Battlepass Trailer")
                                    .setURL(res.data.videos[i].url)
                                )

                                //creating button
                                else if(userData.lang === "ar") row.addComponents(
                                    new Discord.ButtonBuilder()
                                    .setStyle(Discord.ButtonStyle.Link)
                                    .setLabel("عرض الباتل باس")
                                    .setURL(res.data.videos[i].url)
                                )

                            }else

                            //if the video is a season story trailer
                            if(res.data.videos[i].type === "trailer"){

                                //creating button
                                if(userData.lang === "en") row.addComponents(
                                    new Discord.ButtonBuilder()
                                    .setStyle(Discord.ButtonStyle.Link)
                                    .setLabel("Season Trailer")
                                    .setURL(res.data.videos[i].url)
                                )

                                //creating button
                                else if(userData.lang === "ar") row.addComponents(
                                    new Discord.ButtonBuilder()
                                    .setStyle(Discord.ButtonStyle.Link)
                                    .setLabel("عرض السيزون")
                                    .setURL(res.data.videos[i].url)
                                )
                            }
                        }

                        //send the info embed
                        const att = new Discord.AttachmentBuilder(canvas.toBuffer(), {name: `season${res.data.season}.png`})
                        await message.reply({embeds: [info], components: [row], files: [att]})
                        msg.delete()
                    })
                                
                }else{

                    //create error embed
                    const noBattlepassFoundError = new Discord.EmbedBuilder()
                    noBattlepassFoundError.setColor(FNBRMENA.Colors("embedError"))
                    if(userData.lang === "en") noBattlepassFoundError.setTitle(`There is no battlepass with that number ${emojisObject.errorEmoji}`)
                    else if(userData.lang === "ar") noBattlepassFoundError.setTitle(`لا يوجد باتل باس بهذا الرقم ${emojisObject.errorEmoji}`)
                    message.reply({embeds: [noBattlepassFoundError]})
                }

            }).catch(err => {
                FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject)
                
            })
        }

        //if args == 0
        if(args.length === 0){

            await FNBRMENA.Seasons(userData.lang)
            .then(async res => {

                //create an embed
                const battlepassChapterEmbed = new Discord.EmbedBuilder()
                battlepassChapterEmbed.setColor(FNBRMENA.Colors("embed"))
                if(userData.lang === "en"){
                    battlepassChapterEmbed.setAuthor({name: `Battlepass, Chapter`, iconURL: 'https://imgur.com/90m1ldM.png'})
                    battlepassChapterEmbed.setDescription(`Please click on the Drop-Down menu and choose the battlepass's chapter.`)
                }else if(userData.lang === "ar"){
                    battlepassChapterEmbed.setAuthor({name: `بطاقة المعركة, الفصل`, iconURL: 'https://imgur.com/90m1ldM.png'})
                    battlepassChapterEmbed.setDescription('الرجاء الضغط على السهم لاختيار فصل بطاقة المعركة')
                }

                //create a row for cancel button
                const buttonDataRow = new Discord.ActionRowBuilder()

                //add buttons
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
                

                //loop through seasons
                const allChapters = [], foundChapters = []
                for(const season of res.data.seasons){

                    if(!foundChapters.includes(season.chapter)){
                        foundChapters.push(season.chapter)
                        if(userData.lang === "en") allChapters.push(
                            {
                                label: `Chapter ${season.chapter}`,
                                value: `${season.chapter}`
                            }
                        )

                        else if(userData.lang === "ar") allChapters.push(
                            {
                                label: `الفصل ${season.chapter}`,
                                value: `${season.chapter}`
                            }
                        )
                    }
                }

                //create a row for drop down menu for categories
                const battlepassChapterRow = new Discord.ActionRowBuilder()

                //create the drop menu
                const battlepassChapterDropMenu = new Discord.SelectMenuBuilder()
                battlepassChapterDropMenu.setCustomId('chapter')
                if(userData.lang === "en") battlepassChapterDropMenu.setPlaceholder('Select a chapter!')
                else if(userData.lang === "ar") battlepassChapterDropMenu.setPlaceholder('اختار فصل!')
                battlepassChapterDropMenu.addOptions(allChapters)

                //add the drop menu to its row
                battlepassChapterRow.addComponents(battlepassChapterDropMenu)

                //edit the orignal image
                const battlepassMessage = await message.reply({embeds: [battlepassChapterEmbed], components: [battlepassChapterRow, buttonDataRow]})

                //filtering the user clicker
                const filter = i => i.user.id === message.author.id
                
                //await for the user
                await message.channel.awaitMessageComponent({filter, time: 30000})
                .then(async collected => {
                    collected.deferUpdate();

                    //if cancel button has been clicked
                    if(collected.customId === "Cancel") battlepassMessage.delete()

                    //if a search tag option has been chosen
                    if(collected.customId === "chapter"){

                        //create an embed
                        const battlepassSeasonEmbed = new Discord.EmbedBuilder()
                        battlepassSeasonEmbed.setColor(FNBRMENA.Colors("embed"))
                        if(userData.lang === "en"){
                            battlepassSeasonEmbed.setAuthor({name: `Battlepass, Season`, iconURL: 'https://imgur.com/90m1ldM.png'})
                            battlepassSeasonEmbed.setDescription(`Please click on the Drop-Down menu and choose the battlepass's season`)
                        }else if(userData.lang === "ar"){
                            battlepassSeasonEmbed.setAuthor({name: `بطاقة المعركة, الموسم`, iconURL: 'https://imgur.com/90m1ldM.png'})
                            battlepassSeasonEmbed.setDescription('الرجاء الضغط على السهم لاختيار موسم بطاقة المعركة')
                        }

                        //loop through seasons
                        const allSeasons = []
                        for(const seasons of res.data.seasons){

                            if(seasons.chapter === Number(collected.values[0])) allSeasons.push({
                                    label: seasons.displayName,
                                    value: `${seasons.season}`
                                })
                        }

                        //create a row for drop down menu for categories
                        const battlepassSeasonRow = new Discord.ActionRowBuilder()

                        //create the drop menu
                        const battlepassSeasonDropMenu = new Discord.SelectMenuBuilder()
                        battlepassSeasonDropMenu.setCustomId('season')
                        if(userData.lang === "en") battlepassSeasonDropMenu.setPlaceholder('Select a season!')
                        else if(userData.lang === "ar") battlepassSeasonDropMenu.setPlaceholder('اختار موسم!')
                        battlepassSeasonDropMenu.addOptions(allSeasons)

                        //add the drop menu to its row
                        battlepassSeasonRow.addComponents(battlepassSeasonDropMenu)

                        //edit the orignal image
                        battlepassMessage.edit({embeds: [battlepassSeasonEmbed], components: [battlepassSeasonRow, buttonDataRow]})
                        
                        //await for the user
                        await message.channel.awaitMessageComponent({filter, time: 30000})
                        .then(async collected => {
                            collected.deferUpdate();

                            //if cancel button has been clicked
                            if(collected.customId === "Cancel") battlepassMessage.delete()

                            //if a search tag option has been chosen
                            if(collected.customId === "season") battlepass(collected.values[0])
                            
                        }).catch(async err => {
                            battlepassMessage.delete()
                            FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject)
                        })
                    }
                }).catch(async err => {
                    battlepassMessage.delete()
                    FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject)
                })
            }).catch(async err => {
                FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject)
            })

        }else battlepass(text) //user has specified a season number
    }
}