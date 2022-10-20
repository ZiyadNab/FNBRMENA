const Canvas = require('canvas')
const moment = require('moment')
const Discord = require('discord.js')
require('moment-timezone')

module.exports = {
    commands: 'stats',
    type: 'Fortnite',
    descriptionEN: 'Use this command to extract the account stats.',
    descriptionAR: 'أستعمل الأمر لأستخراج جميع احصائيات الحساب.',
    expectedArgsEN: 'Use this command then type the use EPICGAMES displayname',
    expectedArgsAR: 'أستعمل الأمر ثم اكتب اسم اي حساب شخص على منصة ايبك قيمز',
    argsExample: ['Ninja', 'SypherPK'],
    minArgs: 1,
    maxArgs: null,
    cooldown: -1,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (FNBRMENA, message, args, text, LL, client, admin, userData, alias, emojisObject) => {

        // User input
        var userInput = {
            name: text,
            platform: null,
            type: null,
            custom: false
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
            '9E00FF,D086FD'
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
        const drawPlayerStats = async (res, outfit, loadingscreen, color) => {

            // Generating message
            const generating = new Discord.EmbedBuilder()
            generating.setColor(FNBRMENA.Colors("embed"))
            if(userData.lang === "en") generating.setTitle(`Loading player's data... ${emojisObject.loadingEmoji}`)
            else if(userData.lang === "ar") generating.setTitle(`جاري تحميل بيانات اللاعب... ${emojisObject.loadingEmoji}`)
            message.reply({embeds: [generating]})
            .then(async msg => {

                // Push add, solo, duo, squads and LTM's
                const statsData = []
                if(res.data.data.stats.all.overall !== null) statsData.push(res.data.data.stats.all.overall)
                else statsData.push({ })
                if(res.data.data.stats.all.solo !== null) statsData.push(res.data.data.stats.all.solo)
                else statsData.push({ })
                if(res.data.data.stats.all.duo !== null) statsData.push(res.data.data.stats.all.duo)
                else statsData.push({ })
                if(res.data.data.stats.all.squad !== null) statsData.push(res.data.data.stats.all.squad)
                else statsData.push({ })
                if(res.data.data.stats.all.ltm !== null) statsData.push(res.data.data.stats.all.ltm)
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
                    ctx.fillText(`FNBRMENA | ${res.data.data.account.name}`, 30, 110)

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
                        }else ctx.fillText('?', x += xAxis, y + yAxis) //add the wins

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
                        }
                        else ctx.fillText('?', x += xAxis, y + yAxis) //add the lastModified

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

                // Send the stats message
                const att = new Discord.AttachmentBuilder(canvas.toBuffer(), {name: `${res.data.data.account.name}.png`})
                await message.reply({files: [att]})
                msg.delete()

            }).catch(async err => {
                FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject)

            })
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
        const statsTypeRow = new Discord.ActionRowBuilder()

        // Create a row for drop down menu for categories
        const statsPlatformRow = new Discord.ActionRowBuilder()

        const statsPlatformDropMenu = new Discord.SelectMenuBuilder()
        statsPlatformDropMenu.setCustomId(`Platform-${alias}`)
        if(userData.lang === "en") statsPlatformDropMenu.setPlaceholder('Nothing selected!')
        else if(userData.lang === "ar") statsPlatformDropMenu.setPlaceholder('الرجاء الأختيار!')

        // Add options for en
        if(userData.lang === "en") statsPlatformDropMenu.addOptions([
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
            }]
        )

        // Add options for ar
        else if(userData.lang === "ar") statsPlatformDropMenu.addOptions([
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
            }]
        )

        // Add the drop menu to the categoryDropMenu
        statsPlatformRow.addComponents(statsPlatformDropMenu)

        // Send the message
        const dropMenuMessage = await message.reply({embeds: [statsPlatformEmbed], components: [statsPlatformRow, cancelButtonDataRow]})

        // Filtering the user clicker
        const filter = (i => {
            return (i.user.id === message.author.id && i.message.id === dropMenuMessage.id && i.guild.id === message.guild.id)
        })

        // Await for user input
        const colllector = await message.channel.createMessageComponentCollector({filter, time: 60000, errors: ['time'] })
        colllector.on('collect', async collected => {

            // If cancel button has been clicked
            if(collected.customId === `Cancel-${alias}`){
                collected.deferUpdate();
                colllector.stop()
            }

            // If the user selected a platform
            if(collected.customId === `Platform-${alias}`){
                collected.deferUpdate();

                // Add the chosen platform to userInput obj
                userInput.platform = collected.values[0]

                // Add options for en
                if(userData.lang === "en") statsPlatformRow.components[0].setOptions(
                    {
                        label: `Epic Games`,
                        value: `epic`,
                        default: (userInput.platform === 'epic'),
                        emoji: `${emojisObject.epicgames.name}:${emojisObject.epicgames.id}`
                    },
                    {
                        label: `Playstation`,
                        value: `psn`,
                        default: (userInput.platform === 'psn'),
                        emoji: `${emojisObject.playstation.name}:${emojisObject.playstation.id}`
                    },
                    {
                        label: `Xbox`,
                        value: `xbl`,
                        default: (userInput.platform === 'xbl'),
                        emoji: `${emojisObject.xbox.name}:${emojisObject.xbox.id}`
                    }
                )

                // Add options for ar
                else if(userData.lang === "ar")statsPlatformRow.components[0].setOptions(
                    {
                        label: `ايبك قيمز`,
                        value: `epic`,
                        default: (userInput.platform === 'epic'),
                        emoji: `${emojisObject.epicgames.name}:${emojisObject.epicgames.id}`
                    },
                    {
                        label: `بلايستيشن`,
                        value: `psn`,
                        default: (userInput.platform === 'psn'),
                        emoji: `${emojisObject.playstation.name}:${emojisObject.playstation.id}`
                    },
                    {
                        label: `اكسبوكس`,
                        value: `xbl`,
                        default: (userInput.platform === 'xbl'),
                        emoji: `${emojisObject.xbox.name}:${emojisObject.xbox.id}`
                    }
                )

                // Stats Seasonal/Lifetime 
                const statsTypeDropMenu = new Discord.SelectMenuBuilder()
                statsTypeDropMenu.setCustomId(`Type-${alias}`)
                if(userData.lang === "en") statsTypeDropMenu.setPlaceholder('Nothing selected!')
                else if(userData.lang === "ar") statsTypeDropMenu.setPlaceholder('الرجاء الأختيار!')

                // Add options for en
                if(userData.lang === "en") statsTypeDropMenu.addOptions(
                    {
                        label: `Lifetime`,
                        value: `lifetime`,
                    },
                    {
                        label: `Seasonal`,
                        value: `season`,
                    }
                )

                // Add options for ar
                else if(userData.lang === "ar") statsTypeDropMenu.addOptions(
                    {
                        label: `جميع المواسم`,
                        value: `lifetime`,
                    },
                    {
                        label: `موسمي`,
                        value: `season`,
                    }
                )

                // Add the drop menu to the categoryDropMenu
                statsTypeRow.addComponents(statsTypeDropMenu)

                // Edit the main message
                await dropMenuMessage.edit({embeds: [statsPlatformEmbed], components: [statsPlatformRow, statsTypeRow, cancelButtonDataRow]})
                
            }

            // If the user selected a type
            if(collected.customId === `Type-${alias}`){
                collected.deferUpdate();

                // Add the chosen type to userInput obj
                userInput.type = collected.values[0]

                // Add options for en
                if(userData.lang === "en") statsPlatformRow.components[0].setOptions(
                    {
                        label: `Epic Games`,
                        value: `epic`,
                        default: (userInput.platform === 'epic'),
                        emoji: `${emojisObject.epicgames.name}:${emojisObject.epicgames.id}`
                    },
                    {
                        label: `Playstation`,
                        value: `psn`,
                        default: (userInput.platform === 'psn'),
                        emoji: `${emojisObject.playstation.name}:${emojisObject.playstation.id}`
                    },
                    {
                        label: `Xbox`,
                        value: `xbl`,
                        default: (userInput.platform === 'xbl'),
                        emoji: `${emojisObject.xbox.name}:${emojisObject.xbox.id}`
                    }
                )

                // Add options for ar
                else if(userData.lang === "ar")statsPlatformRow.components[0].setOptions(
                    {
                        label: `ايبك قيمز`,
                        value: `epic`,
                        default: (userInput.platform === 'epic'),
                        emoji: `${emojisObject.epicgames.name}:${emojisObject.epicgames.id}`
                    },
                    {
                        label: `بلايستيشن`,
                        value: `psn`,
                        default: (userInput.platform === 'psn'),
                        emoji: `${emojisObject.playstation.name}:${emojisObject.playstation.id}`
                    },
                    {
                        label: `اكسبوكس`,
                        value: `xbl`,
                        default: (userInput.platform === 'xbl'),
                        emoji: `${emojisObject.xbox.name}:${emojisObject.xbox.id}`
                    }
                )

                // Add options for en
                if(userData.lang === "en") statsTypeRow.components[0].setOptions(
                    {
                        label: `Lifetime`,
                        value: `lifetime`,
                        default: (userInput.type === 'lifetime'),
                    },
                    {
                        label: `Seasonal`,
                        value: `season`,
                        default: (userInput.type === 'season'),
                    }
                )

                // Add options for ar
                else if(userData.lang === "ar") statsTypeRow.components[0].setOptions(
                    {
                        label: `جميع المواسم`,
                        value: `lifetime`,
                        default: (userInput.type === 'lifetime'),
                    },
                    {
                        label: `موسمي`,
                        value: `season`,
                        default: (userInput.type === 'season'),
                    }
                )

                // Create a row for buttons
                const buttonDataRow = new Discord.ActionRowBuilder()

                // Add buttons
                if(userData.lang === "en") buttonDataRow.addComponents(
                    new Discord.ButtonBuilder()
                    .setCustomId(`Generate-${alias}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setLabel("Generate")
                )

                else if(userData.lang === "ar") buttonDataRow.addComponents(
                    new Discord.ButtonBuilder()
                    .setCustomId(`Generate-${alias}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setLabel("انشاء")
                )

                if(userData.lang === "en") buttonDataRow.addComponents(
                    new Discord.ButtonBuilder()
                    .setCustomId(`Custom-${alias}`)
                    .setStyle(Discord.ButtonStyle.Success)
                    .setLabel("Custom")
                )

                else if(userData.lang === "ar") buttonDataRow.addComponents(
                    new Discord.ButtonBuilder()
                    .setCustomId(`Custom-${alias}`)
                    .setStyle(Discord.ButtonStyle.Success)
                    .setLabel("اختياري")
                )

                // Add buttons
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
                await dropMenuMessage.edit({embeds: [statsPlatformEmbed], components: [statsPlatformRow, statsTypeRow, buttonDataRow]})
            }

            // If the user selected a type
            if(collected.customId === `Generate-${alias}`){
                colllector.stop()
                collected.deferUpdate();

                //request data
                await FNBRMENA.Stats(userInput.name, userInput.platform, userInput.type)
                .then(async res =>{

                    // Draw the stats
                    drawPlayerStats(res, false, false, false)
                
                }).catch(async err => {
                    if(err.response.data.status === 404){

                        if(err.response.data.error === "the requested account does not exist"){

                            // Epic games string
                            if(collected.values[0] === "epic" && userData.lang === "en") var usedPlatform = 'Epicgames'
                            else if(collected.values[0] === "epic" && userData.lang === "ar") var usedPlatform = 'ايبك قيمز'

                            // Psn string
                            if(collected.values[0] === "psn" && userData.lang === "en") var usedPlatform = 'Playstation'
                            else if(collected.values[0] === "psn" && userData.lang === "ar") var usedPlatform = 'بلايستيشن'

                            // Xbl string
                            if(collected.values[0] === "xbl" && userData.lang === "en") var usedPlatform = 'XBOX'
                            else if(collected.values[0] === "xbl" && userData.lang === "ar") var usedPlatform = 'اكسبوكس'

                            const noUserHasBeenFoundError = new Discord.EmbedBuilder()
                            noUserHasBeenFoundError.setColor(FNBRMENA.Colors("embedError"))
                            if(userData.lang === "en") noUserHasBeenFoundError.setTitle(`Can't find ${text} in ${usedPlatform} platform. Please try again ${emojisObject.errorEmoji}`)
                            else if(userData.lang === "ar") noUserHasBeenFoundError.setTitle(`لا يمكنني العثور على حساب ${text} في منصه ${usedPlatform}. حاول مجددا ${emojisObject.errorEmoji}`)
                            await message.reply({embeds: [noUserHasBeenFoundError]})

                        }else if(err.response.data.error === "the requested profile didnt play any match yet"){

                            const noMatchsPlayedYetError = new Discord.EmbedBuilder()
                            noMatchsPlayedYetError.setColor(FNBRMENA.Colors("embedError"))
                            if(userData.lang === "en") noMatchsPlayedYetError.setTitle(`The ${text} account hasn't played any matchs yet ${emojisObject.errorEmoji}`)
                            else if(userData.lang === "ar") noMatchsPlayedYetError.setTitle(`صاحب حساب ${text} لم يلعب اي مباراة حتى الأن ${emojisObject.errorEmoji}`)
                            await message.reply({embeds: [noMatchsPlayedYetError]})

                        }

                    }else if(err.response.data.status === 403){

                        const theUserAccountIsPrivate = new Discord.EmbedBuilder()
                        theUserAccountIsPrivate.setColor(FNBRMENA.Colors("embedError"))
                        if(userData.lang === "en") theUserAccountIsPrivate.setTitle(`Can't get access to ${text} because the user account is private. ${emojisObject.errorEmoji}`)
                        else if(userData.lang === "ar") theUserAccountIsPrivate.setTitle(`لا يمكنني الحصول على صلاحية إحصائيات ${text} بسبب ان الحساب خاص. ${emojisObject.errorEmoji}`)
                        await message.reply({embeds: [theUserAccountIsPrivate]})

                    }else FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject)
                })
            }

            // If the user selected a type
            if(collected.customId === `Custom-${alias}`){

                // Create the modal and add text fields
                const customModal = new Discord.ModalBuilder()

                // Set data
                customModal.setCustomId(`customStatsModal-${message.id}`)
                customModal.setTitle('Custom Stats')
                customModal.addComponents(
                    new Discord.ActionRowBuilder().addComponents(
                        new Discord.TextInputBuilder()
                        .setCustomId('outfitInput')
                        .setLabel("Type the outfit name.")
                        .setPlaceholder("Leave it empty to skip")
                        .setStyle(Discord.TextInputStyle.Short)
                        .setValue('Scarlet Witch')
                    ),
                    new Discord.ActionRowBuilder().addComponents(
                        new Discord.TextInputBuilder()
                        .setCustomId('loadingscreenInput')
                        .setLabel("Type the loadingscreen name.")
                        .setPlaceholder("Leave it empty to skip")
                        .setStyle(Discord.TextInputStyle.Short)
                        .setValue('Through the Mirror Dimension')
                    ),
                    new Discord.ActionRowBuilder().addComponents(
                        new Discord.TextInputBuilder()
                        .setCustomId('colorInputA')
                        .setLabel("Type the color A (HEX only).")
                        .setPlaceholder("Leave it empty to skip")
                        .setStyle(Discord.TextInputStyle.Short)
                        .setValue('FF0000')
                    ),
                    new Discord.ActionRowBuilder().addComponents(
                        new Discord.TextInputBuilder()
                        .setCustomId('colorInputB')
                        .setLabel("Type the color B (HEX only).")
                        .setPlaceholder("Leave it empty to skip")
                        .setStyle(Discord.TextInputStyle.Short)
                        .setValue('8C0000')
                    )
                )

                await collected.showModal(customModal)

                // Listen for modal submission
                const filter = (i => {
                    return i.customId === `customStatsModal-${message.id}` && i.user.id === message.author.id && i.guild.id === message.guild.id
                })

                await collected.awaitModalSubmit({filter, time: 10 * 60000})
                .then(async modalCollect => {

                    // Fields
                    var outfit = modalCollect.fields.getTextInputValue('outfitInput')
                    var loadingscreen = modalCollect.fields.getTextInputValue('loadingscreenInput')
                    var color = `${modalCollect.fields.getTextInputValue('colorInputA')},${modalCollect.fields.getTextInputValue('colorInputB')}`

                    // Check for empty fields
                    if(outfit == "") outfit = false
                    if(loadingscreen == "") loadingscreen = false
                    if(color == ",") color = false

                    //request data
                    await FNBRMENA.Stats(userInput.name, userInput.platform, userInput.type)
                    .then(async res =>{

                        // Specify parms
                        var type = "name"

                        // Search by id
                        if(outfit.includes("_")) type = "id"

                        // Request outfit image
                        if(outfit) outfit = await FNBRMENA.Search(userData.lang, type, outfit)

                        // Search by id
                        if(loadingscreen.includes("_")) type = "id"

                        // Request loadingscreen image
                        if(loadingscreen) loadingscreen = await FNBRMENA.Search(userData.lang, type, loadingscreen)

                        // Draw the stats
                        if(outfit.data.items.length > 0 && loadingscreen.data.items.length > 0){
                            modalCollect.deferUpdate()
                            await colllector.stop()
                            drawPlayerStats(res, outfit, loadingscreen, color)

                        }else modalCollect.reply({content: 'Outfit name or loadingscreen name are not valid', ephemeral: true})
                    
                    }).catch(async err => {
                        if(err.response.data.status === 404){

                            if(err.response.data.error === "the requested account does not exist"){

                                // Epic games string
                                if(collected.values[0] === "epic" && userData.lang === "en") var usedPlatform = 'Epicgames'
                                else if(collected.values[0] === "epic" && userData.lang === "ar") var usedPlatform = 'ايبك قيمز'

                                // Psn string
                                if(collected.values[0] === "psn" && userData.lang === "en") var usedPlatform = 'Playstation'
                                else if(collected.values[0] === "psn" && userData.lang === "ar") var usedPlatform = 'بلايستيشن'

                                // Xbl string
                                if(collected.values[0] === "xbl" && userData.lang === "en") var usedPlatform = 'XBOX'
                                else if(collected.values[0] === "xbl" && userData.lang === "ar") var usedPlatform = 'اكسبوكس'

                                const noUserHasBeenFoundError = new Discord.EmbedBuilder()
                                noUserHasBeenFoundError.setColor(FNBRMENA.Colors("embedError"))
                                if(userData.lang === "en") noUserHasBeenFoundError.setTitle(`Can't find ${text} in ${usedPlatform} platform. Please try again ${emojisObject.errorEmoji}`)
                                else if(userData.lang === "ar") noUserHasBeenFoundError.setTitle(`لا يمكنني العثور على حساب ${text} في منصه ${usedPlatform}. حاول مجددا ${emojisObject.errorEmoji}`)
                                await message.reply({embeds: [noUserHasBeenFoundError]})

                            }else if(err.response.data.error === "the requested profile didnt play any match yet"){

                                const noMatchsPlayedYetError = new Discord.EmbedBuilder()
                                noMatchsPlayedYetError.setColor(FNBRMENA.Colors("embedError"))
                                if(userData.lang === "en") noMatchsPlayedYetError.setTitle(`The ${text} account hasn't played any matchs yet ${emojisObject.errorEmoji}`)
                                else if(userData.lang === "ar") noMatchsPlayedYetError.setTitle(`صاحب حساب ${text} لم يلعب اي مباراة حتى الأن ${emojisObject.errorEmoji}`)
                                await message.reply({embeds: [noMatchsPlayedYetError]})

                            }

                        }else if(err.response.data.status === 403){

                            const theUserAccountIsPrivate = new Discord.EmbedBuilder()
                            theUserAccountIsPrivate.setColor(FNBRMENA.Colors("embedError"))
                            if(userData.lang === "en") theUserAccountIsPrivate.setTitle(`Can't get access to ${text} because the user account is private. ${emojisObject.errorEmoji}`)
                            else if(userData.lang === "ar") theUserAccountIsPrivate.setTitle(`لا يمكنني الحصول على صلاحية إحصائيات ${text} بسبب ان الحساب خاص. ${emojisObject.errorEmoji}`)
                            await message.reply({embeds: [theUserAccountIsPrivate]})

                        }else FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject)
                    })

                }).catch(async err => {
                    if(!err.message.includes("time")) FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject)
                })
            }
        })

        // When time ends
        colllector.on('end', async () => {
            try {
                await dropMenuMessage.delete()
            } catch {
                
            }
        })
    }
}