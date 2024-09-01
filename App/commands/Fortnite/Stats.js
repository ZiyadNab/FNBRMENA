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

        /*

                  SECTION   SECTION   SECTION   SECTION .... ->
                   NAME      NAME       NAME      NAME
        MODE NAME ////////+/////////+/////////+/////////+//////////////////////////////////////////////////////////// <--- VERTICAL LINE
        WHERE + MEANS SECTION ENDS

        */

        // User input
        var userInput = {
            name: text,
            platform: null,
            type: null,
            season: null,
            custom: false,
            platformOptions: [],
            typeOptions: [],
            avSeasons: [],
            statsTypeRow: null
        }

        // List of colors
        const listOfColors = [
            '00e7ff,0006ff',
            'FF00F3,9700FF',
            '23FF00,9700FF',
            'FF0000,8C0000',
            '00FFAA,01764F',
            'FF0080,810041',
            'AE00FF,570180',
            '6400FF,330180',
            'A6FF00,588701',
            'F4FF00,818701',
            'FFAA00,895C01',
            '9E00FF,D086FD',
            '000000,5A5A5A',
            '003AFF,031B6B',
            '00F2F9,F900F9',
            '002DF9,00F9F5',
            '6D00F9,F900EE',
            '00F939,DFFE00',
            'FEC400,3E00FF'
        ]

        // List of types
        const listOfTypes = [
            'ALL',
            'SOLOS',
            'DUOS',
            'TRIOS',
            'SQUADS',
            'OTHERS',
            'الكل',
            'فردي',
            'زوجي',
            'ثلاثي',
            'الفِرق',
            'اخرى'
        ]

        // Draw player stats
        const drawPlayerStats = async (res, stats, season, outfit, loadingscreen, color, msg) => {

            // Generating messages
            const generating = new Discord.EmbedBuilder()
            generating.setColor(FNBRMENA.Colors("embed"))
            if(userData.lang === "en") generating.setTitle(`Loading player's data... ${emojisObject.loadingEmoji}`)
            else if(userData.lang === "ar") generating.setTitle(`جاري تحميل بيانات اللاعب... ${emojisObject.loadingEmoji}`)
            msg.edit({embeds: [generating], components: [], files: []})
            .catch(async err => {
                FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, msg)
            })

            try {

                // Push add, solo, duo, squads and LTM's
                const statsData = []
                if(stats.overall !== null) statsData.push(stats.overall)
                else statsData.push({ })
                if(stats.solos !== null) statsData.push(stats.solos)
                else statsData.push({ })
                if(stats.duos !== null) statsData.push(stats.duos)
                else statsData.push({ })
                if(stats.trios !== null) statsData.push(stats.trios)
                else statsData.push({ })
                if(stats.squads !== null) statsData.push(stats.squads)
                else statsData.push({ })
                if(stats.others !== null) statsData.push(stats.others)
                else statsData.push({ })

                // Loop throw every stats feild
                const tableWidth = 13
                var rowData = []
                for(let i = 0; i < statsData.length; i++){

                    // Define hours played variable
                    var minutesPlayed = `${statsData[i].minutesPlayed / 60}`
                    if(minutesPlayed.includes('.')) minutesPlayed = minutesPlayed.substring(0, minutesPlayed.indexOf('.'))

                    // List of Coulmns
                    rowData.push([
                        {NameEN: 'HOURS', NameAR: 'الساعات', Data: minutesPlayed, xAxis: 190, yAxis: 105, index: i},
                        {NameEN: 'MATCHES', NameAR: 'المواجهات', Data: statsData[i].matches !== undefined ? statsData[i].matches : null, xAxis: 190, yAxis: 105, index: i},
                        {NameEN: 'WINS', NameAR: 'الإنتصارات', Data: statsData[i].wins !== undefined ? statsData[i].wins : null, xAxis: 190, yAxis: 105, index: i},
                        {NameEN: 'WIN RATE', NameAR: 'م/الإنتصارات', Data: statsData[i].winRate !== undefined ? statsData[i].winRate : null, xAxis: 190, yAxis: 105, index: i},
                        {NameEN: 'DEATHS', NameAR: 'الخسارات', Data: statsData[i].deaths !== undefined ? statsData[i].deaths : null, xAxis: 190, yAxis: 105, index: i},
                        {NameEN: 'KILLS', NameAR: 'الذبحات', Data: statsData[i].kills !== undefined ? statsData[i].kills : null, xAxis: 190, yAxis: 105, index: i},
                        {NameEN: 'K.P.M', NameAR: 'ذ.ك.م', Data: statsData[i].killsPerMatch !== undefined ? statsData[i].killsPerMatch : null, xAxis: 190, yAxis: 105, index: i},
                        {NameEN: 'K/D', NameAR: 'ك/د', Data: statsData[i].kd !== undefined ? statsData[i].kd : null, xAxis: 190, yAxis: 105, index: i},
                        {NameEN: 'TOP 3', NameAR: 'أفضل 3', Data: statsData[i].top3 !== undefined ? statsData[i].top3 : null, xAxis: 190, yAxis: 105, index: i},
                        {NameEN: 'TOP 5', NameAR: 'أفضل 5', Data: statsData[i].top5 !== undefined ? statsData[i].top5 : null, xAxis: 190, yAxis: 105, index: i},
                        {NameEN: 'TOP 10', NameAR: 'أفضل 10', Data: statsData[i].top10 !== undefined ? statsData[i].top10 : null, xAxis: 190, yAxis: 105, index: i},
                        {NameEN: 'TOP 25', NameAR: 'أفضل 25', Data: statsData[i].top25 !== undefined ? statsData[i].top25 : null, xAxis: 190, yAxis: 105, index: i},
                        {NameEN: 'LAST TIME PLAYED', NameAR: 'اخر لعب قبل', Data: statsData[i].lastModified !== undefined ? statsData[i].lastModified : null, xAxis: 315, yAxis: 105, index: i},
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
                const canvas = Canvas.createCanvas(900 + tableWidth * 300, 2400)
                const ctx = canvas.getContext('2d')

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
                        const listOfLoadingscreans = await FNBRMENA.Search(userData.lang, "custom", "&type=loadingscreen&introduction.chapter=Chapter 1")
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
                            ctx.drawImage(outfitIMG, canvas.width - 1550, 300, canvas.height - 300, canvas.height - 300)
                        })
                    }else{

                        if(outfit.data.items[0].images.featured !== null){

                            // Outfit img 
                            const outfitIMG = await Canvas.loadImage(outfit.data.items[0].images.featured)
                            ctx.drawImage(outfitIMG, canvas.width - 1550, 300, canvas.height - 300, canvas.height - 300)
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
                                ctx.drawImage(outfitIMG, canvas.width - 1550, 300, canvas.height - 300, canvas.height - 300)
                            })
                        }
                    }

                    // Add the credits
                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign='left';
                    ctx.font = '100px Burbank Big Condensed'
                    ctx.fillText(`FNBRMENA | ${userInput.name.toUpperCase()} | ${season.toUpperCase()}`, 115, 110)

                    // Add stats type
                    if(userInput.type === "all"){
                        const allTypeIMG = await Canvas.loadImage('https://i.ibb.co/q9CNh4z/IGV05Yq.png')
                        ctx.drawImage(allTypeIMG, 115, 120, 120, 120)
                    }
                    if(userInput.type === "kbm"){
                        const kbmTypeIMG = await Canvas.loadImage('https://i.ibb.co/W6qDrSr/gUCgxuZ.png')
                        ctx.drawImage(kbmTypeIMG, 115, 120, 120, 120)
                    }
                    if(userInput.type === "controller"){
                        const controllerTypeIMG = await Canvas.loadImage('https://i.ibb.co/WWWZPhX/BfRpXon.png')
                        ctx.drawImage(controllerTypeIMG, 115, 120, 120, 120)
                    }
                    if(userInput.type === "touch"){
                        const touchTypeIMG = await Canvas.loadImage('https://i.ibb.co/xm3hHWD/mVWCmjy.png')
                        ctx.drawImage(touchTypeIMG, 115, 120, 120, 120)
                    }

                    // Add player's platform
                    if(userInput.platform === "epic"){
                        const allTypeIMG = await Canvas.loadImage('https://i.ibb.co/WHK22xy/tSDjS5L.png')
                        ctx.drawImage(allTypeIMG, 115, 250, 120, 120)
                    }
                    if(userInput.platform === "psn"){
                        const allTypeIMG = await Canvas.loadImage('https://i.ibb.co/dkMKvKB/gnVRNSs.png')
                        ctx.drawImage(allTypeIMG, 115, 250, 120, 120)
                    }
                    if(userInput.platform === "xbl"){
                        const allTypeIMG = await Canvas.loadImage('https://i.ibb.co/drJJHwy/zmJKwQw.png')
                        ctx.drawImage(allTypeIMG, 115, 250, 120, 120)
                    }

                }

                // Draw player's XP
                const drawPlayerXP = async () => {

                    //define xp bar variables
                    var w = 75
                    var h = canvas.height

                    //add the xp process
                    ctx.fillStyle = `#${randomColor.substring(0, randomColor.indexOf(','))}` // '#96fe7e';
                    ctx.globalAlpha = 0.5
                    ctx.fillRect(0, 0, w, h)
                    ctx.globalAlpha = 1
                    ctx.fillStyle = `#${randomColor.substring(0, randomColor.indexOf(','))}` // '#00ff00';
                    ctx.fillRect(0, canvas.height, w, -((res.data.data.battlePass.progress / 100) * h))

                    // Add the credits
                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign='left';
                    if(userData.lang === "en"){
                        ctx.font = '100px Burbank Big Condensed'
                        ctx.fillText(`${res.data.data.battlePass.level} LEVEL(S), PROGRESSION ${res.data.data.battlePass.progress}%`, 120, canvas.height - 40)
                    }else if(userData.lang === "ar"){
                        ctx.font = '100px Arabic'
                        ctx.fillText(`المستوى ${res.data.data.battlePass.level} , التقدم ${res.data.data.battlePass.progress}%`, 120, canvas.height - 40)
                    }
                }

                // Section border
                const sectionBorder = async (x, y, randomColor) => {
                    ctx.fillStyle = `#${randomColor.substring(randomColor.indexOf(',') + 1, randomColor.length)}`
                    ctx.globalAlpha = 0.5
                    ctx.fillRect(x , y, 90, 150)
                    ctx.globalAlpha = 1
                    ctx.fillStyle = '#ffffff';

                }

                // Add tags
                const Tags = async (text, size) => {
                    ctx.textAlign = 'center';
                    applyText(canvas, text, 90, size, true)
                    ctx.fillText(text, x, y - 40)
                }

                // Add new column to the board
                const newColumn = async (value ,ColumnNameEN, ColumnNameAR, xAxis, yAxis, i, randomColor) => {

                    if(ColumnNameEN !== "LAST TIME PLAYED"){
                        if(value !== null){
                            applyText(canvas, value, 95, 185, false)
                            ctx.fillText(value, x += xAxis, y + yAxis)
                        }else{
                            if(userData.lang === "en"){
                                applyText(canvas, 'N/A', 95, 185, true)
                                ctx.fillText('N/A', x += xAxis, y + yAxis)
                            }else if(userData.lang === "ar"){
                                applyText(canvas, 'غ/م', 95, 185, true)
                                ctx.fillText('غ/م', x += xAxis, y + yAxis)
                            }
                        }

                        // Add the section name
                        if(i === 0) Tags(userData.lang === "en" ? ColumnNameEN : ColumnNameAR, 275)
                        
                        // Add the end of a section
                        sectionBorder(x += 100, y, randomColor)

                    }else if(ColumnNameEN === "LAST TIME PLAYED"){

                        if(value !== null){
                            moment.locale(userData.lang)
                            applyText(canvas, moment.tz(moment(value), userData.timezone).fromNow(), 95, 420, true)
                            ctx.fillText(moment.tz(moment(value), userData.timezone).fromNow(), x += xAxis, y + yAxis) // Add the lastModified
                            
                        }else{
                            if(userData.lang === "en"){
                                applyText(canvas, 'N/A', 95, 185, true)
                                ctx.fillText('N/A', x += xAxis, y + yAxis)
                            }else if(userData.lang === "ar"){
                                applyText(canvas, 'غ/م', 95, 185, true)
                                ctx.fillText('غ/م', x += xAxis, y + yAxis)
                            }
                        }

                        // Add the section name
                        if(i === 0) Tags(userData.lang === "en" ? ColumnNameEN : ColumnNameAR, 500)
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
                var x = 225
                var y = 520

                // Loop through every stat
                for(let i = 0; i < rowData.length; i++){

                    // Set and draw the vertical line color
                    ctx.fillStyle = `#${randomColor.substring(0, randomColor.indexOf(','))}`
                    ctx.globalAlpha = 0.5
                    ctx.fillRect(x, y, canvas.width - (x * 2), 150)
                    ctx.globalAlpha = 1

                    // Change x value
                    x += 155

                    // Add the mode's name
                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign='center';
                    if(userData.lang === "en"){
                        ctx.font = '97px Burbank Big Condensed'
                        ctx.fillText(listOfTypes[i], x, y + 106)
                    }else if(userData.lang === "ar"){
                        ctx.font = '97px Arabic'
                        ctx.fillText(listOfTypes[i + 6], x, y + 97)
                    }
                    
                    // Add the first end of a section
                    sectionBorder(x += 150, y, randomColor)

                    // Loop through every column
                    for(const lineData of rowData[i])
                    await newColumn(lineData.Data, lineData.NameEN, lineData.NameAR, lineData.xAxis, lineData.yAxis, lineData.index, randomColor)

                    // Get to the next row
                    y += 150 + 113
                    x = 225

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

        const statsPlatformDropMenu = new Discord.StringSelectMenuBuilder()
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
            collected.deferUpdate()

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
                const statsTypeDropMenu = new Discord.StringSelectMenuBuilder()
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

            // If seasonal button has been clicked
            if(collected.customId === `Seasonal-${alias}`){

                // Set platform options
                userInput.platformOptions.forEach(e => (userInput.platform === e.value) ? e.default = true : e.default = false)
                statsPlatformRow.components[0].setOptions(userInput.platformOptions)

                // Set type options
                userInput.typeOptions.forEach(e => (userInput.type === e.value) ? e.default = true : e.default = false)
                userInput.statsTypeRow.components[0].setOptions(userInput.typeOptions)

                // Request seasons data
                const listSeasons = await FNBRMENA.Seasons(userData.lang)
                for(const i of listSeasons.data.seasons) if(i.season >= 10 && i.endDate !== null) userInput.avSeasons.push({
                    label: `${i.displayName}`,
                    value: `${i.season}`
                })

                // Stats Seasonal/Lifetime 
                const statsSeasonDropMenu = new Discord.StringSelectMenuBuilder()
                statsSeasonDropMenu.setCustomId(`Season-${alias}`)
                if(userData.lang === "en") statsSeasonDropMenu.setPlaceholder('Nothing selected!')
                else if(userData.lang === "ar") statsSeasonDropMenu.setPlaceholder('الرجاء الأختيار!')
                statsSeasonDropMenu.addOptions(userInput.avSeasons)

                // Add the drop menu to the categoryDropMenu
                const statsSeasonRow = new Discord.ActionRowBuilder()
                statsSeasonRow.addComponents(statsSeasonDropMenu)
                
                // Edit the main message
                dropMenuMessage.edit({embeds: [statsPlatformEmbed], components: [statsPlatformRow, userInput.statsTypeRow, statsSeasonRow, cancelButtonDataRow], files: []})
                .catch(err => {
                    FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, dropMenuMessage)
                })
            }

            // If Lifetime/Season button has been clicked
            if(collected.customId === `Lifetime-${alias}` || collected.customId === `Season-${alias}`){
                
                // Request stats data
                FNBRMENA.FNBRMENAStats(userInput.name, userInput.platform, collected.customId === `Lifetime-${alias}` ? false : collected.values[0])
                .then(async res => {

                    // Season
                    if(collected.customId === `Lifetime-${alias}`) var season = 'lifetime'
                    else var season = userInput.avSeasons.filter(e => {
                        return e.value === collected.values[0]
                    })[0].label

                    // Draw the stats
                    if(userInput.type === "all") drawPlayerStats(res, res.data.data.stats.all, season, false, false, false, dropMenuMessage)
                    if(userInput.type === "kbm") drawPlayerStats(res, res.data.data.stats.keyboardmouse, season, false, false, false, dropMenuMessage)
                    if(userInput.type === "controller") drawPlayerStats(res, res.data.data.stats.gamepad, season, false, false, false, dropMenuMessage)
                    if(userInput.type === "touch") drawPlayerStats(res, res.data.data.stats.touch, season, false, false, false, dropMenuMessage)
                
                }).catch(async err => {
                    if(err.response.status === 404){

                        if(err.response.data.error === "The requested account does not exist."){

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
                            await dropMenuMessage.edit({embeds: [noUserHasBeenFoundError], components: [], files: []})
                            .catch(err => {
                                FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, dropMenuMessage)
                            })

                        }else if(err.response.status){

                            const noMatchsPlayedYetError = new Discord.EmbedBuilder()
                            noMatchsPlayedYetError.setColor(FNBRMENA.Colors("embedError"))
                            if(userData.lang === "en") noMatchsPlayedYetError.setTitle(`\`${text}\` hasn't played any matchs yet ${emojisObject.errorEmoji}.`)
                            else if(userData.lang === "ar") noMatchsPlayedYetError.setTitle(`صاحب حساب \`${text}\` لم يلعب اي مباراة حتى الأن ${emojisObject.errorEmoji}.`)
                            await dropMenuMessage.edit({embeds: [noMatchsPlayedYetError], components: [], files: []})
                            .catch(err => {
                                FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, dropMenuMessage)
                            })

                        }else if(err.response.data.error === "The requested profile didn't play any matches yet."){

                            const noMatchsPlayedYetError = new Discord.EmbedBuilder()
                            noMatchsPlayedYetError.setColor(FNBRMENA.Colors("embedError"))
                            if(userData.lang === "en") noMatchsPlayedYetError.setTitle(`\`${text}\` hasn't played any matchs yet ${emojisObject.errorEmoji}.`)
                            else if(userData.lang === "ar") noMatchsPlayedYetError.setTitle(`صاحب حساب \`${text}\` لم يلعب اي مباراة حتى الأن ${emojisObject.errorEmoji}.`)
                            await dropMenuMessage.edit({embeds: [noMatchsPlayedYetError], components: [], files: []})
                            .catch(err => {
                                FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, dropMenuMessage)
                            })

                        }

                    }else if(err.response.status === 403){

                        const theUserAccountIsPrivate = new Discord.EmbedBuilder()
                        theUserAccountIsPrivate.setColor(FNBRMENA.Colors("embedError"))
                        if(userData.lang === "en") theUserAccountIsPrivate.setTitle(`\`${text}\` account is private, Try again later ${emojisObject.errorEmoji}.`)
                        else if(userData.lang === "ar") theUserAccountIsPrivate.setTitle(`عذرا حساب \`${text}\` خاص ، حاول مجددآ في وقت لاحق ${emojisObject.errorEmoji}.`)
                        await dropMenuMessage.edit({embeds: [theUserAccountIsPrivate], components: [], files: []})
                        .catch(err => {
                            FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, dropMenuMessage)
                        })

                    }else if(err.response.status === 400){

                        const theUserAccountIsPrivate = new Discord.EmbedBuilder()
                        theUserAccountIsPrivate.setColor(FNBRMENA.Colors("embedError"))
                        if(userData.lang === "en") theUserAccountIsPrivate.setTitle(`Invalid season, please specicy a valid season ${emojisObject.errorEmoji}.`)
                        else if(userData.lang === "ar") theUserAccountIsPrivate.setTitle(`الموسم المدخل ليس صحيح , الرجاء ادخل موسم صحيح ${emojisObject.errorEmoji}.`)
                        await dropMenuMessage.edit({embeds: [theUserAccountIsPrivate], components: [], files: []})
                        .catch(err => {
                            FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, dropMenuMessage)
                        })

                    }else if(err.response.status === 500){

                        const notCompletedData = new Discord.EmbedBuilder()
                        notCompletedData.setColor(FNBRMENA.Colors("embedError"))
                        if(userData.lang === "en") notCompletedData.setTitle(`\`${text}\` account does not have a completed data ${emojisObject.errorEmoji}.`)
                        else if(userData.lang === "ar") notCompletedData.setTitle(`عذرا حساب \`${text}\` لا يحتوي على معلومات الكامله ${emojisObject.errorEmoji}.`)
                        await dropMenuMessage.edit({embeds: [notCompletedData], components: [], files: []})
                        .catch(err => {
                            FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, dropMenuMessage)
                        })

                    }else FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, dropMenuMessage)
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
