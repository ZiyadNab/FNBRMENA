const Canvas = require('canvas')
const moment = require('moment')
require('moment-timezone')

module.exports = {
    commands: 'stats',
    type: 'Fortnite',
    descriptionEN: 'Generates an image contains statistics about any account.',
    descriptionAR: 'استرجاع صورة تحتوي على إحصائيات حول أي حساب.',
    expectedArgsEN: 'To start, use the command then the account display name.',
    expectedArgsAR: 'للبدء ، استخدم الأمر ثم اسم عرض الحساب.',
    hintEN: 'You can find statistics about any account regardless of the account platform whether its Xbox, Playstation or, Epic Games.',
    hintAR: 'يمكنك العثور على إحصائيات حول أي حساب بغض النظر عن النظام الأساسي للحساب سواء كان Xbox أو Playstation أو Epic Games.',
    argsExample: ['Ninja', 'SypherPK'],
    minArgs: 1,
    maxArgs: null,
    cooldown: 5,
    callback: async (FNBRMENA, message, args, text, Discord, client, admin, userData, alias, emojisObject) => {

        // User input
        var userInput = {
            name: text,
            platform: null,
            type: null,
            custom: false,
            platformOptions: [],
            typeOptions: [],
            statsTypeRow: null
        }

        // List of colors
        const listOfColors = [
            '00e7ff,0006ff',
            'FF00F3,9700FF',
            '23FF00,116F02',
            'FF0000,8C0000',
            'E1FEFE,66FFFF',
            '00FFAA,01764F',
            'FF0080,810041',
            'AE00FF,570180',
            '6400FF,330180',
            'A6FF00,588701',
            'F4FF00,818701',
            'FFAA00,895C01',
            '9E00FF,D086FD',
            '000000,000000',
            '003AFF,031B6B',
            '00F2F9,F900F9',
            '002DF9,00F9F5',
            '6D00F9,F900EE',
            '00F939,DFFE00',
            'FEC400,3E00FF'
        ]

        // List of types
        const listOfTypes = [
            'All',
            'Solo',
            'Duos',
            'Squads',
            'LTMs',
            'الكل',
            'فردي',
            'زوجي',
            'الفِرق',
            'اطوار'
        ]

        // Draw player stats
        const drawPlayerStats = async (res, stats, outfit, loadingscreen, color, msg) => {

            // Generating message
            const generating = new Discord.EmbedBuilder()
            generating.setColor(FNBRMENA.Colors("embed"))
            if(userData.lang === "en") generating.setTitle(`Loading player's data... ${emojisObject.loadingEmoji}`)
            else if(userData.lang === "ar") generating.setTitle(`جاري تحميل بيانات اللاعب... ${emojisObject.loadingEmoji}`)
            msg.edit({embeds: [generating], components: [], files: []})
            .catch(err => {
                FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, msg)
            })

            try {

                // Push add, solo, duo, squads and LTM's
                const statsData = []
                if(stats.overall !== null) statsData.push(stats.overall)
                else statsData.push({ })
                if(stats.solo !== null) statsData.push(stats.solo)
                else statsData.push({ })
                if(stats.duo !== null) statsData.push(stats.duo)
                else statsData.push({ })
                if(stats.squad !== null) statsData.push(stats.squad)
                else statsData.push({ })
                if(stats.ltm !== null) statsData.push(stats.ltm)
                else statsData.push({ })

                // Loop throw every stats feild
                const tableWidth = 13
                var rowData = []
                for(let i = 0; i < statsData.length; i++){

                    // Define hours played variable
                    var minutesPlayed = `${statsData[i].minutesPlayed / 60}`
                    if(minutesPlayed.includes('.')) minutesPlayed = minutesPlayed.substring(0, minutesPlayed.indexOf('.'))

                    // List of Coulmn names
                    rowData.push([
                        {NameEN: 'Matches', NameAR: 'المواجهات', Data: statsData[i].matches, xAxis: 190, yAxis: 97, index: i},
                        {NameEN: 'Wins', NameAR: 'الإنتصارات', Data: statsData[i].wins, xAxis: 190, yAxis: 97, index: i},
                        {NameEN: 'Wins Rate', NameAR: 'م/الإنتصارات', Data: statsData[i].winRate, xAxis: 190, yAxis: 97, index: i},
                        {NameEN: 'Deaths', NameAR: 'الخسارات', Data: statsData[i].deaths, xAxis: 190, yAxis: 97, index: i},
                        {NameEN: 'Kills', NameAR: 'الذبحات', Data: statsData[i].kills, xAxis: 190, yAxis: 97, index: i},
                        {NameEN: 'K.P.M', NameAR: 'ذ.ك.م', Data: statsData[i].killsPerMatch, xAxis: 190, yAxis: 97, index: i},
                        {NameEN: 'K/D', NameAR: 'ك/د', Data: statsData[i].kd, xAxis: 190, yAxis: 97, index: i},
                        {NameEN: 'Hours Played', NameAR: 'ساعات اللعب', Data: minutesPlayed, xAxis: 190, yAxis: 97, index: i},
                        {NameEN: 'Top 3', NameAR: 'أفضل 3', Data: statsData[i].top3, xAxis: 190, yAxis: 97, index: i},
                        {NameEN: 'Top 5', NameAR: 'أفضل 5', Data: statsData[i].top5, xAxis: 190, yAxis: 97, index: i},
                        {NameEN: 'Top 10', NameAR: 'أفضل 10', Data: statsData[i].top10, xAxis: 190, yAxis: 97, index: i},
                        {NameEN: 'Top 25', NameAR: 'أفضل 25', Data: statsData[i].top25, xAxis: 190, yAxis: 97, index: i},
                        {NameEN: 'Last Time Played', NameAR: 'اخر لعب قبل', Data: statsData[i].lastModified, xAxis: 315, yAxis: 97, index: i},
                    ])
                }
                
                // Registering fonts
                Canvas.registerFont('./assets/font/Lalezar-Regular.ttf', {family: 'Arabic',weight: "700",style: "bold"});
                Canvas.registerFont('./assets/font/BurbankBigCondensed-Black.ttf' ,{family: 'Burbank Big Condensed',weight: "700",style: "bold"})
                
                // Applytext
                const applyText = (canvas, text, font, width, langCheck) => {
                    const ctx = canvas.getContext('2d')
                    let fontSize = font
                    do {
                        if(langCheck){
                            if(userData.lang === "en") ctx.font = `${fontSize -= 1}px Burbank Big Condensed`
                            else if(userData.lang === "ar") ctx.font = `${fontSize -= 1}px Arabic`
                            
                        }else ctx.font = `${fontSize -= 1}px Burbank Big Condensed`
                    } while (ctx.measureText(text).width > width)
                    return ctx.font
                }

                // Creating canvas
                const canvas = Canvas.createCanvas(625 + tableWidth * 300, 2160);
                const ctx = canvas.getContext('2d');

                // Get random color
                const randomNumber = async (list) => {
                    return Math.floor(Math.random() * list)
                }

                // Background initializer function
                const backgroundInitializer = async (randomColor) => {

                    // Background gradient
                    const backgroundGRD = ctx.createLinearGradient(0, canvas.height, canvas.width, 0)
                    backgroundGRD.addColorStop(0, `#${randomColor.substring(0, randomColor.indexOf(','))}`)
                    backgroundGRD.addColorStop(1, `#${randomColor.substring(randomColor.indexOf(',') + 1, randomColor.length)}`)
                    ctx.fillStyle = backgroundGRD
                    ctx.fillRect(0, 0, canvas.width, canvas.height) //background

                    // Check for custom loadingscreen
                    if(!loadingscreen){

                        // Get a random loadingscreen
                        const listOfLoadingscreans = await FNBRMENA.Search(userData.lang, "custom", "&type=loadingscreen")
                        ctx.globalAlpha = 0.5;
                        const randomImage = await randomNumber(listOfLoadingscreans.data.items.length)
                        const loadingscreanIMG = await Canvas.loadImage(listOfLoadingscreans.data.items[randomImage].images.featured)
                        ctx.drawImage(loadingscreanIMG, 0, 0, canvas.width, canvas.height)
                        ctx.globalAlpha = 1;
                    }else{
                        ctx.globalAlpha = 0.5;
                        const loadingscreanIMG = await Canvas.loadImage(loadingscreen.data.items[0].images.featured)
                        ctx.drawImage(loadingscreanIMG, 0, 0, canvas.width, canvas.height)
                        ctx.globalAlpha = 1;
                    }

                    // LHS plate
                    const leftHandSideGRD = ctx.createLinearGradient(3300, canvas.height + 200, canvas.width + 1000, 0)
                    leftHandSideGRD.addColorStop(0, `#${randomColor.substring(0, randomColor.indexOf(','))}`)
                    leftHandSideGRD.addColorStop(1, `#${randomColor.substring(randomColor.indexOf(',') + 1, randomColor.length)}`)
                    ctx.fillStyle = leftHandSideGRD
                    ctx.save()
                    ctx.translate(canvas.width - 190, 0);
                    ctx.rotate(Math.PI / 19);
                    ctx.translate(-(canvas.width - 190), -0);
                    ctx.fillRect(canvas.width - 190, -100, 1000, canvas.height + 200); //left hand side
                    ctx.restore()

                    // Check for custom outfit
                    if(!outfit){

                        // Request data
                        await FNBRMENA.Search(userData.lang, "custom", "&gameplayTags=Cosmetics.Source.ItemShop&type=outfit&images.featured=*png")
                        .then(async listOfOutfits => {

                            do {
                                var randomImage = await randomNumber(listOfOutfits.data.items.length)

                            } while(listOfOutfits.data.items[randomImage].builtInEmote !== null &&
                                listOfOutfits.data.items[randomImage].styles.length > 2)

                            // Outfit img 
                            const outfitIMG = await Canvas.loadImage(listOfOutfits.data.items[randomImage].images.featured)
                            ctx.drawImage(outfitIMG, canvas.width - 1250, 300, 1860, 1860)
                        })
                    }else{

                        if(outfit.data.items[0].images.featured !== null){

                            // Outfit img 
                            const outfitIMG = await Canvas.loadImage(outfit.data.items[0].images.featured)
                            ctx.drawImage(outfitIMG, canvas.width - 1250, 300, 1860, 1860)
                        }else{

                            // Request data
                            await FNBRMENA.Search(userData.lang, "custom", "&gameplayTags=Cosmetics.Source.ItemShop&type=outfit&images.featured=*png")
                            .then(async listOfOutfits => {

                                do {
                                    var randomImage = await randomNumber(listOfOutfits.data.items.length)

                                } while(listOfOutfits.data.items[randomImage].builtInEmote !== null &&
                                    listOfOutfits.data.items[randomImage].styles.length > 2)

                                // Outfit img 
                                const outfitIMG = await Canvas.loadImage(listOfOutfits.data.items[randomImage].images.featured)
                                ctx.drawImage(outfitIMG, canvas.width - 1250, 300, 1860, 1860)
                            })
                        }
                    }

                    // Add the credits
                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign='left';
                    ctx.font = '100px Burbank Big Condensed'
                    ctx.fillText(`FNBRMENA | ${userInput.name.toUpperCase()}`, 30, 110)

                    // Add stats type
                    if(userInput.type === "all"){
                        const allTypeIMG = await Canvas.loadImage('https://imgur.com/IGV05Yq.png')
                        ctx.drawImage(allTypeIMG, 30, 120, 120, 120)
                    }
                    if(userInput.type === "kbm"){
                        const kbmTypeIMG = await Canvas.loadImage('https://imgur.com/gUCgxuZ.png')
                        ctx.drawImage(kbmTypeIMG, 30, 120, 120, 120)
                    }
                    if(userInput.type === "controller"){
                        const controllerTypeIMG = await Canvas.loadImage('https://imgur.com/BfRpXon.png')
                        ctx.drawImage(controllerTypeIMG, 30, 120, 120, 120)
                    }
                    if(userInput.type === "touch"){
                        const touchTypeIMG = await Canvas.loadImage('https://imgur.com/mVWCmjy.png')
                        ctx.drawImage(touchTypeIMG, 30, 120, 120, 120)
                    }

                    // Add player's platform
                    if(userInput.platform === "epic"){
                        const allTypeIMG = await Canvas.loadImage('https://imgur.com/tSDjS5L.png')
                        ctx.drawImage(allTypeIMG, 30, 250, 120, 120)
                    }
                    if(userInput.platform === "psn"){
                        const allTypeIMG = await Canvas.loadImage('https://imgur.com/gnVRNSs.png')
                        ctx.drawImage(allTypeIMG, 30, 250, 120, 120)
                    }
                    if(userInput.platform === "xbl"){
                        const allTypeIMG = await Canvas.loadImage('https://imgur.com/zmJKwQw.png')
                        ctx.drawImage(allTypeIMG, 30, 250, 120, 120)
                    }

                }

                // Draw player's XP
                const drawPlayerXP = async () => {

                    //define xp bar variables
                    var w = canvas.width - 1000
                    var h = 80
                    var x = 0
                    var y = canvas.height - h

                    //add the xp process
                    ctx.fillStyle = '#96fe7e';
                    ctx.globalAlpha = 0.5
                    ctx.fillRect(x, y, w + 70, h)
                    ctx.globalAlpha = 1
                    ctx.fillStyle = '#00ff00';
                    ctx.fillRect(x, y, ((res.data.data.battlePass.progress / 100) * w) + 70, h)

                    //add the progress percentage
                    ctx.fillStyle = '#ffffff';
                    ctx.font = '80px Burbank Big Condensed'
                    ctx.fillText(`${res.data.data.battlePass.progress}%`, ((res.data.data.battlePass.progress / 100) * w) + 80, y + 68)

                    //add the lvl pin
                    const lvlPIN = await Canvas.loadImage('https://imgur.com/o0AGlt6.png')
                    ctx.drawImage(lvlPIN, ((res.data.data.battlePass.progress / 100) * w) + 30, y - 80, 80, 80)

                    //add the xp lvl text
                    ctx.textAlign='center';
                    if(userData.lang === "en") ctx.fillText(`${res.data.data.battlePass.level} lvl`, ((res.data.data.battlePass.progress / 100) * w) + 70, y - 100)
                    else{
                        ctx.font = '80px Arabic'
                        ctx.fillText(`${res.data.data.battlePass.level} لفل`, ((res.data.data.battlePass.progress / 100) * w) + 70, y - 100)
                    }
                }

                // Line boarders
                const rowLine = async (x, y, randomColor) => {
                    ctx.fillStyle = `#${randomColor.substring(randomColor.indexOf(',') + 1, randomColor.length)}`
                    ctx.globalAlpha = 0.5
                    ctx.fillRect(x, y, 90, 150)
                    ctx.globalAlpha = 1
                    ctx.fillStyle = '#ffffff';

                }

                // Add tags
                const Tags = async (text, size) => {
                    ctx.textAlign = 'center';
                    applyText(canvas, text, 75, size, true)
                    ctx.fillText(text, x, y - 40)
                }

                // Add new column to the board
                const newColumn = async (Path ,ColumnNameEN, ColumnNameAR, xAxis, yAxis, i, randomColor) => {

                    if(ColumnNameEN !== "Hours Played" && ColumnNameEN !== "Last Time Played"){
                        if(Path !== undefined){
                            applyText(canvas, Path, 75, 185, false)
                            ctx.fillText(Path, x += xAxis, y + yAxis) //add the wins
                        }else{
                            ctx.font = '80px Arabic'
                            if(userData.lang === "en") ctx.fillText('N/A', x += xAxis, y + yAxis)
                            else if(userData.lang === "en") ctx.fillText('غ/م', x += xAxis, y + yAxis)
                        }

                        //add the line value name
                        if(i === 0){
                            if(userData.lang === "en") Tags(ColumnNameEN, 275)
                            if(userData.lang === "ar") Tags(ColumnNameAR, 275)
                        }
                        
                        //add the line
                        await rowLine(x += 100, y, randomColor)

                    }else if(ColumnNameEN === "Last Time Played"){

                        if(Path !== undefined){
                            moment.locale(userData.lang)
                            const lastModified = moment.duration(moment.tz(moment(), userData.timezone).diff(moment.tz(moment(Path), userData.timezone)))
                            const days = lastModified.asDays().toString().substring(0, lastModified.asDays().toString().indexOf("."))

                            if(userData.lang === "en"){
                                ctx.font = '80px Burbank Big Condensed'

                                //if days r more than 1
                                if(days >= 1) ctx.fillText(`${days} days ago`, x += xAxis, y + yAxis) //add the lastModified

                                //if hours more than 1
                                else if(lastModified.hours() >= 1) ctx.fillText(`${lastModified.hours()} hours ago`, x += xAxis, y + yAxis) //add the lastModified

                                //else add minutes
                                else ctx.fillText(`${lastModified.minutes()} minutes ago`, x += xAxis, y + yAxis) //add the lastModified

                            }else if(userData.lang === "ar"){
                                ctx.font = '80px Arabic'

                                //if days r more than 1
                                if(days >= 1) ctx.fillText(`${days} يوم مضى`, x += xAxis, y + yAxis) //add the lastModified
                                
                                //if hours more than 1
                                else if(lastModified.hours() >= 1) ctx.fillText(`${lastModified.hours()} ساعة مضت`, x += xAxis, y + yAxis) //add the lastModified

                                //else add minutes
                                else ctx.fillText(`${lastModified.minutes()} دقائق مضت`, x += xAxis, y + yAxis) //add the lastModified
                            }
                        }else{
                            ctx.font = '80px Arabic'
                            if(userData.lang === "en") ctx.fillText('N/A', x += xAxis, y + yAxis)
                            else if(userData.lang === "en") ctx.fillText('غ/م', x += xAxis, y + yAxis)
                        }

                        //add the line value name
                        if(i === 0){
                            if(userData.lang === "en") Tags(ColumnNameEN, 400)
                            if(userData.lang === "ar") Tags(ColumnNameAR, 400)
                        }

                    }
                }

                // Get a random color
                if(!color) var randomColor = listOfColors[await randomNumber(listOfColors.length)]
                else var randomColor = color

                // Create grediant background
                await backgroundInitializer(randomColor)

                // Draw player's XP
                await drawPlayerXP()

                // Define x, y and data array
                var x = 250
                var y = 500

                // Loop through every stat
                for(let i = 0; i < rowData.length; i++){

                    // Set and draw lines color
                    ctx.fillStyle = `#${randomColor.substring(0, randomColor.indexOf(','))}`
                    ctx.globalAlpha = 0.5
                    ctx.fillRect(x, y, canvas.width - (x * 2), 150)
                    ctx.globalAlpha = 1

                    // Change x value
                    x += 130

                    // Add the modes
                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign='center';
                    if(userData.lang === "en"){
                        ctx.font = '97px Burbank Big Condensed'
                        ctx.fillText(listOfTypes[i], x, y + 97)
                    }else if(userData.lang === "ar"){
                        ctx.font = '97px Arabic'
                        ctx.fillText(listOfTypes[i + 5], x, y + 97)
                    }
                    
                    // Loop through the statsDrawer length
                    await rowLine(x += 150, y, randomColor)

                    // Loop through every column
                    for(const lineData of rowData[i])
                    await newColumn(lineData.Data, lineData.NameEN, lineData.NameAR, lineData.xAxis, lineData.yAxis, lineData.index, randomColor)

                    // Get to the next row
                    y += 150 + 113
                    x = 250

                }

                // Send the image
                var att = new Discord.AttachmentBuilder(canvas.toBuffer(), {name: `${res.data.data.account.name}.png`})
                msg.edit({embeds: [], components: [], files: [att]})
                .catch(err => {

                    // Try sending it on jpg file format [LOWER QUALITY]
                    var att = new Discord.AttachmentBuilder(canvas.toBuffer('image/jpeg'), {name: `${res.data.data.account.name}.jpg`})
                    msg.edit({embeds: [], components: [], files: [att]})
                    .catch(err => {
                        FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, msg)
                    })
                })

            }catch(err) {
                FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, msg)

            }
        }

        // Create an embed
        const statsPlatformEmbed = new Discord.EmbedBuilder()
        statsPlatformEmbed.setColor(FNBRMENA.Colors("embed"))
        if(userData.lang === "en"){
            statsPlatformEmbed.setTitle(`Select a Platform`)
            statsPlatformEmbed.setDescription('Please click on the Drop-Down menu and select a platform.\n`You have only 30 seconds until this operation ends, Make it quick`!')
        }else if(userData.lang === "ar"){
            statsPlatformEmbed.setTitle(`اختر منصه`)
            statsPlatformEmbed.setDescription('الرجاء الضغط على السهم لاختيار نوع المنصه.\n`لديك فقط 30 ثانية حتى تنتهي العملية, استعجل`!')
        }

        // Create a row for cancel button
        const cancelButtonDataRow = new Discord.ActionRowBuilder()
        
        // Add buttons
        if(userData.lang === "en") cancelButtonDataRow.addComponents(
            new Discord.ButtonBuilder()
            .setCustomId(`Cancel-${alias}`)
            .setStyle(Discord.ButtonStyle.Danger)
            .setLabel("Cancel")
        )

        else if(userData.lang === "ar") cancelButtonDataRow.addComponents(
            new Discord.ButtonBuilder()
            .setCustomId(`Cancel-${alias}`)
            .setStyle(Discord.ButtonStyle.Danger)
            .setLabel("اغلاق")
        )

        // Create a row for drop down menu for categories
        const statsPlatformRow = new Discord.ActionRowBuilder()

        // Add English options
        if(userData.lang === "en") userInput.platformOptions.push(
            {
                label: `Epic Games`,
                value: `epic`,
                default: false,
                emoji: `${emojisObject.epicgames.name}:${emojisObject.epicgames.id}`
            },
            {
                label: `Playstation`,
                value: `psn`,
                default: false,
                emoji: `${emojisObject.playstation.name}:${emojisObject.playstation.id}`
            },
            {
                label: `Xbox`,
                value: `xbl`,
                default: false,
                emoji: `${emojisObject.xbox.name}:${emojisObject.xbox.id}`
            }
        )

        // Add Arabic options
        else if(userData.lang === "ar") userInput.platformOptions.push(
            {
                label: `ايبك قيمز`,
                value: `epic`,
                default: false,
                emoji: `${emojisObject.epicgames.name}:${emojisObject.epicgames.id}`
            },
            {
                label: `بلايستيشن`,
                value: `psn`,
                default: false,
                emoji: `${emojisObject.playstation.name}:${emojisObject.playstation.id}`
            },
            {
                label: `اكسبوكس`,
                value: `xbl`,
                default: false,
                emoji: `${emojisObject.xbox.name}:${emojisObject.xbox.id}`
            }
        )

        const statsPlatformDropMenu = new Discord.SelectMenuBuilder()
        statsPlatformDropMenu.setCustomId(`Platform-${alias}`)
        if(userData.lang === "en") statsPlatformDropMenu.setPlaceholder('Nothing selected!')
        else if(userData.lang === "ar") statsPlatformDropMenu.setPlaceholder('الرجاء الأختيار!')
        statsPlatformDropMenu.addOptions(userInput.platformOptions)

        // Add the drop menu to the categoryDropMenu
        statsPlatformRow.addComponents(statsPlatformDropMenu)

        // Send the message
        const dropMenuMessage = await message.reply({embeds: [statsPlatformEmbed], components: [statsPlatformRow, cancelButtonDataRow], files: []})
        .catch(err => {
            FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, null)
        })

        // Filtering the user clicker
        const filter = (i => {
            return (i.user.id === message.author.id && i.message.id === dropMenuMessage.id && i.guild.id === message.guild.id)
        })

        // Await for user input
        const colllector = await message.channel.createMessageComponentCollector({filter, time: 3 * 60000, errors: ['time'] })
        colllector.on('collect', async collected => {
            collected.deferUpdate();

            // If cancel button has been clicked
            if(collected.customId === `Cancel-${alias}`) colllector.stop()

            // If the user selected a platform
            if(collected.customId === `Platform-${alias}`){

                // Add the chosen platform to userInput obj
                userInput.platform = collected.values[0]

                // Set platform options
                userInput.platformOptions.forEach(e => (userInput.platform === e.value) ? e.default = true : e.default = false)
                statsPlatformRow.components[0].setOptions(userInput.platformOptions)

                // Add English options
                if(userData.lang === "en") userInput.typeOptions = [
                    {
                        label: `All`,
                        value: `all`,
                        emoji: `${emojisObject.overall.name}:${emojisObject.overall.id}`
                    },
                    {
                        label: `Keyboard And Mouse`,
                        value: `kbm`,
                        emoji: `${emojisObject.keyboard.name}:${emojisObject.keyboard.id}`
                    },
                    {
                        label: `Controller`,
                        value: `controller`,
                        emoji: `${emojisObject.controller.name}:${emojisObject.controller.id}`
                    },
                    {
                        label: `Touch`,
                        value: `touch`,
                        emoji: `${emojisObject.touchpad.name}:${emojisObject.touchpad.id}`
                    }
                ]

                // Add Arabic options
                else if(userData.lang === "ar") userInput.typeOptions = [
                    {
                        label: `الكل`,
                        value: `all`,
                        emoji: `${emojisObject.overall.name}:${emojisObject.overall.id}`
                    },
                    {
                        label: `لوحة المفاتيح`,
                        value: `kbm`,
                        emoji: `${emojisObject.keyboard.name}:${emojisObject.keyboard.id}`
                    },
                    {
                        label: `يد التحكم`,
                        value: `controller`,
                        emoji: `${emojisObject.controller.name}:${emojisObject.controller.id}`
                    },
                    {
                        label: `اللمس`,
                        value: `touch`,
                        emoji: `${emojisObject.touchpad.name}:${emojisObject.touchpad.id}`
                    }
                ]

                // Stats Seasonal/Lifetime 
                const statsTypeDropMenu = new Discord.SelectMenuBuilder()
                statsTypeDropMenu.setCustomId(`Type-${alias}`)
                if(userData.lang === "en") statsTypeDropMenu.setPlaceholder('Nothing selected!')
                else if(userData.lang === "ar") statsTypeDropMenu.setPlaceholder('الرجاء الأختيار!')
                statsTypeDropMenu.addOptions(userInput.typeOptions)

                // Add the drop menu to the categoryDropMenu
                userInput.statsTypeRow = new Discord.ActionRowBuilder()
                userInput.statsTypeRow.addComponents(statsTypeDropMenu)

                // Edit the main message
                dropMenuMessage.edit({embeds: [statsPlatformEmbed], components: [statsPlatformRow, userInput.statsTypeRow, cancelButtonDataRow], files: []})
                .catch(err => {
                    FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, dropMenuMessage)
                })
                
            }

            // If the user selected a type
            if(collected.customId === `Type-${alias}`){

                // Add the chosen type to userInput obj
                userInput.type = collected.values[0]

                // Set platform options
                userInput.platformOptions.forEach(e => (userInput.platform === e.value) ? e.default = true : e.default = false)
                statsPlatformRow.components[0].setOptions(userInput.platformOptions)

                // Set type options
                userInput.typeOptions.forEach(e => (userInput.type === e.value) ? e.default = true : e.default = false)
                userInput.statsTypeRow.components[0].setOptions(userInput.typeOptions)

                // Create a row for buttons
                const buttonDataRow = new Discord.ActionRowBuilder()

                // Add buttons
                if(userData.lang === "en") buttonDataRow.addComponents(
                    new Discord.ButtonBuilder()
                    .setCustomId(`Lifetime-${alias}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setLabel("Lifetime")
                )

                else if(userData.lang === "ar") buttonDataRow.addComponents(
                    new Discord.ButtonBuilder()
                    .setCustomId(`Lifetime-${alias}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setLabel("جميع المواسم")
                )

                if(userData.lang === "en") buttonDataRow.addComponents(
                    new Discord.ButtonBuilder()
                    .setCustomId(`Seasonal-${alias}`)
                    .setStyle(Discord.ButtonStyle.Success)
                    .setLabel("Seasonal")
                )

                else if(userData.lang === "ar") buttonDataRow.addComponents(
                    new Discord.ButtonBuilder()
                    .setCustomId(`Seasonal-${alias}`)
                    .setStyle(Discord.ButtonStyle.Success)
                    .setLabel("موسمي")
                )

                if(userData.lang === "en") buttonDataRow.addComponents(
                    new Discord.ButtonBuilder()
                    .setCustomId(`Cancel-${alias}`)
                    .setStyle(Discord.ButtonStyle.Danger)
                    .setLabel("Cancel")
                )

                else if(userData.lang === "ar") buttonDataRow.addComponents(
                    new Discord.ButtonBuilder()
                    .setCustomId(`Cancel-${alias}`)
                    .setStyle(Discord.ButtonStyle.Danger)
                    .setLabel("اغلاق")
                )

                // Edit the main message
                dropMenuMessage.edit({embeds: [statsPlatformEmbed], components: [statsPlatformRow, userInput.statsTypeRow, buttonDataRow], files: []})
                .catch(err => {
                    FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, dropMenuMessage)
                })

            }

            // If lifetime/seasonal button has been clicked
            if(collected.customId === `Lifetime-${alias}` || collected.customId === `Seasonal-${alias}`){
                
                //request data
                FNBRMENA.Stats(userInput.name, userInput.platform, collected.customId === `Lifetime-${alias}` ? 'lifetime' : 'season')
                .then(async res => {

                    // Draw the stats
                    if(userInput.type === "all") drawPlayerStats(res, res.data.data.stats.all, false, false, false, dropMenuMessage)
                    if(userInput.type === "kbm") drawPlayerStats(res, res.data.data.stats.keyboardMouse, false, false, false, dropMenuMessage)
                    if(userInput.type === "controller") drawPlayerStats(res, res.data.data.stats.gamepad, false, false, false, dropMenuMessage)
                    if(userInput.type === "touch") drawPlayerStats(res, res.data.data.stats.touch, false, false, false, dropMenuMessage)
                
                }).catch(async err => {
                    if(err.response.data.status === 404){

                        if(err.response.data.error === "the requested account does not exist"){

                            // Epic games string
                            if(userInput.platform === "epic" && userData.lang === "en") var usedPlatform = 'Epicgames'
                            else if(userInput.platform === "epic" && userData.lang === "ar") var usedPlatform = 'ايبك قيمز'

                            // Psn string
                            if(userInput.platform === "psn" && userData.lang === "en") var usedPlatform = 'Playstation'
                            else if(userInput.platform === "psn" && userData.lang === "ar") var usedPlatform = 'بلايستيشن'

                            // Xbl string
                            if(userInput.platform === "xbl" && userData.lang === "en") var usedPlatform = 'XBOX'
                            else if(userInput.platform === "xbl" && userData.lang === "ar") var usedPlatform = 'اكسبوكس'

                            const noUserHasBeenFoundError = new Discord.EmbedBuilder()
                            noUserHasBeenFoundError.setColor(FNBRMENA.Colors("embedError"))
                            if(userData.lang === "en") noUserHasBeenFoundError.setTitle(`Can't find \`${text}\` in ${usedPlatform} platform. Please try again ${emojisObject.errorEmoji}.`)
                            else if(userData.lang === "ar") noUserHasBeenFoundError.setTitle(`لا يمكنني العثور على حساب \`${text}\` في منصه ${usedPlatform} حاول مجددا ${emojisObject.errorEmoji}.`)
                            await message.reply({embeds: [noUserHasBeenFoundError], components: [], files: []})
                            .catch(err => {
                                FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, null)
                            })

                        }else if(err.response.data.error === "the requested profile didnt play any match yet"){

                            const noMatchsPlayedYetError = new Discord.EmbedBuilder()
                            noMatchsPlayedYetError.setColor(FNBRMENA.Colors("embedError"))
                            if(userData.lang === "en") noMatchsPlayedYetError.setTitle(`\`${text}\` hasn't played any matchs yet ${emojisObject.errorEmoji}.`)
                            else if(userData.lang === "ar") noMatchsPlayedYetError.setTitle(`صاحب حساب \`${text}\` لم يلعب اي مباراة حتى الأن ${emojisObject.errorEmoji}.`)
                            await message.reply({embeds: [noMatchsPlayedYetError], components: [], files: []})
                            .catch(err => {
                                FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, null)
                            })

                        }

                    }else if(err.response.data.status === 403){

                        const theUserAccountIsPrivate = new Discord.EmbedBuilder()
                        theUserAccountIsPrivate.setColor(FNBRMENA.Colors("embedError"))
                        if(userData.lang === "en") theUserAccountIsPrivate.setTitle(`\`${text}\` account is private, Try again later ${emojisObject.errorEmoji}.`)
                        else if(userData.lang === "ar") theUserAccountIsPrivate.setTitle(`عذرا حساب \`${text}\` خاص ، حاول مجددآ في وقت لاحق ${emojisObject.errorEmoji}.`)
                        await message.reply({embeds: [theUserAccountIsPrivate], components: [], files: []})
                        .catch(err => {
                            FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, null)
                        })

                    }else FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, null)
                })
            }
        })

        // When time ends
        colllector.on('end', async (e) => {

            const map = []
            e.map(interaction => map.push(interaction.customId))

            if(map.includes("Cancel") || (!map.includes(`Lifetime-${alias}`) && !map.includes(`Seasonal-${alias}`))) try {
                dropMenuMessage.delete()
            } catch {
                    
            }

        })
    }
}
